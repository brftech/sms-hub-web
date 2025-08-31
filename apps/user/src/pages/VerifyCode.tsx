import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useHub, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@sms-hub/ui";
import { Input, Label, Alert, AlertDescription } from "@sms-hub/ui";
import { Shield, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import styled from "styled-components";
import { createSupabaseClient } from "@sms-hub/supabase";

const VerificationContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const CodeInput = styled(Input)`
  font-size: 2rem;
  text-align: center;
  letter-spacing: 1rem;
  font-weight: bold;
`;

const ResendButton = styled(Button)`
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export function VerifyCode() {
  const { hubConfig } = useHub();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const supabase = createSupabaseClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
  
  const tempSignupId = searchParams.get("id");
  const authMethod = searchParams.get("method") || "sms";
  
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    console.log("VerifyCode mounted with ID:", tempSignupId);
    if (!tempSignupId) {
      console.log("No ID found, redirecting to signup");
      navigate("/signup");
    }
  }, [tempSignupId, navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 6) {
      setCode(value);
      // Auto-submit when 6 digits are entered
      if (value.length === 6) {
        handleVerify(value);
      }
    }
  };

  const handleVerify = async (verificationCode: string = code) => {
    if (verificationCode.length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }

    setIsVerifying(true);
    setError("");

    const payload = {
      temp_signup_id: tempSignupId,
      verification_code: verificationCode,
    };
    console.log("Sending verification payload:", payload);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-code-simple`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Verify response:", response.status, data);

      if (!response.ok) {
        console.error("Verification failed:", data);
        throw new Error(data.error || "Verification failed");
      }

      setSuccess(true);
      
      // Now create the actual account
      if (data.tempSignup) {
        console.log("Creating account for verified signup...");
        
        const accountResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-account`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            temp_signup_id: tempSignupId,
          }),
        });
        
        const accountData = await accountResponse.json();
        console.log("Account creation response:", accountData);
        
        if (accountResponse.ok && accountData.success) {
          // Try to sign in the user with OTP
          console.log("Attempting to sign in user with OTP...");
          try {
            const { data: signInData, error: signInError } = await supabase.auth.signInWithOtp({
              email: data.tempSignup.email,
              options: {
                shouldCreateUser: false, // User already exists
              }
            });
            
            if (signInError) {
              console.error("OTP sign-in error:", signInError);
            } else {
              console.log("OTP sent successfully:", signInData);
            }
          } catch (otpError) {
            console.error("Failed to send OTP:", otpError);
          }
          
          // Now create Stripe checkout session
          console.log("Creating Stripe checkout session...");
          
          const checkoutResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              email: data.tempSignup.email,
              userId: accountData.account?.userId,
              companyId: accountData.account?.companyId,
              hubId: data.tempSignup.hub_id,
            }),
          });
          
          const checkoutData = await checkoutResponse.json();
          console.log("Checkout session response:", checkoutData);
          
          if (checkoutResponse.ok && checkoutData.success && checkoutData.url) {
            // Redirect to Stripe Checkout
            setTimeout(() => {
              window.location.href = checkoutData.url;
            }, 2000);
          } else {
            // If checkout fails, still go to dashboard
            console.error("Checkout session creation failed:", checkoutData.error);
            setTimeout(() => {
              navigate("/");
            }, 2000);
          }
        } else {
          setError(accountData.error || "Failed to create account");
          setSuccess(false);
        }
      }
    } catch (err: any) {
      setError(err.message || "Invalid verification code");
      setCode("");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError("");

    try {
      // Create a new temp signup with the same data to get a new code
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          temp_signup_id: tempSignupId,
          auth_method: authMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend code");
      }

      // Reset timer
      setResendTimer(30);
      setCanResend(false);
      setError("");
      setCode("");
    } catch (err: any) {
      setError(err.message || "Failed to resend verification code");
    } finally {
      setIsResending(false);
    }
  };

  if (success) {
    return (
      <VerificationContainer>
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Account Verified!</h2>
            <p className="text-gray-600 mb-4">
              Your {hubConfig.displayName} account has been created successfully.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to complete payment setup...
            </p>
          </CardContent>
        </Card>
      </VerificationContainer>
    );
  }

  return (
    <VerificationContainer>
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl text-center">
            Verify Your {authMethod === "sms" ? "Phone" : "Email"}
          </CardTitle>
          <CardDescription className="text-center">
            We sent a 6-digit verification code to your {authMethod === "sms" ? "phone" : "email"}.
            Please enter it below.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            <div>
              <Label htmlFor="code" className="text-center block mb-2">
                Enter Verification Code
              </Label>
              <CodeInput
                id="code"
                type="text"
                inputMode="numeric"
                placeholder="000000"
                value={code}
                onChange={handleCodeChange}
                disabled={isVerifying}
                maxLength={6}
                autoFocus
              />
              <p className="text-sm text-gray-500 text-center mt-2">
                Code expires in 15 minutes
              </p>
            </div>

            <Button
              onClick={() => handleVerify()}
              className="w-full"
              size="lg"
              disabled={isVerifying || code.length !== 6}
            >
              {isVerifying ? "Verifying..." : "Verify Code"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Didn't receive the code?
              </p>
              <ResendButton
                variant="outline"
                onClick={handleResend}
                disabled={!canResend || isResending}
                className="inline-flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {isResending
                  ? "Sending..."
                  : canResend
                  ? "Resend Code"
                  : `Resend in ${resendTimer}s`}
              </ResendButton>
            </div>

            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600">
                Wrong information?{" "}
                <a
                  href="/signup"
                  className="text-blue-600 hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/signup");
                  }}
                >
                  Start over
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </VerificationContainer>
  );
}