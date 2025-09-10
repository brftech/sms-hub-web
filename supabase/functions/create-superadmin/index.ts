import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

interface CreateSuperadminRequest {
  email: string;
  password: string;
  superadminPassword: string; // Additional verification
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, password, superadminPassword }: CreateSuperadminRequest = await req.json();

    // Verify superadmin creation password
    const expectedSuperadminPassword = Deno.env.get("SUPERADMIN_CREATION_PASSWORD");
    if (!expectedSuperadminPassword || superadminPassword !== expectedSuperadminPassword) {
      throw new Error("Invalid superadmin creation password");
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    console.log("🔐 Creating superadmin user:", email);

    // Check if superadmin user already exists
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers({
      filter: `email.eq.${email}`
    });

    if (existingUser && existingUser.users.length > 0) {
      console.log("✅ Superadmin user already exists");
      return new Response(
        JSON.stringify({
          success: true,
          message: "Superadmin user already exists",
          userId: existingUser.users[0].id
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        role: 'SUPERADMIN',
        signup_type: 'superadmin'
      }
    });

    if (authError) {
      console.error("❌ Error creating auth user:", authError);
      throw new Error(`Failed to create auth user: ${authError.message}`);
    }

    console.log("✅ Auth user created:", authData.user?.id);

    // Update the user profile in database with the actual auth user ID
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .update({
        id: authData.user!.id,
        company_id: '00000000-0000-0000-0000-000000000001', // System company
        role: 'SUPERADMIN',
        signup_type: 'superadmin',
        company_admin: true,
        verification_setup_completed: true,
        payment_status: 'completed',
        onboarding_completed: true,
        permissions: {
          can_access_all_apps: true,
          can_manage_users: true,
          can_manage_companies: true,
          can_manage_campaigns: true,
          can_view_analytics: true,
          can_manage_billing: true,
          can_access_admin_panel: true,
          can_manage_system_settings: true
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', '00000000-0000-0000-0000-000000000001'); // Update the placeholder

    if (profileError) {
      console.error("❌ Error updating user profile:", profileError);
      // Clean up auth user if profile update fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user!.id);
      throw new Error(`Failed to update user profile: ${profileError.message}`);
    }

    console.log("✅ Superadmin user created successfully");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Superadmin user created successfully",
        userId: authData.user!.id,
        email: authData.user!.email
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("❌ Error in create-superadmin:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
