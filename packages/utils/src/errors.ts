// =============================================================================
// ERROR HANDLING SYSTEM
// =============================================================================

export enum ErrorCode {
  // Authentication Errors
  AUTH_INVALID_CREDENTIALS = "AUTH_INVALID_CREDENTIALS",
  AUTH_TOKEN_EXPIRED = "AUTH_TOKEN_EXPIRED",
  AUTH_INSUFFICIENT_PERMISSIONS = "AUTH_INSUFFICIENT_PERMISSIONS",
  AUTH_PHONE_VERIFICATION_FAILED = "AUTH_PHONE_VERIFICATION_FAILED",
  AUTH_OTP_INVALID = "AUTH_OTP_INVALID",
  AUTH_OTP_EXPIRED = "AUTH_OTP_EXPIRED",

  // SMS Errors
  SMS_SEND_FAILED = "SMS_SEND_FAILED",
  SMS_INVALID_PHONE = "SMS_INVALID_PHONE",
  SMS_RATE_LIMITED = "SMS_RATE_LIMITED",
  SMS_PROVIDER_ERROR = "SMS_PROVIDER_ERROR",

  // API Errors
  API_NETWORK_ERROR = "API_NETWORK_ERROR",
  API_TIMEOUT = "API_TIMEOUT",
  API_RATE_LIMITED = "API_RATE_LIMITED",
  API_SERVER_ERROR = "API_SERVER_ERROR",
  API_BAD_REQUEST = "API_BAD_REQUEST",
  API_UNAUTHORIZED = "API_UNAUTHORIZED",
  API_FORBIDDEN = "API_FORBIDDEN",
  API_NOT_FOUND = "API_NOT_FOUND",

  // Database Errors
  DB_CONNECTION_ERROR = "DB_CONNECTION_ERROR",
  DB_QUERY_ERROR = "DB_QUERY_ERROR",
  DB_CONSTRAINT_VIOLATION = "DB_CONSTRAINT_VIOLATION",
  DB_TRANSACTION_FAILED = "DB_TRANSACTION_FAILED",

  // Validation Errors
  VALIDATION_REQUIRED_FIELD = "VALIDATION_REQUIRED_FIELD",
  VALIDATION_INVALID_FORMAT = "VALIDATION_INVALID_FORMAT",
  VALIDATION_INVALID_VALUE = "VALIDATION_INVALID_VALUE",

  // Business Logic Errors
  LEAD_NOT_FOUND = "LEAD_NOT_FOUND",
  LEAD_ALREADY_EXISTS = "LEAD_ALREADY_EXISTS",
  MESSAGE_SEND_FAILED = "MESSAGE_SEND_FAILED",
  CHATBOT_PROCESSING_FAILED = "CHATBOT_PROCESSING_FAILED",

  // External Service Errors
  ZAPIER_WEBHOOK_FAILED = "ZAPIER_WEBHOOK_FAILED",
  BANDWIDTH_API_ERROR = "BANDWIDTH_API_ERROR",
  OPENAI_API_ERROR = "OPENAI_API_ERROR",

  // Unknown Errors
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export enum ErrorSeverity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  phoneNumber?: string;
  leadId?: string;
  messageId?: string;
  endpoint?: string;
  method?: string;
  timestamp: string;
  userAgent?: string;
  ipAddress?: string;
  [key: string]: unknown;
}

export interface AppError extends Error {
  code: ErrorCode;
  severity: ErrorSeverity;
  context: ErrorContext;
  isOperational: boolean;
  retryable: boolean;
  timestamp: Date;
  originalError?: Error;
}

export class BaseAppError extends Error implements AppError {
  public readonly code: ErrorCode;
  public readonly severity: ErrorSeverity;
  public readonly context: ErrorContext;
  public readonly isOperational: boolean;
  public readonly retryable: boolean;
  public readonly timestamp: Date;
  public readonly originalError?: Error;

  constructor(
    message: string,
    code: ErrorCode,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context: Partial<ErrorContext> = {},
    isOperational = true,
    retryable = false,
    originalError?: Error
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.severity = severity;
    this.context = {
      timestamp: new Date().toISOString(),
      ...context,
    };
    this.isOperational = isOperational;
    this.retryable = retryable;
    this.timestamp = new Date();
    this.originalError = originalError;

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// =============================================================================
// SPECIFIC ERROR CLASSES
// =============================================================================

export class AuthenticationError extends BaseAppError {
  constructor(
    message: string,
    context: Partial<ErrorContext> = {},
    originalError?: Error
  ) {
    super(
      message,
      ErrorCode.AUTH_INVALID_CREDENTIALS,
      ErrorSeverity.HIGH,
      context,
      true,
      false,
      originalError
    );
  }
}

export class ValidationError extends BaseAppError {
  constructor(
    message: string,
    context: Partial<ErrorContext> = {},
    originalError?: Error
  ) {
    super(
      message,
      ErrorCode.VALIDATION_REQUIRED_FIELD,
      ErrorSeverity.MEDIUM,
      context,
      true,
      false,
      originalError
    );
  }
}

export class DatabaseError extends BaseAppError {
  constructor(
    message: string,
    code: ErrorCode = ErrorCode.DB_QUERY_ERROR,
    context: Partial<ErrorContext> = {},
    originalError?: Error
  ) {
    super(
      message,
      code,
      ErrorSeverity.HIGH,
      context,
      true,
      true,
      originalError
    );
  }
}

export class NetworkError extends BaseAppError {
  constructor(
    message: string,
    context: Partial<ErrorContext> = {},
    originalError?: Error
  ) {
    super(
      message,
      ErrorCode.API_NETWORK_ERROR,
      ErrorSeverity.MEDIUM,
      context,
      true,
      true,
      originalError
    );
  }
}

export class BusinessLogicError extends BaseAppError {
  constructor(
    message: string,
    code: ErrorCode,
    context: Partial<ErrorContext> = {},
    originalError?: Error
  ) {
    super(
      message,
      code,
      ErrorSeverity.MEDIUM,
      context,
      true,
      false,
      originalError
    );
  }
}

// =============================================================================
// ERROR FACTORY FUNCTIONS
// =============================================================================

export const createAuthError = (
  message: string,
  context: Partial<ErrorContext> = {},
  originalError?: Error
): AuthenticationError => {
  return new AuthenticationError(message, context, originalError);
};

export const createValidationError = (
  message: string,
  context: Partial<ErrorContext> = {},
  originalError?: Error
): ValidationError => {
  return new ValidationError(message, context, originalError);
};

export const createDatabaseError = (
  message: string,
  code: ErrorCode = ErrorCode.DB_QUERY_ERROR,
  context: Partial<ErrorContext> = {},
  originalError?: Error
): DatabaseError => {
  return new DatabaseError(message, code, context, originalError);
};

export const createNetworkError = (
  message: string,
  context: Partial<ErrorContext> = {},
  originalError?: Error
): NetworkError => {
  return new NetworkError(message, context, originalError);
};

export const createBusinessLogicError = (
  message: string,
  code: ErrorCode,
  context: Partial<ErrorContext> = {},
  originalError?: Error
): BusinessLogicError => {
  return new BusinessLogicError(message, code, context, originalError);
};

export const createAPIError = (
  message: string,
  status?: number,
  statusText?: string,
  context: Partial<ErrorContext> = {},
  originalError?: Error
): AppError => {
  const error = new BaseAppError(
    message,
    ErrorCode.API_SERVER_ERROR,
    ErrorSeverity.HIGH,
    context,
    true,
    true,
    originalError
  );

  // Add HTTP-specific properties
  (error as any).status = status;
  (error as any).statusText = statusText;

  return error;
};

// =============================================================================
// ERROR UTILITY FUNCTIONS
// =============================================================================

export const isAppError = (error: unknown): error is AppError => {
  return error instanceof BaseAppError;
};

export const isOperationalError = (error: unknown): boolean => {
  return isAppError(error) && error.isOperational;
};

export const isRetryableError = (error: unknown): boolean => {
  return isAppError(error) && error.retryable;
};

export const getErrorContext = (error: unknown): ErrorContext | undefined => {
  return isAppError(error) ? error.context : undefined;
};

export const getErrorCode = (error: unknown): ErrorCode | undefined => {
  return isAppError(error) ? error.code : undefined;
};

export const getErrorSeverity = (error: unknown): ErrorSeverity | undefined => {
  return isAppError(error) ? error.severity : undefined;
};
