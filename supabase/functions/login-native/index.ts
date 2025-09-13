import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  console.log("🔄 Native login request received");

  try {
    const { email, password } = await req.json();

    // Create Supabase client (not admin - we want standard auth flow)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Attempt to sign in with email and password
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (authError) {
      console.error("Login failed:", authError);
      
      // Provide user-friendly error messages
      if (authError.message.includes("Invalid login credentials")) {
        return new Response(
          JSON.stringify({ error: "Invalid email or password" }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 401 
          }
        );
      }
      
      return new Response(
        JSON.stringify({ error: authError.message }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401 
        }
      );
    }

    if (!authData.user || !authData.session) {
      throw new Error("Login failed - no session created");
    }

    console.log("✅ User logged in successfully:", authData.user.id);

    // Create admin client to get user profile data
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    
    console.log("Service role key exists:", !!serviceRoleKey);
    console.log("Service role key length:", serviceRoleKey?.length);
    console.log("Supabase URL:", supabaseUrl);
    
    if (!serviceRoleKey) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
    }
    
    const supabaseAdmin = createClient(
      supabaseUrl ?? "",
      serviceRoleKey,
      { auth: { persistSession: false } }
    );

    // Test if service role key works
    console.log("Testing service role access...");
    const { count, error: countError } = await supabaseAdmin
      .from("user_profiles")
      .select("*", { count: "exact", head: true });
    
    console.log("User profiles count:", count);
    console.log("Count error:", countError);

    // Get user profile to include hub_id and other metadata
    // First, get the user profile
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (profileError) {
      console.error("Failed to get user profile:", profileError);
      throw new Error("User profile not found");
    }

    // Get company if user has one
    let company = null;
    if (userProfile.company_id) {
      const { data: companyData } = await supabaseAdmin
        .from("companies")
        .select("id, public_name, company_account_number")
        .eq("id", userProfile.company_id)
        .single();
      company = companyData;
    }

    // Get customer record if exists
    let customer = null;
    const { data: customerData } = await supabaseAdmin
      .from("customers")
      .select("id, payment_status, subscription_status")
      .eq("user_id", authData.user.id)
      .single();
    customer = customerData;

    // Update last login info
    await supabaseAdmin
      .from("user_profiles")
      .update({
        last_login_at: new Date().toISOString(),
        last_login_method: "password",
      })
      .eq("id", authData.user.id);

    // Everyone who successfully logs in goes to the dashboard
    // The dashboard will handle showing payment prompts, verification prompts, etc.
    const paymentStatus = customer?.payment_status || 'none';
    const hasVerification = userProfile?.verification_setup_completed || false;
    const hasOnboarding = userProfile?.onboarding_completed || false;
    
    console.log("User status check:", {
      userId: authData.user.id,
      role: userProfile?.role,
      onboarding_completed: hasOnboarding,
      verification_setup_completed: hasVerification,
      customer_payment_status: paymentStatus,
    });

    return new Response(
      JSON.stringify({
        success: true,
        session: authData.session,
        user: {
          id: authData.user.id,
          email: authData.user.email,
          hub_id: userProfile?.hub_id,
          role: userProfile?.role,
          company_id: userProfile?.company_id,
          first_name: userProfile?.first_name,
          last_name: userProfile?.last_name,
          payment_status: paymentStatus,
          has_verification: hasVerification,
          has_onboarding: hasOnboarding,
        },
        redirect_to: "/dashboard", // ALWAYS go to dashboard after successful login
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in login-native:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});