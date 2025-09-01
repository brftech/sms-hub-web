import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useHub, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sms-hub/ui'
import { Input, Label, Alert, AlertDescription } from '@sms-hub/ui'
import { Mail, ArrowRight, Shield, CheckCircle } from 'lucide-react'
import { createSupabaseClient } from '@sms-hub/supabase'
import styled from 'styled-components'
import logoIcon from "@sms-hub/ui/assets/gnymble-icon-logo.svg"

const LoginContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #2d1b1b 0%, #4a2c2c 50%, #3d2424 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
`

const LogoSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`

const LogoImage = styled.img`
  width: 48px;
  height: 48px;
  margin: 0 auto 1rem;
  display: block;
`

const FormSection = styled.form`
  space-y: 4;
`

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`

const StyledLabel = styled(Label)`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`

const StyledInput = styled(Input)`
  width: 100%;
`

const SubmitButton = styled(Button)`
  width: 100%;
  height: 48px;
  font-size: 1rem;
  font-weight: 600;
`

const Footer = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
`

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
      <LoginContainer>
        <LoginCard>
          <CardContent className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
            <p className="text-gray-600 mb-4">
              We've sent a login link to {email}
            </p>
            <p className="text-sm text-gray-500">
              Click the link in your email to sign in to your account.
            </p>
          </CardContent>
        </LoginCard>
      </LoginContainer>
    )
  }
  
  return (
    <LoginContainer>
      <LoginCard>
        <CardHeader>
          <LogoSection>
            <LogoImage src={logoIcon} alt="Logo" />
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your {hubConfig.displayName} account
            </CardDescription>
          </LogoSection>
        </CardHeader>
        
        <CardContent>
          <FormSection onSubmit={handleSubmit}>
            <FormGroup>
              <StyledLabel htmlFor="email">Email Address</StyledLabel>
              <StyledInput
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoComplete="email"
                autoFocus
              />
            </FormGroup>
            
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? (
                'Sending login link...'
              ) : (
                <>
                  Send Login Link
                  <Mail className="w-4 h-4 ml-2" />
                </>
              )}
            </SubmitButton>
          </FormSection>
          
          <Footer>
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign up
              </Link>
            </p>
          </Footer>
        </CardContent>
      </LoginCard>
    </LoginContainer>
  )
}