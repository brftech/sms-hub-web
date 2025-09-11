// Secure logging utility that sanitizes sensitive information

const SENSITIVE_KEYS = [
  'password',
  'token',
  'access_token',
  'refresh_token',
  'api_key',
  'secret',
  'session',
  'auth',
  'authorization',
  'cookie',
  'credit_card',
  'ssn',
  'private_key',
  'service_role_key',
  'anon_key',
];

const PARTIALLY_SENSITIVE_KEYS = [
  'email',
  'phone',
  'mobile_phone_number',
  'user_id',
  'id',
  'customer_id',
  'company_id',
];

/**
 * Recursively sanitize an object, removing or masking sensitive values
 */
function sanitizeObject(obj: any, depth = 0): any {
  if (depth > 10) return '[Max depth exceeded]'; // Prevent infinite recursion
  
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, depth + 1));
  }
  
  const sanitized: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    
    // Completely hide sensitive keys
    if (SENSITIVE_KEYS.some(sensitive => lowerKey.includes(sensitive))) {
      sanitized[key] = '[REDACTED]';
    }
    // Partially mask semi-sensitive keys
    else if (PARTIALLY_SENSITIVE_KEYS.some(sensitive => lowerKey === sensitive)) {
      if (typeof value === 'string' && value.length > 4) {
        // Show first 2 and last 2 characters
        sanitized[key] = `${value.slice(0, 2)}***${value.slice(-2)}`;
      } else {
        sanitized[key] = '[MASKED]';
      }
    }
    // Recursively sanitize nested objects
    else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value, depth + 1);
    }
    // Keep non-sensitive values as-is
    else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Sanitize arguments before logging
 */
function sanitizeArgs(...args: any[]): any[] {
  return args.map(arg => {
    if (typeof arg === 'object' && arg !== null) {
      return sanitizeObject(arg);
    }
    return arg;
  });
}

/**
 * Secure logger that sanitizes sensitive data
 */
export const logger = {
  log: (...args: any[]) => {
    if (import.meta.env.MODE === 'development') {
      console.log(...sanitizeArgs(...args));
    }
  },
  
  error: (...args: any[]) => {
    // Always log errors, but sanitize them
    console.error(...sanitizeArgs(...args));
  },
  
  warn: (...args: any[]) => {
    console.warn(...sanitizeArgs(...args));
  },
  
  info: (...args: any[]) => {
    if (import.meta.env.MODE === 'development') {
      console.info(...sanitizeArgs(...args));
    }
  },
  
  debug: (...args: any[]) => {
    if (import.meta.env.MODE === 'development' && import.meta.env.VITE_DEBUG === 'true') {
      console.debug(...sanitizeArgs(...args));
    }
  },
  
  // Special method for auth-related logging
  auth: (message: string, data?: any) => {
    if (import.meta.env.MODE === 'development') {
      console.log(`[AUTH] ${message}`, data ? sanitizeObject(data) : '');
    }
  },
};