import { useState } from "react";
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
import { Mail, Phone, User, Building, Key, UserPlus } from "lucide-react";
import styled from "styled-components";

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
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--foreground);
`;

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

export function Signup() {
  const { hubConfig } = useHub();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
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

    if (!formData.companyName) {
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
            hub_id: hubConfig.hubNumber,
            signup_type: invitationToken ? "invited_user" : "new_company",
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

      // Store account data for payment flow
      sessionStorage.setItem(
        "account_data",
        JSON.stringify({
          email: formData.email,
          companyName: formData.companyName,
          firstName: formData.firstName,
          lastName: formData.lastName,
          hubId: hubConfig.hubNumber,
        })
      );

      // Redirect to payment setup
      const unifiedAppUrl = import.meta.env.VITE_UNIFIED_APP_URL || "http://localhost:3001";
      window.location.href = `${unifiedAppUrl}/payment-setup`;

    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "Failed to create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SignupContainer>
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="text-center mb-6">
            <HubLogo
              hubType={hubConfig.id}
              variant="icon"
              size="md"
              className="mx-auto mb-4"
            />
            <CardTitle className="text-2xl font-bold">
              Create Your Account
            </CardTitle>
            <CardDescription>
              Start your business with {hubConfig.displayName}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <StyledLabel htmlFor="companyName">
                <Building className="w-4 h-4 inline mr-1" />
                Company Name
              </StyledLabel>
              <Input
                id="companyName"
                type="text"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                placeholder="Enter your company name"
                required
                autoFocus
              />
            </div>

            <FieldRow>
              <div>
                <StyledLabel htmlFor="firstName">
                  <User className="w-4 h-4 inline mr-1" />
                  First Name
                </StyledLabel>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <StyledLabel htmlFor="lastName">Last Name</StyledLabel>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  placeholder="Doe"
                  required
                />
              </div>
            </FieldRow>

            <div>
              <StyledLabel htmlFor="email">
                <Mail className="w-4 h-4 inline mr-1" />
                Email Address
              </StyledLabel>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="john@company.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <StyledLabel htmlFor="phone">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone Number
              </StyledLabel>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="(555) 123-4567"
                required
              />
            </div>

            <FieldRow>
              <div>
                <StyledLabel htmlFor="password">
                  <Key className="w-4 h-4 inline mr-1" />
                  Password
                </StyledLabel>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Min. 6 characters"
                  required
                  autoComplete="new-password"
                />
              </div>
              <div>
                <StyledLabel htmlFor="confirmPassword">Confirm Password</StyledLabel>
                <Input
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
              {isSubmitting ? "Creating Account..." : "Create Account"}
              <UserPlus className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="text-center mt-6 pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="hub-text-primary hover:underline font-semibold"
              >
                Log In
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </SignupContainer>
  );
}