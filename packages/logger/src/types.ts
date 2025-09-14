export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  userId?: string;
  companyId?: string;
  hubId?: number;
  sessionId?: string;
  requestId?: string;
  [key: string]: any;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  error?: Error;
  data?: any;
}

export interface Logger {
  debug(message: string, data?: any): void;
  info(message: string, data?: any): void;
  warn(message: string, data?: any): void;
  error(message: string, error?: Error | any, data?: any): void;
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