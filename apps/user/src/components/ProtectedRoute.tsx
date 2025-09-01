import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { createSupabaseClient } from '@sms-hub/supabase'
import { useUserProfile } from '@sms-hub/supabase/react'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const location = useLocation()
  const { data: userProfile, isLoading: profileLoading } = useUserProfile()
  
  const supabase = createSupabaseClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  )
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        console.log('Current session:', session)
        setIsAuthenticated(!!session)
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
      setIsAuthenticated(!!session)
    })
    
    return () => subscription.unsubscribe()
  }, [])
  
  if (isLoading || profileLoading) {
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
    // Save the attempted location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  
  // Check if user needs to complete payment
  if (userProfile && !userProfile.payment_status) {
    // If they're not already on a payment-related page, redirect to payment
    if (!location.pathname.includes('payment') && !location.pathname.includes('stripe')) {
      return <Navigate to="/payment-required" replace />
    }
  }
  
  return <>{children}</>
}