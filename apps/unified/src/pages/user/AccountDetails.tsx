import { useState } from "react";
import { useSearchParams } from "react-router-dom";
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
import { Building, User, Key, AlertCircle, CheckCircle2 } from "lucide-react";
import styled from "styled-components";
import { redirectToWebApp, getWebAppUrl } from "@sms-hub/utils";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const FormSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export function AccountDetails() {
  const { hubConfig } = useHub();
  // const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const verificationId = searchParams.get("id");
  
  // Try to get signup data with fallback
  let signupData = {};
  try {
    const storedData = sessionStorage.getItem("signup_data");
    if (storedData) {
      signupData = JSON.parse(storedData);
    }
  } catch (error) {
    console.warn("Failed to parse signup data:", error);
    // Try backup data
    try {
      const backupData = sessionStorage.getItem("signup_data_backup");
      if (backupData) {
        signupData = JSON.parse(backupData);
      }
    } catch (backupError) {
      console.warn("Failed to parse backup data:", backupError);
    }
  }

  const [formData, setFormData] = useState({
    companyName: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [accountData, setAccountData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationId) {
      setError("Session expired. Please start over.");
      setTimeout(() => redirectToWebApp("/signup"), 2000);
      return;
    }

    // Validate form
    if (!formData.companyName || !formData.firstName || !formData.lastName) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    setError("");

    console.log("AccountDetails debug:", {
      verificationId,
      signupData,
      formData: { ...formData, password: "***", confirmPassword: "***" },
    });

    try {
      // Create the account directly using the create-account Edge Function
      const createAccountPayload = {
        verification_id: verificationId,
        password: formData.password,
        company_name: formData.companyName,
        first_name: formData.firstName,
        last_name: formData.lastName,
      };

      console.log("Sending create-account request:", createAccountPayload);

      const accountResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-account`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(createAccountPayload),
        }
      );

      const accountData = await accountResponse.json();
      console.log(
        "Create account response:",
        accountResponse.status,
        accountData
      );

      if (!accountResponse.ok) {
        throw new Error(accountData.error || "Failed to create account");
      }

      // Check if this is an existing user
      if (accountData.is_existing_user) {
        setAccountData(accountData);
        setSuccess(true);
        // For existing users, we might want to handle differently
        console.log("Existing user detected:", accountData.message);
        // Still proceed with checkout flow
      }

      // Store user info for checkout
      sessionStorage.setItem(
        "account_data",
        JSON.stringify({
          user_id: accountData.user_id,
          company_id: accountData.company_id,
          email: accountData.email,
          hub_id: accountData.hub_id,
          customer_type: accountData.customer_type,
          company_name: formData.companyName,
          verification_id: accountData.verification_id,
        })
      );

      setAccountData(accountData);
      setSuccess(true);

      // Redirect to Stripe checkout instead of magic link
      console.log("Redirecting to Stripe checkout...");

      try {
        // Create checkout session
        const checkoutResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              email: accountData.email,
              userId: accountData.user_id,
              companyId: accountData.company_id,
              hubId: accountData.hub_id,
              customerType:
                accountData.customer_type || signupData.customer_type,
              successUrl: `${window.location.origin}/payment-callback?session_id={CHECKOUT_SESSION_ID}`,
              cancelUrl: getWebAppUrl("/signup"),
            }),
          }
        );

        const checkoutData = await checkoutResponse.json();

        if (checkoutResponse.ok && checkoutData.url) {
          // Redirect to Stripe checkout - webhook will handle post-payment flow
          console.log("🔄 Redirecting to Stripe checkout...");
          window.location.href = checkoutData.url;
          return;
        } else {
          throw new Error(
            checkoutData.error || "Failed to create checkout session"
          );
        }
      } catch (checkoutError) {
        console.error("Error creating checkout session:", checkoutError);
        // Fallback to magic link if checkout fails
        if (accountData.magic_link) {
          console.log("Falling back to magic link...");
          window.location.href = accountData.magic_link;
          return;
        } else {
          throw new Error(
            "Failed to create checkout session and no magic link available"
          );
        }
      }
    } catch (err: any) {
      console.error("Error creating account:", err);
      setError(err.message || "Failed to create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <Container>
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              {accountData?.is_existing_user
                ? "Welcome Back!"
                : "Account Created!"}
            </h2>
            <p className="text-gray-600 mb-4">
              {accountData?.is_existing_user
                ? `Welcome back to ${hubConfig.displayName}!`
                : `Welcome to ${hubConfig.displayName}!`}
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to Stripe checkout...
            </p>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Complete Your Account
          </CardTitle>
          <CardDescription className="text-center">
            Tell us about yourself and your company
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {signupData.customer_type !== "individual" && (
              <FormSection>
                <SectionTitle>
                  <Building className="w-4 h-4" />
                  Company Information
                </SectionTitle>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                    placeholder="Enter your company name"
                    required
                    autoComplete="organization"
                  />
                </div>
              </FormSection>
            )}

            <FormSection>
              <SectionTitle>
                <User className="w-4 h-4" />
                Personal Information
              </SectionTitle>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    placeholder="First name"
                    required
                    autoComplete="given-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    placeholder="Last name"
                    required
                    autoComplete="family-name"
                  />
                </div>
              </div>
            </FormSection>

            <FormSection>
              <SectionTitle>
                <Key className="w-4 h-4" />
                Create Password
              </SectionTitle>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Create a password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Confirm your password"
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>
            </FormSection>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting
                ? "Creating Account..."
                : "Create Account & Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
