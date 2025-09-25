import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      stripe_customer_id,
      hub_id = 1,
      company_name,
      user_email,
    } = await req.json();

    if (!stripe_customer_id) {
      throw new Error("Stripe customer ID is required");
    }

    console.log("🔄 Syncing Stripe customer:", stripe_customer_id);

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("Stripe secret key not configured");
    }

    const cleanStripeKey = stripeKey.trim().replace(/\s+/g, "");
    const stripe = new Stripe(cleanStripeKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Fetch customer data from Stripe
    const stripeCustomer = await stripe.customers.retrieve(stripe_customer_id);

    if (stripeCustomer.deleted) {
      throw new Error("Stripe customer has been deleted");
    }

    console.log("📊 Stripe customer data:", {
      id: stripeCustomer.id,
      email: stripeCustomer.email,
      name: stripeCustomer.name,
      metadata: stripeCustomer.metadata,
    });

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const timestamp = new Date().toISOString();
    const companyId = crypto.randomUUID();
    const accountNumber = `ACC-${Date.now()}`;

    // Check if customer already exists in Supabase
    const { data: existingCustomer } = await supabaseAdmin
      .from("customers")
      .select("id, company_id, user_id")
      .eq("stripe_customer_id", stripe_customer_id)
      .single();

    if (existingCustomer) {
      console.log(
        "✅ Customer already exists in Supabase:",
        existingCustomer.id
      );
      return new Response(
        JSON.stringify({
          success: true,
          message: "Customer already synced",
          customer_id: existingCustomer.id,
          company_id: existingCustomer.company_id,
          user_id: existingCustomer.user_id,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 1: Create company record
    console.log("🏢 Creating company record");
    const { data: company, error: companyError } = await supabaseAdmin
      .from("companies")
      .insert([
        {
          id: companyId,
          hub_id: hub_id,
          public_name: company_name || stripeCustomer.name || "Unknown Company",
          legal_name: company_name || stripeCustomer.name || "Unknown Company",
          company_account_number: accountNumber,
          is_active: true,
          created_at: timestamp,
          updated_at: timestamp,
        },
      ])
      .select()
      .single();

    if (companyError) {
      throw new Error(`Failed to create company: ${companyError.message}`);
    }

    // Step 2: Create customer record
    console.log("💳 Creating customer record");
    const customerId = crypto.randomUUID();
    const { data: customer, error: customerError } = await supabaseAdmin
      .from("customers")
      .insert([
        {
          id: customerId,
          hub_id: hub_id,
          company_id: companyId,
          billing_email: user_email || stripeCustomer.email,
          stripe_customer_id: stripe_customer_id,
          payment_status: "pending", // Will be updated when payment is made
          subscription_status: "inactive",
          subscription_tier: "free",
          is_active: true,
          metadata: {
            synced_from_stripe: true,
            stripe_created: stripeCustomer.created,
            stripe_metadata: stripeCustomer.metadata,
          },
          created_at: timestamp,
          updated_at: timestamp,
        },
      ])
      .select()
      .single();

    if (customerError) {
      // Clean up company if customer creation fails
      await supabaseAdmin.from("companies").delete().eq("id", companyId);
      throw new Error(`Failed to create customer: ${customerError.message}`);
    }

    // Step 3: Create verification record for authentication
    console.log("📧 Creating verification record for authentication");
    const verificationId = crypto.randomUUID();
    const { data: verification, error: verificationError } = await supabaseAdmin
      .from("sms_verifications")
      .insert([
        {
          id: verificationId,
          hub_id: hub_id,
          email: user_email || stripeCustomer.email,
          mobile_phone: stripeCustomer.phone || null,
          auth_method: "email",
          verification_code: Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase(),
          verification_sent_at: timestamp,
          created_at: timestamp,
          updated_at: timestamp,
          metadata: {
            stripe_customer_id: stripe_customer_id,
            company_id: companyId,
            customer_id: customerId,
            synced_from_stripe: true,
          },
        },
      ])
      .select()
      .single();

    if (verificationError) {
      console.warn(
        "⚠️ Failed to create verification record:",
        verificationError
      );
    }

    // Step 4: Send authentication email
    console.log("📧 Sending authentication email");
    try {
      const { data: emailResult, error: emailError } =
        await supabaseAdmin.functions.invoke("send-user-notification", {
          body: {
            to: user_email || stripeCustomer.email,
            template: "stripe_customer_auth",
            data: {
              company_name: company_name || stripeCustomer.name,
              verification_code: verification?.verification_code,
              hub_id: hub_id,
            },
          },
        });

      if (emailError) {
        console.warn("⚠️ Failed to send authentication email:", emailError);
      } else {
        console.log("✅ Authentication email sent");
      }
    } catch (emailError) {
      console.warn("⚠️ Email service error:", emailError);
    }

    console.log("✅ Stripe customer synced successfully");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Stripe customer synced successfully",
        data: {
          company_id: companyId,
          customer_id: customerId,
          verification_id: verificationId,
          stripe_customer_id: stripe_customer_id,
          email: user_email || stripeCustomer.email,
          company_name: company_name || stripeCustomer.name,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Error syncing Stripe customer:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to sync Stripe customer",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
