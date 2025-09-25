import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";
import { corsHeaders } from "../_shared/cors.ts";

interface DeleteAccountRequest {
  account_id: string;
  account_type: "company" | "customer" | "company_customer";
  permanent: boolean;
  company_id?: string;
  customer_id?: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Define protected emails at the top level
  const PROTECTED_EMAILS = [
    "superadmin@percytech.com",
    "superadmin@gnymble.com",
  ];

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
      customer_id,
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

    // PROTECTION: Check if this is a protected account
    // Protect PercyTech superadmin and associated records
    // Also protect superadmin@gnymble.com as it's the main superadmin
    const PROTECTED_EMAILS = [
      "superadmin@percytech.com",
      "superadmin@gnymble.com",
    ];

    if (company_id || customer_id || account_id) {
      // Check if this is related to a protected superadmin
      let isProtected = false;

      // Check if company is associated with protected emails
      if (company_id) {
        const { data: protectedUsers } = await supabaseAdmin
          .from("user_profiles")
          .select("email")
          .eq("company_id", company_id)
          .in("email", PROTECTED_EMAILS);

        if (protectedUsers && protectedUsers.length > 0) {
          isProtected = true;
        }
      }

      // Check if customer is associated with protected emails
      if (customer_id && !isProtected) {
        const { data: protectedCustomer } = await supabaseAdmin
          .from("customers")
          .select("billing_email")
          .eq("id", customer_id)
          .in("billing_email", PROTECTED_EMAILS);

        if (protectedCustomer && protectedCustomer.length > 0) {
          isProtected = true;
        }
      }

      // Also check if trying to delete via account_id (could be user_profile id)
      if (account_id) {
        const { data: protectedProfile } = await supabaseAdmin
          .from("user_profiles")
          .select("email")
          .eq("id", account_id)
          .in("email", PROTECTED_EMAILS);

        if (protectedProfile && protectedProfile.length > 0) {
          isProtected = true;
        }
      }

      if (isProtected) {
        return new Response(
          JSON.stringify({
            error: "Cannot delete protected account",
            message:
              "The PercyTech superadmin account and its associated records cannot be deleted.",
          }),
          {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    let result = { success: false, message: "" };

    if (permanent) {
      // Permanent deletion - CASCADE DELETE EVERYTHING
      if (company_id) {
        // IMPORTANT: Must clear ALL foreign key references before deleting company

        // 1. First, get all user profiles with this company_id
        const { data: profiles } = await supabaseAdmin
          .from("user_profiles")
          .select("id")
          .eq("company_id", company_id);

        // 2. Clear company_id from ALL tables that reference it
        // This prevents foreign key constraint errors

        // Clear from user_profiles
        const { error: clearProfilesError } = await supabaseAdmin
          .from("user_profiles")
          .update({ company_id: null })
          .eq("company_id", company_id);

        if (clearProfilesError) {
          console.error(
            "Failed to clear company_id from user_profiles:",
            clearProfilesError
          );
        }

        // Clear from customers table
        const { error: clearCustomersError } = await supabaseAdmin
          .from("customers")
          .update({ company_id: null })
          .eq("company_id", company_id);

        if (clearCustomersError) {
          console.error(
            "Failed to clear company_id from customers:",
            clearCustomersError
          );
        }

        // Clear from contacts table if it exists
        const { error: clearContactsError } = await supabaseAdmin
          .from("contacts")
          .update({ company_id: null })
          .eq("company_id", company_id);

        if (clearContactsError) {
          console.error(
            "Failed to clear company_id from contacts:",
            clearContactsError
          );
        }

        // Clear from brands table if it exists
        const { error: clearBrandsError } = await supabaseAdmin
          .from("brands")
          .update({ company_id: null })
          .eq("company_id", company_id);

        if (clearBrandsError) {
          console.error(
            "Failed to clear company_id from brands:",
            clearBrandsError
          );
        }

        // 3. Delete all memberships for this company
        const { error: membershipError } = await supabaseAdmin
          .from("memberships")
          .delete()
          .eq("company_id", company_id);

        if (membershipError) {
          console.error("Failed to delete memberships:", membershipError);
        }

        // 4. Now delete each user completely (user_profiles + auth)
        if (profiles && profiles.length > 0) {
          for (const profile of profiles) {
            // Check if this specific profile is protected
            const { data: userCheck } = await supabaseAdmin
              .from("user_profiles")
              .select("email")
              .eq("id", profile.id)
              .single();

            // Skip deletion if this is a protected account
            if (
              userCheck?.email &&
              PROTECTED_EMAILS.includes(userCheck.email)
            ) {
              console.log(
                `Skipping deletion of protected ${userCheck.email} profile`
              );
              continue;
            }

            // Delete user profile
            const { error: profileError } = await supabaseAdmin
              .from("user_profiles")
              .delete()
              .eq("id", profile.id);

            if (profileError) {
              console.error(
                `Failed to delete profile ${profile.id}:`,
                profileError
              );
            }

            // Delete auth user
            const { error: authError } =
              await supabaseAdmin.auth.admin.deleteUser(profile.id);
            if (authError) {
              console.error(
                `Failed to delete auth for user ${profile.id}:`,
                authError
              );
            }
          }
        }

        // 5. Delete related customer records that were linked to this company
        const { error: deleteCustomersError } = await supabaseAdmin
          .from("customers")
          .delete()
          .or(`company_id.eq.${company_id},company_id.is.null`);

        if (deleteCustomersError) {
          console.error(
            "Failed to delete customer records:",
            deleteCustomersError
          );
        }

        // 6. Finally, delete the company itself
        const { error: companyError } = await supabaseAdmin
          .from("companies")
          .delete()
          .eq("id", company_id);

        if (companyError) {
          throw companyError;
        }
      }

      if (customer_id && !company_id) {
        // Only delete the customer if we're not already deleting the company
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
        message: "Account permanently deleted",
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
        message: "Account deactivated successfully",
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
