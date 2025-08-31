import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CreateAccountData {
  temp_signup_id: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { temp_signup_id }: CreateAccountData = await req.json();

    if (!temp_signup_id) {
      throw new Error("Missing temp_signup_id");
    }

    // Create Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    console.log("🔍 Creating account for verified signup:", temp_signup_id);

    // Get the temp signup - we'll check verification status differently
    const { data: tempSignup, error: fetchError } = await supabaseAdmin
      .from("temp_signups")
      .select("*")
      .eq("id", temp_signup_id)
      .single();

    if (fetchError || !tempSignup) {
      console.error("❌ Error fetching signup:", fetchError);
      throw new Error("Signup not found");
    }

    // Check if it's been verified (code should be null)
    if (tempSignup.verification_code !== null) {
      console.error("❌ Signup not verified - code still present:", tempSignup.verification_code);
      throw new Error("Signup has not been verified yet");
    }
    
    console.log("✅ Found verified signup for:", tempSignup.email);

    try {
      // Generate company account number
      const hubName = getHubName(tempSignup.hub_id).toLowerCase();
      console.log("🏢 Generating account for hub:", hubName, "hub_id:", tempSignup.hub_id);
      
      let companyAccountNumber = `TEMP-${tempSignup.hub_id}-${Date.now()}`;
      
      try {
        const { data: generatedNumber, error: companyAccountError } =
          await supabaseAdmin.rpc("generate_company_account_number", {
            hub_name: hubName,
          });
          
        if (!companyAccountError && generatedNumber) {
          companyAccountNumber = generatedNumber;
          console.log("✅ Generated company account number:", companyAccountNumber);
        } else {
          console.log("⚠️ Using fallback account number:", companyAccountNumber);
          if (companyAccountError) {
            console.error("RPC error:", companyAccountError);
          }
        }
      } catch (rpcError) {
        console.error("❌ RPC call failed:", rpcError);
        console.log("⚠️ Using fallback account number:", companyAccountNumber);
      }

      // Create company record
      const companyData = {
        hub_id: tempSignup.hub_id,
        company_account_number: companyAccountNumber,
        public_name: tempSignup.company_name,
        legal_name: tempSignup.company_name,
        billing_email: tempSignup.email, // Add billing_email (required field)
        point_of_contact_email: tempSignup.email,
        company_phone_number: tempSignup.mobile_phone_number,
        is_active: true,
        created_at: new Date().toISOString(),
      };
      
      console.log("📝 Creating company with data:", companyData);
      
      const { data: company, error: companyError } = await supabaseAdmin
        .from("companies")
        .insert(companyData)
        .select()
        .single();

      if (companyError) {
        console.error("❌ Error creating company:", companyError);
        console.error("Company error details:", {
          code: companyError.code,
          message: companyError.message,
          details: companyError.details,
          hint: companyError.hint,
        });
        throw new Error(`Failed to create company: ${companyError.message}`);
      }
      
      console.log("✅ Company created with ID:", company.id);

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

      // Generate user account number
      const { data: accountNumber, error: accountError } =
        await supabaseAdmin.rpc("generate_account_number", {
          hub_name: getHubName(tempSignup.hub_id),
        });

      if (accountError) {
        console.error("❌ Error generating account number:", accountError);
      }

      // Create user profile with company_id
      const { data: profile, error: profileError } = await supabaseAdmin
        .from("user_profiles")
        .insert({
          id: authData.user.id,
          hub_id: tempSignup.hub_id,
          company_id: company.id, // Link user to company
          account_number: accountNumber || `USER-${Date.now()}`,
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
        console.error("⚠️ Warning: Failed to create membership:", membershipError);
      }

      console.log("✅ Account creation successful for user:", authData.user.id);

      // Generate a magic link for automatic sign-in
      const { data: magicLinkData, error: magicLinkError } = 
        await supabaseAdmin.auth.admin.generateLink({
          type: 'magiclink',
          email: tempSignup.email,
          options: {
            redirectTo: `${Deno.env.get("PUBLIC_URL") || "http://localhost:3001"}/auth/callback`,
          }
        });

      if (magicLinkError) {
        console.error("⚠️ Failed to generate magic link:", magicLinkError);
      }

      // Return success response with account details
      return new Response(
        JSON.stringify({
          success: true,
          message: "Account created successfully!",
          account: {
            userId: authData.user.id,
            companyId: company.id,
            accountNumber: accountNumber,
            email: tempSignup.email,
          },
          magicLink: magicLinkData?.properties?.action_link || null,
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
  } catch (error: any) {
    console.error("Error in create-account function:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to create account",
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