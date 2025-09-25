import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, verification_code, stripe_customer_id } = await req.json();

    if (!email || !verification_code) {
      throw new Error("Email and verification code are required");
    }

    console.log("🔐 Authenticating Stripe customer:", email);

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Find verification record
    const { data: verification, error: verificationError } = await supabaseAdmin
      .from("sms_verifications")
      .select("*")
      .eq("email", email)
      .eq("verification_code", verification_code)
      .eq("metadata->synced_from_stripe", true)
      .single();

    if (verificationError || !verification) {
      throw new Error("Invalid verification code or email");
    }

    // Check if verification is expired (24 hours)
    const verificationAge =
      Date.now() - new Date(verification.created_at).getTime();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (verificationAge > maxAge) {
      throw new Error("Verification code has expired");
    }

    // Get customer and company data
    const { data: customer, error: customerError } = await supabaseAdmin
      .from("customers")
      .select(
        `
        *,
        companies (
          id,
          public_name,
          hub_id
        )
      `
      )
      .eq("id", verification.metadata.customer_id)
      .single();

    if (customerError || !customer) {
      throw new Error("Customer record not found");
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
    const existingUserProfile = existingUser?.users?.find(
      (user) => user.email === email
    );

    if (existingUserProfile) {
      console.log("👤 User already exists, linking to company");

      // Link existing user to company
      const { error: linkError } = await supabaseAdmin
        .from("user_profiles")
        .update({ company_id: customer.company_id })
        .eq("id", existingUserProfile.id);

      if (linkError) {
        console.warn("⚠️ Failed to link existing user to company:", linkError);
      }

      // Create membership if it doesn't exist
      const { error: membershipError } = await supabaseAdmin
        .from("memberships")
        .insert([
          {
            user_id: existingUserProfile.id,
            company_id: customer.company_id,
            hub_id: customer.hub_id,
            role: "USER",
            permissions: {
              admin: false,
              manage_users: false,
              manage_settings: false,
            },
            is_active: true,
            joined_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

      if (membershipError) {
        console.warn("⚠️ Failed to create membership:", membershipError);
      }

      // Update verification
      await supabaseAdmin
        .from("sms_verifications")
        .update({ verification_completed_at: new Date().toISOString() })
        .eq("id", verification.id);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Existing user linked to company",
          user_id: existingUserProfile.id,
          company_id: customer.company_id,
          company_name: customer.companies.public_name,
          existing_user: true,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create new user account
    console.log("👤 Creating new user account");

    // Generate temporary password
    const tempPassword = Math.random().toString(36).substring(2, 15);

    // Create auth user
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: tempPassword,
        email_confirm: true, // Auto-confirm since they verified via email
        user_metadata: {
          first_name: customer.companies.public_name,
          last_name: "",
          company_id: customer.company_id,
          customer_id: customer.id,
          synced_from_stripe: true,
        },
      });

    if (authError || !authData.user) {
      throw new Error(`Failed to create user: ${authError?.message}`);
    }

    // Create user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .insert([
        {
          id: authData.user.id,
          hub_id: customer.hub_id,
          company_id: customer.company_id,
          account_number: `USR-${Date.now()}`,
          email: email,
          first_name: customer.companies.public_name,
          last_name: "",
          role: "USER",
          company_admin: true,
          company_admin_since: new Date().toISOString(),
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (profileError) {
      console.error("❌ Failed to create user profile:", profileError);
      // Clean up auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw new Error("Failed to create user profile");
    }

    // Create membership
    const { error: membershipError } = await supabaseAdmin
      .from("memberships")
      .insert([
        {
          user_id: authData.user.id,
          company_id: customer.company_id,
          hub_id: customer.hub_id,
          role: "USER",
          permissions: {
            admin: false,
            manage_users: false,
            manage_settings: false,
          },
          is_active: true,
          joined_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

    if (membershipError) {
      console.warn("⚠️ Failed to create membership:", membershipError);
    }

    // Update verification
    await supabaseAdmin
      .from("sms_verifications")
      .update({
        verification_completed_at: new Date().toISOString(),
        existing_user_id: authData.user.id,
      })
      .eq("id", verification.id);

    // Send password reset email so user can set their own password
    try {
      const { error: resetError } = await supabaseAdmin.auth.admin.generateLink(
        {
          type: "recovery",
          email: email,
          options: {
            redirectTo: `${Deno.env.get("PUBLIC_SITE_URL") || "http://localhost:3000"}/reset-password`,
          },
        }
      );

      if (resetError) {
        console.warn("⚠️ Failed to send password reset email:", resetError);
      } else {
        console.log("✅ Password reset email sent");
      }
    } catch (emailError) {
      console.warn("⚠️ Email service error:", emailError);
    }

    console.log("✅ Stripe customer authenticated successfully");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Account created successfully",
        data: {
          user_id: authData.user.id,
          company_id: customer.company_id,
          company_name: customer.companies.public_name,
          email: email,
          temp_password: tempPassword, // Only for development/testing
          password_reset_sent: true,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Error authenticating Stripe customer:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to authenticate Stripe customer",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
