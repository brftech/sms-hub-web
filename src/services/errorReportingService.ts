/**
 * Centralized Error Reporting Service
 *
 * Handles error classification, reporting, and telemetry.
 * Integrates with Sentry in production, logs to console in development.
 */

export type ErrorSeverity = "low" | "medium" | "high" | "critical";
export type ErrorCategory = "network" | "auth" | "validation" | "runtime" | "database" | "unknown";

export interface ErrorContext {
  hubId?: number;
  hubType?: string;
  userId?: string;
  route?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

export interface ClassifiedError {
  originalError: Error;
  category: ErrorCategory;
  severity: ErrorSeverity;
  message: string;
  userMessage: string;
  context: ErrorContext;
  timestamp: Date;
  recoverable: boolean;
}

class ErrorReportingService {
  private isDevelopment: boolean;
  private errorHistory: ClassifiedError[] = [];
  private maxHistorySize = 50;

  constructor() {
    this.isDevelopment = import.meta.env.MODE === "development";
  }

  /**
   * Classify error based on type and message
   */
  classifyError(error: Error, context?: ErrorContext): ClassifiedError {
    let category: ErrorCategory = "unknown";
    let severity: ErrorSeverity = "medium";
    let recoverable = false;
    let userMessage = "Something went wrong. Please try again.";

    const errorMessage = error.message.toLowerCase();

    // Network errors
    if (
      (error.name === "TypeError" && errorMessage.includes("fetch")) ||
      errorMessage.includes("network") ||
      errorMessage.includes("connection") ||
      errorMessage.includes("timeout")
    ) {
      category = "network";
      severity = "medium";
      recoverable = true;
      userMessage = "Unable to connect. Please check your internet connection and try again.";
    }
    // Auth errors
    else if (
      errorMessage.includes("auth") ||
      errorMessage.includes("unauthorized") ||
      errorMessage.includes("forbidden") ||
      errorMessage.includes("token")
    ) {
      category = "auth";
      severity = "high";
      recoverable = true;
      userMessage = "Session expired. Please log in again.";
    }
    // Validation errors
    else if (
      errorMessage.includes("validation") ||
      errorMessage.includes("invalid") ||
      errorMessage.includes("required")
    ) {
      category = "validation";
      severity = "low";
      recoverable = true;
      userMessage = "Please check your input and try again.";
    }
    // Database errors
    else if (
      errorMessage.includes("database") ||
      errorMessage.includes("query") ||
      errorMessage.includes("supabase")
    ) {
      category = "database";
      severity = "high";
      recoverable = false;
      userMessage = "Unable to save changes. Please try again later.";
    }
    // Runtime errors
    else if (
      error.name === "TypeError" ||
      error.name === "ReferenceError" ||
      error.name === "RangeError"
    ) {
      category = "runtime";
      severity = "critical";
      recoverable = false;
      userMessage = "An unexpected error occurred. Our team has been notified.";
    }

    return {
      originalError: error,
      category,
      severity,
      message: error.message,
      userMessage,
      context: context || {},
      timestamp: new Date(),
      recoverable,
    };
  }

  /**
   * Report error to telemetry service (Sentry, etc.)
   */
  async reportError(classifiedError: ClassifiedError): Promise<void> {
    // Add to history
    this.errorHistory.unshift(classifiedError);
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory.pop();
    }

    // Log to console in development
    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.group(
        `🔴 Error [${classifiedError.severity.toUpperCase()}] - ${classifiedError.category}`
      );
      console.error("Original Error:", classifiedError.originalError);
      // eslint-disable-next-line no-console
      console.log("Classification:", {
        category: classifiedError.category,
        severity: classifiedError.severity,
        recoverable: classifiedError.recoverable,
      });
      // eslint-disable-next-line no-console
      console.log("Context:", classifiedError.context);
      // eslint-disable-next-line no-console
      console.log("User Message:", classifiedError.userMessage);
      // eslint-disable-next-line no-console
      console.groupEnd();
    }

    // In production, send to Sentry or other service
    if (!this.isDevelopment) {
      // TODO: Integrate with Sentry when ready
      // Sentry.captureException(classifiedError.originalError, {
      //   level: this.getSentryLevel(classifiedError.severity),
      //   tags: {
      //     category: classifiedError.category,
      //     hubType: classifiedError.context.hubType,
      //   },
      //   extra: classifiedError.context,
      // });
    }

    // Log critical errors to server
    if (classifiedError.severity === "critical") {
      await this.logToServer(classifiedError);
    }
  }

  /**
   * Log error to server for persistent storage
   */
  private async logToServer(_classifiedError: ClassifiedError): Promise<void> {
    try {
      // In production, send to Edge Function for logging
      if (!this.isDevelopment) {
        // TODO: Create error-logging Edge Function
        // await fetch('/api/log-error', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     message: _classifiedError.message,
        //     category: _classifiedError.category,
        //     severity: _classifiedError.severity,
        //     context: _classifiedError.context,
        //     timestamp: _classifiedError.timestamp,
        //   }),
        // });
      }
    } catch (error) {
      // Silently fail - don't throw errors in error handler
      console.error("Failed to log error to server:", error);
    }
  }

  /**
   * Get recent error history (useful for debugging)
   */
  getErrorHistory(): ClassifiedError[] {
    return [...this.errorHistory];
  }

  /**
   * Clear error history
   */
  clearHistory(): void {
    this.errorHistory = [];
  }

  /**
   * Check if errors exceed threshold (for health monitoring)
   */
  hasExcessiveErrors(timeWindowMs: number = 60000, threshold: number = 5): boolean {
    const cutoffTime = Date.now() - timeWindowMs;
    const recentErrors = this.errorHistory.filter((err) => err.timestamp.getTime() > cutoffTime);
    return recentErrors.length >= threshold;
  }
}

// Export singleton instance
export const errorReportingService = new ErrorReportingService();

/**
 * Convenience function to report error
 */
export async function reportError(error: Error, context?: ErrorContext): Promise<ClassifiedError> {
  const classifiedError = errorReportingService.classifyError(error, context);
  await errorReportingService.reportError(classifiedError);
  return classifiedError;
}

/**
 * Get user-friendly error message
 */
export function getUserErrorMessage(error: Error, context?: ErrorContext): string {
  const classified = errorReportingService.classifyError(error, context);
  return classified.userMessage;
}
