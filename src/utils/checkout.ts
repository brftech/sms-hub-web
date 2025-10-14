import { getEnvironmentConfig, detectHubFromHostname } from "../config/environment";
import { getHubDomain } from "@sms-hub/hub-logic";

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
 * Get the login URL for the current hub
 * Production: app.{hub}.com (or app2.percytext.com for PercyText)
 * Dev: localhost:3001/login
 */
const getLoginUrl = (): string => {
  const envConfig = getEnvironmentConfig();

  if (!envConfig.isProduction) {
    return "http://localhost:3001/login";
  }

  // Detect current hub from hostname
  const currentHub = detectHubFromHostname();
  const hubDomain = getHubDomain(currentHub);

  // PercyText uses app2 subdomain, all others use app subdomain
  const appSubdomain = currentHub === "percytext" ? "app2" : "app";

  return `https://${appSubdomain}.${hubDomain}`;
};

/**
 * Centralized login redirect handler
 * Opens the appropriate login URL in a new tab based on environment and current hub
 */
export const handleDirectLogin = () => {
  try {
    const loginUrl = getLoginUrl();
    window.open(loginUrl, "_blank");
  } catch (error) {
    console.error("Login redirect error:", error);
    alert("Failed to redirect to login. Please try again.");
  }
};
