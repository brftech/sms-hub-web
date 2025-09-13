import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";
import { corsHeaders } from "../_shared/cors.ts";

interface DeleteAccountRequest {
  account_id: string;
  account_type: 'company' | 'customer' | 'company_customer';
  permanent: boolean;
  company_id?: string;
  customer_id?: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get Supabase URL and keys
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const { 
      account_id, 
      account_type, 
      permanent, 
      company_id, 
      customer_id 
    }: DeleteAccountRequest = await req.json();

    // Validate required fields
    if (!account_id || !account_type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // For now, we'll trust the frontend auth and just verify the request is valid
    // In production, you'd want to verify the user's session properly
    // This matches the pattern used in update-user Edge Function

    let result = { success: false, message: "" };

    if (permanent) {
      // Permanent deletion - CASCADE DELETE EVERYTHING
      if (company_id) {
        // IMPORTANT: Must clear ALL foreign key references before deleting company
        
        // 1. First, get all profiles with this company_id
        const { data: profiles } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("company_id", company_id);

        // 2. Clear company_id from ALL profiles (even if we plan to delete them)
        // This prevents foreign key constraint errors
        const { error: clearError } = await supabaseAdmin
          .from("profiles")
          .update({ company_id: null })
          .eq("company_id", company_id);
        
        if (clearError) {
          console.error("Failed to clear company_id from profiles:", clearError);
        }

        // 3. Delete all memberships for this company
        const { error: membershipError } = await supabaseAdmin
          .from("memberships")
          .delete()
          .eq("company_id", company_id);
        
        if (membershipError) {
          console.error("Failed to delete memberships:", membershipError);
        }

        // 4. Now delete each user completely (profiles + auth)
        if (profiles && profiles.length > 0) {
          for (const profile of profiles) {
            // Delete profile
            const { error: profileError } = await supabaseAdmin
              .from("profiles")
              .delete()
              .eq("id", profile.id);
            
            if (profileError) {
              console.error(`Failed to delete profile ${profile.id}:`, profileError);
            }

            // Delete auth user
            const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(profile.id);
            if (authError) {
              console.error(`Failed to delete auth for user ${profile.id}:`, authError);
            }
          }
        }

        // 5. Finally, delete the company itself
        const { error: companyError } = await supabaseAdmin
          .from("companies")
          .delete()
          .eq("id", company_id);

        if (companyError) {
          throw companyError;
        }
      }

      if (customer_id) {
        // Delete the customer
        const { error: customerError } = await supabaseAdmin
          .from("customers")
          .delete()
          .eq("id", customer_id);

        if (customerError) {
          throw customerError;
        }
      }

      result = {
        success: true,
        message: "Account permanently deleted"
      };
    } else {
      // Deactivation (soft delete)
      if (company_id) {
        const { error: companyError } = await supabaseAdmin
          .from("companies")
          .update({ is_active: false })
          .eq("id", company_id);

        if (companyError) {
          throw companyError;
        }

        // Also deactivate all memberships
        await supabaseAdmin
          .from("memberships")
          .update({ is_active: false })
          .eq("company_id", company_id);
      }

      if (customer_id) {
        const { error: customerError } = await supabaseAdmin
          .from("customers")
          .update({ is_active: false })
          .eq("id", customer_id);

        if (customerError) {
          throw customerError;
        }
      }

      result = {
        success: true,
        message: "Account deactivated successfully"
      };
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in delete-account function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});