import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useHub, Card, CardContent, CardHeader, CardTitle, HubLogo } from "@sms-hub/ui";
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { getSupabaseClient } from "../lib/supabaseSingleton";
import styled from "styled-components";

const CallbackContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #2d1b1b 0%, #4a2c2c 50%, #3d2424 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const StatusIcon = styled.div<{ status: 'loading' | 'success' | 'error' }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  
  ${props => props.status === 'loading' && `
    background: linear-gradient(135deg, #f59e0b, #d97706);
    animation: pulse 2s infinite;
  `}
  
  ${props => props.status === 'success' && `
    background: linear-gradient(135deg, #10b981, #059669);
  `}
  
  ${props => props.status === 'error' && `
    background: linear-gradient(135deg, #ef4444, #dc2626);
  `}
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;

// Function to create business records after email confirmation
const createBusinessRecords = async (user: any, accountData: any) => {
  try {
    console.log('Creating business records for user:', user.id);
    
    // Create a new Supabase client with the user's session
    const supabase = getSupabaseClient();
    
    // Generate unique identifiers
    const timestamp = new Date().toISOString();
    const companyId = crypto.randomUUID();
    const accountNumber = `ACC-${Date.now()}`;
    
    // Step 1: Create company record
    console.log('Creating company record...');
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .insert([{
        id: companyId,
        hub_id: accountData.hubId,
        public_name: accountData.companyName,
        legal_name: accountData.companyName,
        company_account_number: accountNumber,
        signup_type: 'new_company',
        is_active: true,
        first_admin_user_id: user.id,
        created_at: timestamp,
        updated_at: timestamp,
      }])
      .select()
      .single();

    if (companyError) {
      throw new Error(`Failed to create company: ${companyError.message}`);
    }
    
    console.log('✅ Company created:', companyData.id);

    // Step 2: Create user profile record
    console.log('Creating user profile record...');
    const { data: userProfileData, error: userProfileError } = await supabase
      .from('user_profiles')
      .insert([{
        id: user.id,
        email: user.email,
        account_number: `USR-${Date.now()}`,
        hub_id: accountData.hubId,
        first_name: accountData.firstName,
        last_name: accountData.lastName,
        role: 'ADMIN',
        signup_type: 'new_company',
        company_admin: true,
        company_admin_since: timestamp,
        company_id: companyId,
        is_active: true,
        created_at: timestamp,
        updated_at: timestamp,
      }])
      .select()
      .single();

    if (userProfileError) {
      throw new Error(`Failed to create user profile: ${userProfileError.message}`);
    }
    
    console.log('✅ User profile created:', userProfileData.id);

    // Step 3: Create membership record
    console.log('Creating membership record...');
    const { data: membershipData, error: membershipError } = await supabase
      .from('memberships')
      .insert([{
        user_id: user.id,
        company_id: companyId,
        hub_id: accountData.hubId,
        role: 'ADMIN',
        permissions: { admin: true, manage_users: true, manage_settings: true },
        is_active: true,
        joined_at: timestamp,
        created_at: timestamp,
        updated_at: timestamp,
      }])
      .select()
      .single();

    if (membershipError) {
      console.warn('⚠️ Failed to create membership (non-critical):', membershipError.message);
    } else {
      console.log('✅ Membership created:', membershipData.id);
    }

    // Step 4: Create onboarding submission record
    console.log('Creating onboarding submission record...');
    const { data: onboardingData, error: onboardingError } = await supabase
      .from('onboarding_submissions')
      .insert([{
        company_id: companyId,
        user_id: user.id,
        hub_id: accountData.hubId,
        current_step: 'payment',
        stripe_status: 'pending',
        submission_data: {
          company_name: accountData.companyName,
          first_name: accountData.firstName,
          last_name: accountData.lastName,
          email: user.email,
          hub_id: accountData.hubId,
        },
        created_at: timestamp,
        updated_at: timestamp,
      }])
      .select()
      .single();

    if (onboardingError) {
      console.warn('⚠️ Failed to create onboarding submission (non-critical):', onboardingError.message);
    } else {
      console.log('✅ Onboarding submission created:', onboardingData.id);
    }

    console.log('✅ All business records created successfully');
    
    // Store the company ID for later use
    sessionStorage.setItem('created_company_id', companyId);
    
  } catch (error) {
    console.error('❌ Failed to create business records:', error);
    throw error;
  }
};

export function AuthCallback() {
  const { hubConfig } = useHub();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');
  const [error, setError] = useState('');

  // Add error boundary for Supabase client
  let supabase;
  try {
    supabase = getSupabaseClient();
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    setStatus('error');
    setError('Configuration error. Please contact support.');
    setMessage('Unable to verify email');
  }

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('AuthCallback: Starting auth callback handling');
        
        // Get the auth tokens from URL parameters
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const type = searchParams.get('type');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        console.log('AuthCallback: URL params:', { 
          accessToken: !!accessToken, 
          refreshToken: !!refreshToken, 
          type, 
          error, 
          errorDescription 
        });

        // Handle error cases
        if (error) {
          console.error('Auth callback error:', error, errorDescription);
          setStatus('error');
          setError(errorDescription || error);
          setMessage('Email verification failed');
          return;
        }

        // Handle email confirmation or dev mode
        if (type === 'signup' && (accessToken && refreshToken || searchParams.get('dev_mode') === 'true')) {
          console.log('Processing email confirmation or dev mode...');
          
          let sessionData;
          
          if (searchParams.get('dev_mode') === 'true') {
            // Dev mode: Get account data and create a mock user object
            const accountData = sessionStorage.getItem('account_data');
            if (!accountData) {
              throw new Error('Account data not found. Please start the signup process again.');
            }

            const parsedData = JSON.parse(accountData);
            console.log('Dev mode: Creating business records with stored data');
            
            // Create a mock user object for dev mode
            sessionData = {
              user: {
                id: crypto.randomUUID(), // Generate a temporary ID
                email: parsedData.email,
                email_confirmed_at: new Date().toISOString()
              }
            };
            
            // Create business records directly
            try {
              await createBusinessRecords(sessionData.user, parsedData);
              setStatus('success');
              setMessage('Account created successfully! Your account is ready.');
            } catch (recordError) {
              console.error('Failed to create business records:', recordError);
              setStatus('error');
              setError('Account setup failed. Please contact support.');
              setMessage('Account creation incomplete');
              return;
            }
          } else {
            // Normal email confirmation flow
            sessionData = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });

            if (sessionData.error) {
              console.error('Session error:', sessionData.error);
              
              // Check if it's a token expiry error
              if (sessionData.error.message.includes('expired') || sessionData.error.message.includes('invalid')) {
                setStatus('error');
                setError('This verification link has expired. Please request a new one.');
                setMessage('Link expired - please resend verification email');
                return;
              }
              
              throw new Error(sessionData.error.message);
            }

            if (sessionData.data?.user) {
              console.log('Email confirmed successfully for user:', sessionData.data.user.id);
              
              // Get account data from session storage
              const accountData = sessionStorage.getItem('account_data');
              if (!accountData) {
                throw new Error('Account data not found. Please start the signup process again.');
              }

              const parsedData = JSON.parse(accountData);
              console.log('Account data found:', parsedData);

              // Create business records after email confirmation
              try {
                await createBusinessRecords(sessionData.data.user, parsedData);
                setStatus('success');
                setMessage('Email verified successfully! Your account is ready.');
              } catch (recordError) {
                console.error('Failed to create business records:', recordError);
                setStatus('error');
                setError('Account created but setup failed. Please contact support.');
                setMessage('Email verified but account setup incomplete');
                return;
              }
            } else {
              throw new Error('No user data received');
            }
          }

          // Redirect to payment setup after a short delay
          setTimeout(() => {
            // For now, redirect to the unified app
            // In the future, this should go to a payment setup page
            window.location.href = `${import.meta.env.VITE_UNIFIED_APP_URL || "http://localhost:3001"}/?superadmin=dev123`;
          }, 2000);
        } else {
          // Handle other auth types or missing parameters
          console.log('Unexpected auth callback type or missing tokens:', { type, accessToken: !!accessToken, refreshToken: !!refreshToken });
          setStatus('error');
          setError('Invalid verification link');
          setMessage('This verification link is invalid or expired');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setStatus('error');
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        setMessage('Email verification failed');
      }
    };

    handleAuthCallback();
  }, [searchParams, supabase.auth]);

  const handleRetry = () => {
    navigate('/signup');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  // Fallback if hubConfig is not available
  if (!hubConfig) {
    return (
      <CallbackContainer>
        <div className="w-full max-w-md">
          <Card className="shadow-2xl">
            <CardContent className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-700">Loading...</p>
            </CardContent>
          </Card>
        </div>
      </CallbackContainer>
    );
  }

  return (
    <CallbackContainer>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <HubLogo hubType={hubConfig.id} size="lg" className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">
            {hubConfig.displayName}
          </h1>
        </div>

        <Card className="shadow-2xl">
          <CardHeader className="text-center pb-4">
            <StatusIcon status={status}>
              {status === 'loading' && <RefreshCw className="w-10 h-10 text-white animate-spin" />}
              {status === 'success' && <CheckCircle className="w-10 h-10 text-white" />}
              {status === 'error' && <AlertCircle className="w-10 h-10 text-white" />}
            </StatusIcon>
            <CardTitle className="text-xl font-semibold text-gray-900">
              {status === 'loading' && 'Verifying Email...'}
              {status === 'success' && 'Email Verified!'}
              {status === 'error' && 'Verification Failed'}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-gray-700 mb-4">
                {message}
              </p>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">
                    {error}
                  </p>
                </div>
              )}
            </div>

            {status === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-900 mb-2">Account Created Successfully!</h3>
                <ol className="text-sm text-green-800 space-y-1">
                  <li>✅ Email verified</li>
                  <li>✅ Company profile created</li>
                  <li>✅ User account activated</li>
                  <li>🔄 Complete payment setup</li>
                  <li>🔄 Configure SMS settings</li>
                </ol>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Don't worry, you can try again or contact support if the problem persists.
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleRetry}
                    className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => window.location.href = '/check-email'}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Resend Email
                  </button>
                  <button
                    onClick={handleGoHome}
                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Go Home
                  </button>
                </div>
              </div>
            )}

            {status === 'loading' && (
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Please wait while we verify your email address...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CallbackContainer>
  );
}
