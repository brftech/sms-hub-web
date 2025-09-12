import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useHub,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@sms-hub/ui";
import { Input, Label, Alert, AlertDescription, Checkbox } from "@sms-hub/ui";
import { Phone, Shield, CheckCircle2, ArrowRight } from "lucide-react";
import styled from "styled-components";
import { getSupabaseClient } from "../../lib/supabaseSingleton";
import { useUserProfile } from "@sms-hub/supabase/react";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const FormSection = styled.div`
  margin-bottom: 1.5rem;
`;

const ConsentBox = styled.div`
  background: #f0f9ff;
  border: 1px solid #0284c7;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const VerificationCode = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin: 2rem 0;
`;

const CodeInput = styled(Input)`
  width: 3rem;
  height: 3rem;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
`;

const supabase = getSupabaseClient();

export function SmsVerification() {
  const { hubConfig } = useHub();
  const navigate = useNavigate();
  const { data: userProfile } = useUserProfile();
  
  const [step, setStep] = useState<"consent" | "verify">("consent");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [verificationId, setVerificationId] = useState("");

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const withoutCountryCode = cleaned.startsWith("1") ? cleaned.slice(1) : cleaned;
    const limited = withoutCountryCode.slice(0, 10);

    if (limited.length === 10) {
      const match = limited.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
      }
    } else if (limited.length >= 6) {
      const match = limited.match(/^(\d{3})(\d{3})(\d{0,4})$/);
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
      }
    } else if (limited.length >= 3) {
      const match = limited.match(/^(\d{3})(\d{0,3})$/);
      if (match) {
        return `(${match[1]}) ${match[2]}`;
      }
    }

    return limited;
  };

  const getPhoneForAPI = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    const withoutCountryCode = cleaned.startsWith("1") ? cleaned.slice(1) : cleaned;
    return `+1${withoutCountryCode}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only single digit

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSendCode = async () => {
    if (!phone || !consent) {
      setError("Please enter your phone number and agree to receive SMS messages");
      return;
    }

    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sms-verification-consent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
          body: JSON.stringify({
            action: "send",
            phone_number: getPhoneForAPI(phone),
            consent_given: consent,
            consent_text: "I consent to receive SMS messages for account verification and important updates about my SMS Hub account",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send verification code");
      }

      if (result.already_verified) {
        // Phone already verified, skip to next step
        navigate("/onboarding");
        return;
      }

      setVerificationId(result.verification_id);
      setStep("verify");
    } catch (err: any) {
      console.error("SMS send error:", err);
      setError(err.message || "Failed to send verification code");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async () => {
    const code = verificationCode.join("");
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sms-verification-consent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
          body: JSON.stringify({
            action: "verify",
            phone_number: getPhoneForAPI(phone),
            verification_code: code,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Invalid verification code");
      }

      // Success! Navigate to onboarding or dashboard
      navigate("/onboarding");
    } catch (err: any) {
      console.error("Verification error:", err);
      setError(err.message || "Failed to verify code");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === "verify") {
    return (
      <Container>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Verify Your Phone Number
            </CardTitle>
            <CardDescription className="text-center">
              We sent a 6-digit code to {phone}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <VerificationCode>
              {verificationCode.map((digit, index) => (
                <CodeInput
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  autoFocus={index === 0}
                />
              ))}
            </VerificationCode>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleVerifyCode}
              disabled={isSubmitting}
              className="w-full mb-3"
            >
              {isSubmitting ? "Verifying..." : "Verify Phone Number"}
            </Button>

            <Button
              variant="ghost"
              onClick={() => {
                setStep("consent");
                setVerificationCode(["", "", "", "", "", ""]);
                setError("");
              }}
              className="w-full"
            >
              Use Different Number
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Verify Your Phone Number</CardTitle>
            <CardDescription>
              As an SMS platform, we need to verify your phone number
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <FormSection>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={phone}
              onChange={handlePhoneChange}
              autoFocus
            />
            <p className="text-sm text-gray-500 mt-1">
              We'll send a verification code to this number
            </p>
          </FormSection>

          <ConsentBox>
            <div className="flex items-start space-x-3">
              <Checkbox
                id="consent"
                checked={consent}
                onCheckedChange={(checked) => setConsent(checked as boolean)}
                className="mt-1"
              />
              <div>
                <label htmlFor="consent" className="text-sm font-medium cursor-pointer">
                  I consent to receive SMS messages
                </label>
                <p className="text-xs text-gray-600 mt-1">
                  By checking this box, you agree to receive SMS messages for account
                  verification and important updates about your {hubConfig.displayName} account.
                  Message and data rates may apply.
                </p>
              </div>
            </div>
          </ConsentBox>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Why we need this
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Verify account ownership</li>
              <li>• Enable SMS-based features</li>
              <li>• Secure your account with 2FA</li>
              <li>• Send important account alerts</li>
            </ul>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleSendCode}
            disabled={isSubmitting || !phone || !consent}
            className="w-full"
          >
            {isSubmitting ? "Sending Code..." : "Send Verification Code"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <div className="text-center mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="text-gray-500"
            >
              Skip for now
            </Button>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}