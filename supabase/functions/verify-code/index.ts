import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface VerifyCodeData {
  temp_signup_id: string;
  verification_code: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { temp_signup_id, verification_code }: VerifyCodeData =
      await req.json();

    if (!temp_signup_id || !verification_code) {
      throw new Error("Missing temp_signup_id or verification_code");
    }

    // Create Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    console.log("🔍 Verifying code for signup:", temp_signup_id);

    // Find the temp signup
    const { data: tempSignup, error: fetchError } = await supabaseAdmin
      .from("temp_signups")
      .select("*")
      .eq("id", temp_signup_id)
      .eq("verification_code", verification_code)
      .single();

    if (fetchError || !tempSignup) {
      console.error("❌ Error fetching temp signup:", fetchError);
      throw new Error("Invalid verification code or signup ID");
    }

    // Check if code has expired
    if (new Date(tempSignup.expires_at) < new Date()) {
      throw new Error("Verification code has expired");
    }

    // Check if max attempts exceeded
    if (tempSignup.verification_attempts >= tempSignup.max_attempts) {
      throw new Error("Maximum verification attempts exceeded");
    }

    // Increment verification attempts
    await supabaseAdmin
      .from("temp_signups")
      .update({
        verification_attempts: tempSignup.verification_attempts + 1,
      })
      .eq("id", temp_signup_id);

    // If verification successful, create user profile
    if (verification_code === tempSignup.verification_code) {
      // Mark as verified
      await supabaseAdmin
        .from("temp_signups")
        .update({
          is_verified: true,
          verified_at: new Date().toISOString(),
        })
        .eq("id", temp_signup_id);

      console.log("✅ Verification successful for signup:", temp_signup_id);

      // Return success response
      return new Response(
        JSON.stringify({
          success: true,
          message: "Verification successful! Your account is now active.",
          tempSignup: {
            id: tempSignup.id,
            company_name: tempSignup.company_name,
            first_name: tempSignup.first_name,
            last_name: tempSignup.last_name,
            email: tempSignup.email,
            mobile_phone_number: tempSignup.mobile_phone_number,
            hub_id: tempSignup.hub_id,
          },
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } else {
      throw new Error("Invalid verification code");
    }
  } catch (error: any) {
    console.error("Error in verify-code function:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to verify code",
        success: false,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
