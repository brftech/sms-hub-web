/**
 * Environment configuration for the Web app
 * Handles dev/staging/production environment detection and configuration
 */

export type Environment = "development" | "staging" | "production";

// Hub detection is now handled by the hub context, not environment config

/**
 * Get admin dashboard URL (now part of this app)
 */
function getAdminUrl(): string {
  return "/admin";
}

interface EnvironmentConfig {
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
 * Get Supabase configuration based on environment
 */
function getSupabaseConfig(env: Environment) {
  // Allow environment variable override
  if (import.meta.env.VITE_SUPABASE_URL) {
    return {
      url: import.meta.env.VITE_SUPABASE_URL,
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
    };
  }

  // Environment-specific database configuration
  switch (env) {
    case "development":
      return {
        url: "https://hmumtnpnyxuplvqcmnfk.supabase.co",
        anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
      };
    case "production":
      return {
        url: "https://fwlivygerbqzowbzxesw.supabase.co",
        anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
      };
    case "staging":
      // Use dev database for staging
      return {
        url: "https://hmumtnpnyxuplvqcmnfk.supabase.co",
        anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
      };
    default:
      return {
        url: "https://hmumtnpnyxuplvqcmnfk.supabase.co",
        anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
      };
  }
}

/**
 * Get environment configuration
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const env = detectEnvironment();
  const supabaseConfig = getSupabaseConfig(env);

  const baseConfig = {
    supabaseUrl: supabaseConfig.url,
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
        adminUrl: getAdminUrl(),
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
        adminUrl: getAdminUrl(),
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
        adminUrl: getAdminUrl(),
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
      admin: environmentConfig.adminUrl,
      supabase: environmentConfig.supabaseUrl,
    },
    database: {
      project: environmentConfig.supabaseUrl.includes("hmumtnpnyxuplvqcmnfk")
        ? "web-dev"
        : "web-prod",
      environment: environmentConfig.name,
    },
    features: {
      skipEmail: environmentConfig.skipEmailConfirmation,
      devAuth: environmentConfig.enableDevAuth,
      debug: environmentConfig.enableDebugMode,
    },
  });
}
