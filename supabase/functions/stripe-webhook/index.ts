import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.18.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

serve(async (req) => {
  console.log("🔔 Webhook endpoint called - Method:", req.method);
  console.log("🔔 Webhook endpoint called - Headers:", Object.fromEntries(req.headers.entries()));
  
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Stripe-Signature",
      },
    });
  }
  
  // Add CORS headers to all responses
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Stripe-Signature",
  };
  
  // Test endpoint to verify function is accessible
  if (req.method === "GET") {
    console.log("🔔 Test GET request received");
    return new Response(JSON.stringify({ 
      message: "Webhook endpoint is accessible",
      timestamp: new Date().toISOString(),
      method: req.method
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
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
    console.log("🔑 Webhook secret length:", webhookSecret?.length || 0);
    
    if (!stripeKey || !webhookSecret) {
      throw new Error("Stripe configuration missing");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);

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
        console.log("💰 Payment details:", {
          amount_total: session.amount_total,
          currency: session.currency,
          mode: session.mode,
          subscription: session.subscription
        });
        
        try {
          // Determine if this is a one-time purchase or subscription
          const isOneTimePurchase = !session.subscription;
          const paymentAmount = session.amount_total || 0;
          const paymentCurrency = session.currency || 'usd';
          
          // Update customer record with payment details
          if (session.metadata?.company_id) {
            // First, find the customer record for this company
            const { data: customer, error: customerFindError } = await supabaseAdmin
              .from("customers")
              .select("id, stripe_customer_id")
              .eq("billing_email", session.customer_details?.email || session.metadata?.email)
              .single();
            
            if (customerFindError && customerFindError.code !== 'PGRST116') {
              console.error("❌ Error finding customer:", customerFindError);
            }
            
            if (customer) {
              // Update existing customer
              const updateData: any = {
                updated_at: new Date().toISOString(),
              };
              
              if (isOneTimePurchase) {
                // One-time purchase - mark as active
                updateData.subscription_status = "active";
                updateData.subscription_tier = "one_time";
              } else {
                // Subscription - will be handled by subscription events
                updateData.subscription_status = "pending";
              }
              
              const { error: customerUpdateError } = await supabaseAdmin
                .from("customers")
                .update(updateData)
                .eq("id", customer.id);
                
              if (customerUpdateError) {
                console.error("❌ Failed to update customer:", customerUpdateError);
              } else {
                console.log("✅ Updated customer payment details");
              }
            } else {
              // Create new customer record
              const { error: customerCreateError } = await supabaseAdmin
                .from("customers")
                .insert({
                  hub_id: parseInt(session.metadata.hub_id || "1"),
                  billing_email: session.customer_details?.email || session.metadata?.email || "unknown@example.com",
                  customer_type: session.metadata?.customer_type || "b2b",
                  stripe_customer_id: session.customer as string,
                  subscription_status: isOneTimePurchase ? "active" : "pending",
                  subscription_tier: isOneTimePurchase ? "one_time" : "starter",
                  is_active: true,
                  company_id: session.metadata.company_id,
                  user_id: session.metadata.user_id
                });
                
              if (customerCreateError) {
                console.error("❌ Failed to create customer:", customerCreateError);
              } else {
                console.log("✅ Created new customer record");
              }
            }
          }
          
          // Create or update onboarding submission and ensure proper user-company linkage
          if (session.metadata?.company_id && session.metadata?.user_id) {
            console.log("📝 Processing onboarding submission for company:", session.metadata.company_id);
            console.log("👤 Processing for user:", session.metadata.user_id);
            
            // First, ensure the company is linked to the user profile
            const { error: membershipError } = await supabaseAdmin
              .from("user_profiles")
              .update({ company_id: session.metadata.company_id })
              .eq("id", session.metadata.user_id);
            
            if (membershipError) {
              console.error("❌ Failed to link user to company:", membershipError);
            } else {
              console.log("✅ Linked user profile to company");
            }
            
            const { data: existing } = await supabaseAdmin
              .from("onboarding_submissions")
              .select("id")
              .eq("company_id", session.metadata.company_id)
              .single();

            if (existing) {
              // Update existing
              const { error } = await supabaseAdmin
                .from("onboarding_submissions")
                .update({
                  stripe_status: "completed",
                  current_step: "brand",
                  updated_at: new Date().toISOString(),
                })
                .eq("id", existing.id);
                
              if (error) {
                console.error("❌ Failed to update onboarding submission:", error);
              } else {
                console.log("✅ Updated onboarding submission");
              }
            } else {
              // Create new
              const { error } = await supabaseAdmin
                .from("onboarding_submissions")
                .insert({
                  hub_id: parseInt(session.metadata.hub_id || "1"),
                  company_id: session.metadata.company_id,
                  user_id: session.metadata.user_id,
                  stripe_status: "completed",
                  current_step: "brand",
                  step_data: { checkout_session_id: session.id },
                });
                
              if (error) {
                console.error("❌ Failed to create onboarding submission:", error);
                console.error("Error details:", JSON.stringify(error, null, 2));
              } else {
                console.log("✅ Created new onboarding submission");
              }
            }
          } else {
            console.log("⚠️ Missing metadata for onboarding submission");
            console.log("Metadata received:", JSON.stringify(session.metadata, null, 2));
          }
        } catch (error) {
          console.error("❌ Error processing checkout completion:", error);
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("📊 Subscription event:", subscription.id);
        
        // Update customer subscription status
        if (subscription.metadata?.company_id) {
          const status = subscription.status === "active" ? "active" : 
                         subscription.status === "trialing" ? "trialing" : 
                         "inactive";
          
          const { error } = await supabaseAdmin
            .from("customers")
            .update({
              subscription_status: status,
              stripe_subscription_id: subscription.id,
              subscription_tier: subscription.metadata?.tier || "starter",
              subscription_ends_at: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null,
              trial_ends_at: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_customer_id", subscription.customer);

          if (error) {
            console.error("Failed to update customer subscription:", error);
          } else {
            console.log("✅ Updated customer subscription status");
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("❌ Subscription cancelled:", subscription.id);
        
        // Update customer subscription status
        if (subscription.metadata?.company_id) {
          const { error } = await supabaseAdmin
            .from("customers")
            .update({
              subscription_status: "cancelled",
              subscription_ends_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_customer_id", subscription.customer);

          if (error) {
            console.error("Failed to update cancelled subscription:", error);
          } else {
            console.log("✅ Updated customer subscription to cancelled");
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
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});

export default serve;