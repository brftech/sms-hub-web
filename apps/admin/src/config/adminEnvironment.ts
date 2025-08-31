import { EnvironmentAdapter } from '@sms-hub/ui'

export const adminEnvironment: EnvironmentAdapter = {
  isDevelopment: () => 
    import.meta.env.DEV || 
    import.meta.env.MODE === "development" ||
    window.location.hostname === "localhost",
  
  isProduction: () => 
    import.meta.env.PROD || 
    import.meta.env.MODE === "production" ||
    window.location.hostname.includes("admin"),
  
  isStaging: () => 
    import.meta.env.MODE === "staging" ||
    window.location.hostname.includes("staging"),
  
  getCurrent: () => import.meta.env.MODE || "development",
  
  features: {
    hubSwitcher: () => true, // Always show hub switcher in admin
    debugMode: () => import.meta.env.DEV,
    analytics: () => !import.meta.env.DEV,
    errorReporting: () => !import.meta.env.DEV,
  },
}