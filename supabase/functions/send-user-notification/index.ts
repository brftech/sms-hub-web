import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { corsHeaders } from "../_shared/cors.ts";

interface UserNotificationRequest {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  role: string;
  hub_name?: string;
  company_name?: string;
  account_number: string;
  login_url: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  console.log("📧 User notification email request received");

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      console.warn("RESEND_API_KEY not found, skipping email notification");
      return new Response(
        JSON.stringify({
          success: false,
          message: "Email service not configured",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200, // Don't fail the user creation if email fails
        }
      );
    }

    const {
      email,
      first_name,
      last_name,
      password,
      role,
      hub_name = "PercyTech",
      company_name,
      account_number,
      login_url,
    }: UserNotificationRequest = await req.json();

    console.log("Sending notification to:", email);

    const resend = new Resend(resendApiKey);

    // Determine the sender based on hub
    const senderEmail =
      hub_name === "Gnymble"
        ? "Gnymble <noreply@gnymble.com>"
        : "PercyTech <noreply@percytech.com>";

    const hubDisplayName = hub_name === "Gnymble" ? "Gnymble" : "PercyTech";
    const hubColor = hub_name === "Gnymble" ? "#CC5500" : "#DC2626";
    const hubGradient =
      hub_name === "Gnymble"
        ? "linear-gradient(135deg, #CC5500 0%, #FF6B35 100%)"
        : "linear-gradient(135deg, #DC2626 0%, #F87171 100%)";

    const emailResult = await resend.emails.send({
      from: senderEmail,
      to: [email],
      subject: `Welcome to ${hubDisplayName} - Your Account is Ready`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to ${hubDisplayName}</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; border: 1px solid #2a2a2a; overflow: hidden;">
                  
                  <!-- Header with Logo -->
                  <tr>
                    <td align="center" style="padding: 40px 40px 30px 40px; background: linear-gradient(135deg, #1f1f1f 0%, #141414 100%); border-bottom: 1px solid #2a2a2a;">
                      <div style="margin-bottom: 20px;">
                        <svg width="160" height="48" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <linearGradient id="hubGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stop-color="${hubColor}" />
                              <stop offset="100%" stop-color="${hubColor}CC" />
                            </linearGradient>
                          </defs>
                          <text x="10" y="42" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="36" font-weight="900" fill="${hubColor}" letter-spacing="-0.02em">${hubDisplayName.charAt(0)}</text>
                          <text x="40" y="42" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="36" font-weight="700" fill="url(#hubGradient)" letter-spacing="0.05em">${hubDisplayName.slice(1)}</text>
                        </svg>
                      </div>
                      <h1 style="color: ${hubColor}; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">
                        Welcome to ${hubDisplayName}!
                      </h1>
                    </td>
                  </tr>

                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <div style="color: #e5e5e5; line-height: 1.6;">
                        <p style="font-size: 18px; margin: 0 0 24px 0; color: #f5f5f5;">
                          Hello ${first_name},
                        </p>
                        
                        <p style="margin: 0 0 24px 0; color: #d1d5db;">
                          Your account has been created and you're ready to get started with ${hubDisplayName}. 
                          ${company_name ? `You've been assigned to ${company_name}.` : ""}
                        </p>

                        <!-- Account Details Card -->
                        <div style="background: linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%); border: 1px solid #374151; border-radius: 8px; padding: 24px; margin: 24px 0;">
                          <h3 style="color: ${hubColor}; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                            Your Account Details
                          </h3>
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding: 8px 0; color: #d1d5db; font-weight: 500; width: 120px;">Email:</td>
                              <td style="padding: 8px 0; color: #f5f5f5; font-family: 'Monaco', 'Menlo', monospace;">${email}</td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; color: #d1d5db; font-weight: 500;">Password:</td>
                              <td style="padding: 8px 0; color: #f5f5f5; font-family: 'Monaco', 'Menlo', monospace; background: #1a1a1a; padding: 4px 8px; border-radius: 4px; border: 1px solid #374151;">${password}</td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; color: #d1d5db; font-weight: 500;">Role:</td>
                              <td style="padding: 8px 0; color: #f5f5f5; text-transform: capitalize;">${role.toLowerCase()}</td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; color: #d1d5db; font-weight: 500;">Account #:</td>
                              <td style="padding: 8px 0; color: #f5f5f5; font-family: 'Monaco', 'Menlo', monospace;">${account_number}</td>
                            </tr>
                            ${
                              company_name
                                ? `
                            <tr>
                              <td style="padding: 8px 0; color: #d1d5db; font-weight: 500;">Company:</td>
                              <td style="padding: 8px 0; color: #f5f5f5;">${company_name}</td>
                            </tr>
                            `
                                : ""
                            }
                          </table>
                        </div>

                        <!-- Login Button -->
                        <div style="text-align: center; margin: 32px 0;">
                          <a href="${login_url}" style="display: inline-block; background: ${hubGradient}; color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                            Login to ${hubDisplayName}
                          </a>
                        </div>

                        <p style="margin: 24px 0 0 0; color: #9ca3af; font-size: 14px;">
                          Please keep your login credentials secure and consider changing your password after your first login.
                        </p>

                        <p style="margin: 16px 0 0 0; color: #9ca3af; font-size: 14px;">
                          If you have any questions, please contact your administrator or support team.
                        </p>
                      </div>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%); border-top: 1px solid #2a2a2a; text-align: center;">
                      <p style="color: #6b7280; font-size: 14px; margin: 0;">
                        This is an automated message from ${hubDisplayName}. Please do not reply to this email.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (emailResult.error) {
      console.error("Email sending failed:", emailResult.error);
      return new Response(
        JSON.stringify({
          success: false,
          error: emailResult.error.message,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    console.log("✅ Email sent successfully:", emailResult.data?.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email notification sent successfully",
        emailId: emailResult.data?.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in send-user-notification:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An unexpected error occurred",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
