import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.10.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface VerifyCheckoutData {
  sessionId: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("Stripe secret key not configured");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const { sessionId }: VerifyCheckoutData = await req.json();

    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    console.log("🔍 Verifying checkout session:", sessionId);

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer']
    });

    console.log("✅ Retrieved session:", session.id);
    console.log("📊 Payment status:", session.payment_status);
    console.log("💳 Subscription ID:", session.subscription);

    // Check if payment was successful
    if (session.payment_status !== 'paid') {
      throw new Error(`Payment not completed. Status: ${session.payment_status}`);
    }

    // Create Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get subscription details
    const subscription = typeof session.subscription === 'string' 
      ? await stripe.subscriptions.retrieve(session.subscription)
      : session.subscription;

    // Update customer with subscription details
    const customerId = session.metadata?.customer_id;
    const customerType = session.metadata?.customer_type || 'company';
    
    if (session.customer) {
      // First, update or create customer record
      const customerData = {
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: subscription?.id,
        subscription_status: subscription?.status || 'active',
        subscription_tier: getSubscriptionTier(subscription?.items?.data?.[0]?.price?.id),
        billing_email: session.customer_details?.email || session.customer_email || '',
        billing_address: {
          line1: session.customer_details?.address?.line1,
          line2: session.customer_details?.address?.line2,
          city: session.customer_details?.address?.city,
          state: session.customer_details?.address?.state,
          postal_code: session.customer_details?.address?.postal_code,
          country: session.customer_details?.address?.country,
        },
        last_payment_at: new Date().toISOString(),
        metadata: {
          session_id: sessionId,
          payment_intent: session.payment_intent,
        }
      };

      // Check if customer exists
      const { data: existingCustomer } = await supabaseAdmin
        .from("customers")
        .select("id")
        .eq("stripe_customer_id", session.customer)
        .single();

      if (existingCustomer) {
        // Update existing customer
        const { error: updateError } = await supabaseAdmin
          .from("customers")
          .update(customerData)
          .eq("id", existingCustomer.id);

        if (updateError) {
          console.error("⚠️ Failed to update customer:", updateError);
        } else {
          console.log("✅ Updated customer with subscription details");
        }
      } else {
        // This shouldn't happen if create-checkout-session worked correctly
        console.error("⚠️ Customer record not found for Stripe customer:", session.customer);
      }
    }

    // Update legacy company fields if this is a B2B customer
    const companyId = session.metadata?.company_id;
    if (companyId && customerType === 'company') {
      // Update company to mark subscription as active (for backward compatibility)
      const { error: companyUpdateError } = await supabaseAdmin
        .from("companies")
        .update({
          subscription_status: subscription?.status || 'active',
          updated_at: new Date().toISOString()
        })
        .eq("id", companyId);

      if (companyUpdateError) {
        console.error("⚠️ Failed to update company status:", companyUpdateError);
      }
    }

      // Update onboarding submission to mark payment step as complete
      if (companyId) {
        const { error: onboardingError } = await supabaseAdmin
          .from("onboarding_submissions")
          .update({
            stripe_status: 'paid',
            step_data: supabaseAdmin.rpc('jsonb_merge', {
              target: 'step_data',
              source: JSON.stringify({
                payment: {
                  completed: true,
                  session_id: sessionId,
                  subscription_id: subscription?.id,
                  customer_id: session.customer,
                  completed_at: new Date().toISOString()
                }
              })
            })
          })
          .eq("company_id", companyId);

        if (onboardingError) {
          console.error("⚠️ Failed to update onboarding submission:", onboardingError);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        sessionId: session.id,
        customerId: session.customer,
        subscriptionId: session.subscription,
        paymentStatus: session.payment_status,
        customerEmail: session.customer_details?.email || session.customer_email,
        customerType: customerType,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("❌ Error verifying checkout session:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to verify checkout session",
        success: false,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

// Helper function to map price IDs to subscription tiers
function getSubscriptionTier(priceId?: string): string {
  if (!priceId) return 'starter';
  
  // Map your actual Stripe price IDs to tiers
  const priceTierMap: Record<string, string> = {
    'price_starter': 'starter',
    'price_professional': 'professional',
    'price_enterprise': 'enterprise',
    // Add your actual price IDs here
  };
  
  return priceTierMap[priceId] || 'starter';
}

export default serve;