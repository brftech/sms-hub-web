# @sms-hub/logger

Centralized logging utilities for the SMS Hub platform, providing consistent logging across all applications with support for different log levels, contextual information, and optional Sentry integration.

## Features

- **Structured Logging**: Consistent log format with timestamps, levels, and context
- **Log Levels**: Support for debug, info, warn, and error levels
- **Contextual Logging**: Attach user, company, hub, and request context to logs
- **Sentry Integration**: Optional automatic error reporting to Sentry
- **TypeScript Support**: Full type safety for all logging operations
- **Environment Aware**: Different defaults for development vs production

## Installation

```bash
pnpm add @sms-hub/logger
```

## Basic Usage

```typescript
import { logger } from '@sms-hub/logger';

// Simple logging
logger.info('User logged in');
logger.warn('API rate limit approaching');
logger.error('Failed to send SMS', new Error('Network timeout'));

// With additional data
logger.info('Order processed', { orderId: '123', amount: 99.99 });

// With context
const userLogger = logger.withContext({
  userId: 'user123',
  companyId: 'company456',
  hubId: 1
});

userLogger.info('SMS campaign created');
```

## Configuration

Create a custom logger with specific configuration:

```typescript
import { createLogger } from '@sms-hub/logger';

const customLogger = createLogger({
  level: 'warn',              // Minimum log level
  enableConsole: true,        // Log to console
  enableSentry: true,         // Send errors to Sentry
  sentryDsn: 'your-dsn',      // Sentry DSN
  environment: 'production',   // Environment name
  context: {                  // Default context
    service: 'sms-api'
  }
});
```

## Environment Variables

The default logger respects these environment variables:

- `NODE_ENV`: Sets default log level (debug for development, info for production)
- `VITE_SENTRY_DSN` or `SENTRY_DSN`: Sentry DSN for error reporting

## Log Levels

From lowest to highest priority:
- `debug`: Detailed information for debugging
- `info`: General informational messages
- `warn`: Warning messages for potentially harmful situations
- `error`: Error messages for failures

## Context

Add persistent context to all logs:

```typescript
// Create a logger for a specific user session
const sessionLogger = logger.withContext({
  userId: user.id,
  sessionId: session.id,
  hubId: currentHub.id
});

// All logs from this logger will include the context
sessionLogger.info('Navigated to dashboard');
sessionLogger.error('Failed to load contacts', error);
```

## Best Practices

1. **Use appropriate log levels**:
   - `debug`: Development details, not needed in production
   - `info`: Important business events (login, purchase, etc.)
   - `warn`: Recoverable issues that should be investigated
   - `error`: Failures that need immediate attention

2. **Add context early**:
   ```typescript
   // In your auth hook or session initialization
   const logger = globalLogger.withContext({
     userId: user.id,
     companyId: user.companyId,
     hubId: user.hubId
   });
   ```

3. **Include relevant data**:
   ```typescript
   logger.info('SMS sent successfully', {
     recipientCount: 150,
     campaignId: 'camp123',
     duration: 2500
   });
   ```

4. **Handle errors properly**:
   ```typescript
   try {
     await sendSMS(message);
   } catch (error) {
     logger.error('Failed to send SMS', error, {
       messageId: message.id,
       retryCount: attempts
     });
   }
   ```

## Migration Guide

Replace console statements:

```typescript
// Before
console.log('User logged in', userId);
console.error('Failed to save', error);

// After
logger.info('User logged in', { userId });
logger.error('Failed to save', error);
```

## TypeScript Types

```typescript
interface LogContext {
  userId?: string;
  companyId?: string;
  hubId?: number;
  sessionId?: string;
  requestId?: string;
  [key: string]: any;
}

interface Logger {
  debug(message: string, data?: any): void;
  info(message: string, data?: any): void;
  warn(message: string, data?: any): void;
  error(message: string, error?: Error | any, data?: any): void;
  withContext(context: LogContext): Logger;
  setLevel(level: LogLevel): void;
}
```