import { UserRole, UserProfile, routePermissions, navigationItems, NavigationItem } from '../types/roles'

/**
 * Check if a user has a specific role
 */
export const hasRole = (user: UserProfile | null, role: UserRole): boolean => {
  if (!user) return false
  return user.role === role
}

/**
 * Check if a user has any of the specified roles
 */
export const hasAnyRole = (user: UserProfile | null, roles: UserRole[]): boolean => {
  if (!user) return false
  return roles.includes(user.role)
}

/**
 * Check if a user has a specific permission
 */
export const hasPermission = (user: UserProfile | null, permission: keyof UserProfile['permissions']): boolean => {
  if (!user || !user.permissions) return false
  return user.permissions[permission] === true
}

/**
 * Check if a user can access a specific route
 */
export const canAccessRoute = (user: UserProfile | null, path: string): boolean => {
  if (!user) return false
  
  const routePermission = routePermissions.find(rp => path.startsWith(rp.path))
  if (!routePermission) return false
  
  return routePermission.roles.includes(user.role)
}

/**
 * Get navigation items available to a user based on their role
 */
export const getAvailableNavigationItems = (user: UserProfile | null): NavigationItem[] => {
  if (!user) return []
  
  return navigationItems.filter(item => item.roles.includes(user.role))
}

/**
 * Get user's display name
 */
export const getUserDisplayName = (user: UserProfile | null): string => {
  if (!user) return 'Guest'
  return `${user.first_name} ${user.last_name}`.trim() || user.email
}

/**
 * Check if user is fully onboarded
 */
export const isUserOnboarded = (user: UserProfile | null): boolean => {
  if (!user) return false
  return (user.onboarding_completed ?? false) && (user.verification_setup_completed ?? false)
}

/**
 * Check if user can access texting features
 */
export const canAccessTexting = (user: UserProfile | null): boolean => {
  if (!user) return false
  return hasAnyRole(user, [UserRole.ONBOARDED, UserRole.ADMIN, UserRole.SUPERADMIN])
}

/**
 * Check if user can access admin features
 */
export const canAccessAdmin = (user: UserProfile | null): boolean => {
  if (!user) return false
  return hasAnyRole(user, [UserRole.ADMIN, UserRole.SUPERADMIN])
}

/**
 * Get user's role display name
 */
export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    [UserRole.GUEST]: 'Guest',
    [UserRole.USER]: 'User',
    [UserRole.ONBOARDED]: 'Onboarded User',
    [UserRole.ADMIN]: 'Administrator',
    [UserRole.SUPERADMIN]: 'Super Administrator'
  }
  return roleNames[role]
}

/**
 * Get user's role color for UI display
 */
export const getRoleColor = (role: UserRole): string => {
  const roleColors: Record<UserRole, string> = {
    [UserRole.GUEST]: 'gray',
    [UserRole.USER]: 'blue',
    [UserRole.ONBOARDED]: 'green',
    [UserRole.ADMIN]: 'orange',
    [UserRole.SUPERADMIN]: 'purple'
  }
  return roleColors[role]
}
