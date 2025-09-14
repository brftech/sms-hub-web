import {
  UserRole,
  UserProfile,
  routePermissions,
  navigationItems,
  NavigationItem,
} from "../types/roles";

/**
 * Check if a user has a specific role
 */
export const hasRole = (user: UserProfile | null, role: UserRole): boolean => {
  if (!user) return false;
  return String(user.role).toLowerCase() === String(role).toLowerCase();
};

/**
 * Check if a user has any of the specified roles
 */
export const hasAnyRole = (
  user: UserProfile | null,
  roles: UserRole[] | string[]
): boolean => {
  if (!user) return false;
  
  // Debug: Check what we're comparing
  console.log('[hasAnyRole] Debug:', {
    userRole: user.role,
    userRoleType: typeof user.role,
    rolesChecking: roles,
    rolesTypes: roles.map(r => typeof r),
  });
  
  // Convert user role to uppercase string for comparison
  const userRoleUpper = String(user.role).toUpperCase();
  
  // Check if any of the provided roles match
  const result = roles.some((role) => {
    const roleUpper = String(role).toUpperCase();
    const matches = roleUpper === userRoleUpper;
    console.log(`[hasAnyRole] Comparing: "${roleUpper}" === "${userRoleUpper}" => ${matches}`);
    return matches;
  });
  
  return result;
};

/**
 * Check if a user has a specific permission
 */
export const hasPermission = (
  user: UserProfile | null,
  permission: keyof UserProfile["permissions"]
): boolean => {
  if (!user || !user.permissions) return false;
  return user.permissions[permission] === true;
};

/**
 * Check if a user can access a specific route
 */
export const canAccessRoute = (
  user: UserProfile | null,
  path: string
): boolean => {
  if (!user) {
    console.log("[canAccessRoute] No user provided");
    return false;
  }

  console.log("[canAccessRoute] Checking access for path:", path);
  console.log("[canAccessRoute] User role:", user.role);
  console.log("[canAccessRoute] User role type:", typeof user.role);

  const routePermission = routePermissions.find((rp) =>
    path.startsWith(rp.path)
  );
  console.log("[canAccessRoute] Found route permission:", routePermission);

  if (!routePermission) {
    console.log("[canAccessRoute] No route permission found for path:", path);
    return false;
  }

  console.log(
    "[canAccessRoute] Route permission roles:",
    routePermission.roles
  );
  console.log(
    "[canAccessRoute] User role in allowed roles?",
    routePermission.roles.includes(user.role)
  );

  // Check if there's a type mismatch - convert both to strings for comparison
  const userRoleString = String(user.role).toLowerCase();
  const allowedRolesStrings = routePermission.roles.map((role) =>
    String(role).toLowerCase()
  );
  const hasAccess = allowedRolesStrings.includes(userRoleString);

  console.log(
    "[canAccessRoute] User role as string (lowercase):",
    userRoleString
  );
  console.log(
    "[canAccessRoute] Allowed roles as strings (lowercase):",
    allowedRolesStrings
  );
  console.log(
    "[canAccessRoute] Has access after case-insensitive comparison?",
    hasAccess
  );

  return hasAccess;
};

/**
 * Get navigation items available to a user based on their role
 */
export const getAvailableNavigationItems = (
  user: UserProfile | null
): NavigationItem[] => {
  if (!user) return [];

  const userRoleLower = String(user.role).toLowerCase();
  return navigationItems.filter((item) =>
    item.roles.some((role) => String(role).toLowerCase() === userRoleLower)
  );
};

/**
 * Get user's display name
 */
export const getUserDisplayName = (user: UserProfile | null): string => {
  if (!user) return "Guest";
  return `${user.first_name} ${user.last_name}`.trim() || user.email;
};

/**
 * Check if user is fully onboarded
 */
export const isUserOnboarded = (user: UserProfile | null): boolean => {
  if (!user) return false;
  return (
    (user.onboarding_completed ?? false) &&
    (user.verification_setup_completed ?? false)
  );
};

/**
 * Check if user can access texting features
 */
export const canAccessTexting = (user: UserProfile | null): boolean => {
  if (!user) return false;
  return hasAnyRole(user, [
    UserRole.ONBOARDED,
    UserRole.ADMIN,
    UserRole.SUPERADMIN,
  ]);
};

/**
 * Check if user can access admin features
 */
export const canAccessAdmin = (user: UserProfile | null): boolean => {
  if (!user) return false;
  return hasAnyRole(user, [UserRole.ADMIN, UserRole.SUPERADMIN]);
};

/**
 * Get user's role display name
 */
export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    [UserRole.GUEST]: "Guest",
    [UserRole.USER]: "User",
    [UserRole.ONBOARDED]: "Onboarded User",
    [UserRole.ADMIN]: "Administrator",
    [UserRole.SUPERADMIN]: "Superadmin",
  };
  return roleNames[role];
};

/**
 * Get user's role color for UI display
 */
export const getRoleColor = (role: UserRole): string => {
  const roleColors: Record<UserRole, string> = {
    [UserRole.GUEST]: "gray",
    [UserRole.USER]: "blue",
    [UserRole.ONBOARDED]: "green",
    [UserRole.ADMIN]: "orange",
    [UserRole.SUPERADMIN]: "purple",
  };
  return roleColors[role];
};
