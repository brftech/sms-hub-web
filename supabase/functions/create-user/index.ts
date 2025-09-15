import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

interface CreateUserRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
  hub_id?: number;
  company_id?: string;
  mobile_phone_number?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  console.log("🔄 User creation request received");

  try {
    const {
      email,
      password,
      first_name,
      last_name,
      role,
      hub_id = 0, // Default to PercyTech
      company_id,
      mobile_phone_number,
    }: CreateUserRequest = await req.json();

    // Validate required fields
    if (!email || !password || !first_name || !last_name || !role) {
      return new Response(
        JSON.stringify({
          error:
            "Missing required fields: email, password, first_name, last_name, role",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Validate role
    const validRoles = ["SUPERADMIN", "ADMIN", "SUPPORT", "VIEWER", "MEMBER"];
    if (!validRoles.includes(role)) {
      return new Response(
        JSON.stringify({
          error: `Invalid role. Must be one of: ${validRoles.join(", ")}`,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Create service role client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    console.log("Creating user in Supabase Auth...");

    // Create user in Supabase Auth
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          first_name,
          last_name,
          role,
          hub_id,
          company_id,
          mobile_phone_number,
        },
      });

    if (authError) {
      console.error("Auth user creation failed:", authError);
      return new Response(
        JSON.stringify({
          error: `Failed to create user: ${authError.message}`,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    if (!authData.user) {
      throw new Error("User creation failed - no user returned");
    }

    console.log("✅ User created in Auth:", authData.user.id);

    // Generate account number
    const accountNumber = `PERCY-${String(Date.now()).slice(-6)}`;

    // Create user profile
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .insert({
        id: authData.user.id,
        email: authData.user.email,
        first_name,
        last_name,
        role: role.toLowerCase(), // Store as lowercase for consistency
        hub_id,
        company_id,
        mobile_phone_number,
        account_number: accountNumber,
        is_active: true,
        signup_type: "system_created",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (profileError) {
      console.error("Profile creation failed:", profileError);

      // Clean up: delete the auth user if profile creation failed
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);

      return new Response(
        JSON.stringify({
          error: `Failed to create user profile: ${profileError.message}`,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    console.log("✅ User profile created:", profileData.id);

    // If user has a company_id, create membership and update the company
    if (company_id) {
      try {
        // Create membership record to link user to company
        const { error: membershipError } = await supabaseAdmin
          .from("memberships")
          .insert({
            user_id: authData.user.id,
            company_id: company_id,
            hub_id: hub_id,
            role: role.toLowerCase(), // Use the user's role for the membership
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (membershipError) {
          console.warn("Failed to create membership:", membershipError);
          // Don't fail the user creation for this, but log it
        } else {
          console.log("✅ Membership created linking user to company");
        }

        // Update company timestamp
        await supabaseAdmin
          .from("companies")
          .update({
            updated_at: new Date().toISOString(),
          })
          .eq("id", company_id);
      } catch (error) {
        console.warn("Failed to create membership or update company:", error);
        // Don't fail the user creation for this
      }
    }

    // Send email notification to the new user
    try {
      console.log("📧 Sending welcome email to new user...");

      // Get hub and company information for the email
      let hubName = "PercyTech";
      let companyName = null;

      if (hub_id !== 0) {
        const { data: hubData } = await supabaseAdmin
          .from("hubs")
          .select("name")
          .eq("id", hub_id)
          .single();
        if (hubData) {
          hubName = hubData.name;
        }
      }

      if (company_id) {
        const { data: companyData } = await supabaseAdmin
          .from("companies")
          .select("public_name")
          .eq("id", company_id)
          .single();
        if (companyData) {
          companyName = companyData.public_name;
        }
      }

      // Determine login URL based on hub
      const unifiedUrl =
        Deno.env.get("UNIFIED_APP_URL") || "http://localhost:3001";
      const loginUrl = unifiedUrl;

      // Call the email notification service
      const emailResponse = await fetch(
        `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-user-notification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
          },
          body: JSON.stringify({
            email,
            first_name,
            last_name,
            password,
            role,
            hub_name: hubName,
            company_name: companyName,
            account_number: accountNumber,
            login_url: loginUrl,
          }),
        }
      );

      if (emailResponse.ok) {
        const emailResult = await emailResponse.json();
        console.log("✅ Welcome email sent:", emailResult.emailId);
      } else {
        console.warn(
          "⚠️ Failed to send welcome email:",
          await emailResponse.text()
        );
        // Don't fail user creation if email fails
      }
    } catch (error) {
      console.warn("⚠️ Email notification error:", error);
      // Don't fail user creation if email fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: profileData.id,
          email: profileData.email,
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          role: profileData.role,
          hub_id: profileData.hub_id,
          company_id: profileData.company_id,
          account_number: profileData.account_number,
          is_active: profileData.is_active,
          created_at: profileData.created_at,
        },
        message: "User created successfully",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in create-user:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "An unexpected error occurred",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
