import { getEnvironmentConfig } from "../config/environment";

/**
 * Centralized checkout/signup redirect handler
 * In production: Redirects to contact form (signup process not ready yet)
 * In dev: Opens signup page in new tab for testing
 */
export const handleDirectCheckout = () => {
  try {
    const envConfig = getEnvironmentConfig();

    if (envConfig.isProduction) {
      // In production, redirect to contact form (same window)
      window.location.href = "/contact";
    } else {
      // In dev, open signup page in new tab for testing
      window.open("http://localhost:3001/signup", "_blank");
    }
  } catch (error) {
    console.error("Signup redirect error:", error);
    alert("Failed to redirect. Please try again.");
  }
};

/**
 * Centralized login redirect handler
 * Opens the appropriate login URL in a new tab based on environment
 */
export const handleDirectLogin = () => {
  try {
    const envConfig = getEnvironmentConfig();
    const loginUrl = envConfig.isProduction
      ? "https://app.gnymble.com"
      : "http://localhost:3001/login";

    window.open(loginUrl, "_blank");
  } catch (error) {
    console.error("Login redirect error:", error);
    alert("Failed to redirect to login. Please try again.");
  }
};
