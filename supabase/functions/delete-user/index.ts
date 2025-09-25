import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

interface DeleteUserRequest {
  user_id: string;
  permanent?: boolean; // If true, permanently delete from auth. If false, just deactivate.
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  console.log("🔄 Delete user request received");

  try {
    const { user_id, permanent = false }: DeleteUserRequest = await req.json();

    // Validate required fields
    if (!user_id) {
      return new Response(
        JSON.stringify({
          error: "Missing required field: user_id",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Create admin client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    // First, get user details for response
    const { data: userData, error: userError } = await supabaseAdmin
      .from("user_profiles")
      .select("*")
      .eq("id", user_id)
      .single();

    if (userError) {
      console.error("User not found:", userError);
      return new Response(
        JSON.stringify({
          error: "User not found",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    if (permanent) {
      console.log("Permanently deleting user...");

      // Delete from user_profiles table
      const { error: profileError } = await supabaseAdmin
        .from("user_profiles")
        .delete()
        .eq("id", user_id);

      if (profileError) {
        console.error("Profile deletion failed:", profileError);
        return new Response(
          JSON.stringify({
            error: `Failed to delete user profile: ${profileError.message}`,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }

      // Delete from Supabase Auth
      const { error: authError } =
        await supabaseAdmin.auth.admin.deleteUser(user_id);

      if (authError) {
        console.error("Auth user deletion failed:", authError);
        return new Response(
          JSON.stringify({
            error: `Failed to delete user from auth: ${authError.message}`,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }

      console.log("✅ User permanently deleted:", user_id);
    } else {
      console.log("Deactivating user...");

      // Just deactivate the user
      const { error: profileError } = await supabaseAdmin
        .from("user_profiles")
        .update({
          is_active: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user_id);

      if (profileError) {
        console.error("User deactivation failed:", profileError);
        return new Response(
          JSON.stringify({
            error: `Failed to deactivate user: ${profileError.message}`,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }

      console.log("✅ User deactivated:", user_id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: userData.id,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          account_number: userData.account_number,
        },
        message: permanent ? "User permanently deleted" : "User deactivated",
        action: permanent ? "deleted" : "deactivated",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in delete-user:", error);
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
