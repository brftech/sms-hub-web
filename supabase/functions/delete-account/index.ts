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

    let result = { success: false, message: "" };

    if (permanent) {
      // Permanent deletion
      if (company_id) {
        // Delete all memberships first
        await supabaseAdmin
          .from("memberships")
          .delete()
          .eq("company_id", company_id);

        // Delete the company
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