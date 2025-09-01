import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useHub, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, HubLogo } from '@sms-hub/ui'
import { Input, Label, Alert, AlertDescription } from '@sms-hub/ui'
import { Mail, CheckCircle } from 'lucide-react'
import { createSupabaseClient } from '@sms-hub/supabase'

export function Login() {
  const { hubConfig } = useHub()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const supabase = createSupabaseClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  )
  
  const from = location.state?.from?.pathname || '/'
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError('Please enter your email address')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      // Send OTP to email
      const { data, error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false, // Don't create new users on login
        }
      })
      
      if (otpError) {
        // If user doesn't exist, show appropriate message
        if (otpError.message.includes('User not found')) {
          setError('No account found with this email. Please sign up first.')
        } else {
          setError(otpError.message)
        }
        return
      }
      
      setSuccess(true)
      
      // Store email for the OTP verification page
      sessionStorage.setItem('login_email', email)
      
      // Redirect to OTP verification page
      setTimeout(() => {
        navigate('/verify-otp', { state: { email, from } })
      }, 2000)
      
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Failed to send login link')
    } finally {
      setIsLoading(false)
    }
  }
  
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-gray-900">Check Your Email</h2>
            <p className="text-gray-600 mb-4">
              We've sent a login link to {email}
            </p>
            <p className="text-sm text-gray-500">
              Click the link in your email to sign in to your account.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="text-center mb-8">
            <HubLogo hubType={hubConfig.id} variant="icon" size="md" className="mx-auto mb-4" />
            <CardTitle className="text-2xl text-gray-900">Welcome Back</CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to your {hubConfig.displayName} account
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="block mb-2 font-medium text-gray-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoComplete="email"
                autoFocus
                className="w-full"
              />
            </div>
            
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button type="submit" disabled={isLoading} className="w-full h-12 text-base font-semibold">
              {isLoading ? (
                'Sending login link...'
              ) : (
                <>
                  Send Login Link
                  <Mail className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
          
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}