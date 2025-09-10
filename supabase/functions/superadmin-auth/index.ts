import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

interface SuperadminAuthRequest {
  email: string;
  password: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, password }: SuperadminAuthRequest = await req.json();

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    console.log("🔐 Superadmin authentication attempt:", email);

    // Authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.error("❌ Authentication failed:", authError);
      throw new Error("Invalid superadmin credentials");
    }

    // Get user profile from database
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', authData.user.id)
      .eq('role', 'SUPERADMIN')
      .single();

    if (profileError || !userProfile) {
      console.error("❌ Superadmin profile not found:", profileError);
      throw new Error("Superadmin profile not found");
    }

    console.log("✅ Superadmin authenticated successfully:", userProfile.email);

    // Return superadmin user data and session
    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: userProfile.id,
          email: userProfile.email,
          role: userProfile.role,
          first_name: userProfile.first_name,
          last_name: userProfile.last_name,
          company_admin: userProfile.company_admin,
          verification_setup_completed: userProfile.verification_setup_completed,
          payment_status: userProfile.payment_status,
          onboarding_completed: userProfile.onboarding_completed,
          permissions: userProfile.permissions
        },
        session: {
          access_token: authData.session.access_token,
          refresh_token: authData.session.refresh_token,
          expires_at: authData.session.expires_at,
          token_type: authData.session.token_type
        },
        message: "Superadmin authentication successful"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("❌ Error in superadmin-auth:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});