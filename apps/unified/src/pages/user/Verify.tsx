import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  // useHub,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@sms-hub/ui";
import { Input, Label, Alert, AlertDescription } from "@sms-hub/ui";
import { CheckCircle, ArrowLeft } from "lucide-react";
import styled from "styled-components";
// import logoIcon from "@sms-hub/ui/assets/gnymble-icon-logo.svg";
import { useSupabase } from "../../providers/SupabaseProvider";
import { redirectToWebApp } from "@sms-hub/utils";

const VerifyContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #2d1b1b 0%, #4a2c2c 50%, #3d2424 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const VerifyCard = styled(Card)`
  width: 100%;
  max-width: 400px;
`;

const LogoSection = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const LogoImage = styled.img`
  width: 48px;
  height: 48px;
  margin: 0 auto 1rem;
  display: block;
`;

const FormSection = styled.form`
  space-y: 4;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const StyledLabel = styled(Label)`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  font-family:
    "Inter",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    sans-serif;
`;

const StyledInput = styled(Input)`
  width: 100%;
  text-align: center;
  font-size: 1.5rem;
  font-family: monospace;
  letter-spacing: 0.5rem;
  padding: 0.75rem;
`;

const SubmitButton = styled(Button)`
  width: 100%;
  height: 48px;
  font-size: 1rem;
  font-weight: 600;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  transition: color 0.2s ease;

  &:hover {
    color: #374151;
  }
`;

export function Verify() {
  // const { hubConfig } = useHub();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const supabase = useSupabase();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [signupData, setSignupData] = useState<any>(null);
  const verificationId = searchParams.get("id");

  useEffect(() => {
    if (!verificationId) {
      redirectToWebApp("/signup");
      return;
    }

    // Load signup data from session storage
    const storedData = sessionStorage.getItem("signup_data");
    if (storedData) {
      setSignupData(JSON.parse(storedData));
    }
  }, [verificationId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationId || !verificationCode) {
      setError("Please enter the verification code");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            verification_id: verificationId,
            verification_code: verificationCode,
            email: signupData?.email,
            mobile_phone_number:
              signupData?.mobile_phone_number || signupData?.phone,
            auth_method: signupData?.authMethod,
          }),
        }
      );

      const result = await response.json();
      console.log("► Verification response:", result);

      if (!response.ok) {
        throw new Error(result.error || "Failed to verify code");
      }

      setSuccess(true);

      // Handle session if provided
      if (result.session || result.session_url) {
        // For login flow, we might get a session URL
        if (result.session_url) {
          window.location.href = result.session_url;
          return;
        }

        // For signup flow, set the session
        if (result.session) {
          const { error: sessionError } = await supabase.auth.setSession(
            result.session
          );
          if (sessionError) {
            console.error("Session error:", sessionError);
          }
        }
      }

      // Clear session storage
      sessionStorage.removeItem("signup_data");

      // Redirect based on flow type
      const isLogin = signupData?.isLogin || false;
      const redirectPath =
        result.redirect || (isLogin ? "/dashboard" : "/onboarding");

      setTimeout(() => {
        navigate(redirectPath);
      }, 2000);
    } catch (err: any) {
      console.error("Verification error:", err);
      setError(err.message || "Failed to verify code");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!verificationId || !signupData) {
      setError("Unable to resend code. Please try signing up again.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
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
            auth_method: signupData.authMethod,
          }),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to resend code");
      }

      setError("");
      alert("A new verification code has been sent!");
    } catch (err: any) {
      console.error("Resend error:", err);
      setError(err.message || "Failed to resend code");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <VerifyContainer>
        <VerifyCard>
          <CardContent className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              {signupData?.isLogin ? "Login Successful!" : "Account Verified!"}
            </h2>
            <p className="text-gray-600 mb-4">
              {signupData?.isLogin
                ? "You have been successfully logged in."
                : "Your account has been successfully created and verified."}
            </p>
            <p className="text-sm text-gray-500">
              {signupData?.isLogin
                ? "Redirecting to dashboard..."
                : "Redirecting to complete setup..."}
            </p>
          </CardContent>
        </VerifyCard>
      </VerifyContainer>
    );
  }

  if (!verificationId) {
    return null;
  }

  return (
    <VerifyContainer>
      <VerifyCard>
        <CardHeader>
          <LogoSection>
            <LogoImage src="/favicon.svg" alt="Logo" />
            <CardTitle className="text-xl">Verify Your Account</CardTitle>
            <CardDescription className="text-sm">
              Enter the 6-digit verification code sent to your{" "}
              {signupData?.authMethod === "sms" ? "phone" : "email"}
            </CardDescription>
          </LogoSection>
        </CardHeader>

        <CardContent>
          <BackButton onClick={() => redirectToWebApp("/signup")}>
            <ArrowLeft className="w-3 h-3 mr-1" />
            Back to Signup
          </BackButton>

          <FormSection onSubmit={handleSubmit}>
            <FormGroup>
              <StyledLabel htmlFor="verification_code">
                Verification Code
              </StyledLabel>
              <StyledInput
                id="verification_code"
                type="text"
                placeholder="123456"
                maxLength={6}
                value={verificationCode}
                onChange={(e) =>
                  setVerificationCode(e.target.value.replace(/\D/g, ""))
                }
                disabled={isSubmitting}
                autoFocus
              />
            </FormGroup>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Verifying..." : "Verify Code"}
            </SubmitButton>
          </FormSection>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 mb-2">
              Didn't receive the code?
            </p>
            <button
              type="button"
              onClick={handleResend}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              disabled={isSubmitting}
            >
              Resend Code
            </button>
          </div>
        </CardContent>
      </VerifyCard>
    </VerifyContainer>
  );
}
