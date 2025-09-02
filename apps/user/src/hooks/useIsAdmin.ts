import { useUserProfile } from '@sms-hub/supabase/react'
import { useDevAuth } from './useDevAuth'

interface AdminState {
  isAdmin: boolean
  isSuperAdmin: boolean
  isLoading: boolean
  role: string | null
}

export const useIsAdmin = (): AdminState => {
  const { data: userProfile, isLoading } = useUserProfile()
  const devAuth = useDevAuth()
  
  // In dev mode, treat as superadmin
  if (devAuth.isSuperadmin) {
    return {
      isAdmin: true,
      isSuperAdmin: true,
      isLoading: false,
      role: 'SUPERADMIN'
    }
  }
  
  // Check actual user role
  const role = userProfile?.role || null
  const isAdmin = role === 'ADMIN' || role === 'SUPERADMIN' || role === 'OWNER'
  const isSuperAdmin = role === 'SUPERADMIN'
  
  return {
    isAdmin,
    isSuperAdmin,
    isLoading,
    role
  }
}

// Helper to get admin dashboard URL
export const getAdminDashboardUrl = () => {
  // In development, use port 3002
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3002'
  }
  
  // In production, use subdomain or path
  // Adjust this based on your production setup
  const protocol = window.location.protocol
  const host = window.location.hostname
  
  // Example: admin.yourdomain.com
  return `${protocol}//admin.${host}`
}