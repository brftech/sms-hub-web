import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getAuthConfig, validateDevAuthConfig } from '../config'

interface DevAuthState {
  isDevMode: boolean
  isSuperadmin: boolean
  devUserId: string | null
  devUserProfile: Record<string, unknown> | null
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
  
  const hasInitialized = useRef(false)

  useEffect(() => {
    // Prevent infinite loops by checking if already initialized
    if (hasInitialized.current) {
      return;
    }

    console.log('useDevAuth useEffect - environment check:', {
      isDevelopment: environment.isDevelopment(),
      searchParams: Object.fromEntries(searchParams.entries())
    })
    
    // Get auth configuration
    const authConfig = getAuthConfig();
    
    // Only enable dev auth in development environment
    if (!environment.isDevelopment() || !authConfig.dev.enabled) {
      console.log('Dev auth disabled', { 
        isDevelopment: environment.isDevelopment(),
        devEnabled: authConfig.dev.enabled 
      });
      setDevAuthState(prev => ({ ...prev, isInitialized: true }));
      hasInitialized.current = true;
      return;
    }

    // Validate dev auth configuration
    const validation = validateDevAuthConfig();
    if (!validation.valid) {
      console.log('Dev auth configuration not available:', validation.error);
      setDevAuthState(prev => ({ ...prev, isInitialized: true }));
      hasInitialized.current = true;
      return;
    }

    // Check for superadmin query parameter
    const superadminKey = searchParams.get('superadmin');
    
    // Get the expected token from environment
    const expectedToken = 
      (typeof import.meta !== 'undefined' && import.meta.env?.[authConfig.dev.tokenKey]) || 
      (typeof process !== 'undefined' && process.env?.[authConfig.dev.tokenKey]);
    
    // Enable superadmin only if query param matches the secure token
    const isSuperadmin = superadminKey === expectedToken && expectedToken !== undefined;
    
    console.log('useDevAuth - superadmin check:', {
      hasToken: !!superadminKey,
      tokenValid: isSuperadmin,
      currentUrl: window.location.href
    })
    
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
        role: 'superadmin', // Use lowercase to match UserRole enum
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
      
      hasInitialized.current = true
      
      // DO NOT store in sessionStorage - auth should only last for this page load
      // This prevents auth from persisting across refreshes
      // sessionStorage.setItem('dev_superadmin', 'true')
      // sessionStorage.setItem('dev_user_id', devUserId)
      // sessionStorage.setItem('dev_user_profile', JSON.stringify(devUserProfile))
    } else {
      // DO NOT check sessionStorage - we want auth to be explicit each time
      // This prevents dev auth from persisting across page refreshes
      console.log('useDevAuth - no superadmin detected, initializing as regular user')
      setDevAuthState(prev => ({ ...prev, isInitialized: true }))
      hasInitialized.current = true
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]) // Only depend on searchParams to avoid infinite loops with environment object

  return devAuthState
}

// Helper to activate dev auth programmatically
export const activateDevAuth = (environment: EnvironmentAdapter, _userId?: string) => {
  console.log('activateDevAuth called', { isDev: environment.isDevelopment() })
  
  const authConfig = getAuthConfig();
  
  if (!environment.isDevelopment() || !authConfig.dev.enabled) {
    console.warn('Dev auth can only be activated in development environment')
    return
  }
  
  // Get the token from environment
  const token = 
    (typeof import.meta !== 'undefined' && import.meta.env?.[authConfig.dev.tokenKey]) || 
    (typeof process !== 'undefined' && process.env?.[authConfig.dev.tokenKey]);
  
  if (!token) {
    console.error('Dev auth token not configured. Cannot activate dev auth.');
    return;
  }
  
  // Add the query param with the secure token and reload
  const url = new URL(window.location.href)
  url.searchParams.set('superadmin', token)
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