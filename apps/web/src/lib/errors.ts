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
    isOperational: boolean = true,
    retryable: boolean = false,
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

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  public toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      severity: this.severity,
      context: this.context,
      isOperational: this.isOperational,
      retryable: this.retryable,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
      originalError: this.originalError?.message,
    };
  }

  public toString(): string {
    return `${this.name}: ${this.message} (${this.code})`;
  }
}

// =============================================================================
// SPECIFIC ERROR CLASSES
// =============================================================================

export class AuthenticationError extends BaseAppError {
  constructor(
    message: string,
    code: ErrorCode,
    context: Partial<ErrorContext> = {},
    originalError?: Error
  ) {
    super(
      message,
      code,
      ErrorSeverity.HIGH,
      context,
      true,
      false,
      originalError
    );
  }
}

export class SMSError extends BaseAppError {
  constructor(
    message: string,
    code: ErrorCode,
    context: Partial<ErrorContext> = {},
    retryable: boolean = true,
    originalError?: Error
  ) {
    super(
      message,
      code,
      ErrorSeverity.MEDIUM,
      context,
      true,
      retryable,
      originalError
    );
  }
}

export class APIError extends BaseAppError {
  constructor(
    message: string,
    code: ErrorCode,
    context: Partial<ErrorContext> = {},
    retryable: boolean = false,
    originalError?: Error
  ) {
    super(
      message,
      code,
      ErrorSeverity.MEDIUM,
      context,
      true,
      retryable,
      originalError
    );
  }
}

export class DatabaseError extends BaseAppError {
  constructor(
    message: string,
    code: ErrorCode,
    context: Partial<ErrorContext> = {},
    retryable: boolean = true,
    originalError?: Error
  ) {
    super(
      message,
      code,
      ErrorSeverity.HIGH,
      context,
      true,
      retryable,
      originalError
    );
  }
}

export class ValidationError extends BaseAppError {
  constructor(
    message: string,
    code: ErrorCode,
    context: Partial<ErrorContext> = {},
    originalError?: Error
  ) {
    super(
      message,
      code,
      ErrorSeverity.LOW,
      context,
      true,
      false,
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

export class ExternalServiceError extends BaseAppError {
  constructor(
    message: string,
    code: ErrorCode,
    context: Partial<ErrorContext> = {},
    retryable: boolean = true,
    originalError?: Error
  ) {
    super(
      message,
      code,
      ErrorSeverity.MEDIUM,
      context,
      true,
      retryable,
      originalError
    );
  }
}

// =============================================================================
// ERROR FACTORY FUNCTIONS
// =============================================================================

export const createAuthError = (
  code: ErrorCode,
  message: string,
  context: Partial<ErrorContext> = {},
  originalError?: Error
): AuthenticationError => {
  return new AuthenticationError(message, code, context, originalError);
};

export const createSMSError = (
  code: ErrorCode,
  message: string,
  context: Partial<ErrorContext> = {},
  retryable: boolean = true,
  originalError?: Error
): SMSError => {
  return new SMSError(message, code, context, retryable, originalError);
};

export const createAPIError = (
  code: ErrorCode,
  message: string,
  context: Partial<ErrorContext> = {},
  retryable: boolean = false,
  originalError?: Error
): APIError => {
  return new APIError(message, code, context, retryable, originalError);
};

export const createDatabaseError = (
  code: ErrorCode,
  message: string,
  context: Partial<ErrorContext> = {},
  retryable: boolean = true,
  originalError?: Error
): DatabaseError => {
  return new DatabaseError(message, code, context, retryable, originalError);
};

export const createValidationError = (
  code: ErrorCode,
  message: string,
  context: Partial<ErrorContext> = {},
  originalError?: Error
): ValidationError => {
  return new ValidationError(message, code, context, originalError);
};

export const createBusinessLogicError = (
  code: ErrorCode,
  message: string,
  context: Partial<ErrorContext> = {},
  originalError?: Error
): BusinessLogicError => {
  return new BusinessLogicError(message, code, context, originalError);
};

export const createExternalServiceError = (
  code: ErrorCode,
  message: string,
  context: Partial<ErrorContext> = {},
  retryable: boolean = true,
  originalError?: Error
): ExternalServiceError => {
  return new ExternalServiceError(
    message,
    code,
    context,
    retryable,
    originalError
  );
};

// =============================================================================
// ERROR UTILITY FUNCTIONS
// =============================================================================

export const isAppError = (error: unknown): error is AppError => {
  return error instanceof BaseAppError;
};

export const isRetryableError = (error: unknown): boolean => {
  if (isAppError(error)) {
    return error.retryable;
  }
  return false;
};

export const isOperationalError = (error: unknown): boolean => {
  if (isAppError(error)) {
    return error.isOperational;
  }
  return false;
};

export const getErrorCode = (error: unknown): ErrorCode => {
  if (isAppError(error)) {
    return error.code;
  }
  return ErrorCode.UNKNOWN_ERROR;
};

export const getErrorSeverity = (error: unknown): ErrorSeverity => {
  if (isAppError(error)) {
    return error.severity;
  }
  return ErrorSeverity.MEDIUM;
};

export const wrapError = (
  error: unknown,
  message: string,
  code: ErrorCode = ErrorCode.UNKNOWN_ERROR,
  context: Partial<ErrorContext> = {}
): AppError => {
  if (isAppError(error)) {
    return new BaseAppError(
      message,
      code,
      error.severity,
      { ...error.context, ...context },
      error.isOperational,
      error.retryable,
      error
    );
  }

  const originalError =
    error instanceof Error ? error : new Error(String(error));
  return new BaseAppError(
    message,
    code,
    ErrorSeverity.MEDIUM,
    context,
    true,
    false,
    originalError
  );
};
