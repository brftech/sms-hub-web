// Unified App Environment Configuration
// Use a stable object reference to prevent infinite loops in useDevAuth
const createUnifiedEnvironment = () => ({
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
})

// Create a single stable instance
export const unifiedEnvironment = createUnifiedEnvironment()

export type UnifiedEnvironment = typeof unifiedEnvironment
