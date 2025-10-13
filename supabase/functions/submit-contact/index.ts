import { createClient } from "https://esm.sh/@supabase/supabase-js@2.52.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const turnstileSecretKey = Deno.env.get("TURNSTILE_SECRET_KEY");

    console.log("Environment check:", {
      hasResendKey: !!resendApiKey,
      resendKeyLength: resendApiKey?.length || 0,
      hasTurnstileKey: !!turnstileSecretKey,
    });

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabase = createClient(supabaseUrl, supabaseKey);

    const {
      name,
      email,
      phone,
      company,
      message,
      platform_interest,
      hub_id,
      turnstile_token,
      client_ip,
      email_signup,
      sms_signup,
    } = await req.json();

    // Verify Cloudflare Turnstile token (spam protection)
    if (turnstileSecretKey && turnstile_token) {
      console.log("Verifying Turnstile token...");

      const turnstileResponse = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            secret: turnstileSecretKey,
            response: turnstile_token,
            remoteip: client_ip,
          }),
        }
      );

      const turnstileResult = await turnstileResponse.json();

      if (!turnstileResult.success) {
        console.error("Turnstile verification failed:", turnstileResult);
        return new Response(
          JSON.stringify({
            error: "Spam protection verification failed",
            details: "Please try again or contact support if the issue persists.",
          }),
          {
            status: 403,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      console.log("Turnstile verification successful");
    } else if (!turnstile_token) {
      console.warn("No Turnstile token provided - submission may be spam");
    }

    console.log("Processing contact form submission:", {
      name,
      email,
      company,
      platform_interest,
      hub_id,
    });

    // Parse name into first_name and last_name
    const nameParts = (name || "").trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // First, search for existing lead with this email
    console.log("Searching for existing lead with email:", email);

    const { data: existingLead, error: searchError } = await supabase
      .from("leads")
      .select("id, name, company_name, phone, status, created_at")
      .eq("email", email)
      .single();

    let leadData;
    let isNewLead = false;

    if (searchError && searchError.code === "PGRST116") {
      // No existing lead found, create a new one
      console.log("No existing lead found, creating new lead");
      isNewLead = true;

      const { data: newLeadData, error: insertError } = await supabase
        .from("leads")
        .insert({
          hub_id: hub_id || 1, // Default to Gnymble (hub_id: 1) if not provided
          name: `${firstName} ${lastName}`.trim(),
          email,
          phone: phone || null,
          company_name: company || null,
          message,
          source: "contact_form",
          last_interaction_at: new Date().toISOString(),
          interaction_count: 1,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Database insert error details:", {
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code,
        });
        throw new Error(`Failed to create new lead: ${insertError.message}`);
      }

      leadData = newLeadData;
      console.log("New lead created:", leadData.id);
    } else if (searchError) {
      // Some other error occurred during search
      console.error("Error searching for existing lead:", searchError);
      throw new Error(`Failed to search for existing lead: ${searchError.message}`);
    } else {
      // Existing lead found, update it with new information
      console.log("Existing lead found, updating with new information:", existingLead.id);

      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      // Only update fields if new data is provided and different
      const fullName = `${firstName} ${lastName}`.trim();
      if (fullName && fullName !== existingLead.name) {
        updateData.name = fullName;
      }
      if (company && company !== existingLead.company_name) {
        updateData.company_name = company;
      }
      if (phone && phone !== existingLead.phone) {
        updateData.phone = phone;
      }
      if (message) {
        updateData.message = message;
      }

      const { data: updatedLead, error: updateError } = await supabase
        .from("leads")
        .update({
          ...updateData,
          last_interaction_at: new Date().toISOString(),
          interaction_count: (existingLead.interaction_count || 0) + 1,
        })
        .eq("id", existingLead.id)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating existing lead:", updateError);
        throw new Error(`Failed to update existing lead: ${updateError.message}`);
      }

      leadData = updatedLead;
      console.log("Existing lead updated:", leadData.id);
    }

    // Always add activity to lead_activities table
    console.log("Adding activity to lead_activities table");

    const activityDescription = isNewLead
      ? `New contact form submission from ${firstName} ${lastName} (${email}). Company: ${
          company || "Not specified"
        }. Platform interest: ${platform_interest || "General inquiry"}. Message: ${message}`
      : `Contact form resubmission from ${firstName} ${lastName} (${email}). Company: ${
          company || "Not specified"
        }. Platform interest: ${
          platform_interest || "General inquiry"
        }. Message: ${message}. Lead ID: ${leadData.id}`;

    console.log(
      "About to insert into lead_activities with hub_id:",
      hub_id,
      "fallback:",
      hub_id || 1
    );

    const { error: activityError } = await supabase.from("lead_activities").insert({
      hub_id: hub_id || 1, // Default to Gnymble (hub_id: 1) if not provided
      lead_id: leadData.id,
      activity_type: "note",
      activity_data: { description: activityDescription },
    });

    if (activityError) {
      console.error("Activity tracking error:", activityError);
      // Don't throw error, just log it
    } else {
      console.log("Activity logged successfully");
    }

    // Send confirmation email via Resend
    if (resendApiKey) {
      console.log("Sending confirmation email via Resend...");

      try {
        const resend = new Resend(resendApiKey);

        const emailResult = await resend.emails.send({
          from: "Gnymble <contact@gnymble.com>",
          to: [email],
          subject: isNewLead
            ? "Welcome to the refined side of hospitality communication"
            : "Thank you for your continued interest in Gnymble",
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>${isNewLead ? "Welcome to Gnymble" : "Thank you - Gnymble"}</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a;">
                <tr>
                  <td align="center" style="padding: 40px 20px;">
                    <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; border: 1px solid #2a2a2a; overflow: hidden;">
                      
                      <!-- Header with Logo -->
                      <tr>
                        <td align="center" style="padding: 40px 40px 30px 40px; background: linear-gradient(135deg, #1f1f1f 0%, #141414 100%); border-bottom: 1px solid #2a2a2a;">
                          <!-- SVG Logo for emails -->
                          <div style="margin-bottom: 20px;">
                            <svg width="160" height="48" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
                              <defs>
                                <linearGradient id="gnymbleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stop-color="#CC5500" />
                                  <stop offset="100%" stop-color="#FF6B35" />
                                </linearGradient>
                              </defs>
                              <text x="10" y="42" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="36" font-weight="900" fill="#CC5500" letter-spacing="-0.02em">G</text>
                              <text x="40" y="42" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="36" font-weight="700" fill="url(#gnymbleGradient)" letter-spacing="0.05em">nymble</text>
                            </svg>
                          </div>
                          <h1 style="color: #CC5500; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">
                            ${
                              isNewLead
                                ? "Welcome to the refined side"
                                : "Thank you for your continued interest"
                            }
                          </h1>
                          <p style="color: #CC5500; font-size: 16px; margin: 8px 0 0 0; opacity: 0.9;">
                            ${isNewLead ? "of hospitality communication" : "in Gnymble"}
                          </p>
                        </td>
                      </tr>
                      
                      <!-- Main Content -->
                      <tr>
                        <td style="padding: 40px;">
                          <p style="color: #e5e5e5; font-size: 18px; line-height: 1.6; margin: 0 0 24px 0;">Dear ${firstName},</p>
                          
                          <p style="color: #cccccc; font-size: 16px; line-height: 1.7; margin: 0 0 32px 0;">
                            ${
                              isNewLead
                                ? "Thank you for your interest in Gnymble—where premium establishments find their voice. We've received your inquiry and are excited to discuss how we can elevate your guest communications."
                                : "Thank you for reaching out to us again. We've received your latest inquiry and appreciate your continued interest in Gnymble."
                            }
                          </p>
                          
                          <!-- Details Card -->
                          <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 24px; margin: 32px 0;">
                            <h3 style="color: #CC5500; font-size: 16px; font-weight: 600; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 1px;">Your Inquiry Details</h3>
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="color: #888; font-size: 14px; padding: 8px 0; width: 140px; vertical-align: top;">Name:</td>
                                <td style="color: #e5e5e5; font-size: 14px; padding: 8px 0;">${firstName} ${lastName}</td>
                              </tr>
                              <tr>
                                <td style="color: #888; font-size: 14px; padding: 8px 0; width: 140px; vertical-align: top;">Company:</td>
                                <td style="color: #e5e5e5; font-size: 14px; padding: 8px 0;">${
                                  company || "Not specified"
                                }</td>
                              </tr>
                              <tr>
                                <td style="color: #888; font-size: 14px; padding: 8px 0; vertical-align: top;">Platform Interest:</td>
                                <td style="color: #e5e5e5; font-size: 14px; padding: 8px 0;">${
                                  platform_interest || "General inquiry"
                                }</td>
                              </tr>
                              <tr>
                                <td style="color: #888; font-size: 14px; padding: 8px 0; vertical-align: top;">Message:</td>
                                <td style="color: #e5e5e5; font-size: 14px; padding: 8px 0; line-height: 1.5;">${message}</td>
                              </tr>
                            </table>
                          </div>
                          
                          <p style="color: #cccccc; font-size: 16px; line-height: 1.7; margin: 32px 0 24px 0;">
                            Our team of hospitality communication specialists will reach out within <strong style="color: #CC5500;">24 hours</strong> 
                            to discuss how Gnymble can transform your guest experience through sophisticated, compliant messaging solutions.
                          </p>
                          
                          <p style="color: #cccccc; font-size: 16px; line-height: 1.7; margin: 0;">
                            Until then, savor the anticipation.
                          </p>
                        </td>
                      </tr>
                      
                      <!-- Footer -->
                      <tr>
                        <td style="padding: 32px 40px; background: #0d0d0d; border-top: 1px solid #2a2a2a;">
                          <p style="color: #888; font-size: 14px; margin: 0 0 8px 0;">Refined regards,</p>
                          <p style="color: #CC5500; font-size: 16px; font-weight: 600; margin: 0; letter-spacing: 0.5px;">The Gnymble Team</p>
                          <p style="color: #666; font-size: 12px; margin: 16px 0 0 0; font-style: italic;">
                            Business texting for the regulated & refined
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

        console.log("Confirmation email sent successfully:", emailResult);

        // Send notification email to bryan@percytech.com
        try {
          console.log("Sending notification email to bryan@percytech.com...");

          const notificationEmail = await resend.emails.send({
            from: "Gnymble <contact@gnymble.com>",
            to: ["bryan@percytech.com"],
            subject: `${isNewLead ? "New" : "Updated"} Contact Form Submission - Gnymble`,
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${isNewLead ? "New" : "Updated"} Contact Form Submission</title>
              </head>
              <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
                  <tr>
                    <td align="center" style="padding: 40px 20px;">
                      <table width="600" cellpadding="0" cellspacing="0" style="background: white; border-radius: 12px; border: 1px solid #e0e0e0; overflow: hidden;">
                        
                        <!-- Header -->
                        <tr>
                          <td align="center" style="padding: 30px 40px; background: #CC5500; border-bottom: 1px solid #e0e0e0;">
                            <h1 style="color: white; font-size: 24px; font-weight: 700; margin: 0;">${
                              isNewLead ? "New" : "Updated"
                            } Contact Form Submission</h1>
                            <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 8px 0 0 0;">Gnymble Website</p>
                          </td>
                        </tr>
                        
                        <!-- Main Content -->
                        <tr>
                          <td style="padding: 40px;">
                            <p style="color: #333; font-size: 18px; line-height: 1.6; margin: 0 0 24px 0;">
                              ${
                                isNewLead
                                  ? "A new contact form has been submitted on the Gnymble website."
                                  : "An existing contact has submitted an updated form on the Gnymble website."
                              }
                            </p>
                            
                            <!-- Contact Details -->
                            <div style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 24px; margin: 24px 0;">
                              <h3 style="color: #CC5500; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">Contact Information</h3>
                              <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td style="color: #666; font-size: 14px; padding: 8px 0; width: 120px; vertical-align: top; font-weight: 600;">Name:</td>
                                  <td style="color: #333; font-size: 14px; padding: 8px 0;">${firstName} ${lastName}</td>
                                </tr>
                                <tr>
                                  <td style="color: #666; font-size: 14px; padding: 8px 0; vertical-align: top; font-weight: 600;">Email:</td>
                                  <td style="color: #333; font-size: 14px; padding: 8px 0;">${email}</td>
                                </tr>
                                <tr>
                                  <td style="color: #666; font-size: 14px; padding: 8px 0; vertical-align: top; font-weight: 600;">Phone:</td>
                                  <td style="color: #333; font-size: 14px; padding: 8px 0;">${
                                    phone || "Not provided"
                                  }</td>
                                </tr>
                                <tr>
                                  <td style="color: #666; font-size: 14px; padding: 8px 0; vertical-align: top; font-weight: 600;">Company:</td>
                                  <td style="color: #333; font-size: 14px; padding: 8px 0;">${
                                    company || "Not specified"
                                  }</td>
                                </tr>
                                <tr>
                                  <td style="color: #666; font-size: 14px; padding: 8px 0; vertical-align: top; font-weight: 600;">Platform Interest:</td>
                                  <td style="color: #333; font-size: 14px; padding: 8px 0;">${
                                    platform_interest || "General inquiry"
                                  }</td>
                                </tr>
                                <tr>
                                  <td style="color: #666; font-size: 14px; padding: 8px 0; vertical-align: top; font-weight: 600;">Message:</td>
                                  <td style="color: #333; font-size: 14px; padding: 8px 0; line-height: 1.5;">${message}</td>
                                </tr>
                                <tr>
                                  <td style="color: #666; font-size: 14px; padding: 8px 0; vertical-align: top; font-weight: 600;">Lead Status:</td>
                                  <td style="color: #333; font-size: 14px; padding: 8px 0;">${
                                    isNewLead ? "New Lead" : "Existing Lead - Updated"
                                  }</td>
                                </tr>
                              </table>
                            </div>
                            
                            <!-- Action Items -->
                            <div style="background: #e8f4fd; border: 1px solid #bee5eb; border-radius: 8px; padding: 20px; margin: 24px 0;">
                              <h4 style="color: #0c5460; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">Next Steps</h4>
                              <ul style="color: #0c5460; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                                <li>Review the contact details above</li>
                                <li>Follow up within 24 hours as promised</li>
                                <li>Add to CRM if applicable</li>
                                <li>Track in lead_activities table (ID: ${leadData.id})</li>
                                ${
                                  !isNewLead
                                    ? "<li>Note: This is an existing lead with updated information</li>"
                                    : ""
                                }
                              </ul>
                            </div>
                            
                            <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 24px 0 0 0;">
                              This contact was submitted at ${new Date().toLocaleString("en-US", {
                                timeZone: "America/New_York",
                              })}.
                            </p>
                          </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                          <td style="padding: 24px 40px; background: #f8f9fa; border-top: 1px solid #e0e0e0;">
                            <p style="color: #666; font-size: 12px; margin: 0; text-align: center;">
                              Gnymble Contact Form Notification System
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

          console.log("Notification email sent successfully:", notificationEmail);
        } catch (notificationError) {
          console.error("Error sending notification email:", notificationError);
          // Don't fail the function, but log the error
        }
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
        // Don't fail the function, but log the error
      }
    } else {
      console.warn("RESEND_API_KEY not configured - skipping email sending");
    }

    // Handle email/SMS signup preferences
    // Reuse firstName and lastName already parsed at the top of the function

    // Email signup
    if (email_signup) {
      console.log("Processing email signup preference...");

      // Get default email marketing list for this hub
      const { data: emailLists, error: emailListError } = await supabase
        .from("email_lists")
        .select("id")
        .eq("hub_id", hub_id || 1)
        .eq("list_type", "marketing")
        .limit(1);

      if (emailListError) {
        console.error("Error fetching email list:", emailListError);
      } else if (emailLists && emailLists.length > 0) {
        const { error: emailSubError } = await supabase.from("email_subscribers").insert({
          email: email,
          email_list_id: emailLists[0].id,
          first_name: firstName || null,
          last_name: lastName,
          hub_id: hub_id || 1,
          source: "website",
          status: "active",
        });

        if (emailSubError) {
          console.error("Error adding email subscriber:", emailSubError);
        } else {
          console.log("Email subscriber added successfully");
        }
      } else {
        console.warn("No default email list found for hub", hub_id);
      }
    }

    // SMS signup
    if (sms_signup && phone) {
      console.log("Processing SMS signup preference...");

      // Get default SMS marketing list for this hub
      const { data: smsLists, error: smsListError } = await supabase
        .from("sms_lists")
        .select("id")
        .eq("hub_id", hub_id || 1)
        .eq("list_type", "marketing")
        .limit(1);

      if (smsListError) {
        console.error("Error fetching SMS list:", smsListError);
      } else if (smsLists && smsLists.length > 0) {
        const { error: smsSubError } = await supabase.from("sms_subscribers").insert({
          phone_number: phone,
          sms_list_id: smsLists[0].id,
          first_name: firstName || null,
          last_name: lastName,
          hub_id: hub_id || 1,
          email: email,
          source: "website",
          status: "active",
        });

        if (smsSubError) {
          console.error("Error adding SMS subscriber:", smsSubError);
        } else {
          console.log("SMS subscriber added successfully");
        }
      } else {
        console.warn("No default SMS list found for hub", hub_id);
      }
    } else if (sms_signup && !phone) {
      console.warn("SMS signup requested but no phone number provided");
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: isNewLead
          ? "Contact submitted successfully and saved locally"
          : "Contact information updated successfully",
        leadId: leadData.id,
        isNewLead,
        existingLeadId: isNewLead ? null : leadData.id,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in submit-contact function:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to submit contact form",
        details: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
