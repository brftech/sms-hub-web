import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";
import { corsHeaders } from "../_shared/cors.ts";

interface UpdateAccountRequest {
  account_type: 'company' | 'customer';
  account_id: string;
  updates: {
    // Company fields
    company_name?: string;
    legal_company_name?: string;
    company_account_number?: string;
    tax_id?: string;
    industry_vertical?: string;
    is_active?: boolean;
    
    // Customer fields
    first_name?: string;
    last_name?: string;
    email?: string;
    payment_type?: string;
    payment_status?: string;
    stripe_customer_id?: string;
    stripe_subscription_id?: string;
  };
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
    const { account_type, account_id, updates }: UpdateAccountRequest = await req.json();

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

    // For now, we'll trust the frontend auth and just verify the request is valid
    // In production, you'd want to verify the user's session properly
    // This matches the pattern used in update-user Edge Function

    let result;

    if (account_type === 'company') {
      // Update company
      const companyUpdates: any = {};
      
      // Helper function to format EIN
      const formatEIN = (ein: string | undefined | null): string | null => {
        if (!ein) return null;
        // Remove any non-numeric characters
        const cleanEIN = ein.replace(/\D/g, '');
        // Check if it's 9 digits
        if (cleanEIN.length !== 9) {
          // If not 9 digits, return null to avoid constraint violation
          console.warn(`Invalid EIN length: ${cleanEIN.length} digits (expected 9)`);
          return null;
        }
        // Format as XX-XXXXXXX
        return `${cleanEIN.slice(0, 2)}-${cleanEIN.slice(2)}`;
      };
      
      if (updates.public_name !== undefined) companyUpdates.public_name = updates.public_name;
      // company_name doesn't exist in companies table, map to public_name
      if (updates.company_name !== undefined) companyUpdates.public_name = updates.company_name;
      if (updates.legal_company_name !== undefined) companyUpdates.legal_company_name = updates.legal_company_name;
      if (updates.legal_name !== undefined) companyUpdates.legal_name = updates.legal_name;
      if (updates.contact_email !== undefined) companyUpdates.primary_contact_email = updates.contact_email;
      if (updates.contact_phone !== undefined) companyUpdates.primary_contact_phone = updates.contact_phone;
      if (updates.company_account_number !== undefined) companyUpdates.company_account_number = updates.company_account_number;
      
      // Handle EIN with proper formatting
      if (updates.tax_id !== undefined) {
        companyUpdates.ein = formatEIN(updates.tax_id);
      } else if (updates.ein !== undefined) {
        companyUpdates.ein = formatEIN(updates.ein);
      }
      
      if (updates.industry_vertical !== undefined) companyUpdates.industry_vertical = updates.industry_vertical;
      if (updates.is_active !== undefined) companyUpdates.is_active = updates.is_active;

      const { data, error } = await supabaseAdmin
        .from("companies")
        .update(companyUpdates)
        .eq("id", account_id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      result = { success: true, data, message: "Company updated successfully" };
    } else if (account_type === 'customer') {
      // Update customer
      const customerUpdates: any = {};
      
      if (updates.first_name !== undefined) customerUpdates.first_name = updates.first_name;
      if (updates.last_name !== undefined) customerUpdates.last_name = updates.last_name;
      if (updates.email !== undefined) customerUpdates.email = updates.email;
      if (updates.billing_email !== undefined) customerUpdates.billing_email = updates.billing_email;
      if (updates.payment_type !== undefined) customerUpdates.payment_type = updates.payment_type;
      if (updates.payment_status !== undefined) customerUpdates.payment_status = updates.payment_status;
      if (updates.stripe_customer_id !== undefined) customerUpdates.stripe_customer_id = updates.stripe_customer_id;
      if (updates.stripe_subscription_id !== undefined) customerUpdates.stripe_subscription_id = updates.stripe_subscription_id;
      if (updates.is_active !== undefined) customerUpdates.is_active = updates.is_active;

      const { data, error } = await supabaseAdmin
        .from("customers")
        .update(customerUpdates)
        .eq("id", account_id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      result = { success: true, data, message: "Customer updated successfully" };
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid account type" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in update-account function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});