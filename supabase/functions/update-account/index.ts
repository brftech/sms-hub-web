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
    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create Supabase client with the user's token
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

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

    // Create admin client for operations
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user has permission (must be admin or superadmin)
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'SUPERADMIN')) {
      return new Response(
        JSON.stringify({ error: "Insufficient permissions" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let result;

    if (account_type === 'company') {
      // Update company
      const companyUpdates: any = {};
      
      if (updates.company_name !== undefined) companyUpdates.company_name = updates.company_name;
      if (updates.legal_company_name !== undefined) companyUpdates.legal_company_name = updates.legal_company_name;
      if (updates.company_account_number !== undefined) companyUpdates.company_account_number = updates.company_account_number;
      if (updates.tax_id !== undefined) companyUpdates.tax_id = updates.tax_id;
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