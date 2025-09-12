import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

interface SyncRequest {
  email?: string;
  syncAll?: boolean;
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
    const { email, syncAll }: SyncRequest = await req.json();

    if (!email && !syncAll) {
      throw new Error("Either email or syncAll flag is required");
    }

    console.log("🔄 Starting auth user sync:", { email, syncAll });

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get user profiles to sync
    let profileQuery = supabaseAdmin.from("user_profiles").select("*");
    
    if (email) {
      profileQuery = profileQuery.eq("email", email);
    }
    
    const { data: profiles, error: profileError } = await profileQuery;

    if (profileError || !profiles || profiles.length === 0) {
      throw new Error("No user profiles found to sync");
    }

    console.log(`📊 Found ${profiles.length} profiles to sync`);

    // Get existing auth users
    const { data: authUserList, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error("❌ Error listing auth users:", listError);
      throw new Error("Failed to list auth users");
    }

    const existingEmails = new Set(authUserList.users?.map(u => u.email?.toLowerCase()));
    const results = {
      created: [],
      updated: [],
      skipped: [],
      errors: [],
    };

    // Process each profile
    for (const profile of profiles) {
      try {
        const profileEmail = profile.email?.toLowerCase();
        
        if (existingEmails.has(profileEmail)) {
          // User already exists in auth - update metadata
          const existingUser = authUserList.users?.find(u => u.email?.toLowerCase() === profileEmail);
          
          if (existingUser) {
            const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
              existingUser.id,
              {
                user_metadata: {
                  profile_id: profile.id,
                  hub_id: profile.hub_id,
                  role: profile.role,
                },
                app_metadata: {
                  role: profile.role,
                  hub_id: profile.hub_id,
                },
              }
            );

            if (updateError) {
              console.error(`❌ Error updating ${profile.email}:`, updateError);
              results.errors.push({ email: profile.email, error: updateError.message });
            } else {
              console.log(`✅ Updated metadata for ${profile.email}`);
              results.updated.push(profile.email);
            }
          }
        } else {
          // Create new auth user
          console.log(`🆕 Creating auth user for ${profile.email}`);
          
          const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: profile.email,
            password: profile.role === "SUPERADMIN" ? "SuperAdmin123!" : "TempPassword123!",
            email_confirm: true,
            user_metadata: {
              profile_id: profile.id,
              hub_id: profile.hub_id,
              role: profile.role,
            },
            app_metadata: {
              role: profile.role,
              hub_id: profile.hub_id,
            },
          });

          if (createError) {
            console.error(`❌ Error creating auth user for ${profile.email}:`, createError);
            results.errors.push({ email: profile.email, error: createError.message });
          } else {
            console.log(`✅ Created auth user for ${profile.email}`);
            results.created.push(profile.email);

            // If the auth user ID is different from profile ID, we might need to update it
            if (newUser.user && newUser.user.id !== profile.id) {
              console.log(`🔄 Auth user ID (${newUser.user.id}) differs from profile ID (${profile.id})`);
              // Note: We can't change the auth user ID, but we can store the mapping in user_metadata
            }
          }
        }
      } catch (err) {
        console.error(`❌ Error processing ${profile.email}:`, err);
        results.errors.push({ 
          email: profile.email, 
          error: err instanceof Error ? err.message : "Unknown error" 
        });
      }
    }

    console.log("✅ Sync completed:", results);

    return new Response(
      JSON.stringify({
        success: true,
        results,
        message: "Auth user sync completed",
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );

  } catch (error) {
    console.error("❌ Error in sync-auth-users:", error);
    
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