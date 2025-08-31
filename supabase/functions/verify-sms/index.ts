import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface VerifySMSData {
  phone: string;
  verificationCode: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { phone, verificationCode }: VerifySMSData = await req.json();

    if (!phone || !verificationCode) {
      throw new Error("Missing phone or verificationCode.");
    }

    console.log(
      "🔍 Verification attempt for phone:",
      phone,
      "code:",
      verificationCode
    );

    // Find the verification request
    const { data: request, error: fetchError } = await supabaseClient
      .from("demo_verification_requests")
      .select("*")
      .eq("phone", phone)
      .eq("verification_code", verificationCode)
      .eq("status", "pending")
      .single();

    if (fetchError || !request) {
      console.error("❌ Error fetching verification request:", fetchError);
      throw new Error("Invalid verification code or phone number.");
    }

    // Check if code has expired
    if (new Date(request.verification_expires) < new Date()) {
      throw new Error("Verification code has expired.");
    }

    // Mark the verification request as verified
    const { error: updateError } = await supabaseClient
      .from("demo_verification_requests")
      .update({
        status: "verified",
        verified_at: new Date().toISOString(),
        verification_code: null, // Clear the code for security
        verification_expires: null,
      })
      .eq("id", request.id);

    if (updateError) {
      console.error("Error updating verification request status:", updateError);
      throw new Error("Failed to update verification status.");
    }

    console.log("✅ Verification successful!");

    // Verification successful - return success response
    return new Response(
      JSON.stringify({
        success: true,
        message:
          "Phone number verified successfully. You can now access the demo.",
        requestId: request.id,
        phone: request.phone,
        nextStep: "demo_access",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in verify-sms function:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        success: false,
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
