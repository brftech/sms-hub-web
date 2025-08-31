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
      appName: "SMS Hub",
      appVersion: "1.0.0",
      environment: "development",
      ...config,
    };

    // Set log level from environment (if available)
    if (typeof process !== "undefined" && process.env.LOG_LEVEL) {
      this.config.level = this.parseLogLevel(process.env.LOG_LEVEL);
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
    this.log(LogLevel.ERROR, message, context, error, data);
  }

  public critical(
    message: string,
    error?: unknown,
    context: Partial<LogContext> = {},
    data?: Record<string, unknown>
  ): void {
    this.log(LogLevel.CRITICAL, message, context, error, data);
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
    const newLogger = new Logger(this.config);
    newLogger.requestId = this.requestId;
    return newLogger;
  }

  // =============================================================================
  // PRIVATE METHODS
  // =============================================================================

  private log(
    level: LogLevel,
    message: string,
    context: Partial<LogContext> = {},
    error?: unknown,
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
        ...context,
        requestId: this.requestId,
      },
      data,
    };

    if (error) {
      if (isAppError(error)) {
        logEntry.error = error;
      } else {
        logEntry.error = {
          name: "UnknownError",
          message: error instanceof Error ? error.message : String(error),
          code: ErrorCode.UNKNOWN_ERROR,
          severity: ErrorSeverity.MEDIUM,
          context: {},
          isOperational: true,
          retryable: false,
          timestamp: new Date(),
        } as AppError;
      }
    }

    if (this.config.enableConsole) {
      this.logToConsole(logEntry);
    }

    if (this.config.enableRemote) {
      this.logToRemote(logEntry);
    }
  }

  private logToConsole(entry: LogEntry): void {
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    const level = LogLevel[entry.level];
    const prefix = `[${timestamp}] [${level}]`;

    const contextStr =
      Object.keys(entry.context).length > 0
        ? ` ${JSON.stringify(entry.context)}`
        : "";

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(
          `${prefix} ${entry.message}${contextStr}`,
          entry.data || ""
        );
        break;
      case LogLevel.INFO:
        console.info(
          `${prefix} ${entry.message}${contextStr}`,
          entry.data || ""
        );
        break;
      case LogLevel.WARN:
        console.warn(
          `${prefix} ${entry.message}${contextStr}`,
          entry.data || ""
        );
        break;
      case LogLevel.ERROR:
        console.error(
          `${prefix} ${entry.message}${contextStr}`,
          entry.error || "",
          entry.data || ""
        );
        break;
      case LogLevel.CRITICAL:
        console.error(
          `${prefix} ${entry.message}${contextStr}`,
          entry.error || "",
          entry.data || ""
        );
        break;
    }
  }

  private logToRemote(entry: LogEntry): void {
    // Implementation for remote logging (e.g., to a logging service)
    // This would typically send logs to a service like DataDog, LogRocket, etc.
    if (this.config.remoteEndpoint) {
      fetch(this.config.remoteEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      }).catch(() => {
        // Silently fail if remote logging fails
      });
    }
  }

  private parseLogLevel(level: string): LogLevel {
    const upperLevel = level.toUpperCase();
    switch (upperLevel) {
      case "DEBUG":
        return LogLevel.DEBUG;
      case "INFO":
        return LogLevel.INFO;
      case "WARN":
      case "WARNING":
        return LogLevel.WARN;
      case "ERROR":
        return LogLevel.ERROR;
      case "CRITICAL":
      case "FATAL":
        return LogLevel.CRITICAL;
      default:
        return LogLevel.INFO;
    }
  }
}

// =============================================================================
// LOGGER INSTANCES
// =============================================================================

export const logger = new Logger();
export const apiLogger = new Logger({ appName: "SMS Hub API" });

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

export const logInfo = (
  message: string,
  context: Partial<LogContext> = {},
  data?: Record<string, unknown>
): void => {
  logger.info(message, context, data);
};

export const logError = (
  message: string,
  error?: unknown,
  context: Partial<LogContext> = {},
  data?: Record<string, unknown>
): void => {
  logger.error(message, error, context, data);
};

export const logWarn = (
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

export const createPerformanceLogger = (requestId: string) => {
  const startTime = Date.now();
  const perfLogger = new Logger({ appName: "SMS Hub Performance" });
  perfLogger.setRequestId(requestId);

  return {
    start: (operation: string) => {
      perfLogger.info(`Starting operation: ${operation}`, { operation });
    },
    end: (operation: string, success: boolean = true) => {
      const duration = Date.now() - startTime;
      perfLogger.info(`Completed operation: ${operation}`, {
        operation,
        duration,
        success,
      });
    },
    error: (operation: string, error: unknown) => {
      const duration = Date.now() - startTime;
      perfLogger.error(`Operation failed: ${operation}`, error, {
        operation,
        duration,
      });
    },
  };
};
