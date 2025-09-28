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

          console.log("💳 Marketing site - processing successful payment");

          // Check if this is a retry (existing lead) or new customer
          const { data: existingLead } = await supabaseAdmin
            .from("leads")
            .select("*")
            .eq("email", customerEmail)
            .eq("hub_id", hubId)
            .single();

          let leadData;
          let leadStatus;

          if (existingLead) {
            // Update existing lead to converted
            console.log("🔄 Updating existing lead to converted:", existingLead.id);
            leadStatus = "converted";
            
            const { data: updatedLead, error: updateError } = await supabaseAdmin
              .from("leads")
              .update({
                status: "converted",
                converted_at: new Date().toISOString(),
                converted_to_customer_id: session.customer as string,
                lead_score: 100,
                custom_fields: {
                  ...existingLead.custom_fields,
                  stripe_session_id: session.id,
                  stripe_customer_id: session.customer,
                  payment_amount: session.amount_total,
                  payment_currency: session.currency,
                  payment_status: "completed",
                  converted_via: "stripe_webhook",
                  is_retry_success: true,
                  redirect_to_app: true,
                },
              })
              .eq("id", existingLead.id)
              .select()
              .single();

            if (updateError) {
              console.error("❌ Failed to update existing lead:", updateError);
              throw updateError;
            }
            
            leadData = updatedLead;
          } else {
            // Create new converted lead
            console.log("🆕 Creating new converted lead");
            
            const { data: newLead, error: createError } = await supabaseAdmin
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
                lead_score: 100,
                converted_at: new Date().toISOString(),
                converted_to_customer_id: session.customer as string,
                custom_fields: {
                  stripe_session_id: session.id,
                  stripe_customer_id: session.customer,
                  payment_amount: session.amount_total,
                  payment_currency: session.currency,
                  payment_status: "completed",
                  created_via: "stripe_webhook",
                  redirect_to_app: true,
                },
              })
              .select()
              .single();

            if (createError) {
              console.error("❌ Failed to create converted lead:", createError);
              throw createError;
            }
            
            leadData = newLead;
          }

          console.log("✅ Payment processed successfully - Lead ID:", leadData.id);
          console.log("📧 Customer email:", customerEmail);
          console.log("🔗 Stripe customer ID:", session.customer);
          console.log("🚀 Ready for app2 redirect");

        } catch (error) {
          console.error("❌ Error in payment processing:", error);
          throw error;
        }
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("⏰ Checkout session expired:", session.id);

        try {
          const customerEmail = session.customer_details?.email;
          const hubId = parseInt(session.metadata?.hub_id || "1");

          if (customerEmail) {
            // Update or create lead with expired status
            const { data: existingLead } = await supabaseAdmin
              .from("leads")
              .select("*")
              .eq("email", customerEmail)
              .eq("hub_id", hubId)
              .single();

            if (existingLead) {
              // Update existing lead
              await supabaseAdmin
                .from("leads")
                .update({
                  status: "abandoned",
                  custom_fields: {
                    ...existingLead.custom_fields,
                    stripe_session_id: session.id,
                    payment_status: "expired",
                    last_payment_attempt: new Date().toISOString(),
                    needs_followup: true,
                  },
                })
                .eq("id", existingLead.id);
            } else {
              // Create new abandoned lead
              await supabaseAdmin
                .from("leads")
                .insert({
                  hub_id: hubId,
                  email: customerEmail,
                  name: session.customer_details?.name,
                  status: "abandoned",
                  source: "stripe_payment",
                  lead_score: 50, // Medium score for abandoned checkout
                  custom_fields: {
                    stripe_session_id: session.id,
                    payment_status: "expired",
                    created_via: "stripe_webhook",
                    needs_followup: true,
                  },
                });
            }

            console.log("📝 Abandoned checkout recorded for:", customerEmail);
          }
        } catch (error) {
          console.error("❌ Error processing expired checkout:", error);
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

        try {
          // Update lead status to indicate payment failure
          const { error } = await supabaseAdmin
            .from("leads")
            .update({
              status: "payment_failed",
              custom_fields: {
                stripe_invoice_id: invoice.id,
                payment_status: "failed",
                last_payment_attempt: new Date().toISOString(),
                payment_failure_reason: invoice.last_payment_error?.message || "Unknown",
                needs_followup: true,
                retry_eligible: true,
              },
            })
            .eq("converted_to_customer_id", invoice.customer);

          if (error) {
            console.log("⚠️ Could not update lead payment failure:", error.message);
          } else {
            console.log("✅ Updated lead with payment failure info");
          }
        } catch (error) {
          console.error("❌ Error processing payment failure:", error);
        }
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