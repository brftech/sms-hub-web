import React, { useEffect, useState } from 'react'
import { getSupabaseClient } from '../lib/supabaseSingleton'

export const ClearAuth: React.FC = () => {
  const [isClearing, setIsClearing] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const clearAuth = async () => {
      try {
        // Get Supabase client and sign out
        const supabase = getSupabaseClient()
        await supabase.auth.signOut()
        
        // Clear ALL auth-related sessionStorage
        sessionStorage.removeItem('dev_superadmin')
        sessionStorage.removeItem('dev_user_id')
        sessionStorage.removeItem('dev_user_profile')
        sessionStorage.removeItem('superadmin_session')
        sessionStorage.clear()
        
        // Clear ALL auth-related localStorage
        // Clear all Supabase auth keys
        const keysToRemove = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && (key.includes('supabase') || key.includes('auth'))) {
            keysToRemove.push(key)
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key))
        
        // Also clear dev bypass
        localStorage.removeItem('dev_bypass')
        
        // Clear cookies if any
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        
        console.log('All auth data cleared!')
        setIsClearing(false)
      } catch (err) {
        console.error('Error clearing auth:', err)
        setError('Failed to clear authentication. Please try again.')
        setIsClearing(false)
      }
    }
    
    clearAuth()
  }, [])

  const handleGoToWeb = () => {
    // Redirect to Web app home page
    window.location.href = 'http://localhost:3000'
  }

  const handleGoToLogin = () => {
    // Redirect to Web app login page
    window.location.href = 'http://localhost:3000/login'
  }

  if (isClearing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Clearing Authentication...</h2>
          <p className="text-gray-600">Please wait while we clear your session.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Cleared</h2>
        <p className="text-gray-600 mb-6">
          All authentication data has been successfully cleared from your browser.
        </p>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <button
            onClick={handleGoToWeb}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Go to Home (Web App)
          </button>
          <button
            onClick={handleGoToLogin}
            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default ClearAuth