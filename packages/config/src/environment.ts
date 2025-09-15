/**
 * Comprehensive environment configuration for SMS Hub monorepo
 * Handles development (local), staging (preview), and production environments
 */

export type Environment = 'development' | 'staging' | 'production';

export interface EnvironmentConfig {
  // Core environment properties
  name: Environment;
  isDevelopment: boolean;
  isStaging: boolean;
  isProduction: boolean;

  // URLs
  webAppUrl: string;
  unifiedAppUrl: string;
  apiUrl: string;
  supabaseUrl: string;

  // Feature flags
  features: {
    debugMode: boolean;
    devAuth: boolean;
    emailConfirmation: boolean;
    analytics: boolean;
    errorReporting: boolean;
    hubSwitcher: boolean;
  };

  // Security
  security: {
    requireHttps: boolean;
    csrfProtection: boolean;
    rateLimiting: boolean;
  };
}

/**
 * Detect current environment based on various signals
 */
export function detectEnvironment(): Environment {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isVercel = hostname.includes('.vercel.app');
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    const isProduction = hostname.includes('sms-hub') || hostname.includes('gnymble') || hostname.includes('percymd');

    if (isLocalhost) return 'development';
    if (isVercel && !isProduction) return 'staging';
    if (isProduction) return 'production';
  }

  // Check Node.js environment variables
  const nodeEnv = process.env.NODE_ENV || process.env.VERCEL_ENV;

  switch (nodeEnv) {
    case 'production':
      return 'production';
    case 'preview':
    case 'staging':
      return 'staging';
    case 'development':
    case 'test':
    default:
      return 'development';
  }
}

/**
 * Get environment-specific configuration
 */
export function getEnvironmentConfig(env?: Environment): EnvironmentConfig {
  const environment = env || detectEnvironment();

  const configs: Record<Environment, EnvironmentConfig> = {
    development: {
      name: 'development',
      isDevelopment: true,
      isStaging: false,
      isProduction: false,

      webAppUrl: process.env.VITE_WEB_APP_URL || 'http://localhost:3000',
      unifiedAppUrl: process.env.VITE_UNIFIED_APP_URL || 'http://localhost:3001',
      apiUrl: process.env.VITE_API_URL || 'http://localhost:3002',
      supabaseUrl: process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '',

      features: {
        debugMode: true,
        devAuth: true,
        emailConfirmation: false, // Skip email confirmation in dev
        analytics: false,
        errorReporting: false,
        hubSwitcher: true,
      },

      security: {
        requireHttps: false,
        csrfProtection: false,
        rateLimiting: false,
      },
    },

    staging: {
      name: 'staging',
      isDevelopment: false,
      isStaging: true,
      isProduction: false,

      webAppUrl: process.env.VITE_WEB_APP_URL || 'https://sms-hub-staging.vercel.app',
      unifiedAppUrl: process.env.VITE_UNIFIED_APP_URL || 'https://sms-hub-unified-staging.vercel.app',
      apiUrl: process.env.VITE_API_URL || 'https://api-staging.sms-hub.com',
      supabaseUrl: process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '',

      features: {
        debugMode: true,
        devAuth: true, // Allow dev auth in staging for testing
        emailConfirmation: true,
        analytics: false,
        errorReporting: true,
        hubSwitcher: true,
      },

      security: {
        requireHttps: true,
        csrfProtection: true,
        rateLimiting: true,
      },
    },

    production: {
      name: 'production',
      isDevelopment: false,
      isStaging: false,
      isProduction: true,

      webAppUrl: process.env.VITE_WEB_APP_URL || 'https://gnymble.com',
      unifiedAppUrl: process.env.VITE_UNIFIED_APP_URL || 'https://unified.gnymble.com',
      apiUrl: process.env.VITE_API_URL || 'https://api.gnymble.com',
      supabaseUrl: process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '',

      features: {
        debugMode: false,
        devAuth: false, // Never allow dev auth in production
        emailConfirmation: true,
        analytics: true,
        errorReporting: true,
        hubSwitcher: false,
      },

      security: {
        requireHttps: true,
        csrfProtection: true,
        rateLimiting: true,
      },
    },
  };

  return configs[environment];
}

/**
 * Singleton instance of environment configuration
 */
export const environmentConfig = getEnvironmentConfig();

/**
 * Helper functions for environment checks
 */
export const isDevelopment = () => environmentConfig.isDevelopment;
export const isStaging = () => environmentConfig.isStaging;
export const isProduction = () => environmentConfig.isProduction;
export const getCurrentEnvironment = () => environmentConfig.name;