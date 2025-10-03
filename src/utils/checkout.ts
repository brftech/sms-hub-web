import { getEnvironmentConfig } from "../config/environment";

/**
 * Centralized checkout/signup redirect handler
 * Opens the appropriate signup URL in a new tab based on environment
 */
export const handleDirectCheckout = () => {
  try {
    const envConfig = getEnvironmentConfig();
    const signupUrl = envConfig.isProduction 
      ? "https://app.gnymble.com/signup"
      : "http://localhost:3001/signup";
    
    window.open(signupUrl, '_blank');
  } catch (error) {
    console.error("Signup redirect error:", error);
    alert("Failed to redirect to signup. Please try again.");
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
    
    window.open(loginUrl, '_blank');
  } catch (error) {
    console.error("Login redirect error:", error);
    alert("Failed to redirect to login. Please try again.");
  }
};
