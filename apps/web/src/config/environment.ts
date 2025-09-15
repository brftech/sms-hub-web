/**
 * Environment configuration for the Web app
 * Handles dev/staging/production environment detection and configuration
 */

export type Environment = "development" | "staging" | "production";

/**
 * Detect hub from current hostname
 */
function detectHub(): string {
  if (typeof window === "undefined") return "gnymble";

  const hostname = window.location.hostname.toLowerCase();

  if (hostname.includes("percytech")) return "percytech";
  if (hostname.includes("percymd")) return "percymd";
  if (hostname.includes("percytext")) return "percytext";

  return "gnymble"; // Default
}

/**
 * Get unified app URL based on current hub and environment
 */
function getUnifiedUrl(env: Environment, hub: string): string {
  // Allow environment variable override
  if (import.meta.env.VITE_UNIFIED_APP_URL) {
    return import.meta.env.VITE_UNIFIED_APP_URL;
  }

  // Development - always localhost
  if (env === "development") {
    return "http://localhost:3001";
  }

  // Production URLs - temporarily redirect all to app.gnymble.com
  if (env === "production") {
    return "https://app.gnymble.com";
  }

  // Staging URLs
  if (env === "staging") {
    switch (hub) {
      case "percytech":
        return "https://unified-staging.percytech.com";
      case "percymd":
        return "https://unified-staging.percymd.com";
      case "percytext":
        return "https://unified-staging.percytext.com";
      default:
        return "https://unified-staging.gnymble.com";
    }
  }

  // Fallback
  return "https://app.gnymble.com";
}

interface EnvironmentConfig {
  name: Environment;
  isDevelopment: boolean;
  isStaging: boolean;
  isProduction: boolean;

  // URLs
  webAppUrl: string;
  unifiedAppUrl: string;
  supabaseUrl: string;

  // Features
  skipEmailConfirmation: boolean;
  enableDevAuth: boolean;
  enableDebugMode: boolean;

  // Dev auth token (only in dev)
  devAuthToken?: string;
}

/**
 * Detect current environment
 */
function detectEnvironment(): Environment {
  // Check Vite environment mode first
  if (import.meta.env.MODE === "production") return "production";
  if (import.meta.env.MODE === "staging") return "staging";
  if (import.meta.env.MODE === "development") return "development";

  // Check hostname as fallback
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    // Production domains
    if (
      hostname.includes("gnymble.com") ||
      hostname.includes("percymd.com") ||
      hostname.includes("percytext.com")
    ) {
      return "production";
    }

    // Staging/preview domains
    if (
      hostname.includes(".vercel.app") ||
      hostname.includes("staging") ||
      hostname.includes("preview")
    ) {
      return "staging";
    }

    // Local development
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.includes(".local")
    ) {
      return "development";
    }
  }

  // Default to development for safety
  return "development";
}

/**
 * Get environment configuration
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const env = detectEnvironment();
  const hub = detectHub();

  const baseConfig = {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || "",
  };

  switch (env) {
    case "production":
      return {
        ...baseConfig,
        name: "production",
        isDevelopment: false,
        isStaging: false,
        isProduction: true,
        webAppUrl: import.meta.env.VITE_WEB_APP_URL || window.location.origin,
        unifiedAppUrl: getUnifiedUrl(env, hub),
        skipEmailConfirmation: false,
        enableDevAuth: false,
        enableDebugMode: false,
      };

    case "staging":
      return {
        ...baseConfig,
        name: "staging",
        isDevelopment: false,
        isStaging: true,
        isProduction: false,
        webAppUrl: import.meta.env.VITE_WEB_APP_URL || window.location.origin,
        unifiedAppUrl: getUnifiedUrl(env, hub),
        skipEmailConfirmation: false,
        enableDevAuth: true, // Allow dev auth in staging for testing
        enableDebugMode: true,
        devAuthToken: import.meta.env.VITE_DEV_AUTH_TOKEN,
      };

    case "development":
    default:
      return {
        ...baseConfig,
        name: "development",
        isDevelopment: true,
        isStaging: false,
        isProduction: false,
        webAppUrl: import.meta.env.VITE_WEB_APP_URL || "http://localhost:3000",
        unifiedAppUrl: getUnifiedUrl(env, hub),
        skipEmailConfirmation:
          import.meta.env.VITE_SKIP_EMAIL_CONFIRMATION === "true",
        enableDevAuth: true,
        enableDebugMode: true,
        devAuthToken: import.meta.env.VITE_DEV_AUTH_TOKEN || "dev123",
      };
  }
}

// Export singleton instance
export const environmentConfig = getEnvironmentConfig();

// Export helper functions
export const isDevelopment = () => environmentConfig.isDevelopment;
export const isStaging = () => environmentConfig.isStaging;
export const isProduction = () => environmentConfig.isProduction;
export const getEnvironment = () => environmentConfig.name;

// Debug logging (only in dev/staging)
if (environmentConfig.enableDebugMode) {
  console.log("🌍 Environment Configuration:", {
    environment: environmentConfig.name,
    urls: {
      web: environmentConfig.webAppUrl,
      unified: environmentConfig.unifiedAppUrl,
      supabase: environmentConfig.supabaseUrl,
    },
    features: {
      skipEmail: environmentConfig.skipEmailConfirmation,
      devAuth: environmentConfig.enableDevAuth,
      debug: environmentConfig.enableDebugMode,
    },
  });
}
