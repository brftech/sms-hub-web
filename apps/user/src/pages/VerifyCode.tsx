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
  
  const verificationId = searchParams.get("id");
  const authMethod = searchParams.get("method") || "sms";
  const isExistingUser = searchParams.get("existing") === "true";
  
  // Get signup data from session storage
  const signupData = JSON.parse(sessionStorage.getItem('signup_data') || '{}');
  const [password, setPassword] = useState("");
  
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    console.log("VerifyCode mounted with ID:", verificationId);
    if (!verificationId) {
      console.log("No ID found, redirecting to signup");
      navigate("/signup");
    }
  }, [verificationId, navigate]);

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
    console.log("handleVerify called with:", { 
      code: verificationCode, 
      verificationId,
      hasValidId: !!verificationId 
    });
    
    if (!verificationId) {
      console.error("No verification ID available!");
      setError("Session expired. Please start over.");
      setTimeout(() => navigate("/signup"), 2000);
      return;
    }
    
    if (verificationCode.length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }

    setIsVerifying(true);
    setError("");

    const payload = {
      signup_id: signupData.signupId || verificationId,
      code: verificationCode,
      email: signupData.email,
      mobile_phone_number: signupData.phone,
      auth_method: authMethod
    };
    console.log("Sending verification payload:", payload);

    try {
      // Step 1: Verify the code
      const verifyResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      const verifyData = await verifyResponse.json();
      console.log("Verify response:", verifyResponse.status, verifyData);

      if (!verifyResponse.ok) {
        console.error("Verification failed:", verifyData);
        throw new Error(verifyData.error || "Verification failed");
      }

      // Code is verified! Now redirect to account details
      setSuccess(true);
      
      // Store the signup_id for the next step
      sessionStorage.setItem('verified_signup_id', verifyData.signup_id);
      
      setTimeout(() => {
        navigate(`/account-details?id=${verifyData.signup_id}`);
      }, 1500);
      
    } catch (err: any) {
      console.error("Error in handleVerify:", err);
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
      // Resend using our custom endpoint
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          verification_id: verificationId,
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
            <h2 className="text-2xl font-bold mb-2">
              {isExistingUser ? "Identity Verified!" : "Account Verified!"}
            </h2>
            <p className="text-gray-600 mb-4">
              {isExistingUser 
                ? `Welcome back to ${hubConfig.displayName}!`
                : `Your ${hubConfig.displayName} account has been created successfully.`
              }
            </p>
            <p className="text-sm text-gray-500">
              {isExistingUser 
                ? "Redirecting to login..."
                : "Redirecting to your dashboard..."
              }
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
            {isExistingUser ? "Welcome Back!" : `Verify Your ${authMethod === "sms" ? "Phone" : "Email"}`}
          </CardTitle>
          <CardDescription className="text-center">
            {isExistingUser 
              ? `We've sent a new verification code to your ${authMethod === "sms" ? "phone" : "email"}. Please enter it below to access your account.`
              : `We sent a 6-digit verification code to your ${authMethod === "sms" ? "phone" : "email"}. Please enter it below.`
            }
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