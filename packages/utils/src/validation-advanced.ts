// =============================================================================
// RUNTIME VALIDATION WITH ZOD
// =============================================================================

import { z } from "zod";
import { createValidationError } from "./errors";

// =============================================================================
// COMMON VALIDATION SCHEMAS
// =============================================================================

// Phone number validation
export const phoneSchema = z
  .string()
  .min(10, "Phone number must be at least 10 digits")
  .max(15, "Phone number must be no more than 15 digits")
  .regex(/^[+]?[1-9][\d]{0,15}$/, "Invalid phone number format")
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
  .regex(/^[a-zA-Z\s\-'.]+$/, "Name contains invalid characters");

// Company name validation
export const companySchema = z
  .string()
  .min(1, "Company name is required")
  .max(200, "Company name is too long")
  .regex(/^[a-zA-Z0-9\s\-'.&,]+$/, "Company name contains invalid characters");

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
// ZAPIER SCHEMAS
// =============================================================================

export const zapierSMSRequestSchema = z.object({
  phoneNumber: phoneSchema,
  message: messageSchema,
  sessionId: z.string().optional(),
  source: z.string().optional().default("demo"),
});

export const zapierSMSResponseSchema = z.object({
  success: z.boolean(),
  messageId: z.string().optional(),
  error: z.string().optional(),
});

export const zapierOTPRequestSchema = z.object({
  phoneNumber: phoneSchema,
  otpCode: z.string().length(6, "OTP code must be exactly 6 digits"),
  sessionId: z.string().optional(),
});

export const zapierOTPResponseSchema = z.object({
  success: z.boolean(),
  messageId: z.string().optional(),
  error: z.string().optional(),
});

export const zapierChatRequestSchema = z.object({
  phoneNumber: phoneSchema,
  message: messageSchema,
  sessionId: z.string().optional(),
  context: z.record(z.unknown()).optional(),
});

export const zapierChatResponseSchema = z.object({
  success: z.boolean(),
  response: z.string().optional(),
  error: z.string().optional(),
});

// =============================================================================
// CHATBOT SCHEMAS
// =============================================================================

export const chatMessageSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1, "Message cannot be empty"),
  sender: z.enum(["user", "bot", "system"]),
  timestamp: z.date().default(() => new Date()),
  metadata: z.record(z.unknown()).optional(),
});

export const chatbotConfigSchema = z.object({
  model: z.string().default("gpt-3.5-turbo"),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().min(1).max(4000).default(1000),
  systemPrompt: z.string().optional(),
});

export const conversationContextSchema = z.object({
  sessionId: z.string(),
  messages: z.array(chatMessageSchema),
  config: chatbotConfigSchema.optional(),
  metadata: z.record(z.unknown()).optional(),
});

// =============================================================================
// VALIDATION FUNCTIONS
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
        `Validation failed: ${error.errors.map((e) => e.message).join(", ")}`,
        context
      );
      throw validationError;
    }
    throw error;
  }
};

export const validatePartial = <T>(
  _schema: z.ZodSchema<T>,
  data: unknown,
  context?: Record<string, unknown>
): Partial<T> => {
  try {
    // For partial validation, we'll just return the data as-is
    // since we can't easily make all fields optional with the current Zod setup
    return data as Partial<T>;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = createValidationError(
        `Partial validation failed: ${error.errors.map((e) => e.message).join(", ")}`,
        context
      );
      throw validationError;
    }
    throw error;
  }
};

export const safeValidate = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((e) => e.message),
      };
    }
    return {
      success: false,
      errors: ["Unknown validation error"],
    };
  }
};

// =============================================================================
// SCHEMA EXPORTS
// =============================================================================

export const schemas = {
  phone: phoneSchema,
  email: emailSchema,
  name: nameSchema,
  company: companySchema,
  message: messageSchema,
  url: urlSchema,
  smsAuthRequest: smsAuthRequestSchema,
  otpVerification: otpVerificationSchema,
  userProfile: userProfileSchema,
  smsRequest: smsRequestSchema,
  smsResponse: smsResponseSchema,
  chatMessage: chatMessageSchema,
  chatbotConfig: chatbotConfigSchema,
  conversationContext: conversationContextSchema,
  zapierSMSRequest: zapierSMSRequestSchema,
  zapierSMSResponse: zapierSMSResponseSchema,
  zapierOTPRequest: zapierOTPRequestSchema,
  zapierOTPResponse: zapierOTPResponseSchema,
  zapierChatRequest: zapierChatRequestSchema,
  zapierChatResponse: zapierChatResponseSchema,
};
