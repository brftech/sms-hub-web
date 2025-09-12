import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  console.log("🔄 SMS verification consent request received");

  try {
    const {
      action, // "send" or "verify"
      phone_number,
      verification_code,
      consent_text,
      consent_given,
    } = await req.json();

    // Get auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Create Supabase clients
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
        auth: { persistSession: false },
      }
    );

    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      console.error("Failed to get user:", userError);
      throw new Error("Unauthorized");
    }

    if (action === "send") {
      // Check if user has already verified this phone number
      const { data: existingVerification } = await supabaseAdmin
        .from("sms_verifications")
        .select("*")
        .eq("user_id", user.id)
        .eq("phone_number", phone_number)
        .not("verified_at", "is", null)
        .single();

      if (existingVerification) {
        return new Response(
          JSON.stringify({
            success: true,
            already_verified: true,
            message: "This phone number is already verified for your account",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Generate verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      // Get client IP for consent tracking
      const clientIp = req.headers.get("x-forwarded-for") || 
                      req.headers.get("x-real-ip") || 
                      "unknown";

      // Create verification record with consent
      const { data: verificationData, error: verificationError } = await supabaseAdmin
        .from("sms_verifications")
        .insert([
          {
            user_id: user.id,
            phone_number: phone_number,
            verification_code: code,
            consent_given: consent_given || false,
            consent_timestamp: consent_given ? new Date().toISOString() : null,
            consent_ip_address: consent_given ? clientIp : null,
            consent_text: consent_text || "I consent to receive SMS messages for account verification and important updates",
          },
        ])
        .select()
        .single();

      if (verificationError) {
        console.error("Failed to create verification record:", verificationError);
        throw new Error("Failed to create verification session");
      }

      // Send SMS via Zapier webhook
      const zapierUrl = Deno.env.get("ZAPIER_SMS_WEBHOOK_URL");
      if (!zapierUrl) {
        throw new Error("SMS service not configured");
      }

      console.log("📱 Sending SMS verification to:", phone_number);

      const smsResponse = await fetch(zapierUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phone_number,
          to: phone_number,
          phone: phone_number,
          phone_number: phone_number,
          message: `Your ${Deno.env.get("APP_NAME") || "SMS Hub"} verification code is: ${code}. This code expires in 15 minutes.`,
          text: `Your ${Deno.env.get("APP_NAME") || "SMS Hub"} verification code is: ${code}. This code expires in 15 minutes.`,
          type: "verification",
          code: code,
        }),
      });

      if (!smsResponse.ok) {
        const errorText = await smsResponse.text();
        console.error("❌ SMS send failed:", {
          status: smsResponse.status,
          statusText: smsResponse.statusText,
          error: errorText
        });
        throw new Error("Failed to send SMS verification");
      }

      console.log("✅ SMS verification sent successfully");

      return new Response(
        JSON.stringify({
          success: true,
          verification_id: verificationData.id,
          message: "Verification code sent to your phone",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } else if (action === "verify") {
      // Verify the code
      const { data: verificationRecord, error: findError } = await supabaseAdmin
        .from("sms_verifications")
        .select("*")
        .eq("user_id", user.id)
        .eq("phone_number", phone_number)
        .eq("verification_code", verification_code)
        .is("verified_at", null)
        .gte("expires_at", new Date().toISOString())
        .single();

      if (findError || !verificationRecord) {
        console.error("Invalid verification code:", findError);
        return new Response(
          JSON.stringify({ error: "Invalid or expired verification code" }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400 
          }
        );
      }

      // Mark as verified
      const { error: updateError } = await supabaseAdmin
        .from("sms_verifications")
        .update({
          verified_at: new Date().toISOString(),
        })
        .eq("id", verificationRecord.id);

      if (updateError) {
        console.error("Failed to update verification:", updateError);
        throw new Error("Failed to verify code");
      }

      // Update user profile with verified phone and mark verification setup as complete
      const { error: profileError } = await supabaseAdmin
        .from("user_profiles")
        .update({
          mobile_phone_number: phone_number,
          verification_setup_completed: true,
          verification_setup_completed_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (profileError) {
        console.error("Failed to update user profile:", profileError);
      }

      console.log("✅ Phone number verified successfully");

      return new Response(
        JSON.stringify({
          success: true,
          message: "Phone number verified successfully",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } else {
      throw new Error("Invalid action. Use 'send' or 'verify'");
    }

  } catch (error) {
    console.error("Error in sms-verification-consent:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});