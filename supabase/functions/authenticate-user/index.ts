import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

interface AuthenticateUserData {
  email: string;
  password?: string;
  userId?: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const { email, password, userId }: AuthenticateUserData = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    console.log("🔐 Authenticating user:", { email, userId });

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // First, check if user exists in user_profiles
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .select("*")
      .eq("email", email)
      .single();

    if (profileError || !userProfile) {
      console.error("❌ User profile not found:", profileError);
      throw new Error("User profile not found");
    }

    console.log("✅ Found user profile:", {
      id: userProfile.id,
      email: userProfile.email,
      role: userProfile.role,
    });

    // Check if user exists in auth.users
    const { data: authUserList, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error("❌ Error listing auth users:", listError);
      throw new Error("Failed to check auth users");
    }

    const existingAuthUser = authUserList.users?.find(u => u.email === email);

    let authUser;
    
    if (existingAuthUser) {
      console.log("✅ User already exists in auth.users:", existingAuthUser.id);
      
      // If password provided, update it
      if (password) {
        const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          existingAuthUser.id,
          { password }
        );
        
        if (updateError) {
          console.error("❌ Error updating password:", updateError);
          throw new Error("Failed to update user password");
        }
        
        authUser = updatedUser.user;
        console.log("✅ Password updated successfully");
      } else {
        authUser = existingAuthUser;
      }
    } else {
      console.log("🆕 Creating new auth user for:", email);
      
      // Create user in auth.users with a default password if not provided
      const { data: newAuthUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password || "TempPassword123!",
        email_confirm: true,
        user_metadata: {
          profile_id: userProfile.id,
          hub_id: userProfile.hub_id,
          role: userProfile.role,
        },
        app_metadata: {
          role: userProfile.role,
          hub_id: userProfile.hub_id,
        },
      });

      if (createError) {
        console.error("❌ Error creating auth user:", createError);
        throw new Error("Failed to create auth user");
      }

      authUser = newAuthUser.user;
      console.log("✅ Auth user created successfully:", authUser?.id);

      // Update user_profiles with the auth user ID
      const { error: updateProfileError } = await supabaseAdmin
        .from("user_profiles")
        .update({ id: authUser?.id })
        .eq("email", email);

      if (updateProfileError) {
        console.warn("⚠️ Warning: Could not update profile with auth ID:", updateProfileError);
        // Don't throw here - the auth user was created successfully
      }
    }

    // Generate a magic link for the user to login
    const { data: magicLinkData, error: magicLinkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: email,
      options: {
        redirectTo: `${req.headers.get("origin")}/onboarding`,
      },
    });

    if (magicLinkError) {
      console.error("❌ Error generating magic link:", magicLinkError);
      throw new Error("Failed to generate authentication link");
    }

    console.log("✅ Magic link generated successfully");

    // Return success with user info and magic link
    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: authUser?.id,
          email: authUser?.email,
          role: userProfile.role,
        },
        magicLink: magicLinkData.properties.action_link,
        message: "User authenticated successfully",
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );

  } catch (error) {
    console.error("❌ Error in authenticate-user:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});