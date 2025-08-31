import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.10.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  
  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeKey || !webhookSecret) {
      throw new Error("Stripe configuration missing");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

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
        
        // Update company with subscription info
        if (session.metadata?.company_id) {
          const { error } = await supabaseAdmin
            .from("companies")
            .update({
              stripe_customer_id: session.customer,
              subscription_status: "active",
              subscription_tier: "starter",
              updated_at: new Date().toISOString(),
            })
            .eq("id", session.metadata.company_id);

          if (error) {
            console.error("Failed to update company:", error);
          }
        }

        // Update user profile onboarding step
        if (session.metadata?.user_id) {
          const { error } = await supabaseAdmin
            .from("user_profiles")
            .update({
              onboarding_step: "brand_registration",
              updated_at: new Date().toISOString(),
            })
            .eq("id", session.metadata.user_id);

          if (error) {
            console.error("Failed to update user profile:", error);
          }
        }

        // Create or update onboarding submission
        if (session.metadata?.company_id && session.metadata?.user_id) {
          const { data: existing } = await supabaseAdmin
            .from("onboarding_submissions")
            .select("id")
            .eq("company_id", session.metadata.company_id)
            .single();

          if (existing) {
            // Update existing
            await supabaseAdmin
              .from("onboarding_submissions")
              .update({
                stripe_status: "completed",
                current_step: "brand_registration",
                updated_at: new Date().toISOString(),
              })
              .eq("id", existing.id);
          } else {
            // Create new
            await supabaseAdmin
              .from("onboarding_submissions")
              .insert({
                hub_id: parseInt(session.metadata.hub_id || "2"),
                company_id: session.metadata.company_id,
                user_id: session.metadata.user_id,
                stripe_status: "completed",
                current_step: "brand_registration",
                step_data: { checkout_session_id: session.id },
              });
          }
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("📊 Subscription event:", subscription.id);
        
        // Update company subscription status
        if (subscription.metadata?.company_id) {
          const status = subscription.status === "active" ? "active" : 
                         subscription.status === "trialing" ? "trialing" : 
                         "inactive";
          
          const { error } = await supabaseAdmin
            .from("companies")
            .update({
              subscription_status: status,
              stripe_subscription_id: subscription.id,
              updated_at: new Date().toISOString(),
            })
            .eq("id", subscription.metadata.company_id);

          if (error) {
            console.error("Failed to update subscription:", error);
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("❌ Subscription cancelled:", subscription.id);
        
        // Update company subscription status
        if (subscription.metadata?.company_id) {
          const { error } = await supabaseAdmin
            .from("companies")
            .update({
              subscription_status: "cancelled",
              updated_at: new Date().toISOString(),
            })
            .eq("id", subscription.metadata.company_id);

          if (error) {
            console.error("Failed to update cancelled subscription:", error);
          }
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("💰 Payment succeeded:", invoice.id);
        
        // Record payment in payment_history
        if (invoice.metadata?.company_id && invoice.metadata?.user_id) {
          const { error } = await supabaseAdmin
            .from("payment_history")
            .insert({
              hub_id: parseInt(invoice.metadata.hub_id || "2"),
              user_profile_id: invoice.metadata.user_id,
              stripe_payment_intent_id: invoice.payment_intent as string,
              amount: invoice.amount_paid,
              currency: invoice.currency,
              status: "succeeded",
              payment_method: "card",
            });

          if (error) {
            console.error("Failed to record payment:", error);
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("❌ Payment failed:", invoice.id);
        
        // Record failed payment
        if (invoice.metadata?.company_id && invoice.metadata?.user_id) {
          const { error } = await supabaseAdmin
            .from("payment_history")
            .insert({
              hub_id: parseInt(invoice.metadata.hub_id || "2"),
              user_profile_id: invoice.metadata.user_id,
              stripe_payment_intent_id: invoice.payment_intent as string,
              amount: invoice.amount_due,
              currency: invoice.currency,
              status: "failed",
              payment_method: "card",
            });

          if (error) {
            console.error("Failed to record failed payment:", error);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400 }
    );
  }
});

export default serve;