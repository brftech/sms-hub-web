import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useHub, Card, CardContent, CardHeader, CardTitle, HubLogo } from "@sms-hub/ui";
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { getSupabaseClient } from "../lib/supabaseSingleton";
import { environmentConfig } from "../config/environment";
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

export function AuthCallback() {
  const { hubConfig } = useHub();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');
  const [error, setError] = useState('');

  const supabase = getSupabaseClient();

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

        // Handle email confirmation
        if (type === 'signup' && accessToken && refreshToken) {
          console.log('Processing email confirmation...');

          // Set the session with the tokens
          const sessionData = await supabase.auth.setSession({
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
            setMessage('Setting up your account...');

            // Call the Edge Function to create business records
            try {
              const response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/complete-signup`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                  },
                }
              );

              const result = await response.json();

              if (!response.ok) {
                throw new Error(result.error || "Failed to complete account setup");
              }

              console.log('✅ Business records created:', result);

              // Clear session storage
              sessionStorage.removeItem('account_data');
              sessionStorage.removeItem('signup_email');

              setStatus('success');
              setMessage('Email verified successfully! Your account is ready.');

              // Redirect to unified app after a short delay
              setTimeout(() => {
                const redirectUrl = environmentConfig.enableDevAuth && environmentConfig.devAuthToken && environmentConfig.isDevelopment
                  ? `${environmentConfig.unifiedAppUrl}/?superadmin=${environmentConfig.devAuthToken}`
                  : environmentConfig.unifiedAppUrl;

                window.location.href = redirectUrl;
              }, 2000);

            } catch (recordError) {
              console.error('Failed to create business records:', recordError);

              // Account is created but setup failed - user can still log in
              setStatus('success');
              setMessage('Email verified! Please complete your profile setup after logging in.');

              // Still redirect but with a note
              setTimeout(() => {
                window.location.href = environmentConfig.unifiedAppUrl;
              }, 3000);
            }
          } else {
            throw new Error('No user data received');
          }
        } else if (type === 'recovery' && accessToken && refreshToken) {
          // Handle password recovery
          console.log('Processing password recovery...');

          const sessionData = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (sessionData.error) {
            throw new Error(sessionData.error.message);
          }

          setStatus('success');
          setMessage('Password reset verified! Redirecting to reset page...');

          setTimeout(() => {
            navigate('/reset-password');
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
  }, [searchParams, supabase.auth, navigate]);

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
                <p className="text-sm text-green-800">
                  Redirecting you to the dashboard...
                </p>
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