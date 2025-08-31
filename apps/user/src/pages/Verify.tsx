import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  useHub,
  HubLogo,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@sms-hub/ui";
import {
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@sms-hub/ui";
import { useVerifyCode } from "../hooks/useAuth";
import { VerificationData } from "@sms-hub/types";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function Verify() {
  const { currentHub } = useHub();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const verifyCode = useVerifyCode();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const tempSignupId = searchParams.get("id");

  const form = useForm<{ verification_code: string }>({
    defaultValues: {
      verification_code: "",
    },
  });

  useEffect(() => {
    if (!tempSignupId) {
      navigate("/signup");
    }
  }, [tempSignupId, navigate]);

  const onSubmit = async (data: { verification_code: string }) => {
    if (!tempSignupId) return;

    setIsSubmitting(true);

    try {
      const verificationData: VerificationData = {
        temp_signup_id: tempSignupId,
        verification_code: data.verification_code,
      };

      await verifyCode.mutateAsync(verificationData);

      toast.success("Account verified! Redirecting to onboarding...");

      // Navigate to onboarding
      setTimeout(() => {
        navigate("/onboarding");
      }, 1500);
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Invalid verification code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!tempSignupId) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <HubLogo hubType={currentHub} variant="full" size="lg" />
          </div>
          <CardTitle className="hub-text-primary">
            Verify Your Account
          </CardTitle>
          <CardDescription>
            Enter the verification code sent to your phone
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="verification_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123456"
                        maxLength={6}
                        className="text-center text-lg font-mono tracking-widest"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full hub-bg-primary hover:hub-bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Verifying..." : "Verify Account"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Didn't receive a code?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="hub-text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
