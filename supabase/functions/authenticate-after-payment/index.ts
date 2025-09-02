import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

interface AuthenticateData {
  userId: string;
  email: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const { userId, email }: AuthenticateData = await req.json();

    if (!userId || !email) {
      throw new Error("User ID and email are required");
    }

    console.log("🔐 Authenticating user after payment:", { userId, email });

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Generate a magic link for the user
    const { data: magicLinkData, error: magicLinkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: email,
      options: {
        redirectTo: `${req.headers.get("origin")}/onboarding`,
      },
    });

    if (magicLinkError) {
      console.error("❌ Error generating magic link:", magicLinkError);
      throw new Error("Failed to generate authentication link");
    }

    console.log("✅ Magic link generated successfully");

    // Return the magic link URL
    return new Response(
      JSON.stringify({
        success: true,
        magicLink: magicLinkData.properties.action_link,
        message: "Authentication link generated successfully",
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );

  } catch (error) {
    console.error("❌ Error in authenticate-after-payment:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});
