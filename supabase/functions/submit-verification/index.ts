import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      email,
      mobile_phone_number,
      auth_method,
      hub_id,
      signup_type,
      invitation_token,
      customer_type,
    } = await req.json();

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Generate verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Store verification request - only include fields that exist in the table
    const { data: verificationData, error: verificationError } =
      await supabaseAdmin
        .from("verifications")
        .insert([
          {
            email,
            mobile_phone_number,
            auth_method,
            verification_code: verificationCode,
            hub_id,
            company_name: "TBD", // Required field - will be collected later
            first_name: "TBD", // Required field - will be collected later
            last_name: "TBD", // Required field - will be collected later
            step_data: {
              signup_type,
              invitation_token,
              customer_type,
            },
            is_verified: false,
            expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
          },
        ])
        .select()
        .single();

    if (verificationError) {
      console.error(
        "Failed to create verification request:",
        verificationError
      );
      throw new Error("Failed to create verification session");
    }

    // Send verification code
    if (auth_method === "sms") {
      // Send SMS via Zapier webhook
      const zapierUrl = Deno.env.get("ZAPIER_SMS_WEBHOOK_URL");
      if (!zapierUrl) {
        throw new Error("SMS service not configured");
      }

      const smsResponse = await fetch(zapierUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          From: Deno.env.get("TWILIO_PHONE_NUMBER") || "+18885551234",
          To: mobile_phone_number,
          Body: `Your verification code is: ${verificationCode}`,
        }),
      });

      if (!smsResponse.ok) {
        console.error("SMS send failed:", await smsResponse.text());
        throw new Error("Failed to send SMS");
      }
    } else {
      // Send email via Resend
      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      if (!resendApiKey) {
        throw new Error("Email service not configured");
      }

      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "SMS Hub <noreply@smshub.com>",
          to: email,
          subject: "Verify your email",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Verify your email</h2>
              <p>Your verification code is:</p>
              <h1 style="font-size: 36px; letter-spacing: 5px; text-align: center; background: #f0f0f0; padding: 20px; border-radius: 8px;">
                ${verificationCode}
              </h1>
              <p>This code will expire in 10 minutes.</p>
            </div>
          `,
        }),
      });

      if (!emailResponse.ok) {
        console.error("Email send failed:", await emailResponse.text());
        throw new Error("Failed to send email");
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        verification_id: verificationData.id,
        auth_method,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in submit-verification:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
