import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// TCR Webhook Event Types
interface TCRWebhookEvent {
  eventType: string;
  campaignId?: string;
  brandId?: string;
  status?: string;
  message?: string;
  timestamp: string;
  mnoMetadata?: any;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const event: TCRWebhookEvent = await req.json();
    
    console.log("TCR Webhook received:", event);

    // Create Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Handle different event types
    switch (event.eventType) {
      case "CAMPAIGN_STATUS_UPDATE":
        await handleCampaignStatusUpdate(supabaseAdmin, event);
        break;
        
      case "BRAND_STATUS_UPDATE":
      case "BRAND_IDENTITY_STATUS_UPDATE":
        await handleBrandStatusUpdate(supabaseAdmin, event);
        break;
        
      case "CAMPAIGN_DCA_COMPLETE":
        await handleCampaignDCAComplete(supabaseAdmin, event);
        break;
        
      default:
        console.log("Unhandled event type:", event.eventType);
    }

    return new Response(
      JSON.stringify({ success: true, received: event.eventType }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error in tcr-webhook:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to process webhook",
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
      }
    );
  }
});

async function handleCampaignStatusUpdate(supabase: any, event: TCRWebhookEvent) {
  const { campaignId, status } = event;
  
  if (!campaignId) return;

  // Map TCR status to our status
  let mappedStatus = 'pending';
  if (status === 'ACTIVE' || status === 'APPROVED') {
    mappedStatus = 'approved';
  } else if (status === 'REJECTED' || status === 'FAILED') {
    mappedStatus = 'rejected';
  } else if (status === 'SUSPENDED') {
    mappedStatus = 'suspended';
  }

  // Update campaign status
  const { error } = await supabase
    .from("campaigns")
    .update({ 
      status: mappedStatus,
      tcr_approval_date: mappedStatus === 'approved' ? new Date().toISOString() : null,
      tcr_rejection_reason: status === 'REJECTED' ? event.message : null,
      updated_at: new Date().toISOString()
    })
    .eq("tcr_campaign_id", campaignId);

  if (error) {
    console.error("Error updating campaign status:", error);
  } else {
    console.log(`Campaign ${campaignId} status updated to ${mappedStatus}`);
  }

  // If approved, update company onboarding status
  if (mappedStatus === 'approved') {
    const { data: campaign } = await supabase
      .from("campaigns")
      .select("brand_id")
      .eq("tcr_campaign_id", campaignId)
      .single();

    if (campaign) {
      const { data: brand } = await supabase
        .from("brands")
        .select("company_id")
        .eq("id", campaign.brand_id)
        .single();

      if (brand) {
        await supabase
          .from("companies")
          .update({ 
            tcr_campaign_approved: true,
            updated_at: new Date().toISOString()
          })
          .eq("id", brand.company_id);
      }
    }
  }
}

async function handleBrandStatusUpdate(supabase: any, event: TCRWebhookEvent) {
  const { brandId, status } = event;
  
  if (!brandId) return;

  // Map TCR status to our status
  let mappedStatus = 'pending';
  if (status === 'ACTIVE' || status === 'VERIFIED') {
    mappedStatus = 'approved';
  } else if (status === 'REJECTED' || status === 'FAILED') {
    mappedStatus = 'rejected';
  } else if (status === 'SUSPENDED') {
    mappedStatus = 'suspended';
  }

  // Update brand status
  const { error } = await supabase
    .from("brands")
    .update({ 
      status: mappedStatus,
      tcr_approval_date: mappedStatus === 'approved' ? new Date().toISOString() : null,
      tcr_rejection_reason: status === 'REJECTED' ? event.message : null,
      updated_at: new Date().toISOString()
    })
    .eq("tcr_brand_id", brandId);

  if (error) {
    console.error("Error updating brand status:", error);
  } else {
    console.log(`Brand ${brandId} status updated to ${mappedStatus}`);
  }

  // If approved, update company onboarding status
  if (mappedStatus === 'approved') {
    const { data: brand } = await supabase
      .from("brands")
      .select("company_id")
      .eq("tcr_brand_id", brandId)
      .single();

    if (brand) {
      await supabase
        .from("companies")
        .update({ 
          tcr_brand_approved: true,
          updated_at: new Date().toISOString()
        })
        .eq("id", brand.company_id);
    }
  }
}

async function handleCampaignDCAComplete(supabase: any, event: TCRWebhookEvent) {
  const { campaignId } = event;
  
  if (!campaignId) return;

  // DCA (Direct Carrier Approval) complete means campaign is fully approved
  const { error } = await supabase
    .from("campaigns")
    .update({ 
      status: 'active',
      dca_complete: true,
      updated_at: new Date().toISOString()
    })
    .eq("tcr_campaign_id", campaignId);

  if (error) {
    console.error("Error updating campaign DCA status:", error);
  } else {
    console.log(`Campaign ${campaignId} DCA complete`);
  }
}