import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  console.log("🔄 Native login request received");

  try {
    const { email, password } = await req.json();

    // Create Supabase client (not admin - we want standard auth flow)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Attempt to sign in with email and password
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (authError) {
      console.error("Login failed:", authError);
      
      // Provide user-friendly error messages
      if (authError.message.includes("Invalid login credentials")) {
        return new Response(
          JSON.stringify({ error: "Invalid email or password" }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 401 
          }
        );
      }
      
      return new Response(
        JSON.stringify({ error: authError.message }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401 
        }
      );
    }

    if (!authData.user || !authData.session) {
      throw new Error("Login failed - no session created");
    }

    console.log("✅ User logged in successfully:", authData.user.id);

    // Create admin client to get user profile data
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get user profile to include hub_id and other metadata
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .select(`
        *,
        companies (
          id,
          public_name,
          company_account_number
        ),
        customers (
          id,
          payment_status,
          subscription_status
        )
      `)
      .eq("id", authData.user.id)
      .single();

    if (profileError) {
      console.error("Failed to get user profile:", profileError);
    }

    // Update last login info
    await supabaseAdmin
      .from("user_profiles")
      .update({
        last_login_at: new Date().toISOString(),
        last_login_method: "password",
      })
      .eq("id", authData.user.id);

    // Check if user needs to complete onboarding
    const needsOnboarding = userProfile && !userProfile.onboarding_completed;
    const needsPayment = userProfile?.customers?.payment_status !== "succeeded";
    const needsSmsVerification = userProfile && !userProfile.verification_setup_completed;

    return new Response(
      JSON.stringify({
        success: true,
        session: authData.session,
        user: {
          id: authData.user.id,
          email: authData.user.email,
          hub_id: userProfile?.hub_id,
          role: userProfile?.role,
          company_id: userProfile?.company_id,
          first_name: userProfile?.first_name,
          last_name: userProfile?.last_name,
        },
        redirect_to: needsPayment ? "/payment-setup" : 
                    needsSmsVerification ? "/sms-verification" : 
                    needsOnboarding ? "/onboarding" : "/dashboard",
        needs_onboarding: needsOnboarding,
        needs_payment: needsPayment,
        needs_sms_verification: needsSmsVerification,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in login-native:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});