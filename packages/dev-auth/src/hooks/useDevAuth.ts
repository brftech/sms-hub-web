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
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DEV_SUPERADMIN === 'true') ||
      (typeof process !== 'undefined' && process.env?.DEV_SUPERADMIN === 'true')
    
    // Enable superadmin if query param matches or env var is set
    const isSuperadmin = superadminKey === 'dev123' || envSuperadmin
    
    if (isSuperadmin) {
      // Create mock dev user ID
      const devUserId = devUserParam || 'dev-superadmin-001'
      
      // Create mock user profile
      const devUserProfile = {
        id: devUserId,
        email: 'superadmin@dev.local',
        phone: '+15551234567',
        first_name: 'Dev',
        last_name: 'Superadmin',
        company: 'Development Testing',
        hub_id: 1, // Default to PercyTech
        payment_status: 'completed',
        onboarding_completed: true,
        role: 'SUPERADMIN', // Give superadmin role
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
      
      // Store in sessionStorage for persistence during dev session
      sessionStorage.setItem('dev_superadmin', 'true')
      sessionStorage.setItem('dev_user_id', devUserId)
      sessionStorage.setItem('dev_user_profile', JSON.stringify(devUserProfile))
    } else {
      // Check sessionStorage for existing dev session
      const storedSuperadmin = sessionStorage.getItem('dev_superadmin') === 'true'
      const storedUserId = sessionStorage.getItem('dev_user_id')
      const storedProfile = sessionStorage.getItem('dev_user_profile')
      
      if (storedSuperadmin && storedUserId && storedProfile) {
        setDevAuthState({
          isDevMode: true,
          isSuperadmin: true,
          devUserId: storedUserId,
          devUserProfile: JSON.parse(storedProfile),
          isInitialized: true
        })
      } else {
        setDevAuthState(prev => ({ ...prev, isInitialized: true }))
      }
    }
  }, [searchParams, environment])

  return devAuthState
}

// Helper to activate dev auth programmatically
export const activateDevAuth = (environment: EnvironmentAdapter, userId?: string) => {
  console.log('activateDevAuth called', { isDev: environment.isDevelopment() })
  
  if (!environment.isDevelopment()) {
    console.warn('Dev auth can only be activated in development environment')
    return
  }
  
  console.log('Activating dev auth...')
  const devUserId = userId || 'dev-superadmin-001'
  const devUserProfile = {
    id: devUserId,
    email: 'superadmin@dev.local',
    phone: '+15551234567',
    first_name: 'Dev',
    last_name: 'Superadmin',
    company: 'Development Testing',
    hub_id: 1, // Default to PercyTech
    payment_status: 'completed',
    onboarding_completed: true,
    role: 'SUPERADMIN', // Give superadmin role
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  // Store in sessionStorage
  sessionStorage.setItem('dev_superadmin', 'true')
  sessionStorage.setItem('dev_user_id', devUserId)
  sessionStorage.setItem('dev_user_profile', JSON.stringify(devUserProfile))
  
  // Reload to apply changes
  window.location.reload()
}

// Helper to clear dev auth session
export const clearDevAuth = () => {
  sessionStorage.removeItem('dev_superadmin')
  sessionStorage.removeItem('dev_user_id')
  sessionStorage.removeItem('dev_user_profile')
  window.location.reload()
}