// =============================================================================
// STRUCTURED LOGGING FRAMEWORK
// =============================================================================

import { ErrorCode, ErrorSeverity, AppError, isAppError } from "./errors";

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4,
}

export interface LogContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  endpoint?: string;
  method?: string;
  userAgent?: string;
  ipAddress?: string;
  duration?: number;
  [key: string]: unknown;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context: LogContext;
  error?: AppError;
  data?: Record<string, unknown>;
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  remoteEndpoint?: string;
  appName: string;
  appVersion: string;
  environment: "development" | "staging" | "production";
}

class Logger {
  private config: LoggerConfig;
  private requestId: string | null = null;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: LogLevel.INFO,
      enableConsole: true,
      enableRemote: false,
      appName: "Gnymble",
      appVersion: "1.0.0",
      environment: "development",
      ...config,
    };

    // Set log level from environment
    const envLevel = import.meta.env.VITE_LOG_LEVEL;
    if (envLevel) {
      this.config.level = this.parseLogLevel(envLevel);
    }
  }

  // =============================================================================
  // LOGGING METHODS
  // =============================================================================

  public debug(
    message: string,
    context: Partial<LogContext> = {},
    data?: Record<string, unknown>
  ): void {
    this.log(LogLevel.DEBUG, message, context, undefined, data);
  }

  public info(
    message: string,
    context: Partial<LogContext> = {},
    data?: Record<string, unknown>
  ): void {
    this.log(LogLevel.INFO, message, context, undefined, data);
  }

  public warn(
    message: string,
    context: Partial<LogContext> = {},
    data?: Record<string, unknown>
  ): void {
    this.log(LogLevel.WARN, message, context, undefined, data);
  }

  public error(
    message: string,
    error?: unknown,
    context: Partial<LogContext> = {},
    data?: Record<string, unknown>
  ): void {
    const appError = this.normalizeError(error);
    this.log(LogLevel.ERROR, message, context, appError, data);
  }

  public critical(
    message: string,
    error?: unknown,
    context: Partial<LogContext> = {},
    data?: Record<string, unknown>
  ): void {
    const appError = this.normalizeError(error);
    this.log(LogLevel.CRITICAL, message, context, appError, data);
  }

  // =============================================================================
  // CONTEXT MANAGEMENT
  // =============================================================================

  public setRequestId(requestId: string): void {
    this.requestId = requestId;
  }

  public clearRequestId(): void {
    this.requestId = null;
  }

  public withContext(context: Partial<LogContext>): Logger {
    const logger = new Logger(this.config);
    logger.requestId = this.requestId;
    return logger;
  }

  // =============================================================================
  // PRIVATE METHODS
  // =============================================================================

  private log(
    level: LogLevel,
    message: string,
    context: Partial<LogContext> = {},
    error?: AppError,
    data?: Record<string, unknown>
  ): void {
    if (level < this.config.level) {
      return;
    }

    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: {
        ...this.getDefaultContext(),
        ...context,
      },
      error,
      data,
    };

    if (this.config.enableConsole) {
      this.logToConsole(logEntry);
    }

    if (this.config.enableRemote && this.config.remoteEndpoint) {
      this.logToRemote(logEntry);
    }
  }

  private getDefaultContext(): LogContext {
    return {
      requestId: this.requestId,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };
  }

  private normalizeError(error: unknown): AppError | undefined {
    if (!error) return undefined;

    if (isAppError(error)) {
      return error;
    }

    if (error instanceof Error) {
      // Convert generic errors to AppError
      return {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: "UNKNOWN_ERROR" as ErrorCode,
        severity: ErrorSeverity.MEDIUM,
        context: {},
        isOperational: true,
        retryable: false,
        timestamp: new Date(),
      } as AppError;
    }

    return {
      name: "UnknownError",
      message: String(error),
      code: "UNKNOWN_ERROR" as ErrorCode,
      severity: ErrorSeverity.MEDIUM,
      context: {},
      isOperational: true,
      retryable: false,
      timestamp: new Date(),
    } as AppError;
  }

  private logToConsole(logEntry: LogEntry): void {
    const { level, message, timestamp, context, error, data } = logEntry;

    const prefix = `[${timestamp}] [${this.getLevelString(level)}] [${
      this.config.appName
    }]`;
    const contextStr =
      Object.keys(context).length > 0 ? ` | ${JSON.stringify(context)}` : "";
    const dataStr = data ? ` | ${JSON.stringify(data)}` : "";

    const logMessage = `${prefix} ${message}${contextStr}${dataStr}`;

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(logMessage);
        break;
      case LogLevel.INFO:
        console.info(logMessage);
        break;
      case LogLevel.WARN:
        console.warn(logMessage);
        break;
      case LogLevel.ERROR:
        console.error(logMessage, error);
        break;
      case LogLevel.CRITICAL:
        console.error(`🚨 CRITICAL: ${logMessage}`, error);
        break;
    }
  }

  private async logToRemote(logEntry: LogEntry): Promise<void> {
    try {
      await fetch(this.config.remoteEndpoint!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...logEntry,
          appName: this.config.appName,
          appVersion: this.config.appVersion,
          environment: this.config.environment,
        }),
      });
    } catch (error) {
      // Fallback to console if remote logging fails
      console.error("Failed to send log to remote endpoint:", error);
    }
  }

  private getLevelString(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return "DEBUG";
      case LogLevel.INFO:
        return "INFO";
      case LogLevel.WARN:
        return "WARN";
      case LogLevel.ERROR:
        return "ERROR";
      case LogLevel.CRITICAL:
        return "CRITICAL";
      default:
        return "UNKNOWN";
    }
  }

  private parseLogLevel(level: string): LogLevel {
    switch (level.toLowerCase()) {
      case "debug":
        return LogLevel.DEBUG;
      case "info":
        return LogLevel.INFO;
      case "warn":
        return LogLevel.WARN;
      case "error":
        return LogLevel.ERROR;
      case "critical":
        return LogLevel.CRITICAL;
      default:
        return LogLevel.INFO;
    }
  }
}

// =============================================================================
// LOGGER INSTANCES
// =============================================================================

// Main application logger
export const logger = new Logger({
  level: LogLevel.INFO,
  enableConsole: true,
  enableRemote: false,
  appName: "Gnymble",
  appVersion: "1.0.0",
  environment: import.meta.env.MODE as "development" | "staging" | "production",
});

// Specialized loggers for different domains
export const authLogger = logger.withContext({ domain: "authentication" });
export const smsLogger = logger.withContext({ domain: "sms" });
export const apiLogger = logger.withContext({ domain: "api" });
export const dbLogger = logger.withContext({ domain: "database" });
export const chatbotLogger = logger.withContext({ domain: "chatbot" });

// =============================================================================
// LOGGING UTILITIES
// =============================================================================

export const logError = (
  message: string,
  error: unknown,
  context: Partial<LogContext> = {},
  data?: Record<string, unknown>
): void => {
  logger.error(message, error, context, data);
};

export const logInfo = (
  message: string,
  context: Partial<LogContext> = {},
  data?: Record<string, unknown>
): void => {
  logger.info(message, context, data);
};

export const logWarning = (
  message: string,
  context: Partial<LogContext> = {},
  data?: Record<string, unknown>
): void => {
  logger.warn(message, context, data);
};

export const logDebug = (
  message: string,
  context: Partial<LogContext> = {},
  data?: Record<string, unknown>
): void => {
  logger.debug(message, context, data);
};

// =============================================================================
// PERFORMANCE LOGGING
// =============================================================================

export const logPerformance = (
  operation: string,
  duration: number,
  context: Partial<LogContext> = {},
  data?: Record<string, unknown>
): void => {
  const level = duration > 1000 ? LogLevel.WARN : LogLevel.INFO;
  const message = `${operation} completed in ${duration}ms`;

  if (level === LogLevel.WARN) {
    logger.warn(message, { ...context, duration }, data);
  } else {
    logger.info(message, { ...context, duration }, data);
  }
};

export const createPerformanceLogger = (operation: string) => {
  const startTime = performance.now();

  return {
    finish: (
      context: Partial<LogContext> = {},
      data?: Record<string, unknown>
    ) => {
      const duration = performance.now() - startTime;
      logPerformance(operation, duration, context, data);
    },
  };
};
