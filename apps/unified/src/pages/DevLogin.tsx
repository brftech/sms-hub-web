import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DevLogin: React.FC = () => {
  const [email, setEmail] = useState('superadmin@sms-hub.com')
  const [password, setPassword] = useState('SuperAdmin123!')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // For development, create a mock session that works with the unified system
      const mockSession = {
        user: {
          id: '00000000-0000-0000-0000-000000000001',
          email: email,
          role: email === 'superadmin@sms-hub.com' ? 'superadmin' : 'user',
          first_name: email === 'superadmin@sms-hub.com' ? 'Super' : 'Test',
          last_name: email === 'superadmin@sms-hub.com' ? 'Admin' : 'User',
          company_admin: true,
          verification_setup_completed: true,
          payment_status: 'completed',
          onboarding_completed: true,
          permissions: {}
        },
        access_token: 'mock_token_' + Date.now(),
        refresh_token: 'mock_refresh_' + Date.now(),
        expires_at: Date.now() + 3600000, // 1 hour
        token_type: 'bearer'
      }
      
      // Store in sessionStorage for the auth system to pick up
      sessionStorage.setItem('supabase.auth.token', JSON.stringify(mockSession))
      
      // Redirect to dashboard
      navigate('/dashboard')
    } catch (err) {
      setError('Login failed. Please try again.')
      console.error('Dev login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDevMode = () => {
    // Add dev superadmin parameter and reload
    const url = new URL(window.location.href)
    url.searchParams.set('superadmin', 'dev123')
    window.location.href = url.toString()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Development Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access the SMS Hub unified app
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Or</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleDevMode}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Use Dev Mode (No Password)
              </button>
            </div>
          </div>
        </form>

        <div className="text-xs text-gray-500 text-center">
          <p>Development credentials:</p>
          <p>Email: superadmin@sms-hub.com</p>
          <p>Password: SuperAdmin123!</p>
          <p className="mt-2">Or use any email for regular user role</p>
        </div>
      </div>
    </div>
  )
}

export default DevLogin
