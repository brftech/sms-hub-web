import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

interface DevAuthState {
  isDevMode: boolean
  isSuperadmin: boolean
  devUserId: string | null
  devUserProfile: any
  isInitialized: boolean
}

interface EnvironmentAdapter {
  isDevelopment: () => boolean
}

export const useDevAuth = (environment: EnvironmentAdapter): DevAuthState => {
  const [searchParams] = useSearchParams()
  const [devAuthState, setDevAuthState] = useState<DevAuthState>({
    isDevMode: false,
    isSuperadmin: false,
    devUserId: null,
    devUserProfile: null,
    isInitialized: false
  })

  useEffect(() => {
    // Only enable dev auth in development environment
    if (!environment.isDevelopment()) {
      setDevAuthState(prev => ({ ...prev, isInitialized: true }))
      return
    }

    // Check for superadmin query parameter
    const superadminKey = searchParams.get('superadmin')
    const devUserParam = searchParams.get('devuser')
    
    // Also check environment variable (both Vite and standard)
    const envSuperadmin = 
      (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_DEV_SUPERADMIN === 'true') ||
      (typeof process !== 'undefined' && process.env?.DEV_SUPERADMIN === 'true')
    
    // Enable superadmin if query param matches or env var is set
    // Removed auto-enable - now requires explicit ?superadmin=dev123 param
    const isSuperadmin = superadminKey === 'dev123' || envSuperadmin
    
    if (isSuperadmin) {
      // Use the actual superadmin user ID from the database
      const devUserId = '00000000-0000-0000-0000-000000000001'
      
      // Create user profile that matches the database superadmin
      const devUserProfile = {
        id: devUserId,
        email: 'superadmin@sms-hub.com',
        phone: '+15551234567',
        mobile_phone_number: '+15551234567',
        first_name: 'Super',
        last_name: 'Admin',
        company_id: '00000000-0000-0000-0000-000000000002',
        company_name: 'SMS Hub System',
        customer_id: '00000000-0000-0000-0000-000000000003',
        hub_id: 1, // PercyTech
        payment_status: 'completed',
        onboarding_completed: true,
        verification_setup_completed: true,
        is_active: true,
        role: 'SUPERADMIN',
        account_number: 'PERCY-SA001',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      setDevAuthState({
        isDevMode: true,
        isSuperadmin: true,
        devUserId,
        devUserProfile,
        isInitialized: true
      })
      
      // DO NOT store in sessionStorage - auth should only last for this page load
      // This prevents auth from persisting across refreshes
      // sessionStorage.setItem('dev_superadmin', 'true')
      // sessionStorage.setItem('dev_user_id', devUserId)
      // sessionStorage.setItem('dev_user_profile', JSON.stringify(devUserProfile))
    } else {
      // DO NOT check sessionStorage - we want auth to be explicit each time
      // This prevents dev auth from persisting across page refreshes
      setDevAuthState(prev => ({ ...prev, isInitialized: true }))
    }
  }, [searchParams, environment])

  return devAuthState
}

// Helper to activate dev auth programmatically
export const activateDevAuth = (environment: EnvironmentAdapter, _userId?: string) => {
  console.log('activateDevAuth called', { isDev: environment.isDevelopment() })
  
  if (!environment.isDevelopment()) {
    console.warn('Dev auth can only be activated in development environment')
    return
  }
  
  // Since we're not storing in sessionStorage anymore,
  // this function now just adds the query param and reloads
  const url = new URL(window.location.href)
  url.searchParams.set('superadmin', 'dev123')
  window.location.href = url.toString()
}

// Helper to clear dev auth session
export const clearDevAuth = () => {
  // Since we're not storing in sessionStorage anymore,
  // just remove the query param and reload
  const url = new URL(window.location.href)
  url.searchParams.delete('superadmin')
  url.searchParams.delete('devuser')
  window.location.href = url.toString()
}