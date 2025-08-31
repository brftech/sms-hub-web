// =============================================================================
// ZAPIER SERVICE - REFACTORED WITH PROPER ARCHITECTURE
// =============================================================================

import { supabase } from "@/integrations/supabase/client";
import { leadsService } from "./leadsService";
import { chatbotService } from "./chatbotService";
import { zapierClient } from "@/lib/httpClient";
import { createPerformanceLogger } from "@/lib/logger";
import { apiLogger, logError, logInfo } from "@/lib/logger";
import {
  createExternalServiceError,
  createAuthError,
  createDatabaseError,
  ErrorCode,
} from "@/lib/errors";
import {
  validate,
  schemas,
  type ZapierSMSRequest,
  type ZapierSMSResponse,
  type ZapierOTPRequest,
  type ZapierOTPResponse,
  type ZapierChatRequest,
  type ZapierChatResponse,
} from "@/lib/validation";

class ZapierService {
  private webhookBaseUrl: string;

  constructor() {
    this.webhookBaseUrl = import.meta.env.VITE_ZAPIER_WEBHOOK_URL || "";

    if (!this.webhookBaseUrl) {
      apiLogger.warn("Zapier webhook URL not configured", {
        service: "zapier",
        operation: "constructor",
      });
    }
  }

  /**
   * Send SMS via Zapier -> Bandwidth
   */
  async sendSMS(request: ZapierSMSRequest): Promise<ZapierSMSResponse> {
    const perfLogger = createPerformanceLogger("Zapier sendSMS");

    try {
      // Validate input
      const validatedRequest = validate(schemas.zapierSMSRequest, request, {
        operation: "sendSMS",
        phoneNumber: request.phoneNumber,
      });

      apiLogger.info("Sending SMS via Zapier", {
        phoneNumber: validatedRequest.phoneNumber,
        messageLength: validatedRequest.message.length,
        sessionId: validatedRequest.sessionId,
        source: validatedRequest.source,
      });

      const response = await zapierClient.post("/send-sms", {
        phoneNumber: validatedRequest.phoneNumber,
        message: validatedRequest.message,
        sessionId: validatedRequest.sessionId,
        source: validatedRequest.source || "demo",
        timestamp: new Date().toISOString(),
      });

      const result = response.data as ZapierSMSResponse;

      if (result.success) {
        apiLogger.info("SMS sent successfully via Zapier", {
          phoneNumber: validatedRequest.phoneNumber,
          messageId: result.messageId,
          sessionId: validatedRequest.sessionId,
        });
      } else {
        apiLogger.warn("SMS send failed via Zapier", {
          phoneNumber: validatedRequest.phoneNumber,
          error: result.error,
          sessionId: validatedRequest.sessionId,
        });
      }

      perfLogger.finish({
        phoneNumber: validatedRequest.phoneNumber,
        success: result.success,
        sessionId: validatedRequest.sessionId,
      });

      return result;
    } catch (error) {
      perfLogger.finish({
        error: error instanceof Error ? error.message : "Unknown error",
        phoneNumber: request.phoneNumber,
      });

      logError("Zapier SMS send error", error, {
        phoneNumber: request.phoneNumber,
        sessionId: request.sessionId,
        operation: "sendSMS",
      });

      if (error instanceof Error) {
        throw error; // Re-throw our typed errors
      }

      // Wrap unknown errors
      throw createExternalServiceError(
        ErrorCode.ZAPIER_WEBHOOK_FAILED,
        "Failed to send SMS via Zapier",
        { phoneNumber: request.phoneNumber, sessionId: request.sessionId }
      );
    }
  }

  /**
   * Send OTP verification SMS
   */
  async sendOTP(
    phoneNumber: string,
    sessionId?: string
  ): Promise<ZapierSMSResponse> {
    const perfLogger = createPerformanceLogger("Zapier sendOTP");

    try {
      if (!phoneNumber.trim()) {
        throw createExternalServiceError(
          ErrorCode.SMS_INVALID_PHONE,
          "Phone number cannot be empty",
          { operation: "sendOTP" }
        );
      }

      const otpCode = this.generateOTP();

      // Store OTP in session storage for verification
      if (sessionId) {
        sessionStorage.setItem(`otp_${sessionId}`, otpCode);
        apiLogger.debug("OTP stored in session storage", { sessionId });
      }

      const message = `Your Gnymble demo verification code is: ${otpCode}. Valid for 10 minutes.`;

      apiLogger.info("Sending OTP verification SMS", {
        phoneNumber,
        sessionId,
        otpCode: otpCode.substring(0, 2) + "****", // Log partial OTP for security
      });

      const result = await this.sendSMS({
        phoneNumber,
        message,
        sessionId,
        source: "otp-verification",
      });

      perfLogger.finish({ phoneNumber, sessionId, success: result.success });
      return result;
    } catch (error) {
      perfLogger.finish({
        error: error instanceof Error ? error.message : "Unknown error",
        phoneNumber,
      });

      if (error instanceof Error) {
        throw error; // Re-throw our typed errors
      }

      // Wrap unknown errors
      throw createExternalServiceError(
        ErrorCode.SMS_SEND_FAILED,
        "Failed to send OTP verification SMS",
        { phoneNumber, sessionId }
      );
    }
  }

  /**
   * Verify OTP code
   */
  async verifyOTP(request: ZapierOTPRequest): Promise<ZapierOTPResponse> {
    const perfLogger = createPerformanceLogger("Zapier verifyOTP");

    try {
      // Validate input
      const validatedRequest = validate(schemas.zapierOTPRequest, request, {
        operation: "verifyOTP",
        phoneNumber: request.phoneNumber,
      });

      const { phoneNumber, otpCode, sessionId } = validatedRequest;

      apiLogger.info("Verifying OTP code", {
        phoneNumber,
        sessionId,
        operation: "verifyOTP",
      });

      // Check stored OTP
      let storedOTP: string | null = null;
      if (sessionId) {
        storedOTP = sessionStorage.getItem(`otp_${sessionId}`);
        // Clean up after verification
        sessionStorage.removeItem(`otp_${sessionId}`);
        apiLogger.debug("OTP retrieved and cleaned from session storage", {
          sessionId,
        });
      }

      if (!storedOTP || storedOTP !== otpCode) {
        apiLogger.warn("OTP verification failed - invalid or expired code", {
          phoneNumber,
          sessionId,
          providedOTP: otpCode.substring(0, 2) + "****",
          storedOTP: storedOTP ? storedOTP.substring(0, 2) + "****" : "none",
        });

        return {
          success: false,
          verified: false,
          error: "Invalid or expired verification code",
        };
      }

      // Create or get user in Supabase
      const {
        data: { user },
        error,
      } = await supabase.auth.signUp({
        phone: phoneNumber,
        password: this.generateSecurePassword(), // Generate secure password for phone auth
        options: {
          data: {
            phone_number: phoneNumber,
            source: "zapier-sms-demo",
            verified_at: new Date().toISOString(),
          },
        },
      });

      if (error) {
        logError("Supabase user creation error", error, {
          phoneNumber,
          sessionId,
          operation: "createUser",
        });

        return {
          success: false,
          verified: false,
          error: "Failed to create user account",
        };
      }

      // Create lead in database
      try {
        await leadsService.createLead({
          email: `sms-${phoneNumber.replace(/\D/g, "")}@demo.gnymble.com`,
          first_name: "Demo",
          last_name: "User",
          phone: phoneNumber,
          message: "SMS Demo Request - User verified via Zapier integration",
          source: "zapier-sms-demo",
          status: "contacted", // Mark as contacted since they verified
          company_name: "Zapier SMS Demo Lead",
        });

        apiLogger.info("Lead created successfully for verified OTP user", {
          phoneNumber,
          userId: user?.id,
          sessionId,
        });
      } catch (leadError) {
        logError("Failed to create lead for verified OTP user", leadError, {
          phoneNumber,
          userId: user?.id,
          sessionId,
          operation: "createLead",
        });
        // Don't fail verification if lead creation fails
      }

      apiLogger.info("OTP verification successful", {
        phoneNumber,
        userId: user?.id,
        sessionId,
      });

      perfLogger.finish({
        phoneNumber,
        userId: user?.id,
        sessionId,
        verified: true,
      });

      return {
        success: true,
        verified: true,
        userId: user?.id,
        sessionId,
      };
    } catch (error) {
      perfLogger.finish({
        error: error instanceof Error ? error.message : "Unknown error",
        phoneNumber: request.phoneNumber,
      });

      logError("Zapier OTP verification error", error, {
        phoneNumber: request.phoneNumber,
        sessionId: request.sessionId,
        operation: "verifyOTP",
      });

      if (error instanceof Error) {
        throw error; // Re-throw our typed errors
      }

      // Wrap unknown errors
      throw createExternalServiceError(
        ErrorCode.ZAPIER_WEBHOOK_FAILED,
        "Verification failed due to unexpected error",
        { phoneNumber: request.phoneNumber, sessionId: request.sessionId }
      );
    }
  }

  /**
   * Process chat message through Zapier -> AI service
   */
  async processChatMessage(
    request: ZapierChatRequest
  ): Promise<ZapierChatResponse> {
    const perfLogger = createPerformanceLogger("Zapier processChatMessage");

    try {
      // Validate input
      const validatedRequest = validate(schemas.zapierChatRequest, request, {
        operation: "processChatMessage",
        phoneNumber: request.phoneNumber,
        sessionId: request.sessionId,
      });

      apiLogger.info("Processing chat message via Zapier", {
        phoneNumber: validatedRequest.phoneNumber,
        messageLength: validatedRequest.message.length,
        sessionId: validatedRequest.sessionId,
      });

      const response = await zapierClient.post("/process-chat", {
        message: validatedRequest.message,
        phoneNumber: validatedRequest.phoneNumber,
        sessionId: validatedRequest.sessionId,
        context: validatedRequest.context,
        timestamp: new Date().toISOString(),
      });

      const result = response.data as ZapierChatResponse;

      if (result.success) {
        apiLogger.info("Chat message processed successfully via Zapier", {
          phoneNumber: validatedRequest.phoneNumber,
          sessionId: validatedRequest.sessionId,
          responseLength: result.response.length,
        });
      } else {
        apiLogger.warn("Chat message processing failed via Zapier", {
          phoneNumber: validatedRequest.phoneNumber,
          sessionId: validatedRequest.sessionId,
          error: result.error,
        });
      }

      perfLogger.finish({
        phoneNumber: validatedRequest.phoneNumber,
        sessionId: validatedRequest.sessionId,
        success: result.success,
      });

      return result;
    } catch (error) {
      perfLogger.finish({
        error: error instanceof Error ? error.message : "Unknown error",
        phoneNumber: request.phoneNumber,
        sessionId: request.sessionId,
      });

      logError("Zapier chat processing error", error, {
        phoneNumber: request.phoneNumber,
        sessionId: request.sessionId,
        operation: "processChatMessage",
      });

      if (error instanceof Error) {
        throw error; // Re-throw our typed errors
      }

      // Wrap unknown errors
      throw createExternalServiceError(
        ErrorCode.ZAPIER_WEBHOOK_FAILED,
        "Failed to process chat message via Zapier",
        { phoneNumber: request.phoneNumber, sessionId: request.sessionId }
      );
    }
  }

  /**
   * Generate 6-digit OTP code
   */
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Generate secure password for phone auth
   */
  private generateSecurePassword(): string {
    return (
      Math.random().toString(36).slice(-12) +
      Math.random().toString(36).slice(-12)
    );
  }

  /**
   * Get webhook URL for Zapier configuration
   */
  getWebhookUrl(): string {
    return `${window.location.origin}/api/zapier`;
  }
}

export const zapierService = new ZapierService();
export default zapierService;
