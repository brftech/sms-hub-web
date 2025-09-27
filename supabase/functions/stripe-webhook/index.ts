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
          // Determine if this is a one-time purchase or subscription
          const isOneTimePurchase = !session.subscription;
          const customerEmail = session.customer_details?.email;
          const hubId = parseInt(session.metadata?.hub_id || "1");

          if (!customerEmail) {
            console.error("❌ No customer email in checkout session");
            return new Response(JSON.stringify({ error: "No customer email" }), {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }

          console.log("💳 Payment-first flow - creating customer with Supabase Auth");

          // Step 1: Create company record
          const companyId = crypto.randomUUID();
          const { data: company, error: companyError } = await supabaseAdmin
            .from("companies")
            .insert({
              id: companyId,
              hub_id: hubId,
              public_name: session.customer_details?.name || "New Company",
              legal_name: session.customer_details?.name || "New Company",
              company_account_number: `ACC-${Date.now()}`,
              is_active: true,
            })
            .select()
            .single();

          if (companyError) {
            console.error("❌ Failed to create company:", companyError);
            throw companyError;
          }

          // Step 2: Create customer record
          const customerId = crypto.randomUUID();
          const { data: newCustomer, error: customerCreateError } =
            await supabaseAdmin.from("customers").insert({
              id: customerId,
              hub_id: hubId,
              company_id: companyId,
              billing_email: customerEmail,
              customer_type: session.metadata?.customer_type || "company",
              stripe_customer_id: session.customer as string,
              subscription_status: isOneTimePurchase ? "active" : "pending",
              subscription_tier: isOneTimePurchase ? "one_time" : "core",
              payment_status: "paid",
              is_active: true,
              metadata: {
                stripe_session_id: session.id,
                payment_first: true,
                created_via: "payment_first_webhook",
                customer_email: customerEmail,
                customer_name: session.customer_details?.name,
              },
            })
            .select()
            .single();

          if (customerCreateError) {
            console.error("❌ Failed to create customer:", customerCreateError);
            throw customerCreateError;
          }

          // Step 3: Create Supabase Auth user
          const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: customerEmail,
            email_confirm: false, // Will trigger email confirmation
            user_metadata: {
              stripe_customer_id: session.customer,
              company_id: companyId,
              customer_id: customerId,
              created_via: "payment_first",
              hub_id: hubId,
            }
          });

          if (authError) {
            console.error("❌ Failed to create Supabase Auth user:", authError);
            throw authError;
          }

          // Step 4: Create user profile
          const { error: profileError } = await supabaseAdmin
            .from("user_profiles")
            .insert({
              id: authUser.user.id,
              hub_id: hubId,
              email: customerEmail,
              first_name: null,
              last_name: null,
              company_id: companyId,
              is_active: true,
              email_confirmed: false,
              verification_setup_completed: false,
              metadata: {
                stripe_customer_id: session.customer,
                company_id: companyId,
                customer_id: customerId,
                created_via: "payment_first",
                requires_profile_setup: true,
              }
            });

          if (profileError) {
            console.error("❌ Failed to create user profile:", profileError);
            // Clean up auth user if profile creation fails
            await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
            throw profileError;
          }

          // Step 5: Create accounts_users relationship
          const { error: membershipError } = await supabaseAdmin
            .from("accounts_users")
            .insert({
              user_id: authUser.user.id,
              company_id: companyId,
              hub_id: hubId,
              role: "OWNER",
              is_active: true,
              permissions: {},
            });

          if (membershipError) {
            console.error("❌ Failed to create user-company relationship:", membershipError);
          }

          console.log("✅ Payment-first flow complete - email confirmation sent to:", customerEmail);

        } catch (error) {
          console.error("❌ Error in payment processing:", error);
          throw error;
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("📊 Subscription event:", subscription.id);

        // Update customer subscription status
        const status =
          subscription.status === "active"
            ? "active"
            : subscription.status === "trialing"
              ? "trialing"
              : "inactive";

        const { error } = await supabaseAdmin
          .from("customers")
          .update({
            subscription_status: status,
            stripe_subscription_id: subscription.id,
            subscription_tier: subscription.metadata?.tier || "starter",
            subscription_ends_at: subscription.current_period_end
              ? new Date(subscription.current_period_end * 1000).toISOString()
              : null,
            trial_ends_at: subscription.trial_end
              ? new Date(subscription.trial_end * 1000).toISOString()
              : null,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", subscription.customer);

        if (error) {
          console.error("Failed to update customer subscription:", error);
        } else {
          console.log("✅ Updated customer subscription status");
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("❌ Subscription cancelled:", subscription.id);

        // Update customer subscription status
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
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("💰 Payment succeeded:", invoice.id);

        // Record payment in payment_history
        if (invoice.metadata?.customer_id) {
          const { error } = await supabaseAdmin.from("payment_history").insert({
            hub_id: parseInt(invoice.metadata.hub_id || "1"),
            customer_id: invoice.metadata.customer_id,
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
        if (invoice.metadata?.customer_id) {
          const { error } = await supabaseAdmin.from("payment_history").insert({
            hub_id: parseInt(invoice.metadata.hub_id || "1"),
            customer_id: invoice.metadata.customer_id,
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
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

export default serve;