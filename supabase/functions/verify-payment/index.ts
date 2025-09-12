import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { session_id } = await req.json();

    if (!session_id) {
      throw new Error("Session ID is required");
    }

    console.log("🔍 Verifying payment for session:", session_id);

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("Stripe secret key not configured");
    }

    const cleanStripeKey = stripeKey.trim().replace(/\s+/g, '');
    const stripe = new Stripe(cleanStripeKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['payment_intent', 'subscription']
    });

    console.log("📊 Session status:", session.payment_status);

    // Check if payment was successful
    const isPaid = session.payment_status === 'paid' || 
                  session.payment_status === 'complete' ||
                  (session.payment_intent && 
                   typeof session.payment_intent === 'object' && 
                   session.payment_intent.status === 'succeeded');

    if (isPaid) {
      console.log("✅ Payment verified successfully");
      
      // Update customer payment status in our database
      const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        { auth: { persistSession: false } }
      );

      if (session.metadata?.company_id) {
        // Update customer payment status
        const { error: updateError } = await supabaseAdmin
          .from("customers")
          .update({ 
            payment_status: 'completed',
            stripe_customer_id: session.customer as string,
            updated_at: new Date().toISOString()
          })
          .eq("company_id", session.metadata.company_id);

        if (updateError) {
          console.error("❌ Failed to update customer payment status:", updateError);
        } else {
          console.log("✅ Updated customer payment status");
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          payment_status: 'paid',
          session_id: session_id,
          message: "Payment verified successfully"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      console.log("❌ Payment not completed:", session.payment_status);
      
      return new Response(
        JSON.stringify({
          success: false,
          payment_status: session.payment_status || 'unknown',
          session_id: session_id,
          message: "Payment not completed"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

  } catch (error) {
    console.error("❌ Error in verify-payment:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        message: "Payment verification failed"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
