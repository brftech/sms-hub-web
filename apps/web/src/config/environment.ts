// Environment configuration
export const environment = {
  // Development environment detection
  isDevelopment: () => {
    return (
      import.meta.env.DEV || // Vite dev mode
      import.meta.env.MODE === "development" || // Development mode
      window.location.hostname === "localhost" || // Localhost
      window.location.hostname === "127.0.0.1" || // Local IP
      window.location.hostname.includes(".local") || // Local domains
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
        window.location.port === "") // No port (standard ports)
    );
  },

  // Staging environment detection (if needed)
  isStaging: () => {
    return (
      window.location.hostname.includes("staging") ||
      window.location.hostname.includes("preview") ||
      window.location.hostname.includes("dev.")
    );
  },

  // Get current environment name
  getCurrent: () => {
    if (environment.isDevelopment()) return "development";
    if (environment.isStaging()) return "staging";
    if (environment.isProduction()) return "production";
    return "unknown";
  },

  // Feature flags based on environment
  features: {
    hubSwitcher: () => environment.isDevelopment(),
    debugMode: () => environment.isDevelopment(),
    analytics: () => environment.isProduction(),
    errorReporting: () => environment.isProduction(),
  },
};
