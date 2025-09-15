export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Type for arbitrary log data
export type LogData = Record<string, unknown>;

export interface LogContext {
  userId?: string;
  companyId?: string;
  hubId?: number;
  sessionId?: string;
  requestId?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  error?: Error;
  data?: LogData;
}

export interface Logger {
  debug(message: string, data?: LogData): void;
  info(message: string, data?: LogData): void;
  warn(message: string, data?: LogData): void;
  error(message: string, error?: Error | unknown, data?: LogData): void;
  withContext(context: LogContext): Logger;
  setLevel(level: LogLevel): void;
}

export interface LoggerConfig {
  level?: LogLevel;
  enableConsole?: boolean;
  enableSentry?: boolean;
  sentryDsn?: string;
  environment?: string;
  context?: LogContext;
}