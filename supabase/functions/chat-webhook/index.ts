import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get request body
    const { message, userId, sessionId } = await req.json();

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Store the incoming message
    const { data: storedMessage, error: storeError } = await supabase
      .from("chat_messages")
      .insert({
        session_id: sessionId,
        user_id: userId || "anonymous",
        message: message,
        sender: "user",
        timestamp: new Date().toISOString(),
      })
      .select()
      .single();

    if (storeError) {
      console.error("Error storing message:", storeError);
      return new Response(
        JSON.stringify({ error: "Failed to store message" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Send to Zapier webhook
    const zapierWebhookUrl = Deno.env.get("ZAPIER_WEBHOOK_URL");
    if (zapierWebhookUrl) {
      try {
        const zapierResponse = await fetch(zapierWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: message,
            sessionId: sessionId,
            userId: userId,
            timestamp: new Date().toISOString(),
            messageId: storedMessage.id,
          }),
        });

        if (!zapierResponse.ok) {
          console.error("Zapier webhook failed:", zapierResponse.statusText);
        }
      } catch (zapierError) {
        console.error("Error calling Zapier:", zapierError);
      }
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        messageId: storedMessage.id,
        message: "Message sent to Zapier for processing",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
