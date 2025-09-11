import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@sms-hub/ui";
import { Input, Label, Alert, AlertDescription } from "@sms-hub/ui";
import { Shield, CheckCircle, RefreshCw } from "lucide-react";
import { createSupabaseClient } from "@sms-hub/supabase";
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

export function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const email = location.state?.email || sessionStorage.getItem("login_email");

  const supabase = createSupabaseClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

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

      // Clear stored email
      sessionStorage.removeItem("login_email");

      // Redirect to user app dashboard
      setTimeout(() => {
        window.location.href = "http://localhost:3001/?superadmin=dev123";
      }, 1500);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Invalid verification code"
      );
      setCode("");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
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
        // Show success message
        const successMsg = document.createElement("div");
        successMsg.textContent = "New code sent!";
        successMsg.className = "text-green-600 text-sm mt-2";
        document.getElementById("resend-button")?.appendChild(successMsg);
        setTimeout(() => successMsg.remove(), 3000);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to resend code");
    }
  };

  if (success) {
    return (
      <VerificationContainer>
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Welcome Back!</h2>
            <p className="text-gray-600">Redirecting to your dashboard...</p>
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
          <CardTitle>Enter Verification Code</CardTitle>
          <CardDescription>We sent a 6-digit code to {email}</CardDescription>
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
            </div>

            {error && (
              <Alert variant="destructive">
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

            <div id="resend-button" className="text-center">
              <button
                onClick={handleResend}
                className="text-sm text-blue-600 hover:text-blue-700"
                disabled={isVerifying}
              >
                <RefreshCw className="w-4 h-4 inline mr-1" />
                Resend Code
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </VerificationContainer>
  );
}
