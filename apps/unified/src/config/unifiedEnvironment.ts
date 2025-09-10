// Unified App Environment Configuration
export const unifiedEnvironment = {
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

export type UnifiedEnvironment = typeof unifiedEnvironment
