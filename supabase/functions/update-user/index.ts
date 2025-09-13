import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

interface UpdateUserRequest {
  user_id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  hub_id?: number;
  company_id?: string;
  mobile_phone_number?: string;
  is_active?: boolean;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  console.log("🔄 Update user request received");

  try {
    const {
      user_id,
      email,
      first_name,
      last_name,
      role,
      hub_id,
      company_id,
      mobile_phone_number,
      is_active,
    }: UpdateUserRequest = await req.json();

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

    // Validate role if provided
    if (role) {
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

    console.log("Updating user profile...");

    // Prepare update data for user_profiles table
    const profileUpdateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (first_name !== undefined) profileUpdateData.first_name = first_name;
    if (last_name !== undefined) profileUpdateData.last_name = last_name;
    if (role !== undefined) profileUpdateData.role = role.toLowerCase();
    if (hub_id !== undefined) profileUpdateData.hub_id = hub_id;
    if (company_id !== undefined) profileUpdateData.company_id = company_id;
    if (mobile_phone_number !== undefined)
      profileUpdateData.mobile_phone_number = mobile_phone_number;
    if (is_active !== undefined) profileUpdateData.is_active = is_active;

    // Update user profile
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .update(profileUpdateData)
      .eq("id", user_id)
      .select()
      .single();

    if (profileError) {
      console.error("Profile update failed:", profileError);
      return new Response(
        JSON.stringify({
          error: `Failed to update user profile: ${profileError.message}`,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    console.log("✅ User profile updated:", profileData.id);

    // Update email in Supabase Auth if provided
    let finalEmail = profileData.email;
    if (email) {
      try {
        const { error: authError } =
          await supabaseAdmin.auth.admin.updateUserById(user_id, {
            email,
            user_metadata: {
              first_name: first_name || profileData.first_name,
              last_name: last_name || profileData.last_name,
              role: role || profileData.role,
              hub_id: hub_id !== undefined ? hub_id : profileData.hub_id,
              company_id:
                company_id !== undefined ? company_id : profileData.company_id,
              mobile_phone_number:
                mobile_phone_number || profileData.mobile_phone_number,
            },
          });

        if (authError) {
          console.warn("Auth email update failed:", authError);
          return new Response(
            JSON.stringify({
              error: `Failed to update email: ${authError.message}`,
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            }
          );
        } else {
          console.log("✅ Auth email updated");
          finalEmail = email;
          
          // Also update the email in the profile to keep them in sync
          const { error: profileEmailError } = await supabaseAdmin
            .from("user_profiles")
            .update({ email, updated_at: new Date().toISOString() })
            .eq("id", user_id);
            
          if (profileEmailError) {
            console.warn("Profile email sync failed:", profileEmailError);
          }
        }
      } catch (error) {
        console.warn("Auth update error:", error);
        return new Response(
          JSON.stringify({
            error: `Failed to update email: ${error.message}`,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }
    }

    // If user has a company_id, update the company's timestamp
    if (company_id) {
      try {
        await supabaseAdmin
          .from("companies")
          .update({
            updated_at: new Date().toISOString(),
          })
          .eq("id", company_id);
      } catch (error) {
        console.warn("Failed to update company timestamp:", error);
        // Don't fail the user update for this
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: profileData.id,
          email: finalEmail,  // Use the final email (either updated or existing)
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          role: profileData.role,
          hub_id: profileData.hub_id,
          company_id: profileData.company_id,
          mobile_phone_number: profileData.mobile_phone_number,
          account_number: profileData.account_number,
          is_active: profileData.is_active,
          updated_at: profileData.updated_at,
        },
        message: "User updated successfully",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in update-user:", error);
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
