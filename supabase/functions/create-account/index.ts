import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { verification_id, password, company_name, first_name, last_name } =
      await req.json();

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    // Get verified verification request
    const { data: verificationRequest, error: findError } = await supabaseAdmin
      .from("verifications")
      .select("*")
      .eq("id", verification_id)
      .not("verification_completed_at", "is", null) // Check if verification is completed
      .single();

    if (findError || !verificationRequest) {
      console.error("Verification request not found:", findError);
      throw new Error("Invalid verification request");
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers({
      filter: `email.eq.${verificationRequest.email}`
    });

    let authData;
    if (existingUser && existingUser.users.length > 0) {
      // User already exists - return existing user info
      console.log("User already exists:", existingUser.users[0].id);
      authData = { user: existingUser.users[0] };
    } else {
      // Create new auth user
      const { data: newAuthData, error: authError } =
        await supabaseAdmin.auth.admin.createUser({
          email: verificationRequest.email,
          password: password,
          email_confirm: true,
          user_metadata: {
            hub_id: verificationRequest.hub_id,
            signup_type: verificationRequest.step_data?.signup_type,
            customer_type: verificationRequest.step_data?.customer_type,
          },
        });

      if (authError) {
        console.error("Failed to create auth user:", authError);
        throw new Error("Failed to create account");
      }
      authData = newAuthData;
    }

    // Generate user account number
    const { data: userAccountNumber } = await supabaseAdmin.rpc(
      "generate_user_account_number",
      {
        hub_name: `Hub${verificationRequest.hub_id}`,
      }
    );

    // Create user profile linked to auth user and verification record
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .insert([
        {
          id: authData.user.id,
          email: verificationRequest.email,
          hub_id: verificationRequest.hub_id,
          account_number: userAccountNumber || `USR-${Date.now()}`,
          mobile_phone_number: verificationRequest.mobile_phone,
          signup_type: verificationRequest.step_data?.customer_type || "company",
          is_active: true,
          first_name: first_name || "",
          last_name: last_name || ""
        },
      ])
      .select()
      .single();

    if (profileError) {
      console.error("Failed to create user profile:", profileError);
      // Try to clean up auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw new Error("Failed to create user profile");
    }

    // Update the verification record to link it to the created user profile
    const { error: verificationUpdateError } = await supabaseAdmin
      .from("verifications")
      .update({ 
        existing_user_id: authData.user.id,
        user_created_at: new Date().toISOString()
      })
      .eq("id", verification_id);

    if (verificationUpdateError) {
      console.error("Failed to update verification record:", verificationUpdateError);
      // Don't throw error here - user profile was created successfully
    }

    // Create company and membership for B2B signups
    let companyId = null;

    if (verificationRequest.step_data?.customer_type !== "individual") {
      // B2B: Create company (without customer_id - that comes after payment)
      // Generate company account number
      const { data: accountNumber } = await supabaseAdmin.rpc(
        "generate_company_account_number",
        {
          hub_name: `Hub${verificationRequest.hub_id}`,
        }
      );

      // Create company (without billing_email - that goes in customers table)
      const { data: companyData, error: companyError } = await supabaseAdmin
        .from("companies")
        .insert([
          {
            hub_id: verificationRequest.hub_id,
            public_name: company_name || "TBD",
            legal_name: company_name || "TBD", // Set legal_name same as public_name initially
            company_account_number: accountNumber || `COMP-${Date.now()}`,
            created_by_user_id: authData.user.id,
            first_admin_user_id: authData.user.id, // First user is the admin
            signup_type: verificationRequest.step_data?.customer_type || "company",
            is_active: true,
          },
        ])
        .select()
        .single();

      if (companyError) {
        console.error("Failed to create company:", companyError);
        // Try to clean up
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        throw new Error("Failed to create company");
      }

      companyId = companyData.id;

      // Create customer record for this company
      const { data: customerData, error: customerError } = await supabaseAdmin
        .from("customers")
        .insert([
          {
            company_id: companyId,
            user_id: authData.user.id,
            billing_email: verificationRequest.email,
            customer_type: verificationRequest.step_data?.customer_type || 'company',
            hub_id: verificationRequest.hub_id,
            payment_status: 'pending',
            is_active: true,
          },
        ])
        .select()
        .single();

      if (customerError) {
        console.error("Failed to create customer:", customerError);
        // Try to clean up
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        throw new Error("Failed to create customer record");
      }

      // Update profile with company_id
      await supabaseAdmin
        .from("user_profiles")
        .update({ company_id: companyId })
        .eq("id", authData.user.id);

      // Create membership linking user to company
      const { error: membershipError } = await supabaseAdmin
        .from("memberships")
        .insert([
          {
            user_profile_id: authData.user.id,
            company_id: companyId,
            role: "OWNER", // First user is the owner
            is_active: true,
          },
        ]);

      if (membershipError) {
        console.error("Failed to create membership:", membershipError);
      }
    }
    // For B2C (individual), customer record will be created after Stripe payment

    // Generate session for immediate login
    const { data: sessionData, error: sessionError } =
      await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email: authData.user.email!,
        options: {
          redirectTo: `${Deno.env.get("PUBLIC_SITE_URL") || "http://localhost:3001"}/`,
        },
      });

    if (sessionError) {
      console.error("Failed to generate session:", sessionError);
    }

    const isExistingUser = existingUser && existingUser.users.length > 0;
    
    return new Response(
      JSON.stringify({
        success: true,
        user_id: authData.user.id,
        company_id: companyId,
        magic_link: sessionData?.properties?.action_link,
        email: verificationRequest.email,
        hub_id: verificationRequest.hub_id,
        customer_type: verificationRequest.step_data?.customer_type,
        verification_id: verification_id, // Reference to verification record
        is_existing_user: isExistingUser,
        message: isExistingUser ? "Welcome back! Your account already exists." : "Account created successfully!"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in create-account:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
