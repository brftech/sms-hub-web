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
  customerType?: 'company' | 'individual';
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
      cancelUrl = `${req.headers.get("origin")}/signup`,
      customerType = 'company'
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
        customer_type: customerType,
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

    // Create or update customer record
    const customerData = {
      hub_id: hubId || 1,
      customer_type: customerType,
      stripe_customer_id: customer.id,
      billing_email: email,
      is_active: true,
      metadata: {
        stripe_session_id: session.id,
        user_id: userId,
        company_id: companyId
      }
    };

    // Check if customer already exists
    const { data: existingCustomer } = await supabaseAdmin
      .from("customers")
      .select("id")
      .eq("stripe_customer_id", customer.id)
      .single();

    let customerId;
    if (existingCustomer) {
      // Update existing customer
      const { data: updatedCustomer, error: updateError } = await supabaseAdmin
        .from("customers")
        .update(customerData)
        .eq("id", existingCustomer.id)
        .select("id")
        .single();
      
      if (updateError) {
        console.error("⚠️ Failed to update customer:", updateError);
      } else {
        customerId = updatedCustomer.id;
        console.log("✅ Updated customer record");
      }
    } else {
      // Create new customer
      const { data: newCustomer, error: createError } = await supabaseAdmin
        .from("customers")
        .insert(customerData)
        .select("id")
        .single();
      
      if (createError) {
        console.error("⚠️ Failed to create customer:", createError);
      } else {
        customerId = newCustomer.id;
        console.log("✅ Created customer record");
      }
    }

    // Link customer to company or user
    if (customerId) {
      if (customerType === 'company' && companyId) {
        const { error: linkError } = await supabaseAdmin
          .from("companies")
          .update({ customer_id: customerId })
          .eq("id", companyId);
        
        if (linkError) {
          console.error("⚠️ Failed to link customer to company:", linkError);
        } else {
          console.log("✅ Linked customer to company");
        }
      } else if (customerType === 'individual' && userId) {
        const { error: linkError } = await supabaseAdmin
          .from("user_profiles")
          .update({ 
            customer_id: customerId,
            is_individual_customer: true 
          })
          .eq("id", userId);
        
        if (linkError) {
          console.error("⚠️ Failed to link customer to user:", linkError);
        } else {
          console.log("✅ Linked customer to individual user");
        }
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