import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      verification_id,
      verification_code,
      email,
      mobile_phone_number,
      auth_method,
    } = await req.json();

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Find and verify the verification request
    const identifier = auth_method === "sms" ? mobile_phone_number : email;
    const identifierField =
      auth_method === "sms" ? "mobile_phone" : "email";

    console.log("🔍 Verification attempt:", {
      verification_id,
      verification_code,
      identifier,
      identifierField,
      auth_method,
    });

    const { data: verificationExists, error: findError } = await supabaseAdmin
      .from("verifications")
      .select("*")
      .eq("id", verification_id)
      .eq(identifierField, identifier)
      .eq("verification_code", verification_code)
      .is("verification_completed_at", null) // Check if not yet completed
      .single();

    if (findError || !verificationExists) {
      console.error("❌ Verification failed:", findError);
      console.error("❌ Query conditions:", {
        id: verification_id,
        [identifierField]: identifier,
        verification_code,
        verification_completed_at: null,
      });
      throw new Error("Invalid or expired verification code");
    }

    console.log("✅ Verification record found:", verificationExists);

    // Update verification request as verified
    const { error: updateError } = await supabaseAdmin
      .from("verifications")
      .update({
        verification_completed_at: new Date().toISOString(),
      })
      .eq("id", verification_id);

    if (updateError) {
      console.error("Failed to update verification request:", updateError);
      throw new Error("Failed to verify code");
    }

    return new Response(
      JSON.stringify({
        success: true,
        verification_id: verificationExists.id,
        signup_id: verificationExists.id, // For backward compatibility
        verification_data: verificationExists.step_data,
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
