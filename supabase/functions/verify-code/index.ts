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

    // If verification successful, create user profile and company
    if (verification_code === tempSignup.verification_code) {
      try {
        // Mark as verified
        await supabaseAdmin
          .from("temp_signups")
          .update({
            is_verified: true,
            verified_at: new Date().toISOString(),
          })
          .eq("id", temp_signup_id);

        console.log("✅ Verification successful for signup:", temp_signup_id);

        // Create company record
        const { data: company, error: companyError } = await supabaseAdmin
          .from("companies")
          .insert({
            name: tempSignup.company_name,
            hub_id: tempSignup.hub_id,
            is_active: true,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (companyError) {
          console.error("❌ Error creating company:", companyError);
          throw new Error("Failed to create company");
        }

        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: tempSignup.email,
          phone: tempSignup.mobile_phone_number,
          password: Math.random().toString(36), // Temporary password
          email_confirm: true,
          phone_confirm: true,
          user_metadata: {
            temp_signup_id: tempSignup.id,
            company_id: company.id,
            hub_id: tempSignup.hub_id,
          },
        });

        if (authError || !authData.user) {
          console.error("❌ Error creating auth user:", authError);
          throw new Error("Failed to create user account");
        }

        // Generate account number
        const { data: accountNumber, error: accountError } = await supabaseAdmin.rpc(
          "generate_account_number",
          { hub_name: getHubName(tempSignup.hub_id) }
        );

        if (accountError) {
          console.error("❌ Error generating account number:", accountError);
          throw new Error("Failed to generate account number");
        }

        // Create user profile
        const { data: profile, error: profileError } = await supabaseAdmin
          .from("user_profiles")
          .insert({
            id: authData.user.id,
            company_id: company.id,
            hub_id: tempSignup.hub_id,
            account_number: accountNumber,
            first_name: tempSignup.first_name,
            last_name: tempSignup.last_name,
            mobile_phone_number: tempSignup.mobile_phone_number,
            email: tempSignup.email,
            role: "OWNER",
            onboarding_step: "payment",
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (profileError) {
          console.error("❌ Error creating user profile:", profileError);
          throw new Error("Failed to create user profile");
        }

        console.log("✅ Account creation successful for user:", authData.user.id);

        // Return success response with account details
        return new Response(
          JSON.stringify({
            success: true,
            message: "Verification successful! Your account is now active.",
            account: {
              userId: authData.user.id,
              companyId: company.id,
              accountNumber: accountNumber,
              tempSignup: {
                id: tempSignup.id,
                company_name: tempSignup.company_name,
                first_name: tempSignup.first_name,
                last_name: tempSignup.last_name,
                email: tempSignup.email,
                mobile_phone_number: tempSignup.mobile_phone_number,
                hub_id: tempSignup.hub_id,
              },
            },
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );
      } catch (accountError: any) {
        console.error("❌ Error creating account:", accountError);
        throw new Error(`Account creation failed: ${accountError.message}`);
      }
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

function getHubName(hubId: number): string {
  const hubNames: Record<number, string> = {
    1: "PercyTech",
    2: "Gnymble",
    3: "PercyMD",
    4: "PercyText",
  };
  return hubNames[hubId] || "SMS Hub";
}

export default serve;
