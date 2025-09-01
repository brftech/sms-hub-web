import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TCRCampaignRequest {
  brandId: string;
  usecase: string;
  subUsecases?: string[];
  resellerId?: string;
  description: string;
  embeddedLink: boolean;
  embeddedPhone: boolean;
  termsAndConditions: boolean;
  numberPool: boolean;
  ageGated: boolean;
  directLending: boolean;
  subscriberOptin: boolean;
  subscriberOptout: boolean;
  subscriberHelp: boolean;
  sample1: string;
  sample2?: string | null;
  sample3?: string | null;
  sample4?: string | null;
  sample5?: string | null;
  messageFlow: string;
  helpMessage: string;
  mnoIds?: number[];
  referenceId?: string;
  autoRenewal?: boolean;
  tag?: string[];
  optinKeywords?: string;
  optoutKeywords?: string;
  helpKeywords?: string;
  optinMessage: string;
  optoutMessage: string;
  privacyPolicyLink?: string | null;
  termsAndConditionsLink?: string | null;
  embeddedLinkSample?: string | null;
}

interface CampaignRegistrationRequest {
  company_id: string;
  brand_id: string;
  campaign_data: {
    campaign_name: string;
    description: string;
    message_flow: string;
    use_case: string;
    sample_messages: string[];
    content_type: string;
    call_to_action: string;
    subscriber_optin: string;
    subscriber_optout: string;
    opt_in_message: string;
    opt_out_message: string;
    help_message: string;
    age_gated: boolean;
    direct_lending: boolean;
    embedded_link: boolean;
    embedded_phone: boolean;
    affiliate_marketing: boolean;
    monthly_volume: number;
  };
}

// Map use cases from frontend to TCR API format
const USE_CASE_MAPPING: Record<string, string> = {
  'marketing': 'MARKETING',
  'notifications': 'TRANSACTIONAL',
  'alerts': 'ACCOUNT_NOTIFICATION',
  'customer_care': 'CUSTOMER_CARE',
  'delivery': 'DELIVERY_NOTIFICATION',
  'appointment': 'APPOINTMENT_REMINDER',
  '2fa': '2FA',
  'surveys': 'SURVEY',
  'mixed': 'MIXED',
  'higher_education': 'HIGHER_EDUCATION',
  'k12_education': 'K12',
  'low_volume': 'LOW_VOLUME',
  'charity': 'CHARITY'
};

// Map subscriber opt-in methods to TCR format
const OPTIN_METHOD_MAPPING: Record<string, string> = {
  'WEB_FORM': 'Website form',
  'VIA_SMS': 'SMS keyword',
  'MOBILE_QR_CODE': 'QR code',
  'VERBAL': 'Verbal/Phone',
  'PAPER': 'Paper form',
  'KEYWORD': 'SMS keyword'
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { company_id, brand_id, campaign_data }: CampaignRegistrationRequest = await req.json();

    // Validate required fields
    if (!company_id || !brand_id || !campaign_data) {
      throw new Error("Missing required fields");
    }

    // Create Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get brand TCR ID from database
    const { data: brand, error: brandError } = await supabaseAdmin
      .from("brands")
      .select("tcr_brand_id, hub_id")
      .eq("id", brand_id)
      .single();

    if (brandError || !brand?.tcr_brand_id) {
      throw new Error("Brand not found or not registered with TCR");
    }

    // Get TCR credentials from environment
    const TCR_API_URL = Deno.env.get("TCR_API_URL") || "https://api-sandbox.campaignregistry.com/v2";
    const TCR_API_KEY = Deno.env.get("TCR_API_KEY");
    const TCR_API_SECRET = Deno.env.get("TCR_API_SECRET");
    const TCR_CSP_ID = Deno.env.get("TCR_CSP_ID");

    if (!TCR_API_KEY || !TCR_API_SECRET) {
      // Development mode - return mock data
      if (Deno.env.get("DEVELOPMENT_MODE") === "true") {
        const mockCampaignId = `C_MOCK_${Date.now()}`;
        
        // Store in database
        const { data: campaign, error: campaignError } = await supabaseAdmin
          .from("campaigns")
          .insert({
            hub_id: brand.hub_id,
            brand_id: brand_id,
            name: campaign_data.campaign_name,
            description: campaign_data.description,
            message_flow: campaign_data.message_flow,
            use_case: campaign_data.use_case,
            content_type: campaign_data.content_type,
            call_to_action: campaign_data.call_to_action,
            sample_1: campaign_data.sample_messages[0],
            sample_2: campaign_data.sample_messages[1] || null,
            sample_3: campaign_data.sample_messages[2] || null,
            sample_4: campaign_data.sample_messages[3] || null,
            sample_5: campaign_data.sample_messages[4] || null,
            opt_in_message: campaign_data.opt_in_message,
            opt_out_message: campaign_data.opt_out_message,
            help_message: campaign_data.help_message,
            subscriber_optin: campaign_data.subscriber_optin,
            subscriber_optout: campaign_data.subscriber_optout || 'STOP',
            age_gated: campaign_data.age_gated,
            direct_lending: campaign_data.direct_lending,
            embedded_link: campaign_data.embedded_link,
            embedded_phone: campaign_data.embedded_phone,
            affiliate_marketing: campaign_data.affiliate_marketing,
            monthly_volume: campaign_data.monthly_volume,
            tcr_campaign_id: mockCampaignId,
            status: 'approved',
            tcr_submission_date: new Date().toISOString()
          })
          .select()
          .single();

        if (campaignError) {
          console.error("Error creating campaign:", campaignError);
          throw new Error("Failed to create campaign");
        }

        return new Response(
          JSON.stringify({
            success: true,
            campaignId: mockCampaignId,
            campaign: campaign,
            mock: true
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error("TCR API credentials not configured");
    }

    // Prepare TCR campaign request
    const tcrRequest: TCRCampaignRequest = {
      brandId: brand.tcr_brand_id,
      usecase: USE_CASE_MAPPING[campaign_data.use_case] || campaign_data.use_case.toUpperCase(),
      subUsecases: [],
      resellerId: TCR_CSP_ID || undefined,
      description: campaign_data.description,
      embeddedLink: campaign_data.embedded_link || false,
      embeddedPhone: campaign_data.embedded_phone || false,
      termsAndConditions: true,
      numberPool: false,
      ageGated: campaign_data.age_gated || false,
      directLending: campaign_data.direct_lending || false,
      subscriberOptin: true,
      subscriberOptout: true,
      subscriberHelp: true,
      sample1: campaign_data.sample_messages[0],
      sample2: campaign_data.sample_messages[1] || null,
      sample3: campaign_data.sample_messages[2] || null,
      sample4: campaign_data.sample_messages[3] || null,
      sample5: campaign_data.sample_messages[4] || null,
      messageFlow: `${campaign_data.call_to_action} ${campaign_data.message_flow}`,
      helpMessage: campaign_data.help_message,
      mnoIds: [10035], // T-Mobile by default
      referenceId: `${company_id}_${Date.now()}`,
      autoRenewal: true,
      tag: [],
      optinKeywords: "START,YES",
      optoutKeywords: "STOP,END,CANCEL,UNSUBSCRIBE,QUIT",
      helpKeywords: "HELP,INFO",
      optinMessage: campaign_data.opt_in_message,
      optoutMessage: campaign_data.opt_out_message,
      privacyPolicyLink: null,
      termsAndConditionsLink: null,
      embeddedLinkSample: campaign_data.embedded_link ? "https://example.com" : null
    };

    // Make request to TCR API
    const authString = btoa(`${TCR_API_KEY}:${TCR_API_SECRET}`);
    const tcrResponse = await fetch(`${TCR_API_URL}/campaign`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authString}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(tcrRequest)
    });

    const tcrData = await tcrResponse.json();

    if (!tcrResponse.ok) {
      console.error("TCR API error:", tcrData);
      
      // Handle specific TCR error codes
      if (tcrData[0]?.code === 527) {
        throw new Error("Brand is still being scored. Please wait and try again.");
      } else if (tcrData[0]?.code === 509) {
        throw new Error("Campaign rejected. Please review requirements and try again.");
      } else if (tcrData[0]?.code === 511) {
        throw new Error("Maximum campaigns exceeded for this brand.");
      }
      
      throw new Error(tcrData[0]?.description || "TCR campaign registration failed");
    }

    // Store campaign in database with TCR campaign ID
    const { data: campaign, error: campaignError } = await supabaseAdmin
      .from("campaigns")
      .insert({
        hub_id: brand.hub_id,
        brand_id: brand_id,
        name: campaign_data.campaign_name,
        description: campaign_data.description,
        message_flow: campaign_data.message_flow,
        use_case: campaign_data.use_case,
        content_type: campaign_data.content_type,
        call_to_action: campaign_data.call_to_action,
        sample_1: campaign_data.sample_messages[0],
        sample_2: campaign_data.sample_messages[1] || null,
        sample_3: campaign_data.sample_messages[2] || null,
        sample_4: campaign_data.sample_messages[3] || null,
        sample_5: campaign_data.sample_messages[4] || null,
        opt_in_message: campaign_data.opt_in_message,
        opt_out_message: campaign_data.opt_out_message,
        help_message: campaign_data.help_message,
        subscriber_optin: campaign_data.subscriber_optin,
        subscriber_optout: campaign_data.subscriber_optout || 'STOP',
        age_gated: campaign_data.age_gated,
        direct_lending: campaign_data.direct_lending,
        embedded_link: campaign_data.embedded_link,
        embedded_phone: campaign_data.embedded_phone,
        affiliate_marketing: campaign_data.affiliate_marketing,
        monthly_volume: campaign_data.monthly_volume,
        tcr_campaign_id: tcrData.campaignId,
        status: 'pending',
        tcr_submission_date: new Date().toISOString()
      })
      .select()
      .single();

    if (campaignError) {
      console.error("Error storing campaign:", campaignError);
      // Don't throw - we have the TCR registration
    }

    // Update company's onboarding status
    await supabaseAdmin
      .from("companies")
      .update({ 
        tcr_campaign_registered: true,
        updated_at: new Date().toISOString()
      })
      .eq("id", company_id);

    return new Response(
      JSON.stringify({
        success: true,
        campaignId: tcrData.campaignId,
        campaign: campaign,
        mnoMetadata: tcrData.mnoMetadata
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error in tcr-register-campaign:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to register campaign",
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
      }
    );
  }
});