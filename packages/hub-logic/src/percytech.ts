export const PERCYTECH_FEATURES = {
  SUPER_ADMIN: 'super_admin',
  ANALYTICS: 'analytics',
  SUPPORT_TEXTING: 'support_texting',
  HUB_MANAGEMENT: 'hub_management',
  USER_ADMINISTRATION: 'user_administration'
} as const

export const PERCYTECH_ADMIN_ROLES = [
  'Platform Administrator',
  'Customer Success Manager',
  'Technical Support',
  'Sales Manager',
  'System Administrator'
] as const

export const getPercyTechCapabilities = () => {
  return {
    crossHubAnalytics: true,
    userManagement: true,
    supportTexting: true,
    hubConfiguration: true,
    auditLogging: true,
    systemMonitoring: true
  }
}

export const getPercyTechDashboardMetrics = () => {
  return {
    hubMetrics: [
      'Total Users',
      'Active Companies',
      'Monthly Revenue',
      'Support Tickets',
      'System Health'
    ],
    smsMetrics: [
      'Messages Sent (All Hubs)',
      'Delivery Rate',
      'Compliance Score',
      'Campaign Performance',
      'Phone Number Utilization'
    ],
    businessMetrics: [
      'New Signups',
      'Conversion Rate',
      'Customer Lifetime Value',
      'Churn Rate',
      'Revenue Growth'
    ]
  }
}

export const validatePercyTechAccess = (userRole: string, requiredPermission: string) => {
  const roleHierarchy = {
    'SUPERADMIN': 100,
    'OWNER': 80,
    'ADMIN': 60,
    'SUPPORT': 40,
    'VIEWER': 20,
    'MEMBER': 10
  }

  const permissionLevels = {
    'view_analytics': 20,
    'manage_users': 60,
    'manage_hubs': 80,
    'system_admin': 100,
    'support_access': 40
  }

  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0
  const requiredLevel = permissionLevels[requiredPermission as keyof typeof permissionLevels] || 100

  return userLevel >= requiredLevel
}