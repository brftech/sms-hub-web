import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ResendRequest {
  verification_id: string;
  auth_method: "sms" | "email";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const request: ResendRequest = await req.json();
    console.log("🔄 Resend verification request:", request);

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get the verification record
    const { data: verificationRecord, error: fetchError } = await supabaseAdmin
      .from("verifications")
      .select("*")
      .eq("id", request.verification_id)
      .single();

    if (fetchError || !verificationRecord) {
      throw new Error("Invalid verification session");
    }

    // Generate new verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Update verification record with new code
    const { error: updateError } = await supabaseAdmin
      .from("verifications")
      .update({
        verification_code: verificationCode,
        verification_sent_at: new Date().toISOString(),
      })
      .eq("id", request.verification_id);

    if (updateError) {
      throw new Error("Failed to update verification code");
    }

    // Send the new code
    if (request.auth_method === "sms") {
      const zapierWebhookUrl = Deno.env.get("ZAPIER_SMS_WEBHOOK_URL");

      if (!zapierWebhookUrl) {
        console.error("❌ ZAPIER_SMS_WEBHOOK_URL not configured");
        throw new Error("SMS service not configured");
      }

      const payload = {
        to: verificationRecord.mobile_phone_number,
        phone: verificationRecord.mobile_phone_number,
        phone_number: verificationRecord.mobile_phone_number,
        message: `Your verification code is: ${verificationCode}. This code will expire in 15 minutes.`,
        text: `Your verification code is: ${verificationCode}. This code will expire in 15 minutes.`,
        type: "verification",
        code: verificationCode,
      };

      const response = await fetch(zapierWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error(
          `❌ Error sending SMS via Zapier:`,
          await response.text()
        );
        throw new Error(`Failed to send SMS verification`);
      }
    } else {
      // Send email
      const resendApiKey = Deno.env.get("RESEND_API_KEY");

      if (!resendApiKey) {
        console.error("❌ RESEND_API_KEY not configured");
        throw new Error("Email service not configured");
      }

      const emailPayload = {
        from: "SMS Hub <noreply@notifications.gnymble.com>",
        to: verificationRecord.email,
        subject: "Your Verification Code",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Verify Your Email</h2>
            <p>Your verification code is:</p>
            <h1 style="font-size: 36px; letter-spacing: 5px; text-align: center; background: #f4f4f4; padding: 20px; border-radius: 8px;">
              ${verificationCode}
            </h1>
            <p>This code will expire in 15 minutes.</p>
            <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
          </div>
        `,
        text: `Your verification code is: ${verificationCode}\n\nThis code will expire in 15 minutes.`,
      };

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Error sending email via Resend:`, errorText);
        throw new Error(`Failed to send email verification`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Verification code resent",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("❌ Error in resend-verification:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to resend verification",
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
