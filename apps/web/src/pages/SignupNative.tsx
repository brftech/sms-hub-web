import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import {
  useHub,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  HubLogo,
} from "@sms-hub/ui";
import { Input, Label, Alert, AlertDescription } from "@sms-hub/ui";
import {
  Building,
  Mail,
  Phone,
  Shield,
  User,
  Key,
  CheckCircle,
} from "lucide-react";
import styled from "styled-components";
import { useDevAuth, activateDevAuth } from "../hooks/useDevAuth";
import { DevAuthToggle } from "@sms-hub/ui";
import { webEnvironment } from "../config/webEnvironment";

const SignupContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #2d1b1b 0%, #4a2c2c 50%, #3d2424 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const StyledLabel = styled(Label)`
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
`;

const StyledInput = styled(Input)`
  width: 100%;
  height: 36px;
  font-size: 0.875rem;
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
  color: #374151;
`;

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const InvitationAlert = styled(Alert)`
  margin-bottom: 1.5rem;
  background: #f0f9ff;
  border: 1px solid #0284c7;
`;

export function SignupNative() {
  const { hubConfig } = useHub();
  const navigate = useNavigate();
  const devAuth = useDevAuth();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [invitationData, setInvitationData] = useState<any>(null);

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    companyName: "",
  });

  const invitationToken = searchParams.get("invitation");
  const signupType = invitationToken ? "invited_user" : "new_company";

  // Check for dev superadmin mode
  useEffect(() => {
    if (devAuth.isInitialized && devAuth.isSuperadmin) {
      console.log("Dev superadmin mode active - redirecting from signup");
      navigate("/", { replace: true });
    }
  }, [devAuth.isInitialized, devAuth.isSuperadmin, navigate]);

  // Load invitation data if token provided
  useEffect(() => {
    if (invitationToken) {
      loadInvitationData(invitationToken);
    }
  }, [invitationToken]);

  const loadInvitationData = async (token: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validate-invitation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ invitation_token: token }),
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || "Invalid invitation");
        return;
      }

      setInvitationData(data);
      setFormData(prev => ({
        ...prev,
        email: data.email || "",
      }));
    } catch (err) {
      console.error("Error loading invitation:", err);
      setError("Failed to load invitation details");
    }
  };

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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  const getPhoneForAPI = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    const withoutCountryCode = cleaned.startsWith("1") ? cleaned.slice(1) : cleaned;
    return `+1${withoutCountryCode}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.email || !formData.phone || !formData.firstName || !formData.lastName) {
      setError("Please fill in all required fields");
      return;
    }

    if (!invitationData && !formData.companyName) {
      setError("Please enter your company name");
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

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/signup-native`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            phone_number: getPhoneForAPI(formData.phone),
            first_name: formData.firstName,
            last_name: formData.lastName,
            company_name: formData.companyName,
            hub_id: invitationData?.hub_id || hubConfig.hubNumber,
            signup_type: signupType,
            invitation_token: invitationToken,
            customer_type: "company",
          }),
        }
      );

      const result = await response.json();
      console.log("Signup response:", response.status, result);

      if (!response.ok) {
        throw new Error(result.error || "Failed to create account");
      }

      setSuccess(true);

      // Store account data for payment flow
      sessionStorage.setItem(
        "account_data",
        JSON.stringify({
          user_id: result.user_id,
          company_id: result.company_id,
          customer_id: result.customer_id,
          email: formData.email,
          hub_id: result.hub_id,
        })
      );

      // Use the magic link if provided, otherwise redirect to payment
      if (result.magic_link) {
        window.location.href = result.magic_link;
      } else {
        // Create Stripe checkout session
        const checkoutResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              email: formData.email,
              userId: result.user_id,
              companyId: result.company_id,
              hubId: result.hub_id,
              customerType: "company",
              successUrl: `${window.location.origin}/payment-callback?session_id={CHECKOUT_SESSION_ID}`,
              cancelUrl: `${window.location.origin}/signup`,
            }),
          }
        );

        const checkoutData = await checkoutResponse.json();

        if (checkoutResponse.ok && checkoutData.url) {
          window.location.href = checkoutData.url;
        } else {
          throw new Error(checkoutData.error || "Failed to create checkout session");
        }
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "Failed to create account");
      setSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <SignupContainer>
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Account Created!</h2>
            <p className="text-gray-600 mb-4">
              Welcome to {hubConfig.displayName}!
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to payment setup...
            </p>
          </CardContent>
        </Card>
      </SignupContainer>
    );
  }

  return (
    <SignupContainer>
      <DevAuthToggle
        environment={
          webEnvironment as unknown as {
            isDevelopment?: () => boolean;
            [key: string]: unknown;
          }
        }
        onActivate={() => activateDevAuth()}
      />
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="text-center mb-6">
            <HubLogo
              hubType={hubConfig.id}
              variant="icon"
              size="md"
              className="mx-auto mb-4"
            />
            <CardTitle className="text-2xl text-gray-900 font-bold">
              {signupType === "invited_user"
                ? "Join Your Team"
                : "Create Your Account"}
            </CardTitle>
            <CardDescription className="text-gray-700 font-medium">
              {signupType === "invited_user"
                ? `You've been invited to join ${invitationData?.company_name || hubConfig.displayName}`
                : `Start your business with ${hubConfig.displayName}`}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {invitationData && (
            <InvitationAlert>
              <AlertDescription>
                <strong>{invitationData.inviter_name}</strong> invited you to join
                <strong> {invitationData.company_name}</strong> as a{" "}
                <strong>{invitationData.role}</strong>.
              </AlertDescription>
            </InvitationAlert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!invitationData && (
              <FormSection>
                <SectionTitle>
                  <Building className="w-4 h-4" />
                  Company Information
                </SectionTitle>
                <div>
                  <StyledLabel htmlFor="companyName">Company Name *</StyledLabel>
                  <StyledInput
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
              <FieldRow>
                <div>
                  <StyledLabel htmlFor="firstName">First Name *</StyledLabel>
                  <StyledInput
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
                <div>
                  <StyledLabel htmlFor="lastName">Last Name *</StyledLabel>
                  <StyledInput
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
              </FieldRow>
            </FormSection>

            <FormSection>
              <SectionTitle>
                <Mail className="w-4 h-4" />
                Contact Information
              </SectionTitle>
              <FieldRow>
                <div>
                  <StyledLabel htmlFor="email">Email Address *</StyledLabel>
                  <StyledInput
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="john@company.com"
                    required
                    autoComplete="email"
                    disabled={!!invitationData}
                  />
                </div>
                <div>
                  <StyledLabel htmlFor="phone">Phone Number *</StyledLabel>
                  <StyledInput
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="(555) 123-4567"
                    required
                    autoComplete="tel"
                  />
                </div>
              </FieldRow>
            </FormSection>

            <FormSection>
              <SectionTitle>
                <Key className="w-4 h-4" />
                Create Password
              </SectionTitle>
              <FieldRow>
                <div>
                  <StyledLabel htmlFor="password">Password *</StyledLabel>
                  <StyledInput
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Min 6 characters"
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <StyledLabel htmlFor="confirmPassword">Confirm Password *</StyledLabel>
                  <StyledInput
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    placeholder="Confirm password"
                    required
                    autoComplete="new-password"
                  />
                </div>
              </FieldRow>
            </FormSection>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full hub-bg-primary hover:hub-bg-primary/90"
            >
              {isSubmitting ? "Creating Account..." : "Create Account & Continue to Payment"}
              <Shield className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="text-center mt-6 pt-6 border-t">
            <p className="text-sm text-gray-700 font-medium">
              Already have an account?{" "}
              <Link
                to="/login"
                className="hub-text-primary hover:underline font-semibold"
              >
                Login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </SignupContainer>
  );
}