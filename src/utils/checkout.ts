import { getEnvironmentConfig } from "../config/environment";

/**
 * Centralized checkout/signup redirect handler
 * Redirects to the appropriate signup URL based on environment
 */
export const handleDirectCheckout = () => {
  try {
    const envConfig = getEnvironmentConfig();
    const signupUrl = envConfig.isProduction 
      ? "https://app.gnymble.com/signup"
      : "http://localhost:3001/signup";
    
    window.location.href = signupUrl;
  } catch (error) {
    console.error("Signup redirect error:", error);
    alert("Failed to redirect to signup. Please try again.");
  }
};
