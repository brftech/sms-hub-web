import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { UserRole } from '../../types/roles'
import { canAccessRoute, hasAnyRole } from '../../utils/roleUtils'
import { redirectToWebApp } from '@sms-hub/utils'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: UserRole[]
  requiredPermissions?: string[]
  fallbackPath?: string
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  fallbackPath
}) => {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated || !user) {
    // Redirect to web app login page
    redirectToWebApp('/login')
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-gray-900">Redirecting to Login...</h3>
          <p className="mt-2 text-sm text-gray-500">
            You will be redirected to the login page.
          </p>
        </div>
      </div>
    )
  }

  // Check if user can access this specific route
  if (!canAccessRoute(user, location.pathname)) {
    // Redirect to appropriate fallback or dashboard
    const fallback = fallbackPath || '/dashboard'
    return <Navigate to={fallback} replace />
  }

  // Check required roles
  if (requiredRoles.length > 0 && !hasAnyRole(user, requiredRoles)) {
    return <Navigate to="/unauthorized" replace />
  }

  // Check required permissions
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => 
      user.permissions?.[permission as keyof typeof user.permissions] === true
    )
    
    if (!hasAllPermissions) {
      return <Navigate to="/unauthorized" replace />
    }
  }

  return <>{children}</>
}

export default ProtectedRoute
