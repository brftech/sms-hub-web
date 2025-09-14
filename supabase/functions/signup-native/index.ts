import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  console.log("🔄 Native signup request received");

  try {
    const {
      email,
      password,
      phone_number,
      first_name,
      last_name,
      company_name,
      hub_id,
      signup_type,
      invitation_token,
      customer_type,
    } = await req.json();

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Check if user already exists in auth
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(user => user.email === email);

    if (existingUser) {
      console.log("User already exists with email:", email);
      return new Response(
        JSON.stringify({ 
          error: "An account already exists with this email. Please log in instead." 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }

    // Check phone number uniqueness
    const { data: existingPhone } = await supabaseAdmin
      .from("user_profiles")
      .select("id")
      .eq("mobile_phone_number", phone_number)
      .single();

    if (existingPhone) {
      console.log("Phone number already in use:", phone_number);
      return new Response(
        JSON.stringify({ 
          error: "This phone number is already registered. Please use a different number or log in." 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }

    // Handle invitation if provided
    let invitationData = null;
    if (invitation_token) {
      const { data: invitation, error: inviteError } = await supabaseAdmin
        .from("user_invitations")
        .select(`
          *,
          companies (
            id,
            public_name,
            hub_id
          )
        `)
        .eq("invitation_token", invitation_token)
        .eq("status", "pending")
        .single();

      if (inviteError || !invitation) {
        console.error("Invalid invitation token:", inviteError);
        return new Response(
          JSON.stringify({ error: "Invalid or expired invitation" }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400 
          }
        );
      }

      // Check if invitation is expired
      if (new Date(invitation.expires_at) < new Date()) {
        return new Response(
          JSON.stringify({ error: "This invitation has expired" }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400 
          }
        );
      }

      invitationData = invitation;
    }

    // Use standard Supabase signup (this automatically sends confirmation email)
    const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: `${Deno.env.get("PUBLIC_SITE_URL") || "http://localhost:3000"}/verify-auth`,
        data: {
          hub_id: invitationData ? invitationData.hub_id : hub_id,
          signup_type: signup_type,
          customer_type: customer_type || "company",
          first_name: first_name,
          last_name: last_name,
        }
      }
    });

    // TEMPORARY: For development, manually confirm the user to bypass email rate limits
    if (authData?.user && !authData.user.email_confirmed_at) {
      console.log("🔧 DEV MODE: Manually confirming user to bypass email rate limit");
      const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
        authData.user.id,
        { email_confirm: true }
      );
      
      if (confirmError) {
        console.error("Failed to manually confirm user:", confirmError);
      } else {
        console.log("✅ User manually confirmed for development");
      }
    }

    if (authError) {
      console.error("Failed to create auth user:", authError);
      return new Response(
        JSON.stringify({ error: "Failed to create account. Please try again." }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }

    console.log("✅ Auth user created and confirmation email sent:", authData.user.id);
    console.log("User will complete profile setup after email confirmation");

    // signUp() automatically sends confirmation email - no additional action needed
    console.log("✅ Confirmation email automatically sent via signUp()");

    console.log("✅ Signup completed successfully");

    return new Response(
      JSON.stringify({
        success: true,
        user_id: authData.user.id,
        email: email,
        hub_id: invitationData ? invitationData.hub_id : hub_id,
        customer_type: customer_type,
        confirmation_email_sent: authData.user.email_confirmed_at ? false : true,
        message: authData.user.email_confirmed_at 
          ? "Account created and confirmed! Redirecting to dashboard..." 
          : "Please check your email to confirm your account",
        dev_mode: authData.user.email_confirmed_at ? true : false,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in signup-native:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});