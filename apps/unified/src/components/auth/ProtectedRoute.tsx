import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { UserRole } from "../../types/roles";
import { canAccessRoute, hasAnyRole } from "../../utils/roleUtils";
// import { redirectToWebApp } from '@sms-hub/utils'
// import { unifiedEnvironment } from '../../config/unifiedEnvironment'

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requiredPermissions?: string[];
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  fallbackPath,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  console.log("[ProtectedRoute] Auth state:", {
    isAuthenticated,
    isLoading,
    hasUser: !!user,
  });

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
          <p className="mt-2 text-sm text-gray-400">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated || !user) {
    console.log("[ProtectedRoute] Not authenticated, redirecting to login");
    // Redirect to web app login with current URL as redirect parameter
    const currentUrl = window.location.href;
    const redirectUrl = `http://localhost:3000/login?redirect=${encodeURIComponent(currentUrl)}`;
    console.log("ProtectedRoute: Redirecting to web app login:", redirectUrl);
    window.location.href = redirectUrl;
    return null;
  }

  console.log("[ProtectedRoute] User authenticated, checking route access");
  console.log("[ProtectedRoute] Current path:", location.pathname);
  console.log("[ProtectedRoute] User role:", user.role);

  // Check if user can access this specific route
  const canAccess = canAccessRoute(user, location.pathname);
  console.log("[ProtectedRoute] Can access route?", canAccess);
  console.log("[ProtectedRoute] Checking canAccessRoute for user:", user);

  // TEMPORARY: Skip route access check for SUPERADMIN and ADMIN
  if (
    user.role !== UserRole.SUPERADMIN &&
    user.role !== UserRole.ADMIN &&
    !canAccess
  ) {
    console.log(
      "[ProtectedRoute] User cannot access route, redirecting to fallback"
    );
    // Redirect to appropriate fallback or dashboard
    const fallback = fallbackPath || "/dashboard";
    if (location.pathname === "/dashboard") {
      // Prevent infinite redirect loop
      console.error(
        "[ProtectedRoute] Cannot redirect from dashboard to dashboard!"
      );
      return <div>Error: Cannot access dashboard</div>;
    }
    return <Navigate to={fallback} replace />;
  }

  console.log("[ProtectedRoute] Route access allowed, checking required roles");
  console.log("[ProtectedRoute] Required roles:", requiredRoles);
  console.log(
    "[ProtectedRoute] Has any role?",
    hasAnyRole(user, requiredRoles)
  );

  // Check required roles
  if (requiredRoles.length > 0 && !hasAnyRole(user, requiredRoles)) {
    console.log(
      "[ProtectedRoute] User doesn't have required role, redirecting to unauthorized"
    );
    return <Navigate to="/unauthorized" replace />;
  }

  // Check required permissions
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(
      (permission) =>
        user.permissions?.[permission as keyof typeof user.permissions] === true
    );

    if (!hasAllPermissions) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  console.log("[ProtectedRoute] Rendering children");
  return <>{children}</>;
};

export default ProtectedRoute;
