import { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useHub, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, HubLogo } from '@sms-hub/ui'
import { Input, Label, Alert, AlertDescription } from '@sms-hub/ui'
import { Mail, Phone, CheckCircle, Shield, Lock } from 'lucide-react'
import styled from 'styled-components'
import { getSupabaseClient } from '../lib/supabaseSingleton'
import { useDevAuth, activateDevAuth } from '../hooks/useDevAuth'
import { DevAuthToggle } from '@sms-hub/ui'
import { webEnvironment } from '../config/webEnvironment'

const LoginContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #2d1b1b 0%, #4a2c2c 50%, #3d2424 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const StyledLabel = styled(Label)`
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
`;

const StyledInput = styled(Input)`
  width: 100%;
  height: 36px;
  font-size: 0.875rem;
`;

const NameRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const NameField = styled.div`
  flex: 1;
`;

const VerificationMethod = styled.div`
  margin-bottom: 1rem;
`;

export function Login() {
  const { hubConfig } = useHub()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const devAuth = useDevAuth()
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [authMethod, setAuthMethod] = useState<'sms' | 'email'>('sms')
  const [loginType, setLoginType] = useState<'verification' | 'password'>('verification')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showLegacyOption, setShowLegacyOption] = useState(false)
  
  
  // Check for dev superadmin mode and redirect
  useEffect(() => {
    if (devAuth.isInitialized && devAuth.isSuperadmin) {
      console.log('Dev superadmin mode active - redirecting from login')
      const redirectUrl = searchParams.get('redirect') || 'http://localhost:3001/'
      window.location.href = redirectUrl
    }
  }, [devAuth.isInitialized, devAuth.isSuperadmin, searchParams])

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    const withoutCountryCode = cleaned.startsWith('1') ? cleaned.slice(1) : cleaned
    const limited = withoutCountryCode.slice(0, 10)
    
    if (limited.length === 10) {
      const match = limited.match(/^(\d{3})(\d{3})(\d{4})$/)
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`
      }
    } else if (limited.length >= 6) {
      const match = limited.match(/^(\d{3})(\d{3})(\d{0,4})$/)
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`
      }
    } else if (limited.length >= 3) {
      const match = limited.match(/^(\d{3})(\d{0,3})$/)
      if (match) {
        return `(${match[1]}) ${match[2]}`
      }
    }
    
    return limited
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhone(formatted)
  }

  const getPhoneForAPI = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    const withoutCountryCode = cleaned.startsWith('1') ? cleaned.slice(1) : cleaned
    return `+1${withoutCountryCode}`
  }
  
  const handleSuperadminLogin = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const supabase = getSupabaseClient()
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'superadmin@sms-hub.com',
        password: 'SuperAdmin123!',
      })
      
      if (signInError) throw signInError
      
      // Update last login method
      if (data.user) {
        await supabase
          .from('user_profiles')
          .update({ 
            last_login_method: 'password',
            updated_at: new Date().toISOString()
          })
          .eq('id', data.user.id)
      }
      
      // Redirect to user app dashboard or specified redirect URL
      const redirectUrl = searchParams.get('redirect') || 'http://localhost:3001/'
      window.location.href = redirectUrl
      
    } catch (err: any) {
      console.error('Superadmin login error:', err)
      setError(err.message || 'Superadmin login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (loginType === 'password') {
      // Legacy password login
      if (!email || !password) {
        setError('Please enter both email and password')
        return
      }
      
      setIsLoading(true)
      setError('')
      
      try {
        const supabase = createSupabaseClient(
          import.meta.env.VITE_SUPABASE_URL,
          import.meta.env.VITE_SUPABASE_ANON_KEY
        )
        
        if (!supabase) {
          throw new Error('Failed to initialize Supabase client')
        }
        
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (signInError) throw signInError
        
        // Update last login method
        if (data.user) {
          await supabase
            .from('user_profiles')
            .update({ 
              last_login_method: 'password',
              updated_at: new Date().toISOString()
            })
            .eq('id', data.user.id)
        }
        
        // Redirect to user app dashboard or specified redirect URL
        const redirectUrl = searchParams.get('redirect') || 'http://localhost:3001/'
        window.location.href = redirectUrl
        
      } catch (err: any) {
        console.error('Password login error:', err)
        setError(err.message || 'Invalid email or password')
        
        // If error suggests no account, show helpful message
        if (err.message?.includes('Invalid login credentials')) {
          setError('Invalid email or password. New users should sign up first.')
        }
      } finally {
        setIsLoading(false)
      }
    } else {
      // Modern verification login
      if (!email || !phone) {
        setError('Please enter both email and phone number')
        return
      }
      
      setIsLoading(true)
      setError('')
      
      try {
        // Use the submit-verify function for login
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            action: "send",
            email: email,
            mobile_phone_number: getPhoneForAPI(phone),
            auth_method: authMethod,
            is_login: true,
          }),
        })

        const result = await response.json()
        if (!response.ok) {
          // If user not found, suggest they might need password login
          if (result.error?.includes('No account found')) {
            setError('No account found. Are you a returning user? Try password login below.')
            setShowLegacyOption(true)
            return
          }
          throw new Error(result.error || "Failed to send verification")
        }

        setSuccess(true)
        
        // Store data for verification page
        sessionStorage.setItem('signup_data', JSON.stringify({
          email,
          phone: getPhoneForAPI(phone),
          authMethod,
          verificationId: result.id,
          isLogin: true,
        }))
        
        // Redirect to verification page
        setTimeout(() => {
          navigate(`/verify?id=${result.id}`)
        }, 2000)
        
      } catch (err: any) {
        console.error('Login error:', err)
        setError(err.message || 'Failed to send verification code')
      } finally {
        setIsLoading(false)
      }
    }
  }
  
  if (success) {
    return (
      <LoginContainer>
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-gray-900">Verification Sent!</h2>
            <p className="text-gray-600 mb-4">
              We've sent a verification code to your {authMethod === 'sms' ? 'phone' : 'email'}
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to verification page...
            </p>
          </CardContent>
        </Card>
      </LoginContainer>
    )
  }
  
  return (
    <LoginContainer>
      <DevAuthToggle environment={webEnvironment} onActivate={() => activateDevAuth()} />
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="text-center mb-6">
            <HubLogo hubType={hubConfig.id} variant="icon" size="md" className="mx-auto mb-4" />
            <CardTitle className="text-2xl text-gray-900">Welcome Back</CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to your {hubConfig.displayName} account
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {loginType === 'verification' ? (
              <>
                <NameRow>
                  <NameField>
                    <StyledLabel htmlFor="phone">
                      Phone Number *
                    </StyledLabel>
                    <StyledInput
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={phone}
                      onChange={handlePhoneChange}
                      disabled={isLoading}
                      autoFocus
                    />
                  </NameField>
                  
                  <NameField>
                    <StyledLabel htmlFor="email">
                      Email Address *
                    </StyledLabel>
                    <StyledInput
                      id="email"
                      type="email"
                      placeholder="john@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </NameField>
                </NameRow>
              </>
            ) : (
              <>
                <FormGroup>
                  <StyledLabel htmlFor="email">
                    Email Address *
                  </StyledLabel>
                  <StyledInput
                    id="email"
                    type="email"
                    placeholder="john@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    autoFocus
                  />
                </FormGroup>
                
                <FormGroup>
                  <StyledLabel htmlFor="password">
                    Password *
                  </StyledLabel>
                  <StyledInput
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </FormGroup>
                
                {/* Superadmin Login Button */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    onClick={handleSuperadminLogin}
                    disabled={isLoading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Superadmin Login
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Quick access for system administrators
                  </p>
                </div>
              </>
            )}

            {loginType === 'verification' && (
              <VerificationMethod>
                <StyledLabel>Verification Method</StyledLabel>
                <div className="space-y-3 mt-3">
                  <label className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-all hover:border-orange-300 ${authMethod === 'sms' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
                    <input
                      type="radio"
                      name="auth_method"
                      value="sms"
                      checked={authMethod === "sms"}
                      onChange={() => setAuthMethod("sms")}
                      className="mt-1 w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1.5 text-orange-600" />
                        <span className="font-medium text-orange-600">SMS Verification</span>
                        <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">Faster</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        Receive your code instantly via SMS
                      </p>
                    </div>
                  </label>
                  
                  <label className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-all hover:border-gray-300 ${authMethod === 'email' ? 'border-gray-500 bg-gray-50' : 'border-gray-200'}`}>
                    <input
                      type="radio"
                      name="auth_method"
                      value="email"
                      checked={authMethod === "email"}
                      onChange={() => setAuthMethod("email")}
                      className="mt-1 w-4 h-4 text-gray-600 border-gray-300 focus:ring-gray-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1.5 text-gray-600" />
                        <span className="font-medium text-gray-700">Email Verification</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        Receive your code via email
                      </p>
                    </div>
                  </label>
                </div>
              </VerificationMethod>
            )}
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full hub-bg-primary hover:hub-bg-primary/90"
            >
              {isLoading 
                ? 'Loading...' 
                : loginType === 'verification' 
                  ? 'Send Verification Code' 
                  : 'Sign In'}
              {loginType === 'verification' ? (
                <Shield className="w-4 h-4 ml-2" />
              ) : (
                <Lock className="w-4 h-4 ml-2" />
              )}
            </Button>
            
            {/* Legacy user option */}
            {(showLegacyOption || loginType === 'password') && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setLoginType(loginType === 'verification' ? 'password' : 'verification')
                    setError('')
                    setPassword('')
                  }}
                  className="text-sm hub-text-primary hover:underline"
                >
                  {loginType === 'verification' 
                    ? 'Returning user? Sign in with password' 
                    : 'Use verification code instead'}
                </button>
              </div>
            )}
          </form>
          
          <div className="text-center mt-6 pt-6 border-t">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="hub-text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
            
            {/* Subtle legacy login option for users who know they need it */}
            {!showLegacyOption && loginType === 'verification' && (
              <button
                onClick={() => setShowLegacyOption(true)}
                className="text-xs text-gray-500 hover:text-gray-600 mt-2 underline"
              >
                Having trouble? More options
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </LoginContainer>
  )
}
