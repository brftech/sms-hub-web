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

    console.log("🔍 Verifying code for signup:", temp_signup_id, "with code:", verification_code);

    // First, find the temp signup by ID only to check if it exists
    const { data: tempSignupCheck, error: checkError } = await supabaseAdmin
      .from("temp_signups")
      .select("*")
      .eq("id", temp_signup_id)
      .single();

    if (checkError || !tempSignupCheck) {
      console.error("❌ Temp signup not found:", temp_signup_id, checkError);
      throw new Error("Signup request not found. Please sign up again.");
    }

    console.log("📋 Found temp signup:", {
      id: tempSignupCheck.id,
      email: tempSignupCheck.email,
      verification_code: tempSignupCheck.verification_code,
      is_verified: tempSignupCheck.is_verified,
      expires_at: tempSignupCheck.expires_at,
      verification_attempts: tempSignupCheck.verification_attempts,
    });

    // Now check if the verification code matches
    if (tempSignupCheck.verification_code !== verification_code) {
      console.error("❌ Invalid code. Expected:", tempSignupCheck.verification_code, "Got:", verification_code);
      
      // Increment attempts
      await supabaseAdmin
        .from("temp_signups")
        .update({ 
          verification_attempts: (tempSignupCheck.verification_attempts || 0) + 1 
        })
        .eq("id", temp_signup_id);
      
      throw new Error("Invalid verification code");
    }

    const tempSignup = tempSignupCheck;

    // Check if already verified
    if (tempSignup.is_verified) {
      console.log("⚠️ Temp signup already verified");
      throw new Error("This signup has already been verified. Please login instead.");
    }

    // Check if code has expired
    if (new Date(tempSignup.expires_at) < new Date()) {
      console.error("❌ Code expired. Expires at:", tempSignup.expires_at);
      throw new Error("Verification code has expired");
    }

    // Check if max attempts exceeded
    const maxAttempts = tempSignup.max_attempts || 5;
    if (tempSignup.verification_attempts >= maxAttempts) {
      console.error("❌ Max attempts exceeded:", tempSignup.verification_attempts, ">=", maxAttempts);
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
        console.log("📊 Temp signup data:", {
          hub_id: tempSignup.hub_id,
          company_name: tempSignup.company_name,
          email: tempSignup.email,
          phone: tempSignup.mobile_phone_number,
        });

        // Generate company account number first
        const hubName = getHubName(tempSignup.hub_id).toLowerCase();
        console.log("🏢 Generating company account for hub:", hubName);
        
        const { data: companyAccountNumber, error: companyAccountError } =
          await supabaseAdmin.rpc("generate_company_account_number", {
            hub_name: hubName,
          });

        if (companyAccountError) {
          console.error("❌ Error generating company account number:", companyAccountError);
          console.error("Hub name used:", hubName);
          throw new Error("Failed to generate company account number");
        }
        
        console.log("✅ Generated company account number:", companyAccountNumber);

        // Create company record
        const companyData = {
          hub_id: tempSignup.hub_id,
          company_account_number: companyAccountNumber,
          public_name: tempSignup.company_name,
          legal_name: tempSignup.company_name,
          billing_email: tempSignup.email, // Required field
          point_of_contact_email: tempSignup.email,
          company_phone_number: tempSignup.mobile_phone_number,
          is_active: true,
          created_at: new Date().toISOString(),
        };
        
        console.log("🏢 Creating company with data:", companyData);
        
        const { data: company, error: companyError } = await supabaseAdmin
          .from("companies")
          .insert(companyData)
          .select()
          .single();

        if (companyError) {
          console.error("❌ Error creating company:", companyError);
          console.error("Company data attempted:", companyData);
          throw new Error("Failed to create company");
        }
        
        console.log("✅ Company created:", company.id);

        // Create user in Supabase Auth
        const { data: authData, error: authError } =
          await supabaseAdmin.auth.admin.createUser({
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
        console.log("🔍 Generating account number for hub:", getHubName(tempSignup.hub_id));
        
        let accountNumber: string;
        try {
          const { data: accountNumberData, error: accountError } =
            await supabaseAdmin.rpc("generate_account_number", {
              hub_name: getHubName(tempSignup.hub_id),
            });

          console.log("🔍 Account RPC Response - data:", accountNumberData);
          console.log("🔍 Account RPC Response - error:", accountError);

          if (accountError) {
            console.error("❌ Error generating account number:", accountError);
            throw new Error(`Failed to generate account number: ${accountError.message}`);
          }

          accountNumber = accountNumberData;
          console.log("✅ Generated account number:", accountNumber);
        } catch (rpcError) {
          console.error("❌ Account RPC call failed:", rpcError);
          throw new Error(`Account RPC call failed: ${rpcError.message}`);
        }

        // Create user profile
        const { data: profile, error: profileError } = await supabaseAdmin
          .from("user_profiles")
          .insert({
            id: authData.user.id,
            hub_id: tempSignup.hub_id,
            account_number: accountNumber,
            first_name: tempSignup.first_name,
            last_name: tempSignup.last_name,
            mobile_phone_number: tempSignup.mobile_phone_number,
            email: tempSignup.email,
            role: "OWNER",
            onboarding_step: "payment",
            is_active: true,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (profileError) {
          console.error("❌ Error creating user profile:", profileError);
          throw new Error("Failed to create user profile");
        }

        // Create membership to link user to company
        const { error: membershipError } = await supabaseAdmin
          .from("memberships")
          .insert({
            user_id: authData.user.id,
            company_id: company.id,
            hub_id: tempSignup.hub_id,
            role: "OWNER",
            status: "active",
          });

        if (membershipError) {
          console.error("❌ Error creating membership:", membershipError);
          // Don't fail the whole signup if membership fails
        }

        console.log(
          "✅ Account creation successful for user:",
          authData.user.id
        );

        // Sign the user in and get a session
        const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
          type: 'signup',
          email: tempSignup.email,
          options: {
            redirectTo: `${Deno.env.get('SUPABASE_URL')}/auth/callback`
          }
        });

        if (sessionError) {
          console.error("❌ Error generating sign in link:", sessionError);
          // Continue without session, user can sign in manually
        }

        // Return success response with account details and session
        return new Response(
          JSON.stringify({
            success: true,
            message: "Verification successful! Your account is now active.",
            session: sessionData,
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
