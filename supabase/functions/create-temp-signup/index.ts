import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CreateTempSignupRequest {
  hub_id: number;
  company_name: string;
  first_name: string;
  last_name: string;
  mobile_phone_number: string;
  email: string;
  auth_method?: 'sms' | 'email';
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signupData: CreateTempSignupRequest = await req.json();

    // Validate required fields
    const requiredFields = ['hub_id', 'company_name', 'first_name', 'last_name', 'mobile_phone_number', 'email'];
    for (const field of requiredFields) {
      if (!signupData[field as keyof CreateTempSignupRequest]) {
        throw new Error(`${field} is required`);
      }
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

    // Create temp signup with verification code
    const { data: tempSignup, error: insertError } = await supabaseAdmin
      .from("temp_signups")
      .insert({
        ...signupData,
        auth_method: signupData.auth_method || 'sms',
        verification_code: verificationCode,
        verification_attempts: 0,
        max_attempts: 3,
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating temp signup:", insertError);
      throw new Error("Failed to create signup request");
    }

    // Send verification based on auth method
    const authMethod = signupData.auth_method || 'sms';
    const hubName = getHubName(signupData.hub_id);

    if (authMethod === 'sms') {
      // Use our SMS platform via Zapier webhook
      const formattedPhone = signupData.mobile_phone_number.replace(/\D/g, "");
      
      console.log("📱 Sending SMS via our platform to:", formattedPhone);
      await sendSMSViaZapier(formattedPhone, verificationCode, hubName, tempSignup.id, signupData.hub_id);
    } else {
      // Send email verification
      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      
      if (resendApiKey) {
        try {
          const emailHtml = `
            <h2>Welcome to ${hubName}!</h2>
            <p>Your verification code is:</p>
            <h1 style="font-size: 32px; letter-spacing: 5px; color: #CC5500;">${verificationCode}</h1>
            <p>This code expires in 15 minutes.</p>
            <p>Questions? We're here to help.</p>
          `;

          const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: `${hubName} <noreply@${getHubDomain(signupData.hub_id)}>`,
              to: [signupData.email],
              subject: `Your ${hubName} Verification Code`,
              html: emailHtml,
            }),
          });

          if (response.ok) {
            console.log("✅ Email sent successfully to:", signupData.email);
          } else {
            console.error("❌ Resend API failed:", await response.text());
          }
        } catch (emailError) {
          console.error("❌ Error sending email:", emailError);
        }
      } else {
        console.log("⚠️ RESEND_API_KEY not configured");
        console.log("📧 Email would be sent to:", signupData.email);
        console.log("🔑 Verification code:", verificationCode);
      }
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        id: tempSignup.id,
        message: "Signup created successfully. Check your phone for verification code.",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error in create-temp-signup:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to create signup",
        details: error.toString()
      }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

function getHubName(hubId: number): string {
  const hubNames: Record<number, string> = {
    1: "PercyTech",
    2: "Gnymble",
    3: "PercyMD",
    4: "PercyText",
  };
  return hubNames[hubId] || "SMS Hub";
}

function getHubDomain(hubId: number): string {
  const hubDomains: Record<number, string> = {
    1: "percytech.com",
    2: "gnymble.com",
    3: "percymd.com",
    4: "percytext.com",
  };
  return hubDomains[hubId] || "sms-hub.com";
}

async function sendSMSViaZapier(phone: string, code: string, hubName: string, signupId: string, hubId: number) {
  const zapierWebhookUrl = Deno.env.get("ZAPIER_SMS_WEBHOOK_URL");
  
  const smsMessage = `Welcome to ${hubName}! 🚀

Your verification code is: ${code}

This code expires in 15 minutes.

Questions? We're here to help.`;

  if (zapierWebhookUrl) {
    try {
      console.log("🔗 Calling Zapier webhook for signup SMS");

      const zapierResponse = await fetch(zapierWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phone,
          message: smsMessage,
          verification_code: code,
          signup_id: signupId,
          hub_id: hubId,
          timestamp: new Date().toISOString(),
          source: "temp-signup",
        }),
      });

      if (zapierResponse.ok) {
        console.log("✅ SMS sent via Zapier to:", phone);
      } else {
        console.error("❌ Zapier webhook failed:", zapierResponse.status);
      }
    } catch (zapierError) {
      console.error("❌ Error calling Zapier webhook:", zapierError);
    }
  } else {
    console.log("⚠️ ZAPIER_SMS_WEBHOOK_URL not configured");
    console.log("📱 SMS would be sent to:", phone);
    console.log("🔑 Verification code:", code);
  }
}