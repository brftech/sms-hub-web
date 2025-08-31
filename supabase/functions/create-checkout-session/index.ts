import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.10.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CreateCheckoutData {
  email: string;
  userId?: string;
  companyId?: string;
  hubId?: number;
  priceId?: string;
  successUrl?: string;
  cancelUrl?: string;
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

    const { 
      email, 
      userId,
      companyId,
      hubId,
      priceId = Deno.env.get("STRIPE_DEFAULT_PRICE_ID"),
      successUrl = `${req.headers.get("origin")}/onboarding?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl = `${req.headers.get("origin")}/signup`
    }: CreateCheckoutData = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    console.log("🛒 Creating checkout session for:", email);

    // Create Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Check if customer already exists in Stripe
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
      console.log("✅ Found existing customer:", customer.id);
    } else {
      // Create new customer
      customer = await stripe.customers.create({
        email: email,
        metadata: {
          user_id: userId || "",
          company_id: companyId || "",
          hub_id: hubId?.toString() || "",
        }
      });
      console.log("✅ Created new customer:", customer.id);
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      metadata: {
        user_id: userId || "",
        company_id: companyId || "",
        hub_id: hubId?.toString() || "",
      },
      subscription_data: {
        metadata: {
          user_id: userId || "",
          company_id: companyId || "",
          hub_id: hubId?.toString() || "",
        }
      },
      allow_promotion_codes: true,
      billing_address_collection: "required",
      customer_update: {
        address: "auto",
        name: "auto"
      }
    });

    console.log("✅ Checkout session created:", session.id);

    // Update company with Stripe customer ID if we have companyId
    if (companyId && customer.id) {
      const { error: updateError } = await supabaseAdmin
        .from("companies")
        .update({ stripe_customer_id: customer.id })
        .eq("id", companyId);

      if (updateError) {
        console.error("⚠️ Failed to update company with Stripe customer ID:", updateError);
      } else {
        console.log("✅ Updated company with Stripe customer ID");
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        url: session.url,
        sessionId: session.id,
        customerId: customer.id
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("❌ Error creating checkout session:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to create checkout session",
        success: false,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

export default serve;