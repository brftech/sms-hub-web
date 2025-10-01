import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, Phone, Shield, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
// Unused import removed: Badge
import { Card, CardContent, CardHeader, CardTitle } from "./card";
// Removed logger import - using console for debugging

interface SMSAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (phoneNumber: string) => void;
}

const SMSAuthModal: React.FC<SMSAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
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
      // Simulate SMS verification code sending
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStep("verification");
      setCountdown(60);

      // Start countdown for resend
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("SMS auth error", error, {
        operation: "sendVerificationCode",
        phoneNumber,
      });
      setError("Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter the 6-digit verification code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate OTP verification
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStep("success");

      // Auto-close after success
      setTimeout(() => {
        onSuccess(phoneNumber);
        onClose();
      }, 1500);
    } catch (error) {
      console.error("OTP verification error", error, {
        operation: "verifyOTP",
        phoneNumber,
      });
      setError("Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;

    setIsLoading(true);
    setError("");

    try {
      // Simulate resending code
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Resend code error", error, {
        operation: "resendVerificationCode",
        phoneNumber,
      });
      setError("Failed to resend code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
      }}
    >
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Phone Verification</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {step === "phone" && (
            <>
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Enter your phone number</h3>
                  <p className="text-sm text-gray-300">
                    We'll send you a verification code via SMS
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Input
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    setPhoneNumber(formatted);
                  }}
                  className="text-center text-lg"
                  maxLength={14}
                />
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-300">
                  <Shield className="h-3 w-3" />
                  <span>Your number is secure and private</span>
                </div>
              </div>

              <Button
                onClick={handlePhoneSubmit}
                disabled={isLoading || phoneNumber.replace(/\D/g, "").length < 10}
                className="w-full"
              >
                {isLoading ? "Sending..." : "Send Verification Code"}
              </Button>
            </>
          )}

          {step === "verification" && (
            <>
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Enter verification code</h3>
                  <p className="text-sm text-gray-300">We sent a 6-digit code to {phoneNumber}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                  className="text-center text-2xl tracking-widest"
                  maxLength={6}
                />
                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={handleResendCode}
                    disabled={countdown > 0 || isLoading}
                    className="text-sm"
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleVerificationSubmit}
                disabled={isLoading || verificationCode.length !== 6}
                className="w-full"
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>
            </>
          )}

          {step === "success" && (
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Verification successful!</h3>
                <p className="text-sm text-gray-300">Your phone number has been verified</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-600">{error}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>,
    document.body
  );
};

export default SMSAuthModal;
