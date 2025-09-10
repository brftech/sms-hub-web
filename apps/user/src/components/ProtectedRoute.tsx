import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { createSupabaseClient } from '@sms-hub/supabase'
import { CheckoutRedirect } from './CheckoutRedirect'
import { useDevAuth, useSuperadminAuth } from '@sms-hub/dev-auth'
import { userEnvironment } from '../config/userEnvironment'
import { redirectToWebApp } from '@sms-hub/utils'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const location = useLocation()
  const devAuth = useDevAuth(userEnvironment)
  const superadminAuth = useSuperadminAuth()
  
  const supabase = createSupabaseClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  )
  
  useEffect(() => {
    // Wait for dev auth to initialize
    if (!devAuth.isInitialized) {
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
    // Redirect to web app login page
    redirectToWebApp('/login');
    return null; // Component will unmount due to redirect
  }
  
  // Check if there's a pending checkout from signup
  // Note: We now use webhooks instead of sessionStorage for payment flow
  const pendingCheckout = sessionStorage.getItem('pending_checkout')
  if (pendingCheckout && location.pathname === '/') {
    // Only redirect to CheckoutRedirect if they're not trying to access onboarding
    if (!location.pathname.includes('onboarding')) {
      return <CheckoutRedirect />
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