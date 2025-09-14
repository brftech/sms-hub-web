import type { UserRole, RoutePermission } from "../types";
import { logger } from "@sms-hub/logger";

// Define role hierarchy
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  USER: 1,
  ONBOARDED: 2,
  ADMIN: 3,
  SUPERADMIN: 4,
};

/**
 * Check if a user has a specific role
 */
export const hasRole = (userRole: string | undefined | null, role: UserRole): boolean => {
  if (!userRole) return false;
  return String(userRole).toUpperCase() === String(role).toUpperCase();
};

/**
 * Check if a user has any of the specified roles
 */
export const hasAnyRole = (
  userRole: string | undefined | null,
  roles: UserRole[]
): boolean => {
  if (!userRole) return false;
  const normalizedUserRole = String(userRole).toUpperCase();
  return roles.some((role) => String(role).toUpperCase() === normalizedUserRole);
};

/**
 * Check if a user has at least the specified role level (based on hierarchy)
 */
export const hasMinimumRole = (
  userRole: string | undefined | null,
  minimumRole: UserRole
): boolean => {
  if (!userRole) return false;
  
  const normalizedUserRole = String(userRole).toUpperCase() as UserRole;
  const userLevel = ROLE_HIERARCHY[normalizedUserRole];
  const requiredLevel = ROLE_HIERARCHY[minimumRole];
  
  if (userLevel === undefined || requiredLevel === undefined) {
    logger.warn("Invalid role comparison", { userRole, minimumRole });
    return false;
  }
  
  return userLevel >= requiredLevel;
};

/**
 * Check if a user can access a specific route based on route permissions
 */
export const canAccessRoute = (
  userRole: string | undefined | null,
  path: string,
  routePermissions: RoutePermission[]
): boolean => {
  if (!userRole) {
    logger.debug("No user role provided for route access check", { path });
    return false;
  }

  // Find the most specific route permission that matches the path
  const matchingPermission = routePermissions
    .filter((rp) => path.startsWith(rp.path))
    .sort((a, b) => b.path.length - a.path.length)[0];

  if (!matchingPermission) {
    logger.debug("No route permission found", { path });
    return false;
  }

  const hasAccess = hasAnyRole(userRole, matchingPermission.roles || []);
  
  logger.debug("Route access check", {
    path,
    userRole,
    requiredRoles: matchingPermission.roles,
    hasAccess,
  });

  return hasAccess;
};

/**
 * Get user's role display name
 */
export const getRoleDisplayName = (role: UserRole | string): string => {
  const roleNames: Record<string, string> = {
    USER: "User",
    ONBOARDED: "Verified User",
    ADMIN: "Administrator",
    SUPERADMIN: "Super Administrator",
  };
  
  const upperRole = String(role).toUpperCase();
  return roleNames[upperRole] || role;
};

/**
 * Get user's role color for UI display
 */
export const getRoleColor = (role: UserRole | string): string => {
  const roleColors: Record<string, string> = {
    USER: "blue",
    ONBOARDED: "green",
    ADMIN: "orange",
    SUPERADMIN: "purple",
  };
  
  const upperRole = String(role).toUpperCase();
  return roleColors[upperRole] || "gray";
};

/**
 * Get user's role badge style for UI display
 */
export const getRoleBadgeStyle = (role: UserRole | string): {
  backgroundColor: string;
  color: string;
} => {
  const styles: Record<string, { backgroundColor: string; color: string }> = {
    USER: { backgroundColor: "#DBEAFE", color: "#1E40AF" },
    ONBOARDED: { backgroundColor: "#D1FAE5", color: "#065F46" },
    ADMIN: { backgroundColor: "#FED7AA", color: "#C2410C" },
    SUPERADMIN: { backgroundColor: "#E9D5FF", color: "#6B21A8" },
  };
  
  const upperRole = String(role).toUpperCase();
  return styles[upperRole] || { backgroundColor: "#F3F4F6", color: "#374151" };
};

/**
 * Check if user is authenticated (has any valid role)
 */
export const isAuthenticated = (userRole: string | undefined | null): boolean => {
  if (!userRole) return false;
  const validRoles: UserRole[] = ["USER", "ONBOARDED", "ADMIN", "SUPERADMIN"];
  return hasAnyRole(userRole, validRoles);
};

/**
 * Check if user is fully onboarded
 */
export const isOnboarded = (userRole: string | undefined | null): boolean => {
  return hasMinimumRole(userRole, "ONBOARDED");
};

/**
 * Check if user can access admin features
 */
export const isAdmin = (userRole: string | undefined | null): boolean => {
  return hasMinimumRole(userRole, "ADMIN");
};

/**
 * Check if user is superadmin
 */
export const isSuperAdmin = (userRole: string | undefined | null): boolean => {
  return hasRole(userRole, "SUPERADMIN");
};