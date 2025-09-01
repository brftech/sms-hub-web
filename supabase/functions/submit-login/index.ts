import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SubmitLoginRequest {
  temp_signup_id: string;
  user_id: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { temp_signup_id, user_id }: SubmitLoginRequest = await req.json();
    console.log("🔑 Submit login request:", { temp_signup_id, user_id });

    if (!temp_signup_id || !user_id) {
      throw new Error("Temp signup ID and user ID are required");
    }

    // Create Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get temp signup to determine auth method
    const { data: tempSignup, error: tempError } = await supabaseAdmin
      .from("temp_signups")
      .select("auth_method")
      .eq("id", temp_signup_id)
      .single();

    if (tempError) {
      console.error("⚠️ Error fetching temp signup:", tempError);
    }

    // Get user profile
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .select("*, companies(*)")
      .eq("id", user_id)
      .single();

    if (profileError || !userProfile) {
      console.error("❌ Error fetching user profile:", profileError);
      throw new Error("User profile not found");
    }

    // Get the auth user
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(user_id);

    if (authError || !authUser) {
      console.error("❌ Error fetching auth user:", authError);
      throw new Error("Authentication user not found");
    }

    // Create a new session for the user
    const { data: session, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: authUser.user.email!,
      options: {
        redirectTo: `${Deno.env.get("PUBLIC_SITE_URL") || req.headers.get("origin")}/dashboard`,
      }
    });

    if (sessionError) {
      console.error("❌ Error creating session:", sessionError);
      throw new Error("Failed to create login session");
    }

    // Mark temp signup as used
    await supabaseAdmin
      .from("temp_signups")
      .update({ 
        verification_status: "verified",
        verified_at: new Date().toISOString()
      })
      .eq("id", temp_signup_id);

    // Update last login and method
    await supabaseAdmin
      .from("user_profiles")
      .update({ 
        last_login_at: new Date().toISOString(),
        last_login_method: tempSignup?.auth_method || "sms",
        updated_at: new Date().toISOString()
      })
      .eq("id", user_id);

    console.log("✅ Login successful for user:", user_id);

    // Determine redirect based on user's subscription status
    let redirect = "/dashboard";
    if (userProfile.companies && userProfile.companies.subscription_status !== "active") {
      redirect = "/onboarding"; // Send to payment if no active subscription
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: userProfile.id,
          email: userProfile.email,
          first_name: userProfile.first_name,
          last_name: userProfile.last_name,
          company_id: userProfile.company_id,
          hub_id: userProfile.hub_id,
        },
        session_url: session.properties?.action_link,
        redirect,
        message: "Login successful",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("❌ Error in submit-login:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to complete login",
        success: false,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

export default serve;