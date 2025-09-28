import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.18.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  console.log("🔔 Webhook endpoint called - Method:", req.method);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  // Test endpoint to verify function is accessible
  if (req.method === "GET") {
    console.log("🔔 Test GET request received");
    return new Response(
      JSON.stringify({
        message: "Webhook endpoint is accessible",
        timestamp: new Date().toISOString(),
        method: req.method,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.log("❌ No Stripe signature found in headers");
    return new Response(JSON.stringify({ error: "No signature" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    console.log("🔑 Stripe key configured:", !!stripeKey);
    console.log("🔑 Webhook secret configured:", !!webhookSecret);

    if (!stripeKey || !webhookSecret) {
      throw new Error("Stripe configuration missing");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret
    );

    console.log(`🔔 Webhook received: ${event.type}`);

    // Create Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("✅ Checkout completed:", session.id);
        console.log("📊 Session metadata:", session.metadata);

        try {
          const customerEmail = session.customer_details?.email;
          const customerName = session.customer_details?.name;
          const hubId = parseInt(session.metadata?.hub_id || "1");

          if (!customerEmail) {
            console.error("❌ No customer email in checkout session");
            return new Response(JSON.stringify({ error: "No customer email" }), {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }

          console.log("💳 Marketing site - creating converted lead from payment");

          // Create a converted lead record (marketing-focused approach)
          const { data: lead, error: leadError } = await supabaseAdmin
            .from("leads")
            .insert({
              hub_id: hubId,
              email: customerEmail,
              name: customerName,
              status: "converted",
              source: "stripe_payment",
              campaign_source: session.metadata?.campaign_source || "direct",
              utm_source: session.metadata?.utm_source,
              utm_medium: session.metadata?.utm_medium,
              utm_campaign: session.metadata?.utm_campaign,
              utm_term: session.metadata?.utm_term,
              utm_content: session.metadata?.utm_content,
              lead_score: 100, // High score for paying customers
              converted_at: new Date().toISOString(),
              converted_to_customer_id: session.customer as string,
              custom_fields: {
                stripe_session_id: session.id,
                stripe_customer_id: session.customer,
                payment_amount: session.amount_total,
                payment_currency: session.currency,
                payment_status: "completed",
                created_via: "stripe_webhook",
                redirect_to_app: true, // Flag to redirect to main app
              },
            })
            .select()
            .single();

          if (leadError) {
            console.error("❌ Failed to create converted lead:", leadError);
            throw leadError;
          }

          console.log("✅ Converted lead created successfully:", lead.id);
          console.log("📧 Customer email:", customerEmail);
          console.log("🔗 Stripe customer ID:", session.customer);

        } catch (error) {
          console.error("❌ Error in payment processing:", error);
          throw error;
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("📊 Subscription event:", subscription.id, event.type);

        // For marketing site, we'll just log subscription events
        // The main app will handle subscription management
        console.log("ℹ️ Subscription event logged - main app handles subscription management");
        
        // Optionally, we could update the lead's custom_fields with subscription info
        if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
          const { error } = await supabaseAdmin
            .from("leads")
            .update({
              custom_fields: {
                stripe_subscription_id: subscription.id,
                subscription_status: subscription.status,
                subscription_tier: subscription.metadata?.tier || "starter",
                subscription_updated_at: new Date().toISOString(),
              }
            })
            .eq("converted_to_customer_id", subscription.customer);

          if (error) {
            console.log("⚠️ Could not update lead subscription info:", error.message);
          } else {
            console.log("✅ Updated lead with subscription info");
          }
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("💰 Payment succeeded:", invoice.id);

        // For marketing site, we'll just log successful payments
        console.log("ℹ️ Payment succeeded - main app handles payment tracking");
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("❌ Payment failed:", invoice.id);

        // For marketing site, we'll just log failed payments
        console.log("ℹ️ Payment failed - main app handles payment failure tracking");
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

export default serve;