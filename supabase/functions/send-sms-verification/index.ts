import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SmsVerificationRequest {
  phone: string;
  redirectUrl: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, redirectUrl }: SmsVerificationRequest = await req.json();

    if (!phone) {
      throw new Error("Phone number is required");
    }

    // Create Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Generate a 6-digit verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Store the verification request in the database
    const { data: request, error: insertError } = await supabaseAdmin
      .from("demo_verification_requests")
      .insert({
        phone,
        verification_code: verificationCode,
        verification_expires: expiresAt.toISOString(),
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting verification request:", insertError);
      throw new Error("Failed to create verification request");
    }

    // SMS message showcasing Gnymble's SMS capabilities
    const smsMessage = `Welcome to Gnymble! 🚀

Your verification code is: ${verificationCode}

This code expires in 10 minutes.

This SMS was sent using Gnymble's platform - the same technology you'll use to grow your business!

Questions? We're here to help.`;

    // Call Zapier webhook to send actual SMS
    const zapierWebhookUrl = Deno.env.get("ZAPIER_SMS_WEBHOOK_URL");

    if (zapierWebhookUrl) {
      try {
        console.log("🔗 Calling Zapier webhook:", zapierWebhookUrl);

        const zapierResponse = await fetch(zapierWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: phone,
            message: smsMessage,
            verification_code: verificationCode,
            request_id: request.id,
            timestamp: new Date().toISOString(),
            source: "gnymble-website-demo",
          }),
        });

        if (zapierResponse.ok) {
          console.log("✅ Zapier webhook called successfully");
          console.log("📱 SMS sent via Zapier to:", phone);
        } else {
          console.error(
            "❌ Zapier webhook failed:",
            zapierResponse.status,
            zapierResponse.statusText
          );
          // Fall back to console logging for demo purposes
          console.log("📱 SMS would be sent to:", phone);
          console.log("📝 Message:", smsMessage);
          console.log("🔑 Verification code:", verificationCode);
        }
      } catch (zapierError) {
        console.error("❌ Error calling Zapier webhook:", zapierError);
        // Fall back to console logging for demo purposes
        console.log("📱 SMS would be sent to:", phone);
        console.log("📝 Message:", smsMessage);
        console.log("🔑 Verification code:", verificationCode);
      }
    } else {
      console.log(
        "⚠️ ZAPIER_SMS_WEBHOOK_URL not configured, falling back to demo mode"
      );
      console.log("📱 SMS would be sent to:", phone);
      console.log("📝 Message:", smsMessage);
      console.log("🔑 Verification code:", verificationCode);
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Verification code sent successfully",
        phone: phone.replace(/(\d{3})(\d{3})(\d{4})/, "***-***-$3"), // Partially mask phone
        requestId: request.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error in send-sms-verification:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
