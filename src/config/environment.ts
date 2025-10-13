/**
 * CONSOLIDATED Environment configuration for the Web app
 * Single source of truth for environment detection and configuration
 * Implements EnvironmentAdapter interface for UI package compatibility
 */

import { EnvironmentAdapter } from "@sms-hub/ui/marketing";

export type Environment = "development" | "staging" | "production";

/**
 * Detect current environment using multiple signals
 * Priority: Vite env vars > hostname detection > default
 */
function detectEnvironment(): Environment {
  // Check Vite environment mode first (most reliable)
  if (import.meta.env.PROD || import.meta.env.MODE === "production") {
    return "production";
  }

  if (import.meta.env.MODE === "staging") {
    return "staging";
  }

  if (import.meta.env.DEV || import.meta.env.MODE === "development") {
    return "development";
  }

  // Check hostname as fallback (for runtime detection)
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    // Local development indicators
    const isLocal =
      hostname === "localhost" || hostname === "127.0.0.1" || hostname.includes(".local");

    // Staging/preview indicators
    const isStaging =
      hostname.includes(".vercel.app") ||
      hostname.includes("staging") ||
      hostname.includes("preview") ||
      hostname.includes("dev.") ||
      hostname.includes("test.") ||
      hostname.includes("netlify.app") ||
      hostname.includes("github.io");

    // Production domains
    const isProduction =
      hostname.includes("gnymble.com") ||
      hostname.includes("percymd.com") ||
      hostname.includes("percytext.com") ||
      hostname.includes("percytech.com");

    if (isLocal) return "development";
    if (isStaging) return "staging";
    if (isProduction) return "production";
  }

  // Default to development for safety
  return "development";
}

/**
 * Get Supabase URL based on environment
 */
function getSupabaseUrl(env: Environment): string {
  // Allow environment variable override for all environments
  if (import.meta.env.VITE_SUPABASE_URL) {
    return import.meta.env.VITE_SUPABASE_URL;
  }

  // Environment-specific database configuration
  switch (env) {
    case "production":
      return "https://fwlivygerbqzowbzxesw.supabase.co"; // Production DB
    case "development":
    case "staging":
    default:
      return "https://hmumtnpnyxuplvqcmnfk.supabase.co"; // Dev DB
  }
}

/**
 * Get web app URL based on environment
 */
function getWebAppUrl(env: Environment): string {
  if (import.meta.env.VITE_WEB_APP_URL) {
    return import.meta.env.VITE_WEB_APP_URL;
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return env === "production"
    ? "https://gnymble.com" // Default production URL
    : "http://localhost:3000"; // Default dev URL
}

/**
 * Environment configuration interface
 */
export interface EnvironmentConfig {
  name: Environment;
  isDevelopment: boolean;
  isStaging: boolean;
  isProduction: boolean;

  // URLs
  webAppUrl: string;
  adminUrl: string;
  supabaseUrl: string;

  // Features
  skipEmailConfirmation: boolean;
  enableDevAuth: boolean;
  enableDebugMode: boolean;
  devAuthToken?: string;

  // Feature flags (from adapter)
  features: {
    hubSwitcher: boolean;
    debugMode: boolean;
    analytics: boolean;
    errorReporting: boolean;
  };
}

/**
 * Get complete environment configuration
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const env = detectEnvironment();
  const supabaseUrl = getSupabaseUrl(env);
  const webAppUrl = getWebAppUrl(env);

  const isDevelopment = env === "development";
  const isStaging = env === "staging";
  const isProduction = env === "production";

  return {
    name: env,
    isDevelopment,
    isStaging,
    isProduction,

    // URLs
    webAppUrl,
    adminUrl: "/admin",
    supabaseUrl,

    // Features
    skipEmailConfirmation: isDevelopment && import.meta.env.VITE_SKIP_EMAIL_CONFIRMATION === "true",
    enableDevAuth: !isProduction,
    enableDebugMode: !isProduction,
    devAuthToken: isProduction ? undefined : import.meta.env.VITE_DEV_AUTH_TOKEN || "dev123",

    // Feature flags
    features: {
      hubSwitcher: !isProduction,
      debugMode: !isProduction,
      analytics: isProduction,
      errorReporting: isProduction,
    },
  };
}

/**
 * Environment adapter implementation for UI package compatibility
 * This provides the interface expected by @sms-hub/ui/marketing
 */
export const webEnvironment: EnvironmentAdapter = {
  isDevelopment: () => {
    const env = detectEnvironment();
    return env === "development";
  },

  isProduction: () => {
    const env = detectEnvironment();
    return env === "production";
  },

  isStaging: () => {
    const env = detectEnvironment();
    return env === "staging";
  },

  getCurrent: () => {
    return detectEnvironment();
  },

  features: {
    hubSwitcher: () => detectEnvironment() !== "production",
    debugMode: () => detectEnvironment() !== "production",
    analytics: () => detectEnvironment() === "production",
    errorReporting: () => detectEnvironment() === "production",
  },
};

// Export singleton instance for convenience
export const environmentConfig = getEnvironmentConfig();

// Export helper functions for backward compatibility
export const isDevelopment = () => environmentConfig.isDevelopment;
export const isStaging = () => environmentConfig.isStaging;
export const isProduction = () => environmentConfig.isProduction;
export const getEnvironment = () => environmentConfig.name;
