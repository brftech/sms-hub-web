import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSupabase } from '../providers/SupabaseProvider'
// import { CheckoutRedirect } from './CheckoutRedirect'
import { useDevAuth, useSuperadminAuth } from '@sms-hub/dev-auth'
import { unifiedEnvironment } from '../config/unifiedEnvironment'
// import { redirectToWebApp } from '@sms-hub/utils'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const location = useLocation()
  const devAuth = useDevAuth(unifiedEnvironment)
  const superadminAuth = useSuperadminAuth()
  const supabase = useSupabase()
  
  useEffect(() => {
    console.log('ProtectedRoute useEffect - devAuth state:', {
      isInitialized: devAuth.isInitialized,
      isSuperadmin: devAuth.isSuperadmin,
      devUserProfile: devAuth.devUserProfile
    })
    console.log('ProtectedRoute useEffect - superadminAuth state:', {
      isAuthenticated: superadminAuth.isAuthenticated,
      isSuperadmin: superadminAuth.isSuperadmin,
      superadminUser: superadminAuth.superadminUser
    })
    
    // Wait for dev auth to initialize
    if (!devAuth.isInitialized) {
      console.log('Dev auth not initialized yet, waiting...')
      return
    }
    
    // Check for dev superadmin mode first - this happens synchronously
    if (devAuth.isSuperadmin) {
      console.log('Dev superadmin mode active')
      setIsAuthenticated(true)
      setUserProfile(devAuth.devUserProfile)
      setIsLoading(false)
      return
    }
    
    // Check for real superadmin authentication
    if (superadminAuth.isAuthenticated && superadminAuth.isSuperadmin) {
      console.log('Superadmin authentication active')
      setIsAuthenticated(true)
      setUserProfile(superadminAuth.superadminUser)
      setIsLoading(false)
      return
    }
    
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        console.log('Current session:', session)
        setIsAuthenticated(!!session)
        
        // If authenticated, load user profile
        if (session?.user) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          setUserProfile(profile)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session)
      // Don't override dev superadmin mode
      if (!devAuth.isSuperadmin) {
        setIsAuthenticated(!!session)
        setIsLoading(false)
      }
    })
    
    return () => subscription.unsubscribe()
  }, [devAuth.isInitialized, devAuth.isSuperadmin, devAuth.devUserProfile, superadminAuth.isAuthenticated, superadminAuth.isSuperadmin, superadminAuth.superadminUser])
  
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
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-gray-900">Authentication Required</h3>
          <p className="mt-2 text-sm text-gray-500">
            Please log in to access this page.
          </p>
          <div className="mt-6 space-y-3">
            <a
              href="/superadmin-login"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Superadmin Login
            </a>
            <button
              onClick={() => {
                const url = new URL(window.location.href)
                url.searchParams.set('superadmin', 'dev123')
                window.location.href = url.toString()
              }}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Dev Mode (No Password)
            </button>
            <p className="text-xs text-gray-400">
              Dev mode: Add ?superadmin=dev123 to URL to enable superadmin mode
            </p>
          </div>
        </div>
      </div>
    )
  }
  
  // Check if there's a pending checkout from signup
  // Note: We now use webhooks instead of sessionStorage for payment flow
  const pendingCheckout = sessionStorage.getItem('pending_checkout')
  if (pendingCheckout && location.pathname === '/') {
    // Only redirect to CheckoutRedirect if they're not trying to access onboarding
    if (!location.pathname.includes('onboarding')) {
      return <Navigate to="/payment-required" replace />
    }
  }
  
  // Check if user needs to complete payment
  if (userProfile && !userProfile.payment_status) {
    // Allow access to onboarding - webhook will handle payment status updates
    if (location.pathname.includes('onboarding')) {
      return <>{children}</>
    }
    
    // If they're not already on a payment-related page or onboarding, redirect to payment
    if (!location.pathname.includes('payment') && !location.pathname.includes('stripe') && !location.pathname.includes('onboarding')) {
      return <Navigate to="/payment-required" replace />
    }
  }
  
  return <>{children}</>
}

export default ProtectedRoute