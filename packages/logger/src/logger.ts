import type {
  LogLevel,
  LogContext,
  Logger,
  LoggerConfig,
  LogEntry,
} from "./types";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class LoggerImpl implements Logger {
  private level: LogLevel;
  private enableConsole: boolean;
  private enableSentry: boolean;
  private context: LogContext;
  private sentryLoaded: boolean = false;

  constructor(private config: LoggerConfig = {}) {
    this.level = config.level || "info";
    this.enableConsole = config.enableConsole ?? true;
    this.enableSentry = config.enableSentry ?? false;
    this.context = config.context || {};

    if (this.enableSentry && config.sentryDsn) {
      this.initializeSentry(config.sentryDsn, config.environment);
    }
  }

  private async initializeSentry(dsn: string, environment?: string) {
    try {
      const Sentry = await import("@sentry/react");
      Sentry.init({
        dsn,
        environment: environment || "development",
        integrations: [
          Sentry.replayIntegration({
            maskAllText: false,
            blockAllMedia: false,
          }),
        ],
        tracesSampleRate: environment === "production" ? 0.1 : 1.0,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
      });
      this.sentryLoaded = true;
    } catch (error) {
      console.error("Failed to initialize Sentry:", error);
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.level];
  }

  private formatMessage(entry: LogEntry): string {
    const { timestamp, level, message, context } = entry;
    const contextStr =
      Object.keys(context || {}).length > 0
        ? ` ${JSON.stringify(context)}`
        : "";
    return `[${timestamp}] [${level.toUpperCase()}]${contextStr} ${message}`;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    error?: Error,
    data?: any
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: this.context,
      error,
      data,
    };
  }

  private async logToSentry(entry: LogEntry) {
    if (!this.enableSentry || !this.sentryLoaded) return;

    try {
      const Sentry = await import("@sentry/react");

      Sentry.withScope((scope) => {
        // Set context
        if (entry.context) {
          scope.setContext("custom", entry.context);
          if (entry.context.userId) {
            scope.setUser({ id: entry.context.userId });
          }
        }

        // Set extra data
        if (entry.data) {
          scope.setExtras(entry.data);
        }

        // Log based on level
        switch (entry.level) {
          case "error":
            if (entry.error) {
              Sentry.captureException(entry.error, {
                contexts: {
                  message: { message: entry.message },
                },
              });
            } else {
              Sentry.captureMessage(entry.message, "error");
            }
            break;
          case "warn":
            Sentry.captureMessage(entry.message, "warning");
            break;
          case "info":
            Sentry.captureMessage(entry.message, "info");
            break;
          case "debug":
            Sentry.captureMessage(entry.message, "debug");
            break;
        }
      });
    } catch (error) {
      console.error("Failed to log to Sentry:", error);
    }
  }

  private log(entry: LogEntry) {
    if (!this.shouldLog(entry.level)) return;

    // Console logging
    if (this.enableConsole) {
      const formattedMessage = this.formatMessage(entry);
      const consoleMethod =
        entry.level === "error"
          ? "error"
          : entry.level === "warn"
            ? "warn"
            : entry.level === "debug"
              ? "debug"
              : "log";

      if (entry.error) {
        console[consoleMethod](formattedMessage, entry.error);
      } else if (entry.data) {
        console[consoleMethod](formattedMessage, entry.data);
      } else {
        console[consoleMethod](formattedMessage);
      }
    }

    // Sentry logging
    this.logToSentry(entry);
  }

  debug(message: string, data?: any): void {
    this.log(this.createLogEntry("debug", message, undefined, data));
  }

  info(message: string, data?: any): void {
    this.log(this.createLogEntry("info", message, undefined, data));
  }

  warn(message: string, data?: any): void {
    this.log(this.createLogEntry("warn", message, undefined, data));
  }

  error(message: string, error?: Error | any, data?: any): void {
    // Handle cases where error might be a string or other type
    const errorObj =
      error instanceof Error
        ? error
        : error
          ? new Error(String(error))
          : undefined;
    this.log(this.createLogEntry("error", message, errorObj, data));
  }

  withContext(context: LogContext): Logger {
    return new LoggerImpl({
      ...this.config,
      context: { ...this.context, ...context },
    });
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }
}

// Create default logger instance
const defaultConfig: LoggerConfig = {
  level: (typeof import.meta !== 'undefined' && import.meta.env?.MODE === "production") ? "info" : "debug",
  enableConsole: true,
  enableSentry: (typeof import.meta !== 'undefined' && import.meta.env?.MODE === "production"),
  sentryDsn: ((typeof import.meta !== 'undefined' && import.meta.env?.VITE_SENTRY_DSN) || 
             (typeof process !== 'undefined' && process.env?.SENTRY_DSN)) as string | undefined,
  environment: (typeof import.meta !== 'undefined' && import.meta.env?.MODE) || 
               (typeof process !== 'undefined' && process.env?.NODE_ENV) || 
               'development',
};

export const logger = new LoggerImpl(defaultConfig);

// Export factory function for creating custom loggers
export const createLogger = (config: LoggerConfig): Logger => {
  return new LoggerImpl(config);
};
