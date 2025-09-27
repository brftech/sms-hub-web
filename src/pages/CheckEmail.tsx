import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHub, Card, CardContent, CardHeader, CardTitle, HubLogo } from "@sms-hub/ui";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";
import styled from "styled-components";

const CheckEmailContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #2d1b1b 0%, #4a2c2c 50%, #3d2424 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const EmailIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--hub-primary), var(--hub-primary-dark));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const ResendButton = styled.button`
  background: transparent;
  color: var(--hub-primary);
  border: 1px solid var(--hub-primary);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: var(--hub-primary);
    color: white;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export function CheckEmail() {
  const { hubConfig, currentHub } = useHub();
  const [email, setEmail] = useState<string>("");
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    // Get email from session storage
    const signupEmail = sessionStorage.getItem('signup_email');
    if (signupEmail) {
      setEmail(signupEmail);
    }
  }, []);

  useEffect(() => {
    // Handle resend cooldown
    let timer: ReturnType<typeof setTimeout>;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleResendEmail = async () => {
    if (!email || isResending || resendCooldown > 0) return;

    setIsResending(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/resend-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to resend email");
      }

      console.log("Resend verification response:", result);
      setResendMessage("Verification email sent successfully!");
      setResendCooldown(60); // 60 second cooldown
      
      // Clear success message after 5 seconds
      setTimeout(() => setResendMessage(""), 5000);
    } catch (error) {
      console.error("Failed to resend email:", error);
      setResendMessage(error instanceof Error ? error.message : "Failed to resend email");
      
      // Clear error message after 5 seconds
      setTimeout(() => setResendMessage(""), 5000);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <CheckEmailContainer>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <HubLogo hubType={currentHub} size="lg" className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">
            {hubConfig.name}
          </h1>
        </div>

        <Card className="shadow-2xl">
          <CardHeader className="text-center pb-4">
            <EmailIcon>
              <Mail className="w-10 h-10 text-white" />
            </EmailIcon>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Check Your Email
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-gray-700 mb-4">
                We've sent a magic link to:
              </p>
              <p className="font-semibold text-lg text-gray-900 bg-gray-50 px-4 py-2 rounded-lg border">
                {email || "your email address"}
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Almost there!</h3>
                <p className="text-sm text-blue-800 mb-3">
                  Your account has been created. Please verify your email to log in and start using the platform.
                </p>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Check your email inbox</li>
                  <li>2. Click the verification link</li>
                  <li>3. Log in to access your dashboard</li>
                </ol>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 text-center">
                  After verifying your email, you'll be able to log in at:
                </p>
                <Link 
                  to="/login" 
                  className="inline-flex items-center justify-center w-full mt-3 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  Go to Login Page
                </Link>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Didn't receive the email? Check your spam folder or resend it.
                </p>
                
                {resendMessage && (
                  <div className={`mb-4 p-3 rounded-lg text-sm ${
                    resendMessage.includes('successfully') 
                      ? 'bg-green-50 text-green-800 border border-green-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {resendMessage}
                  </div>
                )}
                
                <ResendButton
                  onClick={handleResendEmail}
                  disabled={isResending || resendCooldown > 0}
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : resendCooldown > 0 ? (
                    `Resend in ${resendCooldown}s`
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Resend Email
                    </>
                  )}
                </ResendButton>
              </div>
            </div>

            <div className="border-t pt-6">
              <Link 
                to="/" 
                className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </CheckEmailContainer>
  );
}