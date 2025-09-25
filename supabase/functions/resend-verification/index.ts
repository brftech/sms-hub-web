import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  console.log("🔄 Resend verification request received");

  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Check if user exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(
      (user) => user.email === email
    );

    if (!existingUser) {
      return new Response(
        JSON.stringify({ error: "No account found with this email" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    // Check if user is already confirmed
    if (existingUser.email_confirmed_at) {
      return new Response(
        JSON.stringify({
          error: "Account is already confirmed. Please try logging in.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Resend confirmation email using Supabase's built-in resend
    const { error: resendError } = await supabaseAdmin.auth.admin.generateLink({
      type: "signup",
      email: email,
      options: {
        emailRedirectTo: `${Deno.env.get("UNIFIED_APP_URL") || "http://localhost:3001"}/auth-callback`,
      },
    });

    if (resendError) {
      console.error("Failed to resend verification email:", resendError);
      return new Response(
        JSON.stringify({
          error: "Failed to resend verification email. Please try again.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    console.log("✅ Verification email resent successfully to:", email);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Verification email sent successfully",
        email: email,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in resend-verification:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "An unexpected error occurred",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
