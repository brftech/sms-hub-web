import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SubmitVerifyRequest {
  action: "send" | "verify";
  temp_signup_id?: string;
  email?: string;
  mobile_phone_number?: string;
  auth_method?: "sms" | "email";
  verification_code?: string;
  is_login?: boolean;
  hub_id?: number;
  signup_type?: "new_company" | "invited_user" | "individual";
  customer_type?: "company" | "individual";
  invitation_token?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const request: SubmitVerifyRequest = await req.json();
    console.log("🔐 Submit verify request:", { ...request, verification_code: "***" });

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    if (request.action === "send") {
      // SEND VERIFICATION CODE
      return await handleSendVerification(request, supabaseAdmin);
    } else if (request.action === "verify") {
      // VERIFY CODE
      return await handleVerifyCode(request, supabaseAdmin);
    } else {
      throw new Error("Invalid action specified");
    }
  } catch (error: any) {
    console.error("❌ Error in submit-verify:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to process verification",
        success: false,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

async function handleSendVerification(
  request: SubmitVerifyRequest,
  supabaseAdmin: any
) {
  const { temp_signup_id, email, mobile_phone_number, auth_method, is_login, hub_id, signup_type, invitation_token, customer_type } = request;

  if (!email || !mobile_phone_number || !auth_method) {
    throw new Error("Email, phone number, and auth method are required");
  }

  // For new signups, hub_id is required
  if (!is_login && !hub_id) {
    throw new Error("Hub ID is required for new signups");
  }

  // Generate verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  if (is_login) {
    // Handle login flow - check if user exists
    const { data: existingUser, error: userError } = await supabaseAdmin
      .from("user_profiles")
      .select("id, email, mobile_phone_number, hub_id, company_id")
      .or(`email.eq.${email},mobile_phone_number.eq.${mobile_phone_number}`)
      .single();

    if (userError || !existingUser) {
      throw new Error("No account found with these credentials");
    }

    // Create or update temp signup for login
    const { data: tempSignup, error: tempError } = await supabaseAdmin
      .from("temp_signups")
      .upsert({
        id: crypto.randomUUID(),
        hub_id: existingUser.hub_id,
        email: email,
        mobile_phone_number: mobile_phone_number,
        verification_code: verificationCode,
        auth_method: auth_method,
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        is_login: true,
        user_id: existingUser.id,
      })
      .select()
      .single();

    if (tempError) {
      console.error("❌ Error creating login verification:", tempError);
      throw new Error("Failed to create verification request");
    }

    // Send verification code
    try {
      await sendVerificationCode(auth_method, email, mobile_phone_number, verificationCode);
    } catch (sendError: any) {
      console.error("❌ Error sending verification code for login:", sendError);
      console.warn("⚠️ Login verification code saved but not sent:", verificationCode);
    }

    return new Response(
      JSON.stringify({
        success: true,
        id: tempSignup.id,
        message: "Verification code sent for login",
        auth_method: auth_method,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } else {
    // Handle signup flow - create new temp signup (no longer requires existing one)
    // Check if email/phone already exists in user_profiles
    const { data: existingUser } = await supabaseAdmin
      .from("user_profiles")
      .select("id")
      .or(`email.eq.${email},mobile_phone_number.eq.${mobile_phone_number}`)
      .single();

    if (existingUser) {
      throw new Error("An account already exists with this email or phone number. Please log in instead.");
    }

    // Handle invitation validation for invited users
    let validatedInvitation = null;
    let finalHubId = hub_id;
    let companyId = null;
    
    if (signup_type === "invited_user" && invitation_token) {
      // Validate invitation
      const { data: invitation, error: inviteError } = await supabaseAdmin
        .from("user_invitations")
        .select(`
          *,
          companies (
            id,
            public_name,
            hub_id
          )
        `)
        .eq("invitation_token", invitation_token)
        .eq("status", "pending")
        .single();

      if (inviteError || !invitation) {
        throw new Error("Invalid or expired invitation");
      }

      // Check if invitation is expired
      if (new Date(invitation.expires_at) < new Date()) {
        throw new Error("This invitation has expired. Please request a new one.");
      }

      // Verify email matches invitation
      if (invitation.email !== email) {
        throw new Error("Email does not match invitation");
      }

      validatedInvitation = invitation;
      finalHubId = invitation.hub_id;
      companyId = invitation.company_id;
    }

    // Create new temp signup with minimal info
    const newTempSignupId = crypto.randomUUID();
    const { data: newSignup, error: createError } = await supabaseAdmin
      .from("temp_signups")
      .insert({
        id: newTempSignupId,
        hub_id: finalHubId,
        email: email,
        mobile_phone_number: mobile_phone_number,
        verification_code: verificationCode,
        auth_method: auth_method,
        verification_attempts: 0,
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        onboarding_step: "verification",
        company_name: "",  // Will be filled during onboarding
        first_name: "",    // Will be filled during onboarding
        last_name: "",     // Will be filled during onboarding
        // Store signup_type and invitation_token in step_data for now
        step_data: {
          signup_type: signup_type || "new_company",
          invitation_token: invitation_token || null,
          company_id: companyId,
        },
      })
      .select()
      .single();

    if (createError) {
      console.error("❌ Error creating temp signup:", createError);
      throw new Error("Failed to create signup session");
    }

    // Send verification code
    try {
      await sendVerificationCode(auth_method, email, mobile_phone_number, verificationCode);
    } catch (sendError: any) {
      console.error("❌ Error sending verification code:", sendError);
      // Don't fail the signup, just log the error
      // The code is already saved in the database
      console.warn("⚠️ Verification code saved but not sent:", verificationCode);
    }

    return new Response(
      JSON.stringify({
        success: true,
        id: newSignup.id,
        message: "Verification code sent",
        auth_method: auth_method,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  }
}

async function handleVerifyCode(
  request: SubmitVerifyRequest,
  supabaseAdmin: any
) {
  const { temp_signup_id, verification_code } = request;

  if (!temp_signup_id || !verification_code) {
    throw new Error("Signup ID and verification code are required");
  }

  // Get temp signup
  const { data: tempSignup, error: fetchError } = await supabaseAdmin
    .from("temp_signups")
    .select("*")
    .eq("id", temp_signup_id)
    .single();

  if (fetchError || !tempSignup) {
    throw new Error("Invalid verification session");
  }

  // Check if expired
  if (new Date(tempSignup.expires_at) < new Date()) {
    throw new Error("Verification code has expired. Please request a new one.");
  }

  // Extract signup metadata from step_data
  const stepData = tempSignup.step_data || {};
  const signupType = stepData.signup_type || "new_company";
  const invitationToken = stepData.invitation_token;
  const companyId = stepData.company_id;

  // Check attempts
  if (tempSignup.verification_attempts >= (tempSignup.max_attempts || 5)) {
    throw new Error("Too many verification attempts. Please request a new code.");
  }

  // Verify code
  if (tempSignup.verification_code !== verification_code) {
    // Increment attempts
    await supabaseAdmin
      .from("temp_signups")
      .update({ verification_attempts: tempSignup.verification_attempts + 1 })
      .eq("id", temp_signup_id);

    throw new Error("Invalid verification code");
  }

  // Code is valid!
  if (tempSignup.is_login) {
    // Handle login completion
    const { data, error } = await supabaseAdmin.functions.invoke("submit-login", {
      body: { temp_signup_id, user_id: tempSignup.user_id },
    });

    if (error) throw error;
    return new Response(
      JSON.stringify(data),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } else {
    // Handle signup completion - create minimal user profile
    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: tempSignup.email,
        phone: tempSignup.mobile_phone_number,
        password: Math.random().toString(36), // Temporary password
        email_confirm: true,
        phone_confirm: true,
        user_metadata: {
          temp_signup_id: tempSignup.id,
          hub_id: tempSignup.hub_id,
          signup_type: signupType,
          customer_type: signupType === "individual" ? "individual" : "company",
        },
      });

      if (authError || !authData.user) {
        console.error("❌ Error creating auth user:", authError);
        throw new Error("Failed to create user account");
      }

      // Generate account number based on hub
      const hubName = tempSignup.hub_id === 1 ? "PERCY" : 
                      tempSignup.hub_id === 2 ? "GNYM" :
                      tempSignup.hub_id === 3 ? "PMD" : "PTXT";
      const timestamp = Date.now().toString(36).toUpperCase();
      const random = Math.random().toString(36).substring(2, 6).toUpperCase();
      const accountNumber = `${hubName}-${timestamp}-${random}`;

      // Create minimal user profile (no company yet for new_company signups)
      const { data: profile, error: profileError } = await supabaseAdmin
        .from("user_profiles")
        .insert({
          id: authData.user.id,
          email: tempSignup.email,
          mobile_phone_number: tempSignup.mobile_phone_number,
          hub_id: tempSignup.hub_id,
          is_active: true,
          created_at: new Date().toISOString(),
          signup_type: signupType,
          is_individual_customer: signupType === "individual",
          account_number: accountNumber,
          first_name: tempSignup.first_name || "",
          last_name: tempSignup.last_name || "",
          company_name: tempSignup.company_name || "",
          // For invited users, set company_id and invited_by
          ...(signupType === "invited_user" && companyId ? {
            company_id: companyId,
            invited_by_user_id: invitationToken ? 
              (await supabaseAdmin
                .from("user_invitations")
                .select("invited_by_user_id")
                .eq("invitation_token", invitationToken)
                .single()
              ).data?.invited_by_user_id : null,
            invitation_accepted_at: new Date().toISOString(),
          } : {}),
        })
        .select()
        .single();

      if (profileError) {
        console.error("❌ Error creating profile:", profileError);
        throw new Error("Failed to create user profile");
      }

      // Skip creating contact record - not needed for signup flow

      // Mark temp signup as verified
      await supabaseAdmin
        .from("temp_signups")
        .update({ 
          verification_status: "verified",
          verified_at: new Date().toISOString(),
          user_id: authData.user.id
        })
        .eq("id", temp_signup_id);

      // If this was an invited user, update the invitation status
      if (signupType === "invited_user" && invitationToken) {
        await supabaseAdmin
          .from("user_invitations")
          .update({
            status: "accepted",
            accepted_at: new Date().toISOString(),
          })
          .eq("invitation_token", invitationToken);

        // Also create inbox assignment for invited user
        if (tempSignup.company_id) {
          // Get default inbox for the company
          const { data: inbox } = await supabaseAdmin
            .from("inboxes")
            .select("id")
            .eq("company_id", tempSignup.company_id)
            .eq("is_default", true)
            .single();

          if (inbox) {
            await supabaseAdmin
              .from("user_inbox_assignments")
              .insert({
                hub_id: tempSignup.hub_id,
                user_id: authData.user.id,
                company_id: tempSignup.company_id,
                inbox_id: inbox.id,
                role: "USER",
                permissions: {},
                is_active: true,
                assigned_at: new Date().toISOString(),
              });
          }
        }
      }

      // Generate a magic link token for automatic sign-in
      const { data: magicLink, error: magicLinkError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: authData.user.email!,
        options: {
          redirectTo: `${Deno.env.get("PUBLIC_SITE_URL") || "http://localhost:3001"}/dashboard`,
        }
      });

      console.log("✅ Minimal user created successfully:", authData.user.id);
      if (magicLink) {
        console.log("✅ Magic link generated for auto-signin");
      }

      return new Response(
        JSON.stringify({
          success: true,
          account: {
            userId: profile.id,
            email: profile.email,
            hubId: profile.hub_id,
            companyId: null, // No company yet for new signups
          },
          tempSignup: {
            id: tempSignup.id,
            email: tempSignup.email,
            hub_id: tempSignup.hub_id,
          },
          user: {
            id: profile.id,
            email: profile.email,
            hub_id: profile.hub_id,
          },
          session_url: magicLink?.properties?.action_link,
          magic_link_token: magicLink?.properties?.hashed_token,
          redirect: "/payment", // Go directly to payment
          message: "Account created successfully",
          // Include auth details for automatic login
          auth: {
            userId: authData.user.id,
            email: authData.user.email,
          }
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } catch (error: any) {
      console.error("❌ Error in signup completion:", error);
      throw new Error(error.message || "Failed to create account");
    }
  }
}

async function sendVerificationCode(
  method: "sms" | "email",
  email: string,
  phone: string,
  code: string
) {
  console.log(`📤 Sending ${method} verification to ${method === "sms" ? phone : email}`);
  
  if (method === "sms") {
    // Use Zapier webhook for SMS
    const zapierWebhookUrl = Deno.env.get("ZAPIER_SMS_WEBHOOK_URL");
    
    if (!zapierWebhookUrl) {
      console.error("❌ ZAPIER_SMS_WEBHOOK_URL not configured");
      throw new Error("SMS service not configured");
    }

    // Zapier might expect different field names
    const payload = {
      to: phone,
      phone: phone,  // Alternative field name
      phone_number: phone,  // Another alternative
      message: `Your verification code is: ${code}. This code will expire in 15 minutes.`,
      text: `Your verification code is: ${code}. This code will expire in 15 minutes.`,  // Alternative field name
      type: "verification",
      code: code,  // Include the code separately in case Zapier needs it
    };
    
    console.log(`📱 Sending SMS payload to Zapier:`, JSON.stringify(payload));
    
    const response = await fetch(zapierWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`❌ Error sending SMS via Zapier:`, await response.text());
      throw new Error(`Failed to send SMS verification`);
    }

    console.log(`✅ SMS verification sent successfully via Zapier`);
  } else {
    // Send email verification using Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.error("❌ RESEND_API_KEY not configured");
      throw new Error("Email service not configured");
    }

    const emailPayload = {
      from: "SMS Hub <noreply@notifications.gnymble.com>",
      to: email,
      subject: "Your Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verify Your Email</h2>
          <p>Your verification code is:</p>
          <h1 style="font-size: 36px; letter-spacing: 5px; text-align: center; background: #f4f4f4; padding: 20px; border-radius: 8px;">
            ${code}
          </h1>
          <p>This code will expire in 15 minutes.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
      text: `Your verification code is: ${code}\n\nThis code will expire in 15 minutes.`,
    };

    console.log(`📧 Sending email to:`, email);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Error sending email via Resend:`, errorText);
      throw new Error(`Failed to send email verification`);
    }

    const result = await response.json();
    console.log(`✅ Email verification sent successfully:`, result.id);
  }
}

export default serve;