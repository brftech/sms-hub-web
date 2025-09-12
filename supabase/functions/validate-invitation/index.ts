import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { invitation_token } = await req.json();

    if (!invitation_token) {
      return new Response(
        JSON.stringify({ error: "Invitation token is required" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get invitation data
    const { data: invitation, error } = await supabaseAdmin
      .from("user_invitations")
      .select(`
        *,
        companies (
          id,
          public_name,
          hub_id
        ),
        invited_by_user_id!inner (
          first_name,
          last_name
        )
      `)
      .eq("invitation_token", invitation_token)
      .eq("status", "pending")
      .single();

    if (error || !invitation) {
      console.error("Invalid invitation token:", error);
      return new Response(
        JSON.stringify({ error: "Invalid or expired invitation" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404 
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

    // Format response
    const inviterName = invitation.invited_by_user_id
      ? `${invitation.invited_by_user_id.first_name || ""} ${invitation.invited_by_user_id.last_name || ""}`.trim()
      : "A team member";

    return new Response(
      JSON.stringify({
        email: invitation.invited_email,
        company_id: invitation.company_id,
        company_name: invitation.companies?.public_name || "Unknown Company",
        hub_id: invitation.hub_id,
        role: invitation.role,
        inviter_name: inviterName,
        expires_at: invitation.expires_at,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in validate-invitation:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});