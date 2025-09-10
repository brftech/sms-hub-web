import { useEffect, useState } from 'react'

interface SuperadminSession {
  user: any
  token: string
  authenticated_at: string
}

interface SuperadminAuthState {
  isSuperadmin: boolean
  superadminUser: any | null
  isLoading: boolean
  isAuthenticated: boolean
}

export const useSuperadminAuth = (): SuperadminAuthState => {
  const [authState, setAuthState] = useState<SuperadminAuthState>({
    isSuperadmin: false,
    superadminUser: null,
    isLoading: true,
    isAuthenticated: false
  })

  useEffect(() => {
    // Check for superadmin session in sessionStorage
    const superadminSession = sessionStorage.getItem('superadmin_session')
    
    if (superadminSession) {
      try {
        const session: SuperadminSession = JSON.parse(superadminSession)
        
        // Check if session is still valid (24 hours)
        const sessionTime = new Date(session.authenticated_at).getTime()
        const now = new Date().getTime()
        const hoursSinceAuth = (now - sessionTime) / (1000 * 60 * 60)
        
        if (hoursSinceAuth < 24) {
          setAuthState({
            isSuperadmin: true,
            superadminUser: session.user,
            isLoading: false,
            isAuthenticated: true
          })
        } else {
          // Session expired, clear it
          sessionStorage.removeItem('superadmin_session')
          setAuthState({
            isSuperadmin: false,
            superadminUser: null,
            isLoading: false,
            isAuthenticated: false
          })
        }
      } catch (error) {
        console.error('Error parsing superadmin session:', error)
        sessionStorage.removeItem('superadmin_session')
        setAuthState({
          isSuperadmin: false,
          superadminUser: null,
          isLoading: false,
          isAuthenticated: false
        })
      }
    } else {
      setAuthState({
        isSuperadmin: false,
        superadminUser: null,
        isLoading: false,
        isAuthenticated: false
      })
    }
  }, [])

  return authState
}

// Helper to clear superadmin session
export const clearSuperadminAuth = () => {
  sessionStorage.removeItem('superadmin_session')
  window.location.reload()
}

// Helper to check if user has superadmin access to a specific app
export const hasSuperadminAccess = (_app: 'user' | 'texting' | 'admin'): boolean => {
  const superadminSession = sessionStorage.getItem('superadmin_session')
  
  if (!superadminSession) return false
  
  try {
    const session: SuperadminSession = JSON.parse(superadminSession)
    
    // Check if session is still valid
    const sessionTime = new Date(session.authenticated_at).getTime()
    const now = new Date().getTime()
    const hoursSinceAuth = (now - sessionTime) / (1000 * 60 * 60)
    
    if (hoursSinceAuth >= 24) {
      sessionStorage.removeItem('superadmin_session')
      return false
    }
    
    // Superadmin has access to all apps
    return true
  } catch (error) {
    console.error('Error checking superadmin access:', error)
    return false
  }
}
