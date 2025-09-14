import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ProtectedRoute as AuthProtectedRoute, useAuthContext } from "@sms-hub/auth";
import { UserRole } from "../../types/roles";
import { canAccessRoute } from "../../utils/roleUtils";

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requiredPermissions?: string[];
  fallbackPath?: string;
}

// Wrapper component to maintain backward compatibility with the old ProtectedRoute API
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  fallbackPath,
}) => {
  const { user, loading } = useAuthContext();
  const location = useLocation();
  
  
  // Custom loading component that matches the old behavior
  const loadingComponent = (
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

  // Custom unauthorized component that handles the old logic
  const unauthorizedComponent = (() => {
    if (!user) return null;
    
    console.log("[ProtectedRoute] User authenticated, checking route access");
    console.log("[ProtectedRoute] Current path:", location.pathname);
    console.log("[ProtectedRoute] User role:", user.role);

    // Check if user can access this specific route
    const canAccess = canAccessRoute(user as any, location.pathname);
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

    // Default unauthorized behavior
    return <Navigate to="/unauthorized" replace />;
  })();

  // Transform user to match ProtectedRoute's expected type
  const transformedUser = user ? { ...user, role: user.role || undefined } : null;

  return (
    <AuthProtectedRoute
      user={transformedUser}
      loading={loading}
      requiredRoles={requiredRoles as any}
      loadingComponent={loadingComponent}
      unauthorizedComponent={unauthorizedComponent}
      loginUrl={`http://localhost:3000/login?redirect=${encodeURIComponent(window.location.href)}`}
    >
      {children}
    </AuthProtectedRoute>
  );
};

export default ProtectedRoute;