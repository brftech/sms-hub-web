import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  console.log("🔄 Native signup request received");

  try {
    const {
      email,
      password,
      phone_number,
      first_name,
      last_name,
      company_name,
      hub_id,
      signup_type,
      invitation_token,
      customer_type,
    } = await req.json();

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Check if user already exists in auth
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(user => user.email === email);

    if (existingUser) {
      console.log("User already exists with email:", email);
      return new Response(
        JSON.stringify({ 
          error: "An account already exists with this email. Please log in instead." 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }

    // Check phone number uniqueness
    const { data: existingPhone } = await supabaseAdmin
      .from("user_profiles")
      .select("id")
      .eq("mobile_phone_number", phone_number)
      .single();

    if (existingPhone) {
      console.log("Phone number already in use:", phone_number);
      return new Response(
        JSON.stringify({ 
          error: "This phone number is already registered. Please use a different number or log in." 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }

    // Handle invitation if provided
    let invitationData = null;
    if (invitation_token) {
      const { data: invitation, error: inviteError } = await supabaseAdmin
        .from("user_invitations")
        .select(`
          *,
          companies (
            id,
            public_name,
            hub_id
          )
        `)
        .eq("invitation_token", invitation_token)
        .eq("status", "pending")
        .single();

      if (inviteError || !invitation) {
        console.error("Invalid invitation token:", inviteError);
        return new Response(
          JSON.stringify({ error: "Invalid or expired invitation" }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400 
          }
        );
      }

      // Check if invitation is expired
      if (new Date(invitation.expires_at) < new Date()) {
        return new Response(
          JSON.stringify({ error: "This invitation has expired" }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400 
          }
        );
      }

      invitationData = invitation;
    }

    // Create auth user with Supabase native auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Auto-confirm email since we're using admin API
      user_metadata: {
        hub_id: invitationData ? invitationData.hub_id : hub_id,
        signup_type: signup_type,
        customer_type: customer_type || "company",
        first_name: first_name,
        last_name: last_name,
      },
    });

    if (authError) {
      console.error("Failed to create auth user:", authError);
      return new Response(
        JSON.stringify({ error: "Failed to create account. Please try again." }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }

    console.log("✅ Auth user created:", authData.user.id);

    // Generate user account number
    const { data: userAccountNumber } = await supabaseAdmin.rpc(
      "generate_user_account_number",
      {
        hub_name: `Hub${invitationData ? invitationData.hub_id : hub_id}`,
      }
    );

    // Create user profile
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .insert([
        {
          id: authData.user.id,
          email: email,
          hub_id: invitationData ? invitationData.hub_id : hub_id,
          account_number: userAccountNumber || `USR-${Date.now()}`,
          mobile_phone_number: phone_number,
          first_name: first_name,
          last_name: last_name,
          signup_type: customer_type || "company",
          is_active: true,
          role: invitationData ? invitationData.role : "USER",
          onboarding_completed: false,
        },
      ])
      .select()
      .single();

    if (profileError) {
      console.error("Failed to create user profile:", profileError);
      // Clean up auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return new Response(
        JSON.stringify({ error: "Failed to create user profile" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }

    console.log("✅ User profile created");

    let companyId = null;
    let customerId = null;

    // Handle company creation for B2B signups
    if (customer_type !== "individual") {
      if (invitationData && invitationData.company_id) {
        // Invited user - use existing company
        companyId = invitationData.company_id;

        // Create membership
        const { error: membershipError } = await supabaseAdmin
          .from("memberships")
          .insert([
            {
              user_id: authData.user.id,
              company_id: companyId,
              role: invitationData.role || "MEMBER",
              hub_id: invitationData.hub_id,
            },
          ]);

        if (membershipError) {
          console.error("Failed to create membership:", membershipError);
        }

        // Update invitation status
        await supabaseAdmin
          .from("user_invitations")
          .update({
            status: "accepted",
            accepted_at: new Date().toISOString(),
            created_user_id: authData.user.id,
          })
          .eq("id", invitationData.id);

      } else {
        // New company signup
        const { data: companyAccountNumber } = await supabaseAdmin.rpc(
          "generate_company_account_number",
          {
            hub_name: `Hub${hub_id}`,
          }
        );

        const { data: companyData, error: companyError } = await supabaseAdmin
          .from("companies")
          .insert([
            {
              hub_id: hub_id,
              public_name: company_name || "TBD",
              legal_name: company_name || "TBD",
              company_account_number: companyAccountNumber || `COMP-${Date.now()}`,
              created_by_user_id: authData.user.id,
              first_admin_user_id: authData.user.id,
              signup_type: customer_type || "company",
              is_active: true,
            },
          ])
          .select()
          .single();

        if (companyError) {
          console.error("Failed to create company:", companyError);
          // Clean up
          await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
          return new Response(
            JSON.stringify({ error: "Failed to create company" }),
            { 
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400 
            }
          );
        }

        companyId = companyData.id;
        console.log("✅ Company created:", companyId);

        // Create customer record for payment
        const { data: customerData, error: customerError } = await supabaseAdmin
          .from("customers")
          .insert([
            {
              company_id: companyId,
              billing_email: email,
              customer_type: customer_type || "company",
              hub_id: hub_id,
              payment_status: "pending",
              is_active: true,
            },
          ])
          .select()
          .single();

        if (customerError) {
          console.error("Failed to create customer:", customerError);
        } else {
          customerId = customerData.id;
        }

        // Update user profile with company_id and customer_id
        await supabaseAdmin
          .from("user_profiles")
          .update({ 
            company_id: companyId,
            customer_id: customerId,
            company_admin: true,
            company_admin_since: new Date().toISOString(),
          })
          .eq("id", authData.user.id);

        // Create membership as OWNER
        const { error: membershipError } = await supabaseAdmin
          .from("memberships")
          .insert([
            {
              user_id: authData.user.id,
              company_id: companyId,
              role: "OWNER",
              hub_id: hub_id,
            },
          ]);

        if (membershipError) {
          console.error("Failed to create membership:", membershipError);
        }
      }
    } else {
      // Individual signup - create customer record only
      const { data: customerData, error: customerError } = await supabaseAdmin
        .from("customers")
        .insert([
          {
            user_id: authData.user.id,
            billing_email: email,
            customer_type: "individual",
            hub_id: hub_id,
            payment_status: "pending",
            is_active: true,
          },
        ])
        .select()
        .single();

      if (customerError) {
        console.error("Failed to create individual customer:", customerError);
      } else {
        customerId = customerData.id;
        // Update user profile with customer_id
        await supabaseAdmin
          .from("user_profiles")
          .update({ customer_id: customerId })
          .eq("id", authData.user.id);
      }
    }

    // Send magic link email via Supabase (this will actually send the email through Resend)
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.signInWithOtp({
      email: authData.user.email!,
      options: {
        shouldCreateUser: false, // User already exists
        emailRedirectTo: `${Deno.env.get("PUBLIC_SITE_URL") || "http://localhost:3001"}/payment-setup`,
      },
    });

    if (sessionError) {
      console.error("Failed to send magic link email:", sessionError);
    } else {
      console.log("✅ Magic link email sent successfully via Resend");
    }

    console.log("✅ Signup completed successfully");

    return new Response(
      JSON.stringify({
        success: true,
        user_id: authData.user.id,
        company_id: companyId,
        customer_id: customerId,
        magic_link_sent: !sessionError,
        email: email,
        hub_id: invitationData ? invitationData.hub_id : hub_id,
        customer_type: customer_type,
        requires_payment: true,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in signup-native:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});