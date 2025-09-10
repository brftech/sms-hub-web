// Admin Environment Configuration for Unified App
export const adminEnvironment = {
  isDevelopment: () => true, // Always true for now
  isProduction: () => false, // Always false for now
  isStaging: () => false, // Always false for now
  
  getCurrent: () => {
    return 'development'
  },
  
  features: {
    hubSwitcher: () => true,
    debugMode: () => true,
    analytics: () => true,
    errorReporting: () => true,
  }
}

export type AdminEnvironment = typeof adminEnvironment
