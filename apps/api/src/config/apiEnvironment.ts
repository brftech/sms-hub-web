// API App Environment Configuration
export const apiEnvironment = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  isStaging: import.meta.env.MODE === 'staging',
  
  getCurrent: () => {
    if (import.meta.env.PROD) return 'production'
    if (import.meta.env.MODE === 'staging') return 'staging'
    return 'development'
  },
  
  features: {
    superadminManagement: true,
    userManagement: true,
    systemSettings: true,
    auditLogs: true,
    apiDocumentation: true,
  }
}

export type ApiEnvironment = typeof apiEnvironment
