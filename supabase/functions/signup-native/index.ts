import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

// Function to create business records
async function createBusinessRecords(supabaseAdmin: any, user: any, data: any) {
  try {
    const timestamp = new Date().toISOString();
    const companyId = crypto.randomUUID();
    const accountNumber = `ACC-${Date.now()}`;

    // PHASE 1: Create user profile WITHOUT company_id (breaks circular dependency)
    console.log("🔧 PHASE 1: Creating user profile without company_id");
    const { error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .insert([
        {
          id: user.id,
          email: data.email,
          account_number: `USR-${Date.now()}`,
          hub_id: data.hub_id,
          first_name: data.first_name,
          last_name: data.last_name,
          mobile_phone_number: data.phone_number,
          role: "USER",
          signup_type: data.signup_type,
          company_admin: true,
          company_admin_since: timestamp,
          is_active: true,
          created_at: timestamp,
          updated_at: timestamp,
        },
      ]);

    if (profileError) {
      console.error(
        "❌ PHASE 1 FAILED - User profile creation error:",
        profileError
      );
      throw profileError;
    }
    console.log("✅ PHASE 1 SUCCESS - User profile created");

    // PHASE 2: Create company record (now user profile exists)
    console.log("🔧 PHASE 2: Creating company record");
    const { error: companyError } = await supabaseAdmin
      .from("companies")
      .insert([
        {
          id: companyId,
          hub_id: data.hub_id,
          public_name: data.company_name,
          legal_name: data.company_name,
          company_account_number: accountNumber,
          signup_type: data.signup_type,
          is_active: true,
          first_admin_user_id: user.id,
          created_at: timestamp,
          updated_at: timestamp,
        },
      ]);

    if (companyError) {
      console.error(
        "❌ PHASE 2 FAILED - Company creation error:",
        companyError
      );
      throw companyError;
    }
    console.log("✅ PHASE 2 SUCCESS - Company created");

    // PHASE 3: Update user profile with company_id
    console.log("🔧 PHASE 3: Linking user profile to company");
    const { error: updateProfileError } = await supabaseAdmin
      .from("user_profiles")
      .update({ company_id: companyId })
      .eq("id", user.id);

    if (updateProfileError) {
      console.error(
        "❌ PHASE 3 FAILED - User profile update error:",
        updateProfileError
      );
      throw updateProfileError;
    }
    console.log("✅ PHASE 3 SUCCESS - User profile linked to company");

    // PHASE 4: Create dependent records
    console.log("🔧 PHASE 4: Creating dependent records");

    // Create membership record
    const { error: membershipError } = await supabaseAdmin
      .from("memberships")
      .insert([
        {
          user_id: user.id,
          company_id: companyId,
          hub_id: data.hub_id,
          role: "USER",
          permissions: {
            admin: false,
            manage_users: false,
            manage_settings: false,
          },
          is_active: true,
          joined_at: timestamp,
          created_at: timestamp,
          updated_at: timestamp,
        },
      ]);

    if (membershipError) {
      console.warn(
        "⚠️ PHASE 4 WARNING - Failed to create membership:",
        membershipError
      );
    } else {
      console.log("✅ PHASE 4 SUCCESS - Membership created");
    }

    // Create customer record
    const { error: customerError } = await supabaseAdmin
      .from("customers")
      .insert([
        {
          company_id: companyId,
          user_id: user.id,
          hub_id: data.hub_id,
          billing_email: data.email,
          payment_status: "pending",
          created_at: timestamp,
          updated_at: timestamp,
        },
      ]);

    if (customerError) {
      console.warn(
        "⚠️ PHASE 4 WARNING - Failed to create customer:",
        customerError
      );
    } else {
      console.log("✅ PHASE 4 SUCCESS - Customer created");
    }

    console.log("✅ Business records created successfully");
    return { success: true, companyId };
  } catch (error) {
    console.error("Failed to create business records:", error);
    throw error;
  }
}

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
    const existingUser = existingUsers?.users?.find(
      (user) => user.email === email
    );

    if (existingUser) {
      console.log("User already exists with email:", email);
      return new Response(
        JSON.stringify({
          error:
            "An account already exists with this email. Please log in instead.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
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
          error:
            "This phone number is already registered. Please use a different number or log in.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Handle invitation if provided
    let invitationData = null;
    if (invitation_token) {
      const { data: invitation, error: inviteError } = await supabaseAdmin
        .from("user_invitations")
        .select(
          `
          *,
          companies (
            id,
            public_name,
            hub_id
          )
        `
        )
        .eq("invitation_token", invitation_token)
        .eq("status", "pending")
        .single();

      if (inviteError || !invitation) {
        console.error("Invalid invitation token:", inviteError);
        return new Response(
          JSON.stringify({ error: "Invalid or expired invitation" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }

      // Check if invitation is expired
      if (new Date(invitation.expires_at) < new Date()) {
        return new Response(
          JSON.stringify({ error: "This invitation has expired" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }

      invitationData = invitation;
    }

    // Detect environment
    const environment =
      Deno.env.get("VERCEL_ENV") ||
      Deno.env.get("ENVIRONMENT") ||
      "development";
    const isDevelopment = environment === "development";

    // Determine the redirect URL based on hub
    let publicSiteUrl = "";
    const actualHubId = invitationData ? invitationData.hub_id : hub_id;

    // Map hub_id to domain - use environment variables for development
    const baseUrl = Deno.env.get("PUBLIC_SITE_URL") || "http://localhost:3000";
    const unifiedUrl =
      Deno.env.get("UNIFIED_APP_URL") || "http://localhost:3001";

    const hubDomains = {
      0: {
        // PercyTech
        production: "https://www.percytech.com",
        staging: "https://staging.percytech.com",
        development: baseUrl,
      },
      1: {
        // Gnymble
        production: "https://www.gnymble.com",
        staging: "https://staging.gnymble.com",
        development: baseUrl,
      },
      2: {
        // PercyMD
        production: "https://www.percymd.com",
        staging: "https://staging.percymd.com",
        development: baseUrl,
      },
      3: {
        // PercyText
        production: "https://www.percytext.com",
        staging: "https://staging.percytext.com",
        development: baseUrl,
      },
    };

    // Get the appropriate domain
    const hubConfig = hubDomains[actualHubId] || hubDomains[1]; // Default to Gnymble
    if (isDevelopment) {
      publicSiteUrl = hubConfig.development;
    } else if (environment === "staging") {
      publicSiteUrl = hubConfig.staging;
    } else {
      publicSiteUrl = hubConfig.production;
    }

    // Allow override from environment variable
    publicSiteUrl = Deno.env.get("PUBLIC_SITE_URL") || publicSiteUrl;

    // Prepare signup options
    const signupOptions: any = {
      data: {
        hub_id: invitationData ? invitationData.hub_id : hub_id,
        signup_type: signup_type,
        customer_type: customer_type || "company",
        first_name: first_name,
        last_name: last_name,
        company_name: company_name,
        phone_number: phone_number,
      },
      // Redirect to root - let Supabase handle the magic link
      emailRedirectTo: `${unifiedUrl}`,
    };

    // Always use standard signup (sends email)
    console.log("📧 Creating user with standard signup (sends email)");
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.signUp({
        email: email,
        password: password,
        options: signupOptions,
      });

    const autoConfirmed = false;

    if (authError) {
      console.error("Failed to create auth user:", authError);
      return new Response(
        JSON.stringify({
          error: "Failed to create account. Please try again.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Always create business records immediately
    console.log("✅ Auth user created, now creating business records...");
    
    // Create all business records immediately
    await createBusinessRecords(supabaseAdmin, authData.user, {
      email,
      first_name,
      last_name,
      company_name,
      phone_number,
      hub_id: invitationData ? invitationData.hub_id : hub_id,
      signup_type,
      customer_type,
    });

    console.log("✅ Business records created successfully");
    
    // Check if email is confirmed using Supabase's native tracking
    const emailConfirmed = authData.user.email_confirmed_at !== null;
    if (!emailConfirmed) {
      console.log("📧 Confirmation email sent, user must verify email before login");
    }

    console.log("✅ Signup completed successfully");
    console.log("emailConfirmed:", emailConfirmed);
    console.log("confirmation_email_sent will be:", !emailConfirmed);

    return new Response(
      JSON.stringify({
        success: true,
        user_id: authData.user.id,
        email: email,
        hub_id: invitationData ? invitationData.hub_id : hub_id,
        customer_type: customer_type,
        confirmation_email_sent: true, // Always true for new signups
        email_verified: emailConfirmed,
        business_records_created: true,
        message: emailConfirmed 
          ? "Email verified successfully!" 
          : "Account created! Please check your email to verify your account.",
        environment: environment,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in signup-native:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "An unexpected error occurred",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
