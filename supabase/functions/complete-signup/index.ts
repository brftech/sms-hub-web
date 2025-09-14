import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  console.log("🔄 Complete signup request received");

  try {
    // Get the user's access token from the Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Create Supabase client with user's token
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
        auth: { persistSession: false }
      }
    );

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.error("Failed to get user:", userError);
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    console.log("Processing signup completion for user:", user.id);

    // Check if business records already exist
    const { data: existingProfile } = await supabaseClient
      .from("user_profiles")
      .select("id, company_id")
      .eq("id", user.id)
      .single();

    if (existingProfile?.company_id) {
      console.log("Business records already exist for user");
      return new Response(
        JSON.stringify({
          success: true,
          message: "Account already set up",
          company_id: existingProfile.company_id,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get user metadata from auth
    const metadata = user.user_metadata || {};

    // Create admin client for database operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const timestamp = new Date().toISOString();
    const companyId = crypto.randomUUID();
    const accountNumber = `ACC-${Date.now()}`;

    // Step 1: Create company record
    console.log("Creating company record...");
    const { data: companyData, error: companyError } = await supabaseAdmin
      .from("companies")
      .insert([{
        id: companyId,
        hub_id: metadata.hub_id || 0,
        public_name: metadata.company_name || "Unknown Company",
        legal_name: metadata.company_name || "Unknown Company",
        company_account_number: accountNumber,
        signup_type: metadata.signup_type || "new_company",
        is_active: true,
        first_admin_user_id: user.id,
        created_by_user_id: user.id,
        created_at: timestamp,
        updated_at: timestamp,
      }])
      .select()
      .single();

    if (companyError) {
      console.error("Failed to create company:", companyError);
      throw new Error(`Failed to create company: ${companyError.message}`);
    }

    console.log("✅ Company created:", companyData.id);

    // Step 2: Create or update user profile
    console.log("Creating/updating user profile...");
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .upsert([{
        id: user.id,
        email: user.email,
        account_number: `USR-${Date.now()}`,
        hub_id: metadata.hub_id || 0,
        first_name: metadata.first_name || "",
        last_name: metadata.last_name || "",
        mobile_phone_number: metadata.phone_number || "",
        role: "USER",
        signup_type: metadata.signup_type || "new_company",
        company_admin: true,
        company_admin_since: timestamp,
        company_id: companyId,
        is_active: true,
        created_at: timestamp,
        updated_at: timestamp,
      }])
      .select()
      .single();

    if (profileError) {
      console.error("Failed to create user profile:", profileError);
      throw new Error(`Failed to create user profile: ${profileError.message}`);
    }

    console.log("✅ User profile created:", profileData.id);

    // Step 3: Create membership record
    console.log("Creating membership...");
    const { data: membershipData, error: membershipError } = await supabaseAdmin
      .from("memberships")
      .insert([{
        user_id: user.id,
        company_id: companyId,
        hub_id: metadata.hub_id || 0,
        role: "USER",
        permissions: {
          admin: true,
          manage_users: true,
          manage_settings: true
        },
        is_active: true,
        joined_at: timestamp,
        created_at: timestamp,
        updated_at: timestamp,
      }])
      .select()
      .single();

    if (membershipError) {
      console.warn("Failed to create membership (non-critical):", membershipError.message);
    } else {
      console.log("✅ Membership created:", membershipData.id);
    }

    // Step 4: Create customer record
    console.log("Creating customer record...");
    const { data: customerData, error: customerError } = await supabaseAdmin
      .from("customers")
      .insert([{
        company_id: companyId,
        user_id: user.id,
        billing_email: user.email,
        payment_status: "pending",
        created_at: timestamp,
        updated_at: timestamp,
      }])
      .select()
      .single();

    if (customerError) {
      console.warn("Failed to create customer record (non-critical):", customerError.message);
    } else {
      console.log("✅ Customer record created:", customerData.id);
    }

    // Step 5: Create onboarding submission
    console.log("Creating onboarding submission...");
    const { data: onboardingData, error: onboardingError } = await supabaseAdmin
      .from("onboarding_submissions")
      .insert([{
        company_id: companyId,
        user_id: user.id,
        hub_id: metadata.hub_id || 0,
        current_step: "payment",
        stripe_status: "pending",
        submission_data: {
          company_name: metadata.company_name,
          first_name: metadata.first_name,
          last_name: metadata.last_name,
          email: user.email,
          hub_id: metadata.hub_id,
        },
        created_at: timestamp,
        updated_at: timestamp,
      }])
      .select()
      .single();

    if (onboardingError) {
      console.warn("Failed to create onboarding submission (non-critical):", onboardingError.message);
    } else {
      console.log("✅ Onboarding submission created:", onboardingData.id);
    }

    console.log("✅ All business records created successfully");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Business records created successfully",
        company_id: companyId,
        user_id: user.id,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in complete-signup:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to complete signup" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});