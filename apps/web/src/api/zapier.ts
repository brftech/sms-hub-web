import { zapierService } from "@/services/zapierService";
import { chatbotService } from "@/services/chatbotService";
import { leadsService } from "@/services/leadsService";

// This would typically be in a backend API, but for now we'll create frontend endpoints
// In production, these would be Supabase Edge Functions or a separate backend

export interface ZapierWebhookRequest {
  phoneNumber: string;
  message?: string;
  otpCode?: string;
  sessionId?: string;
  source?: string;
  context?: Record<string, unknown>;
}

export interface ZapierWebhookResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Handle SMS sending webhook from Zapier
 */
export async function handleSendSMS(
  request: ZapierWebhookRequest
): Promise<ZapierWebhookResponse> {
  try {
    if (!request.phoneNumber) {
      return {
        success: false,
        error: "Phone number is required",
      };
    }

    // This would be called by Zapier after they send the SMS via Bandwidth
    // We're just acknowledging receipt and logging
    console.log("Zapier sent SMS via Bandwidth:", {
      phoneNumber: request.phoneNumber,
      message: request.message,
      sessionId: request.sessionId,
      source: request.source,
    });

    return {
      success: true,
      data: {
        messageId: `msg_${Date.now()}`,
        status: "sent",
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("Send SMS webhook error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Handle OTP verification webhook from Zapier
 */
export async function handleVerifyOTP(
  request: ZapierWebhookRequest
): Promise<ZapierWebhookResponse> {
  try {
    if (!request.phoneNumber || !request.otpCode) {
      return {
        success: false,
        error: "Phone number and OTP code are required",
      };
    }

    // Verify OTP using our service
    const result = await zapierService.verifyOTP({
      phoneNumber: request.phoneNumber,
      otpCode: request.otpCode,
      sessionId: request.sessionId,
    });

    if (result.success && result.verified) {
      return {
        success: true,
        data: {
          verified: true,
          userId: result.userId,
          sessionId: result.sessionId,
          message: "Phone number verified successfully",
        },
      };
    } else {
      return {
        success: false,
        error: result.error || "Verification failed",
      };
    }
  } catch (error) {
    console.error("Verify OTP webhook error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Handle chat message processing webhook from Zapier
 */
export async function handleProcessChat(
  request: ZapierWebhookRequest
): Promise<ZapierWebhookResponse> {
  try {
    if (!request.message || !request.phoneNumber || !request.sessionId) {
      return {
        success: false,
        error: "Message, phone number, and session ID are required",
      };
    }

    // Process message through chatbot service
    const context = {
      sessionId: request.sessionId,
      messageCount: 1,
      lastInteraction: new Date().toISOString(),
      topic: "general",
    };

    const result = await chatbotService.processMessage(
      request.message,
      context
    );

    if (result.success) {
      // Send AI response back via Zapier -> Bandwidth
      const smsResult = await zapierService.sendSMS({
        phoneNumber: request.phoneNumber,
        message: result.message.text,
        sessionId: request.sessionId,
        source: "ai-response",
      });

      return {
        success: true,
        data: {
          response: result.message.text,
          suggestions: result.suggestions,
          smsSent: smsResult.success,
          messageId: smsResult.messageId,
        },
      };
    } else {
      return {
        success: false,
        error: result.error || "Failed to process chat message",
      };
    }
  } catch (error) {
    console.error("Process chat webhook error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Main webhook handler that routes requests based on type
 */
export async function handleZapierWebhook(
  request: ZapierWebhookRequest & {
    type: "send-sms" | "verify-otp" | "process-chat";
  }
): Promise<ZapierWebhookResponse> {
  try {
    switch (request.type) {
      case "send-sms":
        return await handleSendSMS(request);

      case "verify-otp":
        return await handleVerifyOTP(request);

      case "process-chat":
        return await handleProcessChat(request);

      default:
        return {
          success: false,
          error: "Invalid webhook type",
        };
    }
  } catch (error) {
    console.error("Zapier webhook routing error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Webhook processing failed",
    };
  }
}

/**
 * Get webhook configuration for Zapier setup
 */
export function getZapierWebhookConfig() {
  return {
    endpoints: {
      "send-sms": "/api/zapier/send-sms",
      "verify-otp": "/api/zapier/verify-otp",
      "process-chat": "/api/zapier/process-chat",
    },
    requiredFields: {
      "send-sms": ["phoneNumber", "message", "sessionId?", "source?"],
      "verify-otp": ["phoneNumber", "otpCode", "sessionId?"],
      "process-chat": ["message", "phoneNumber", "sessionId", "context?"],
    },
    responseFormat: {
      success: "boolean",
      data: "object (optional)",
      error: "string (optional)",
    },
  };
}
