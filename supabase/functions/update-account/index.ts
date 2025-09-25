import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";
import { corsHeaders } from "../_shared/cors.ts";

interface UpdateAccountRequest {
  account_type: "company" | "customer";
  account_id: string;
  updates: Record<string, any>;
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
    const { account_type, account_id, updates }: UpdateAccountRequest =
      await req.json();

    // Validate required fields
    if (!account_type || !account_id || !updates) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let result;

    if (account_type === "company") {
      // Map frontend fields to actual database columns for companies table
      const companyUpdates: any = {};

      // Helper function to format EIN
      const formatEIN = (ein: string | undefined | null): string | null => {
        if (!ein) return null;
        // Remove any non-numeric characters
        const cleanEIN = ein.replace(/\D/g, "");
        // Check if it's 9 digits
        if (cleanEIN.length !== 9) {
          console.warn(
            `Invalid EIN length: ${cleanEIN.length} digits (expected 9)`
          );
          return null;
        }
        // Format as XX-XXXXXXX
        return `${cleanEIN.slice(0, 2)}-${cleanEIN.slice(2)}`;
      };

      // Helper function to format phone numbers
      const formatPhone = (phone: string | undefined | null): string | null => {
        if (!phone) return null;
        // Remove any non-numeric characters
        const cleanPhone = phone.replace(/\D/g, "");
        // Check if it's 10 or 11 digits
        if (cleanPhone.length === 10) {
          return `+1${cleanPhone}`;
        } else if (cleanPhone.length === 11 && cleanPhone.startsWith("1")) {
          return `+${cleanPhone}`;
        } else {
          console.warn(`Invalid phone length: ${cleanPhone.length} digits`);
          return null;
        }
      };

      // Map fields from frontend to database columns
      // Companies table actual fields: public_name, legal_name, legal_company_name,
      // primary_contact_email, primary_contact_phone, ein, industry_vertical, etc.

      if (updates.public_name !== undefined) {
        companyUpdates.public_name = updates.public_name;
      }

      if (updates.company_name !== undefined) {
        // company_name doesn't exist, map to public_name
        companyUpdates.public_name = updates.company_name;
      }

      if (updates.name !== undefined) {
        // Generic name field maps to public_name
        companyUpdates.public_name = updates.name;
      }

      if (updates.legal_name !== undefined) {
        companyUpdates.legal_name = updates.legal_name;
      }

      if (updates.legal_company_name !== undefined) {
        companyUpdates.legal_company_name = updates.legal_company_name;
      }

      if (updates.contact_email !== undefined) {
        companyUpdates.primary_contact_email = updates.contact_email;
      }

      if (updates.contact_phone !== undefined) {
        const formattedPhone = formatPhone(updates.contact_phone);
        if (formattedPhone) {
          companyUpdates.primary_contact_phone = formattedPhone;
        }
      }

      if (updates.company_account_number !== undefined) {
        companyUpdates.company_account_number = updates.company_account_number;
      }

      if (updates.tax_id !== undefined) {
        companyUpdates.ein = formatEIN(updates.tax_id);
      }

      if (updates.ein !== undefined) {
        companyUpdates.ein = formatEIN(updates.ein);
      }

      if (updates.industry_vertical !== undefined) {
        companyUpdates.industry_vertical = updates.industry_vertical;
      }

      if (updates.is_active !== undefined) {
        companyUpdates.is_active = updates.is_active;
      }

      // Add timestamp
      companyUpdates.updated_at = new Date().toISOString();

      const { data, error } = await supabaseAdmin
        .from("companies")
        .update(companyUpdates)
        .eq("id", account_id)
        .select()
        .single();

      if (error) {
        console.error("Company update error:", error);
        throw error;
      }

      result = { success: true, data, message: "Company updated successfully" };
    } else if (account_type === "customer") {
      // Map frontend fields to actual database columns for customers table
      const customerUpdates: any = {};

      // Customers table actual fields: billing_email, payment_type, payment_status,
      // stripe_customer_id, stripe_subscription_id, subscription_tier, etc.
      // NOTE: No first_name or last_name fields in customers table!

      if (updates.billing_email !== undefined) {
        customerUpdates.billing_email = updates.billing_email;
      }

      if (updates.email !== undefined) {
        // Map generic email to billing_email
        customerUpdates.billing_email = updates.email;
      }

      if (updates.payment_type !== undefined) {
        customerUpdates.payment_type = updates.payment_type;
      }

      if (updates.payment_status !== undefined) {
        customerUpdates.payment_status = updates.payment_status;
      }

      if (updates.subscription_tier !== undefined) {
        customerUpdates.subscription_tier = updates.subscription_tier;
      }

      if (updates.subscription_status !== undefined) {
        customerUpdates.subscription_status = updates.subscription_status;
      }

      if (updates.stripe_customer_id !== undefined) {
        customerUpdates.stripe_customer_id = updates.stripe_customer_id;
      }

      if (updates.stripe_subscription_id !== undefined) {
        customerUpdates.stripe_subscription_id = updates.stripe_subscription_id;
      }

      if (updates.is_active !== undefined) {
        customerUpdates.is_active = updates.is_active;
      }

      // NOTE: Ignoring first_name and last_name as they don't exist in customers table
      // These might belong to user_profiles table instead
      if (updates.first_name || updates.last_name) {
        console.warn(
          "Note: first_name and last_name are not fields in customers table. These should be updated in user_profiles if needed."
        );
      }

      // Add timestamp
      customerUpdates.updated_at = new Date().toISOString();

      const { data, error } = await supabaseAdmin
        .from("customers")
        .update(customerUpdates)
        .eq("id", account_id)
        .select()
        .single();

      if (error) {
        console.error("Customer update error:", error);
        throw error;
      }

      result = {
        success: true,
        data,
        message: "Customer updated successfully",
      };
    } else {
      return new Response(JSON.stringify({ error: "Invalid account type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in update-account function:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Internal server error",
        details: error.toString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
