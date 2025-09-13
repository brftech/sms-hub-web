import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Get the authorization header to verify the caller is authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verify the user making the request
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid authorization token" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if user has admin privileges
    const { data: profile } = await supabaseAdmin
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const isAdmin = profile?.role && ["ADMIN", "SUPERADMIN", "OWNER"].includes(profile.role);
    
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: "Insufficient privileges" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse request body
    const {
      // Account type
      accountType = "business",
      
      // Company fields
      companyName,
      legalName,
      hub_id,
      
      // Customer fields
      billingEmail,
      subscriptionTier = "FREE",
      paymentStatus = "PENDING",
      
      // User fields (B2B initial user or B2C individual)
      userEmail,
      userPassword,
      firstName,
      lastName,
      phoneNumber,
      role = "MEMBER",
    } = await req.json();

    // Validate required fields based on account type
    if (accountType === "business") {
      if (!companyName || !hub_id || !billingEmail) {
        return new Response(
          JSON.stringify({
            error: "Missing required fields: companyName, hub_id, and billingEmail are required for business accounts",
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    } else if (accountType === "individual") {
      if (!firstName || !lastName || !hub_id || !billingEmail) {
        return new Response(
          JSON.stringify({
            error: "Missing required fields: firstName, lastName, hub_id, and billingEmail are required for individual accounts",
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Generate unique identifiers
    const timestamp = new Date().toISOString();
    let companyId = null;
    let company = null;

    // Start transaction-like operations
    try {
      // Step 1: Create company (only for B2B accounts)
      if (accountType === "business") {
        companyId = crypto.randomUUID();
        const accountNumber = `ACC-${Date.now()}`;
        
        const { data: companyData, error: companyError } = await supabaseAdmin
          .from("companies")
          .insert([{
            id: companyId,
            hub_id: hub_id,
            public_name: companyName,
            legal_name: legalName || companyName,
            company_account_number: accountNumber,
            is_active: true,
            created_at: timestamp,
            updated_at: timestamp,
          }])
          .select()
          .single();

        if (companyError) {
          throw new Error(`Failed to create company: ${companyError.message}`);
        }
        
        company = companyData;
      }

      // Step 2: Create customer record
      const customerId = crypto.randomUUID();
      const { data: customer, error: customerError } = await supabaseAdmin
        .from("customers")
        .insert([{
          id: customerId,
          hub_id: hub_id,
          company_id: companyId, // null for B2C
          billing_email: billingEmail,
          subscription_tier: subscriptionTier,
          payment_status: paymentStatus,
          is_active: true,
          created_at: timestamp,
          updated_at: timestamp,
        }])
        .select()
        .single();

      if (customerError) {
        // Rollback company creation if it was created
        if (companyId) {
          await supabaseAdmin.from("companies").delete().eq("id", companyId);
        }
        throw new Error(`Failed to create customer: ${customerError.message}`);
      }

      // Step 3: Create auth user and profile
      let authUser = null;
      let userProfile = null;
      
      // For B2C, always create user with customer info
      // For B2B, only create if userEmail is provided
      const shouldCreateUser = accountType === "individual" || userEmail;
      const userEmailToUse = accountType === "individual" ? billingEmail : userEmail;
      const userFirstName = accountType === "individual" ? firstName : (userEmail ? firstName : null);
      const userLastName = accountType === "individual" ? lastName : (userEmail ? lastName : null);
      
      if (shouldCreateUser && userEmailToUse) {
        // Create auth user with Supabase Auth
        if (userPassword) {
          const { data: newAuthUser, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
            email: userEmailToUse,
            password: userPassword,
            email_confirm: true, // Auto-confirm email
            user_metadata: {
              first_name: userFirstName,
              last_name: userLastName,
              phone_number: phoneNumber,
              hub_id: hub_id,
              company_id: companyId,
              customer_id: customerId,
              account_type: accountType,
            },
          });

          if (createUserError) {
            console.error("Error creating auth user:", createUserError);
            // Don't fail the whole operation if user creation fails
          } else {
            authUser = newAuthUser;

            // Create user profile linked to auth user
            const { data: profile, error: profileError } = await supabaseAdmin
              .from("user_profiles")
              .insert([{
                id: authUser.user.id, // Use auth user ID for profile
                hub_id: hub_id,
                company_id: companyId, // null for B2C
                account_number: `USR-${Date.now()}`,
                email: userEmailToUse,
                first_name: userFirstName,
                last_name: userLastName,
                mobile_phone_number: phoneNumber,
                role: accountType === "individual" ? "MEMBER" : role, // B2C users are members
                is_active: true,
                created_at: timestamp,
                updated_at: timestamp,
              }])
              .select()
              .single();

            if (profileError) {
              console.error("Error creating user profile:", profileError);
              // Don't fail the whole operation
            } else {
              userProfile = profile;
            }
          }
        } else {
          // Create profile without auth if no password provided
          const { data: profile, error: profileError } = await supabaseAdmin
            .from("user_profiles")
            .insert([{
              id: crypto.randomUUID(),
              hub_id: hub_id,
              company_id: companyId, // null for B2C
              account_number: `USR-${Date.now()}`,
              email: userEmailToUse,
              first_name: userFirstName,
              last_name: userLastName,
              mobile_phone_number: phoneNumber,
              role: accountType === "individual" ? "MEMBER" : role,
              is_active: true,
              created_at: timestamp,
              updated_at: timestamp,
            }])
            .select()
            .single();

          if (!profileError) {
            userProfile = profile;
          }
        }
      }

      // Return success response
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            company,
            customer,
            user: userProfile,
            authUser: authUser?.user ? {
              id: authUser.user.id,
              email: authUser.user.email,
            } : null,
          },
          message: "Account created successfully",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      // Clean up any partial data if needed
      console.error("Error in account creation:", error);
      
      return new Response(
        JSON.stringify({
          error: error.message || "Failed to create account",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error in create-account function:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Internal server error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});