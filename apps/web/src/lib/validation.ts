// =============================================================================
// RUNTIME VALIDATION WITH ZOD
// =============================================================================

import { z } from "zod";
import { createValidationError, ErrorCode } from "./errors";

// =============================================================================
// COMMON VALIDATION SCHEMAS
// =============================================================================

// Phone number validation
export const phoneSchema = z
  .string()
  .min(10, "Phone number must be at least 10 digits")
  .max(15, "Phone number must be no more than 15 digits")
  .regex(/^[\+]?[1-9][\d]{0,15}$/, "Invalid phone number format")
  .transform((val) => {
    // Normalize phone number format
    const cleaned = val.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `+1${cleaned}`;
    }
    if (cleaned.length === 11 && cleaned.startsWith("1")) {
      return `+${cleaned}`;
    }
    return `+${cleaned}`;
  });

// Email validation
export const emailSchema = z
  .string()
  .email("Invalid email format")
  .min(1, "Email is required")
  .max(255, "Email is too long");

// Name validation
export const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(100, "Name is too long")
  .regex(/^[a-zA-Z\s\-'\.]+$/, "Name contains invalid characters");

// Company name validation
export const companySchema = z
  .string()
  .min(1, "Company name is required")
  .max(200, "Company name is too long")
  .regex(/^[a-zA-Z0-9\s\-'\.&,]+$/, "Company name contains invalid characters");

// Message validation
export const messageSchema = z
  .string()
  .min(1, "Message is required")
  .max(1000, "Message is too long");

// URL validation
export const urlSchema = z.string().url("Invalid URL format").optional();

// =============================================================================
// AUTHENTICATION SCHEMAS
// =============================================================================

export const smsAuthRequestSchema = z.object({
  phoneNumber: phoneSchema,
  source: z.string().optional().default("demo-request"),
});

export const otpVerificationSchema = z.object({
  phoneNumber: phoneSchema,
  otpCode: z
    .string()
    .length(6, "OTP code must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP code must contain only digits"),
});

export const userProfileSchema = z.object({
  id: z.string().uuid("Invalid user ID format"),
  phone: phoneSchema,
  email: emailSchema.optional(),
  created_at: z.string().datetime("Invalid date format"),
  last_sign_in: z.string().datetime("Invalid date format").optional(),
});

// =============================================================================
// SMS SCHEMAS
// =============================================================================

export const smsRequestSchema = z.object({
  phoneNumber: phoneSchema,
  message: messageSchema,
  sessionId: z.string().optional(),
  source: z.string().optional().default("demo"),
});

export const smsResponseSchema = z.object({
  success: z.boolean(),
  messageId: z.string().optional(),
  error: z.string().optional(),
});

// =============================================================================
// CHATBOT SCHEMAS
// =============================================================================

export const chatMessageSchema = z.object({
  id: z.string(),
  text: messageSchema,
  sender: z.enum(["user", "business", "ai"]),
  timestamp: z.string().datetime("Invalid timestamp format"),
  businessName: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  sessionId: z.string().optional(),
});

export const chatbotResponseSchema = z.object({
  success: z.boolean(),
  message: chatMessageSchema,
  suggestions: z.array(z.string()).optional(),
  error: z.string().optional(),
});

export const conversationContextSchema = z.object({
  sessionId: z.string(),
  userId: z.string().uuid("Invalid user ID format").optional(),
  leadId: z.string().uuid("Invalid lead ID format").optional(),
  topic: z.string().optional(),
  messageCount: z.number().int().min(0),
  lastInteraction: z.string().datetime("Invalid date format"),
  userPreferences: z.record(z.unknown()).optional(),
});

export const chatbotConfigSchema = z.object({
  personality: z.enum(["professional", "friendly", "expert", "casual"]),
  industry: z.enum(["cigars", "luxury", "general"]),
  responseStyle: z.enum(["concise", "detailed", "conversational"]),
  maxResponseLength: z.number().int().min(50).max(500),
});

// =============================================================================
// LEAD SCHEMAS
// =============================================================================

export const leadSchema = z.object({
  id: z.string().uuid("Invalid lead ID format"),
  email: emailSchema,
  first_name: nameSchema.optional(),
  last_name: nameSchema.optional(),
  company_name: companySchema.optional(),
  phone: phoneSchema.optional(),
  message: messageSchema.optional(),
  source: z.string(),
  status: z.enum(["new", "contacted", "qualified", "converted", "lost"]),
  ip_address: z.string().ip("Invalid IP address format").optional(),
  user_agent: z.string().optional(),
  created_at: z.string().datetime("Invalid date format"),
  updated_at: z.string().datetime("Invalid date format"),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  source_type: z.string().optional(),
  lead_score: z.number().int().min(0).max(100).optional(),
});

export const createLeadSchema = leadSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const updateLeadSchema = leadSchema.partial().omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// =============================================================================
// MESSAGE SCHEMAS
// =============================================================================

export const messageDataSchema = z.object({
  text: messageSchema,
  sender: z.enum(["user", "business", "ai"]),
  businessName: z.string().optional(),
  metadata: z
    .object({
      source: z.enum(["phone-ui", "web-form", "api", "chatbot"]),
      userAgent: z.string().optional(),
      ipAddress: z.string().ip("Invalid IP address format").optional(),
      location: z.string().optional(),
      sessionId: z.string().optional(),
      intent: z.string().optional(),
    })
    .optional(),
});

export const messageDestinationSchema = z.object({
  type: z.enum(["lead", "analytics", "notification", "external"]),
  target: z.string(),
  config: z.record(z.unknown()).optional(),
});

export const messageAnalyticsSchema = z.object({
  messageId: z.string().uuid("Invalid message ID format"),
  deliveryStatus: z.enum(["sent", "delivered", "failed", "pending"]),
  deliveryTime: z.number().optional(),
  readTime: z.number().optional(),
  engagementMetrics: z.record(z.number()).optional(),
});

// =============================================================================
// ZAPIER SCHEMAS
// =============================================================================

export const zapierSMSRequestSchema = smsRequestSchema;
export const zapierSMSResponseSchema = smsResponseSchema;

export const zapierOTPRequestSchema = z.object({
  phoneNumber: phoneSchema,
  otpCode: z
    .string()
    .length(6, "OTP code must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP code must contain only digits"),
  sessionId: z.string().optional(),
});

export const zapierOTPResponseSchema = z.object({
  success: z.boolean(),
  verified: z.boolean(),
  userId: z.string().uuid("Invalid user ID format").optional(),
  sessionId: z.string().optional(),
  error: z.string().optional(),
});

export const zapierChatRequestSchema = z.object({
  message: messageSchema,
  phoneNumber: phoneSchema,
  sessionId: z.string(),
  context: z.record(z.unknown()).optional(),
});

export const zapierChatResponseSchema = z.object({
  success: z.boolean(),
  response: messageSchema,
  suggestions: z.array(z.string()).optional(),
  error: z.string().optional(),
});

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

export const validate = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context?: Record<string, unknown>
): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = createValidationError(
        ErrorCode.VALIDATION_INVALID_VALUE,
        "Validation failed",
        context
      );

      // Add validation details to the error
      validationError.context = {
        ...validationError.context,
        validationErrors: error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
          code: err.code,
        })),
        receivedData: data,
      };

      throw validationError;
    }

    throw error;
  }
};

export const validatePartial = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context?: Record<string, unknown>
): Partial<T> => {
  try {
    return schema.partial().parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = createValidationError(
        ErrorCode.VALIDATION_INVALID_VALUE,
        "Partial validation failed",
        context
      );

      validationError.context = {
        ...validationError.context,
        validationErrors: error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
          code: err.code,
        })),
        receivedData: data,
      };

      throw validationError;
    }

    throw error;
  }
};

export const safeParse = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } => {
  return schema.safeParse(data);
};

// =============================================================================
// SCHEMA EXPORTS
// =============================================================================

export const schemas = {
  // Authentication
  smsAuthRequest: smsAuthRequestSchema,
  otpVerification: otpVerificationSchema,
  userProfile: userProfileSchema,

  // SMS
  smsRequest: smsRequestSchema,
  smsResponse: smsResponseSchema,

  // Chatbot
  chatMessage: chatMessageSchema,
  chatbotResponse: chatbotResponseSchema,
  conversationContext: conversationContextSchema,
  chatbotConfig: chatbotConfigSchema,

  // Leads
  lead: leadSchema,
  createLead: createLeadSchema,
  updateLead: updateLeadSchema,

  // Messages
  messageData: messageDataSchema,
  messageDestination: messageDestinationSchema,
  messageAnalytics: messageAnalyticsSchema,

  // Zapier
  zapierSMSRequest: zapierSMSRequestSchema,
  zapierSMSResponse: zapierSMSResponseSchema,
  zapierOTPRequest: zapierOTPRequestSchema,
  zapierOTPResponse: zapierOTPResponseSchema,
  zapierChatRequest: zapierChatRequestSchema,
  zapierChatResponse: zapierChatResponseSchema,

  // Common
  phone: phoneSchema,
  email: emailSchema,
  name: nameSchema,
  company: companySchema,
  message: messageSchema,
  url: urlSchema,
} as const;

// =============================================================================
// TYPE INFERENCE
// =============================================================================

export type SMSAuthRequest = z.infer<typeof smsAuthRequestSchema>;
export type OTPVerification = z.infer<typeof otpVerificationSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type SMSRequest = z.infer<typeof smsRequestSchema>;
export type SMSResponse = z.infer<typeof smsResponseSchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatbotResponse = z.infer<typeof chatbotResponseSchema>;
export type ConversationContext = z.infer<typeof conversationContextSchema>;
export type ChatbotConfig = z.infer<typeof chatbotConfigSchema>;
export type Lead = z.infer<typeof leadSchema>;
export type CreateLead = z.infer<typeof createLeadSchema>;
export type UpdateLead = z.infer<typeof updateLeadSchema>;
export type MessageData = z.infer<typeof messageDataSchema>;
export type MessageDestination = z.infer<typeof messageDestinationSchema>;
export type MessageAnalytics = z.infer<typeof messageAnalyticsSchema>;
export type ZapierSMSRequest = z.infer<typeof zapierSMSRequestSchema>;
export type ZapierSMSResponse = z.infer<typeof zapierSMSResponseSchema>;
export type ZapierOTPRequest = z.infer<typeof zapierOTPRequestSchema>;
export type ZapierOTPResponse = z.infer<typeof zapierOTPResponseSchema>;
export type ZapierChatRequest = z.infer<typeof zapierChatRequestSchema>;
export type ZapierChatResponse = z.infer<typeof zapierChatResponseSchema>;
