import { useState, useEffect } from 'react'
import { useSupabase } from '../providers/SupabaseProvider'
import { useDevAuth } from '@sms-hub/dev-auth'
import { useSuperadminAuth } from '@sms-hub/dev-auth'
import { UserProfile } from '../types/roles'
import { unifiedEnvironment } from '../config/unifiedEnvironment'

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: UserProfile | null
  session: any
}

export const useAuth = (): AuthState => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    session: null
  })

  const devAuth = useDevAuth(unifiedEnvironment)
  const superadminAuth = useSuperadminAuth()
  const supabase = useSupabase()

  useEffect(() => {
    // Wait for dev auth to initialize
    if (!devAuth.isInitialized) {
      console.log('Waiting for dev auth to initialize...')
      return
    }

    // Check for dev superadmin mode first
    if (devAuth.isSuperadmin) {
      console.log('Dev superadmin mode active')
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user: devAuth.devUserProfile as UserProfile,
        session: { user: devAuth.devUserProfile }
      })
      return
    }

    // Check for real superadmin authentication
    if (superadminAuth.isAuthenticated && superadminAuth.isSuperadmin) {
      console.log('Superadmin authentication active')
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user: superadminAuth.superadminUser as UserProfile,
        session: superadminAuth.superadminUser
      })
      return
    }

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        console.log('Current session:', session)
        
        if (session?.user) {
          // Load user profile from database
          const { data: profile, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (error) {
            console.error('Error loading user profile:', error)
            setAuthState({
              isAuthenticated: false,
              isLoading: false,
              user: null,
              session: null
            })
            return
          }

          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            user: profile as unknown as UserProfile,
            session
          })
        } else {
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            session: null
          })
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          session: null
        })
      }
    }

    checkAuth()

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session)
      
      if (session?.user) {
        // Load user profile
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user: profile as unknown as UserProfile,
          session
        })
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          session: null
        })
      }
    })

    return () => subscription.unsubscribe()
  }, [devAuth.isInitialized, devAuth.isSuperadmin, devAuth.devUserProfile, superadminAuth.isAuthenticated, superadminAuth.isSuperadmin, superadminAuth.superadminUser, supabase])

  console.log('useAuth returning state:', authState)
  return authState
}
