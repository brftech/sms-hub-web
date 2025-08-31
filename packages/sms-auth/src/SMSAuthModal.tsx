import React, { useState } from "react";
import { X, Phone, Shield, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { Button, Input, Badge, Card, CardContent, CardHeader, CardTitle } from "@sms-hub/ui";
import { supabase } from "@sms-hub/supabase";

export interface SMSAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (phoneNumber: string) => void;
}

const SMSAuthModal: React.FC<SMSAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState<"phone" | "verification" | "success">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 3) {
      return `(${cleaned}`;
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
  };

  const handlePhoneSubmit = async () => {
    if (!phoneNumber || phoneNumber.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const cleanedPhone = phoneNumber.replace(/\D/g, "");
      const formattedPhone = cleanedPhone.length === 10 ? `+1${cleanedPhone}` : `+${cleanedPhone}`;
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) throw error;

      setStep("verification");
      startCountdown();
    } catch (error: any) {
      console.error("Error sending SMS:", error);
      setError(error.message || "Failed to send verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a 6-digit verification code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const cleanedPhone = phoneNumber.replace(/\D/g, "");
      const formattedPhone = cleanedPhone.length === 10 ? `+1${cleanedPhone}` : `+${cleanedPhone}`;
      
      const { error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: verificationCode,
        type: "sms",
      });

      if (error) throw error;

      setStep("success");
      setTimeout(() => {
        onSuccess(phoneNumber);
        onClose();
      }, 2000);
    } catch (error: any) {
      console.error("Error verifying code:", error);
      setError(error.message || "Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const startCountdown = () => {
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    setStep("phone");
    handlePhoneSubmit();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            {step === "phone" && "Enter Your Phone Number"}
            {step === "verification" && "Verify Your Number"}
            {step === "success" && "Success!"}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-secondary"
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === "phone" && (
            <>
              <div className="text-center space-y-2">
                <Phone className="h-12 w-12 mx-auto text-primary" />
                <p className="text-muted-foreground">
                  We'll send you a verification code to confirm your phone number
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    setPhoneNumber(formatted);
                  }}
                  className="text-lg"
                  maxLength={14}
                />

                {error && (
                  <div className="flex items-center gap-2 text-destructive text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                <Button
                  onClick={handlePhoneSubmit}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Sending..." : "Send Verification Code"}
                </Button>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Your information is secure and encrypted</span>
              </div>
            </>
          )}

          {step === "verification" && (
            <>
              <div className="text-center space-y-2">
                <Lock className="h-12 w-12 mx-auto text-primary" />
                <p className="text-muted-foreground">
                  Enter the 6-digit code sent to {phoneNumber}
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 6) {
                      setVerificationCode(value);
                    }
                  }}
                  className="text-center text-2xl tracking-widest"
                  maxLength={6}
                />

                {error && (
                  <div className="flex items-center gap-2 text-destructive text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                <Button
                  onClick={handleVerificationSubmit}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>

                <div className="text-center">
                  <button
                    onClick={handleResendCode}
                    disabled={countdown > 0}
                    className={`text-sm ${
                      countdown > 0
                        ? "text-muted-foreground cursor-not-allowed"
                        : "text-primary hover:underline cursor-pointer"
                    }`}
                  >
                    {countdown > 0
                      ? `Resend code in ${countdown}s`
                      : "Resend verification code"}
                  </button>
                </div>
              </div>
            </>
          )}

          {step === "success" && (
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
              <div>
                <h3 className="text-lg font-semibold">Phone Verified!</h3>
                <p className="text-muted-foreground">
                  Your phone number has been successfully verified
                </p>
              </div>
              <Badge variant="secondary" className="gap-2">
                <Phone className="h-4 w-4" />
                {phoneNumber}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SMSAuthModal;