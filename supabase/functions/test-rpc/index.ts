import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    console.log("🧪 Testing RPC functions...");

    // Test company account number generation
    console.log("🔍 Testing generate_company_account_number...");
    const { data: companyNumber, error: companyError } = await supabaseAdmin.rpc(
      "generate_company_account_number",
      { hub_name: "gnymble" }
    );

    console.log("Company number result:", { data: companyNumber, error: companyError });

    // Test user account number generation
    console.log("🔍 Testing generate_account_number...");
    const { data: userNumber, error: userError } = await supabaseAdmin.rpc(
      "generate_account_number",
      { hub_name: "Gnymble" }
    );

    console.log("User number result:", { data: userNumber, error: userError });

    return new Response(
      JSON.stringify({
        success: true,
        company: { data: companyNumber, error: companyError },
        user: { data: userNumber, error: userError },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("❌ Test failed:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
