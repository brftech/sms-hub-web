import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { signup_id, code, email, mobile_phone_number, auth_method } =
      await req.json();

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Find and verify the verification request
    const identifier = auth_method === "sms" ? mobile_phone_number : email;
    const identifierField =
      auth_method === "sms" ? "mobile_phone_number" : "email";

    const { data: verificationRequest, error: findError } = await supabaseAdmin
      .from("verifications")
      .select("*")
      .eq("id", signup_id)
      .eq(identifierField, identifier)
      .eq("verification_code", code)
      .eq("is_verified", false)
      .gte("expires_at", new Date().toISOString())
      .single();

    if (findError || !verificationRequest) {
      console.error("Verification failed:", findError);
      throw new Error("Invalid or expired verification code");
    }

    // Update verification request as verified
    const { error: updateError } = await supabaseAdmin
      .from("verifications")
      .update({
        is_verified: true,
      })
      .eq("id", signup_id);

    if (updateError) {
      console.error("Failed to update signup request:", updateError);
      throw new Error("Failed to verify code");
    }

    return new Response(
      JSON.stringify({
        success: true,
        verification_id: verificationRequest.id,
        verification_data: verificationRequest.step_data,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in verify-code:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
