import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHub, Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Label } from '@sms-hub/ui'
import { Shield, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@sms-hub/supabase'
import { useDevAuth, activateDevAuth } from '../hooks/useDevAuth'
import { DevAuthToggle } from '../components/DevAuthToggle'

export function Login() {
  const { hubConfig } = useHub()
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const devAuth = useDevAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Check for dev superadmin mode and redirect
  useEffect(() => {
    if (devAuth.isInitialized && devAuth.isSuperadmin) {
      console.log('Dev superadmin mode active - redirecting from admin login')
      navigate('/', { replace: true })
    }
  }, [devAuth.isInitialized, devAuth.isSuperadmin, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    setIsLoading(true)
    setError('')

    try {
      await signIn({ email, password })
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <DevAuthToggle onActivate={() => activateDevAuth()} />
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 hub-bg-primary rounded-lg flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold hub-text-primary">
            Admin Portal
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {hubConfig.displayName} platform administration
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Administrator Access</CardTitle>
            <CardDescription>
              Enter your admin credentials to access the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter admin email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full hub-bg-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Access Admin Portal'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            This portal is restricted to authorized administrators only
          </p>
        </div>
      </div>
    </div>
  )
}