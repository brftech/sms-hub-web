import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { UserRole, RoutePermission } from "../types";
import { canAccessRoute, hasAnyRole, hasMinimumRole } from "../utils/roleUtils";
import { logger } from "@sms-hub/logger";

export interface ProtectedRouteProps {
  children: React.ReactNode;
  user: { role?: string } | null;
  loading?: boolean;
  requiredRoles?: UserRole[];
  minimumRole?: UserRole;
  requiredPermissions?: string[];
  routePermissions?: RoutePermission[];
  redirectTo?: string;
  loginUrl?: string;
  loadingComponent?: React.ReactNode;
  unauthorizedComponent?: React.ReactNode;
  debug?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  user,
  loading = false,
  requiredRoles = [],
  minimumRole,
  requiredPermissions = [],
  routePermissions = [],
  redirectTo = "/dashboard",
  loginUrl = "/login",
  loadingComponent,
  unauthorizedComponent,
  debug = false,
}) => {
  const location = useLocation();

  // Debug logging
  if (debug) {
    logger.debug("ProtectedRoute check", {
      path: location.pathname,
      userRole: user?.role,
      requiredRoles,
      minimumRole,
      loading,
    });
  }

  // Show loading state
  if (loading) {
    return (
      <>
        {loadingComponent || (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </div>
        )}
      </>
    );
  }

  // Check if user is authenticated
  if (!user || !user.role) {
    if (debug) {
      logger.debug("ProtectedRoute: User not authenticated, redirecting to login");
    }

    // If loginUrl is an absolute URL, use window.location
    if (loginUrl.startsWith("http")) {
      const currentUrl = window.location.href;
      const redirectUrl = `${loginUrl}?redirect=${encodeURIComponent(currentUrl)}`;
      window.location.href = redirectUrl;
      return null;
    }

    // Otherwise use React Router navigation
    return <Navigate to={loginUrl} state={{ from: location }} replace />;
  }

  // Check route-based permissions if provided
  if (routePermissions.length > 0) {
    const canAccess = canAccessRoute(user.role, location.pathname, routePermissions);
    
    if (!canAccess) {
      if (debug) {
        logger.debug("ProtectedRoute: User cannot access route", {
          path: location.pathname,
          userRole: user.role,
        });
      }

      // Prevent redirect loops
      if (location.pathname === redirectTo) {
        return (
          <>
            {unauthorizedComponent || (
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
                  <p className="mt-2 text-gray-600">
                    You don't have permission to access this page.
                  </p>
                </div>
              </div>
            )}
          </>
        );
      }

      return <Navigate to={redirectTo} replace />;
    }
  }

  // Check minimum role requirement
  if (minimumRole && !hasMinimumRole(user.role, minimumRole)) {
    if (debug) {
      logger.debug("ProtectedRoute: User doesn't meet minimum role requirement", {
        userRole: user.role,
        minimumRole,
      });
    }

    return (
      <>
        {unauthorizedComponent || <Navigate to={redirectTo} replace />}
      </>
    );
  }

  // Check specific role requirements
  if (requiredRoles.length > 0 && !hasAnyRole(user.role, requiredRoles)) {
    if (debug) {
      logger.debug("ProtectedRoute: User doesn't have required role", {
        userRole: user.role,
        requiredRoles,
      });
    }

    return (
      <>
        {unauthorizedComponent || <Navigate to={redirectTo} replace />}
      </>
    );
  }

  // Check permissions (if permission system is implemented)
  if (requiredPermissions.length > 0) {
    // This would need to be implemented based on your permission system
    logger.warn("Permission checking not yet implemented", { requiredPermissions });
  }

  // All checks passed, render children
  if (debug) {
    logger.debug("ProtectedRoute: Access granted");
  }

  return <>{children}</>;
};