import { EnvironmentAdapter } from "@sms-hub/ui/marketing";

// Web app environment configuration that implements the shared EnvironmentAdapter interface
export const webEnvironment: EnvironmentAdapter = {
  // Development environment detection
  isDevelopment: () => {
    return (
      import.meta.env.DEV || // Vite dev mode
      import.meta.env.MODE === "development" || // Development mode
      window.location.hostname === "localhost" || // Localhost
      window.location.hostname === "127.0.0.1" || // Local IP
      window.location.hostname.includes(".local") || // Local domains
      window.location.hostname.includes("localhost") || // Localhost variants
      window.location.port !== "" // Has port (usually dev server)
    );
  },

  // Production environment detection
  isProduction: () => {
    return (
      import.meta.env.PROD || // Vite production mode
      import.meta.env.MODE === "production" || // Production mode
      (window.location.hostname !== "localhost" && // Not localhost
        window.location.hostname !== "127.0.0.1" && // Not local IP
        !window.location.hostname.includes(".local") && // Not local domains
        !window.location.hostname.includes("localhost") && // Not localhost variants
        window.location.port === "") // No port (standard ports)
    );
  },

  // Staging environment detection (if needed)
  isStaging: () => {
    return (
      window.location.hostname.includes("staging") ||
      window.location.hostname.includes("preview") ||
      window.location.hostname.includes("dev.") ||
      window.location.hostname.includes("test.") ||
      window.location.hostname.includes("vercel.app") || // Vercel preview URLs
      window.location.hostname.includes("netlify.app") || // Netlify preview URLs
      window.location.hostname.includes("github.io") // GitHub Pages
    );
  },

  // Get current environment name
  getCurrent: () => {
    if (webEnvironment.isDevelopment()) return "development";
    if (webEnvironment.isStaging()) return "staging";
    if (webEnvironment.isProduction()) return "production";
    return "unknown";
  },

  // Feature flags based on environment
  features: {
    hubSwitcher: () => webEnvironment.isDevelopment() || webEnvironment.isStaging(),
    debugMode: () => webEnvironment.isDevelopment() || webEnvironment.isStaging(),
    analytics: () => webEnvironment.isProduction(),
    errorReporting: () => webEnvironment.isProduction(),
  },
};