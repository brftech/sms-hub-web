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
} from "@sms-hub/ui";
import { Input, Label, Alert, AlertDescription } from "@sms-hub/ui";
import {
  CheckCircle,
  Mail,
  Phone,
  ArrowRight,
  Building,
  UserPlus,
  User,
} from "lucide-react";
import styled from "styled-components";
import logoIcon from "@sms-hub/ui/assets/gnymble-icon-logo.svg";
import { createSupabaseClient } from "@sms-hub/supabase";
import { useDevAuth, activateDevAuth } from '../hooks/useDevAuth';
import { DevAuthToggle } from '@sms-hub/ui';
import { webEnvironment } from '../config/webEnvironment';

const SignupContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #2d1b1b 0%, #4a2c2c 50%, #3d2424 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const SignupCard = styled(Card)`
  width: 100%;
  max-width: 360px;
`;

const LogoSection = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

const LogoImage = styled.img`
  width: 40px;
  height: 40px;
  margin: 0 auto 0.75rem;
  display: block;
`;

const FormSection = styled.form`
  space-y: 4;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const NameRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const NameField = styled.div`
  flex: 1;
`;

const StyledLabel = styled(Label)`
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
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
  height: 36px;
  font-size: 0.875rem;
`;

const SubmitButton = styled(Button)`
  width: 100%;
  height: 44px;
  font-size: 0.95rem;
  font-weight: 600;
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

const VerificationMethod = styled.div`
  margin-bottom: 1rem;
`;

const PathwaySelection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const InvitationTokenInput = styled.div`
  margin-bottom: 1.5rem;
`;

const HelperText = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.5rem;
`;

const PathwayCard = styled.div<{ $selected: boolean }>`
  border: 2px solid ${(props) => (props.$selected ? "#667eea" : "#e5e7eb")};
  background: ${(props) => (props.$selected ? "#f0f4ff" : "#ffffff")};
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;

  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
  }

  svg {
    width: 32px;
    height: 32px;
    color: ${(props) => (props.$selected ? "#667eea" : "#6b7280")};
    margin: 0 auto 0.5rem;
  }

  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: ${(props) => (props.$selected ? "#1e293b" : "#374151")};
    margin-bottom: 0.25rem;
  }

  p {
    font-size: 0.75rem;
    color: ${(props) => (props.$selected ? "#475569" : "#6b7280")};
  }
`;

const InvitationAlert = styled(Alert)`
  margin-bottom: 1.5rem;
  background: #f0f9ff;
  border: 1px solid #0284c7;
`;

// Helper function to get hub ID for database
const getHubIdForDatabase = (hubType: string) => {
  const hubMap: { [key: string]: number } = {
    percytech: 1,
    gnymble: 2,
    percymd: 3,
    percytext: 4,
  };
  return hubMap[hubType] || 2; // Default to Gnymble (2)
};

// Create supabase client
const supabase = createSupabaseClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export function Signup() {
  const { hubConfig } = useHub();
  const navigate = useNavigate();
  const devAuth = useDevAuth();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [authMethod, setAuthMethod] = useState<"sms" | "email">("sms");
  const [signupType, setSignupType] = useState<
    "new_company" | "invited_user" | "individual"
  >("new_company");
  const [invitationToken, setInvitationToken] = useState("");
  const [invitationData, setInvitationData] = useState<any>(null);
  const [isLoadingInvitation, setIsLoadingInvitation] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
  });

  // Check for dev superadmin mode and redirect
  useEffect(() => {
    if (devAuth.isInitialized && devAuth.isSuperadmin) {
      console.log('Dev superadmin mode active - redirecting from signup')
      navigate('/', { replace: true })
    }
  }, [devAuth.isInitialized, devAuth.isSuperadmin, navigate]);

  // Check for invitation token in URL
  useEffect(() => {
    const token = searchParams.get("invitation");
    if (token) {
      setInvitationToken(token);
      setSignupType("invited_user");
      loadInvitationData(token);
    }
  }, [searchParams]);

  const loadInvitationData = async (token: string) => {
    setIsLoadingInvitation(true);
    try {
      const { data, error } = await supabase
        .from("user_invitations")
        .select(
          `
          *,
          companies (
            id,
            public_name,
            hub_id
          )
        `
        )
        .eq("invitation_token", token)
        .eq("status", "pending")
        .single();

      if (error || !data) {
        setError("Invalid or expired invitation link");
        return;
      }

      // Check if invitation is expired
      if (new Date(data.expires_at) < new Date()) {
        setError("This invitation has expired. Please request a new one.");
        return;
      }

      setInvitationData(data);
      setFormData((prev) => ({
        ...prev,
        email: data.email,
      }));
    } catch (err) {
      console.error("Error loading invitation:", err);
      setError("Failed to load invitation details");
    } finally {
      setIsLoadingInvitation(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, "");

    // If it starts with 1, remove it (we'll add +1 later)
    const withoutCountryCode = cleaned.startsWith("1")
      ? cleaned.slice(1)
      : cleaned;

    // Limit to 10 digits (US phone number)
    const limited = withoutCountryCode.slice(0, 10);

    // Format as (XXX) XXX-XXXX for display
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

  // Function to get phone number in +1 format for API
  const getPhoneForAPI = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    const withoutCountryCode = cleaned.startsWith("1")
      ? cleaned.slice(1)
      : cleaned;
    return `+1${withoutCountryCode}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.phone) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const hubId =
        signupType === "invited_user" && invitationData
          ? invitationData.hub_id
          : getHubIdForDatabase(hubConfig.id);

      // Call submit-verification to send verification code
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            email: formData.email,
            mobile_phone_number: getPhoneForAPI(formData.phone),
            auth_method: authMethod,
            hub_id: hubId,
            signup_type:
              signupType === "individual" ? "individual" : signupType,
            invitation_token: invitationToken || undefined,
            customer_type:
              signupType === "individual" ? "individual" : "company",
          }),
        }
      );

      const result = await response.json();
      console.log("Submit verify response:", response.status, result);

      if (!response.ok) {
        console.error("Submit verify failed:", result);
        // Check if error is due to existing account
        if (result.error?.includes("already exists")) {
          setError(
            "An account already exists with this email or phone. Please log in instead."
          );
          setTimeout(() => navigate("/login"), 3000);
          return;
        }
        throw new Error(result.error || "Failed to send verification");
      }

      setSuccess(true);

      // Store data for verification page
      sessionStorage.setItem(
        "signup_data",
        JSON.stringify({
          email: formData.email,
          phone: getPhoneForAPI(formData.phone),
          authMethod,
          verificationId: result.verification_id,
          hubId,
          isLogin: false,
          signupType,
          invitationToken: invitationToken || undefined,
          companyId: invitationData?.company_id || undefined,
          customerType: signupType === "individual" ? "individual" : "company",
        })
      );

      // Redirect to verification page
      setTimeout(() => {
        navigate(`/verify?id=${result.verification_id}`);
      }, 2000);
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "Failed to create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <SignupContainer>
        <DevAuthToggle environment={webEnvironment} onActivate={() => activateDevAuth()} />
        <SignupCard>
          <CardContent className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Verification Sent!</h2>
            <p className="text-gray-600 mb-4">
              We've sent a verification code to your{" "}
              {authMethod === "sms" ? "phone" : "email"}
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to verification page...
            </p>
          </CardContent>
        </SignupCard>
      </SignupContainer>
    );
  }

  return (
    <SignupContainer>
      <DevAuthToggle environment={webEnvironment} onActivate={() => activateDevAuth()} />
      <SignupCard>
        <CardHeader>
          <LogoSection>
            <LogoImage src={logoIcon} alt="Logo" />
            <CardTitle className="text-xl">
              {signupType === "invited_user"
                ? "Join Your Team"
                : "Create Account"}
            </CardTitle>
            <CardDescription className="text-sm">
              {signupType === "invited_user"
                ? `You've been invited to join ${invitationData?.companies?.public_name || hubConfig.displayName}`
                : `Get started with ${hubConfig.displayName}`}
            </CardDescription>
          </LogoSection>
        </CardHeader>

        <CardContent>
          {/* Show invitation token input for Join Team */}
          {signupType === "invited_user" && !invitationToken && (
            <InvitationTokenInput>
              <StyledLabel>Invitation Code</StyledLabel>
              <StyledInput
                type="text"
                placeholder="Enter your 6-character invitation code"
                value={invitationToken}
                onChange={(e) => {
                  const value = e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, "")
                    .slice(0, 6);
                  setInvitationToken(value);
                  if (value.length === 6) {
                    loadInvitationData(value);
                  }
                }}
                maxLength={6}
                style={{
                  fontFamily: "monospace",
                  letterSpacing: "0.2em",
                  textAlign: "center",
                }}
              />
              <HelperText>
                Don't have a code? Ask your team admin to send you an
                invitation.
              </HelperText>
            </InvitationTokenInput>
          )}

          {/* Show invitation info if user is invited */}
          {signupType === "invited_user" && invitationData && (
            <InvitationAlert>
              <AlertDescription>
                <strong>
                  {invitationData.first_name} {invitationData.last_name}
                </strong>{" "}
                invited you to join
                <strong> {invitationData.companies?.public_name}</strong> as a{" "}
                <strong>{invitationData.role}</strong>.
              </AlertDescription>
            </InvitationAlert>
          )}

          {/* Show pathway selection if no invitation - HIDDEN FOR NOW */}
          {false && !invitationToken && (
            <PathwaySelection>
              <PathwayCard
                $selected={signupType === "new_company"}
                onClick={() => setSignupType("new_company")}
              >
                <Building />
                <h4>New Business</h4>
                <p>Start fresh with a new company account</p>
              </PathwayCard>

              <PathwayCard
                $selected={signupType === "invited_user"}
                onClick={() => setSignupType("invited_user")}
              >
                <UserPlus />
                <h4>Join Team</h4>
                <p>Join an existing company</p>
              </PathwayCard>

              <PathwayCard
                $selected={signupType === "individual"}
                onClick={() => setSignupType("individual")}
              >
                <User />
                <h4>Personal</h4>
                <p>For individual use</p>
              </PathwayCard>
            </PathwaySelection>
          )}

          {/* Show invitation input if user selected invited_user but has no token - HIDDEN SINCE PATHWAYS ARE HIDDEN */}
          {false && signupType === "invited_user" && !invitationToken && (
            <FormGroup style={{ marginBottom: "1.5rem" }}>
              <StyledLabel htmlFor="invitation_code">
                Invitation Code
              </StyledLabel>
              <StyledInput
                id="invitation_code"
                type="text"
                placeholder="Enter your invitation code"
                onChange={(e) => {
                  const code = e.target.value.trim();
                  if (code) {
                    setInvitationToken(code);
                    loadInvitationData(code);
                  }
                }}
                disabled={isLoadingInvitation}
              />
            </FormGroup>
          )}

          <FormSection onSubmit={handleSubmit}>
            <NameRow>
              <NameField>
                <StyledLabel htmlFor="phone">Phone Number *</StyledLabel>
                <StyledInput
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  disabled={isSubmitting}
                  autoFocus
                />
              </NameField>

              <NameField>
                <StyledLabel htmlFor="email">Email Address *</StyledLabel>
                <StyledInput
                  id="email"
                  type="email"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={
                    isSubmitting ||
                    (signupType === "invited_user" && !!invitationData)
                  }
                  readOnly={signupType === "invited_user" && !!invitationData}
                />
              </NameField>
            </NameRow>

            <VerificationMethod>
              <StyledLabel>Verification Method</StyledLabel>
              <div className="space-y-2 mt-2">
                <label
                  className={`flex items-start space-x-3 p-2.5 border rounded-lg cursor-pointer transition-all hover:border-orange-300 ${authMethod === "sms" ? "border-orange-500 bg-orange-50" : "border-gray-200"}`}
                >
                  <input
                    type="radio"
                    name="auth_method"
                    value="sms"
                    checked={authMethod === "sms"}
                    onChange={() => setAuthMethod("sms")}
                    className="mt-1 w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-1.5 text-orange-600" />
                      <span className="font-medium text-orange-600">
                        SMS Verification
                      </span>
                      <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Receive a 6-digit code via SMS
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-start space-x-3 p-2.5 border rounded-lg cursor-pointer transition-all hover:border-gray-300 ${authMethod === "email" ? "border-gray-500 bg-gray-50" : "border-gray-200"}`}
                >
                  <input
                    type="radio"
                    name="auth_method"
                    value="email"
                    checked={authMethod === "email"}
                    onChange={() => setAuthMethod("email")}
                    className="mt-1 w-4 h-4 text-gray-600 border-gray-300 focus:ring-gray-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-1.5 text-gray-600" />
                      <span className="font-medium text-gray-700">
                        Email Verification
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Receive a 6-digit code via email
                    </p>
                  </div>
                </label>
              </div>
            </VerificationMethod>

            {error && (
              <Alert variant="destructive" className="mb-3">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending Verification..." : "Get Started"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </SubmitButton>
          </FormSection>

          <Footer>
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Log in
              </Link>
            </p>
          </Footer>
        </CardContent>
      </SignupCard>
    </SignupContainer>
  );
}
