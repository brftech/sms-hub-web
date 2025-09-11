// Authentication configuration
// This file should NEVER contain actual secrets - only configuration structure

export interface AuthConfig {
  dev: {
    enabled: boolean;
    // Dev auth token should come from environment variable, never hardcoded
    tokenKey: string;
  };
  security: {
    // Session timeout in milliseconds (default: 30 minutes)
    sessionTimeout: number;
    // Whether to clear auth on browser close
    clearOnClose: boolean;
    // Whether to require re-authentication on route change
    requireReauthOnRouteChange: boolean;
  };
}

// Get auth configuration from environment
export const getAuthConfig = (): AuthConfig => {
  // Check if we're in a development environment
  // For Vite apps, use import.meta.env
  // For Node.js apps, check if process is defined first
  const isDevelopment = 
    (typeof import.meta !== 'undefined' && import.meta.env?.MODE === 'development') || 
    (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development');

  // Get dev token from environment variable (never hardcode it)
  // Default to VITE_DEV_AUTH_TOKEN for the key name
  const devTokenEnvKey = 'VITE_DEV_AUTH_TOKEN';

  return {
    dev: {
      enabled: isDevelopment,
      tokenKey: devTokenEnvKey,
    },
    security: {
      sessionTimeout: 30 * 60 * 1000, // 30 minutes
      clearOnClose: true,
      requireReauthOnRouteChange: false,
    },
  };
};

// Validate that dev auth token is properly configured
export const validateDevAuthConfig = (): { valid: boolean; error?: string } => {
  const config = getAuthConfig();
  
  if (!config.dev.enabled) {
    return { valid: true }; // Dev auth is disabled, no validation needed
  }

  // Check if token key is configured
  if (!config.dev.tokenKey) {
    return { 
      valid: false, 
      error: 'Dev auth token key not configured. Set DEV_AUTH_TOKEN_KEY environment variable.' 
    };
  }

  // Get the actual token value from environment
  const tokenValue = 
    (typeof import.meta !== 'undefined' && import.meta.env?.[config.dev.tokenKey]) || 
    (typeof process !== 'undefined' && process.env?.[config.dev.tokenKey]);

  if (!tokenValue) {
    return { 
      valid: false, 
      error: `Dev auth token not found. Set ${config.dev.tokenKey} environment variable.` 
    };
  }

  // Ensure token is not the insecure default
  if (tokenValue === 'dev123' || tokenValue.length < 16) {
    return { 
      valid: false, 
      error: 'Dev auth token is insecure. Use a strong random token of at least 16 characters.' 
    };
  }

  return { valid: true };
};