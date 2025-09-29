import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
  useHub,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@sms-hub/ui";
import { Input, Label, Alert, AlertDescription } from "@sms-hub/ui";
import { Shield, AlertCircle, CheckCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { getSupabaseClient } from "../lib/supabaseSingleton";
import styled from "styled-components";

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

type VerificationMode = "otp" | "signup";

export function VerifyAuth() {
  const { hubConfig } = useHub();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Determine mode based on route
  const mode: VerificationMode = location.pathname === "/verify-otp" ? "otp" : "signup";
  
  // OTP mode state
  const email = location.state?.email || sessionStorage.getItem("login_email");
  
  // Signup mode state
  const verificationId = searchParams.get("id");
  const authMethod = searchParams.get("method") || "sms";
  const isExistingUser = searchParams.get("existing") === "true";
  const signupData = JSON.parse(sessionStorage.getItem("signup_data") || "{}");
  
  const supabase = getSupabaseClient();

  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (mode === "otp" && !email) {
      navigate("/login");
    } else if (mode === "signup" && !verificationId && !signupData.verificationId) {
      navigate("/signup");
    }
  }, [mode, email, verificationId, navigate, signupData.verificationId]);

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

    try {
      if (mode === "otp") {
        // Supabase OTP verification
        const { error: verifyError } = await supabase.auth.verifyOtp({
          email,
          token: verificationCode,
          type: "email",
        });

        if (verifyError) {
          setError(verifyError.message);
          setCode("");
          return;
        }

        setSuccess(true);
        sessionStorage.removeItem("login_email");

        // Redirect to unified app as the authenticated user
        setTimeout(() => {
          window.location.href = `${import.meta.env.VITE_UNIFIED_APP_URL || "http://localhost:3001"}/`;
        }, 1500);
      } else {
        // Signup verification via edge function
        const actualVerificationId = verificationId || signupData.verificationId;

        if (!actualVerificationId) {
          setError("Verification session expired. Please start over.");
          setTimeout(() => navigate("/signup"), 2000);
          return;
        }

        const payload = {
          verification_id: actualVerificationId,
          verification_code: verificationCode,
          email: signupData.email,
          mobile_phone_number: signupData.phone,
          auth_method: authMethod,
        };

        const verifyResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-code`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify(payload),
          }
        );

        const verifyData = await verifyResponse.json();

        if (!verifyResponse.ok) {
          throw new Error(verifyData.error || "Verification failed");
        }

        setSuccess(true);
        sessionStorage.setItem("verified_verification_id", verifyData.verification_id);

        setTimeout(() => {
          window.location.href = `${import.meta.env.VITE_UNIFIED_APP_URL || "http://localhost:3001"}/account-details?id=${verifyData.verification_id}`;
        }, 1500);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid verification code");
      setCode("");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError("");

    try {
      if (mode === "otp") {
        // Resend OTP via Supabase
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: false,
          },
        });

        if (error) {
          setError(error.message);
        } else {
          setError("");
          setCode("");
          setResendTimer(30);
          setCanResend(false);
        }
      } else {
        // Resend via edge function
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/resend-verification`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              verification_id: verificationId,
              auth_method: authMethod,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to resend code");
        }

        setResendTimer(30);
        setCanResend(false);
        setError("");
        setCode("");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to resend code");
    } finally {
      setIsResending(false);
    }
  };

  if (success) {
    return (
      <VerificationContainer>
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            {mode === "otp" ? (
              <>
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Welcome Back!</h2>
                <p className="text-gray-600">Redirecting to your dashboard...</p>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">
                  {isExistingUser ? "Identity Verified!" : "Account Verified!"}
                </h2>
                <p className="text-gray-600 mb-4">
                  {isExistingUser
                    ? `Welcome back to ${hubConfig.name}!`
                    : `Your ${hubConfig.name} account has been created successfully.`}
                </p>
                <p className="text-sm text-gray-300">
                  {isExistingUser
                    ? "Redirecting to login..."
                    : "Redirecting to your dashboard..."}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </VerificationContainer>
    );
  }

  return (
    <VerificationContainer>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle>
            {mode === "otp" 
              ? "Enter Verification Code" 
              : (isExistingUser ? "Welcome Back!" : `Verify Your ${authMethod === "sms" ? "Phone" : "Email"}`)}
          </CardTitle>
          <CardDescription>
            {mode === "otp"
              ? `We sent a 6-digit code to ${email}`
              : (isExistingUser
                  ? `We've sent a new verification code to your ${authMethod === "sms" ? "phone" : "email"}. Please enter it below to access your account.`
                  : `We sent a 6-digit verification code to your ${authMethod === "sms" ? "phone" : "email"}. Please enter it below.`)}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="code" className="sr-only">
                Verification Code
              </Label>
              <CodeInput
                id="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={code}
                onChange={handleCodeChange}
                placeholder="000000"
                disabled={isVerifying}
                autoFocus
                autoComplete="one-time-code"
              />
              {mode === "signup" && (
                <p className="text-sm text-gray-300 text-center mt-2">
                  Code expires in 15 minutes
                </p>
              )}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={() => handleVerify()}
              disabled={isVerifying || code.length !== 6}
              className="w-full"
            >
              {isVerifying ? "Verifying..." : "Verify & Sign In"}
            </Button>

            <div className="text-center">
              {mode === "signup" && (
                <p className="text-sm text-gray-600 mb-2">
                  Didn't receive the code?
                </p>
              )}
              <ResendButton
                variant={mode === "otp" ? "ghost" : "outline"}
                onClick={handleResend}
                disabled={!canResend || isResending}
                className="inline-flex items-center text-sm"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                {isResending
                  ? "Sending..."
                  : canResend
                    ? "Resend Code"
                    : `Resend in ${resendTimer}s`}
              </ResendButton>
            </div>

            {mode === "signup" && (
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
            )}
          </div>
        </CardContent>
      </Card>
    </VerificationContainer>
  );
}