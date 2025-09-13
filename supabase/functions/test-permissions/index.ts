import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Test with service role key
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const url = Deno.env.get("SUPABASE_URL");

    console.log("Environment check:");
    console.log("- URL exists:", !!url);
    console.log("- Service role key exists:", !!serviceRoleKey);
    console.log("- Service role key length:", serviceRoleKey?.length);
    console.log("- Anon key exists:", !!anonKey);
    console.log("- Anon key length:", anonKey?.length);

    // Create admin client
    const supabaseAdmin = createClient(url!, serviceRoleKey!, {
      auth: { persistSession: false },
      db: { schema: 'public' },
      global: {
        headers: {
          'apikey': serviceRoleKey!,
          'Authorization': `Bearer ${serviceRoleKey!}`
        }
      }
    });

    // Try different queries
    console.log("\nTesting queries with service role:");
    
    // 1. Count query
    const { count, error: countError } = await supabaseAdmin
      .from("user_profiles")
      .select("*", { count: "exact", head: true });
    console.log("Count result:", { count, error: countError });

    // 2. Direct query
    const { data, error: selectError } = await supabaseAdmin
      .from("user_profiles")
      .select("id, email")
      .limit(1);
    console.log("Select result:", { data, error: selectError });

    // 3. RPC call to check permissions
    const { data: hasAccess, error: rpcError } = await supabaseAdmin
      .rpc('has_table_privilege', {
        rolename: 'service_role',
        tablename: 'public.user_profiles',
        privilege: 'SELECT'
      });
    console.log("RPC permission check:", { hasAccess, error: rpcError });

    return new Response(
      JSON.stringify({
        success: true,
        tests: {
          environment: {
            urlExists: !!url,
            serviceKeyExists: !!serviceRoleKey,
            serviceKeyLength: serviceRoleKey?.length,
          },
          queries: {
            count: { result: count, error: countError },
            select: { result: data, error: selectError },
            permissions: { hasAccess, error: rpcError }
          }
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Test error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});