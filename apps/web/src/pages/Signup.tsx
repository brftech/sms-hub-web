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
  CheckCircle,
  Mail,
  Phone,
  Shield,
} from "lucide-react";
import styled from "styled-components";
import { getSupabaseClient } from "../lib/supabaseSingleton";
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

const NameRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const NameField = styled.div`
  flex: 1;
`;

const VerificationMethod = styled.div`
  margin-bottom: 1rem;
`;

// Removed PathwaySelection - defaulting to new business

const InvitationTokenInput = styled.div`
  margin-bottom: 1.5rem;
`;

const HelperText = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.5rem;
`;

const InvitationAlert = styled(Alert)`
  margin-bottom: 1.5rem;
  background: #f0f9ff;
  border: 1px solid #0284c7;
`;

// Helper function to get hub ID for database
const getHubIdForDatabase = (hubType: string) => {
  const hubMap: { [key: string]: number } = {
    percytech: 0,
    gnymble: 1,
    percymd: 2,
    percytext: 3,
  };
  return hubMap[hubType] || 1; // Default to Gnymble (1)
};

// Use singleton supabase client
const supabase = getSupabaseClient();

export function Signup() {
  const { hubConfig } = useHub();
  const navigate = useNavigate();
  const devAuth = useDevAuth();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [authMethod, setAuthMethod] = useState<"sms" | "email">("email");
  const [signupType, setSignupType] = useState<
    "new_company" | "invited_user" | "individual"
  >("new_company"); // Default to new business
  const [invitationToken, setInvitationToken] = useState("");
  const [invitationData, setInvitationData] = useState<{
    company_id?: string;
    company_name?: string;
    inviter_name?: string;
    hub_id?: number;
    first_name?: string | null;
    last_name?: string | null;
    role?: string | null;
    companies?: {
      public_name?: string;
    };
  } | null>(null);
  // Removed isLoadingInvitation - no longer used

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
  });

  // Check for dev superadmin mode and redirect
  useEffect(() => {
    if (devAuth.isInitialized && devAuth.isSuperadmin) {
      console.log("Dev superadmin mode active - redirecting from signup");
      navigate("/", { replace: true });
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

    // Try to recover form data from backup
    try {
      const backupData = sessionStorage.getItem("signup_data_backup");
      if (backupData) {
        const parsed = JSON.parse(backupData);
        // Only restore if data is recent (within last hour)
        const dataAge = Date.now() - new Date(parsed.timestamp).getTime();
        if (dataAge < 60 * 60 * 1000) {
          setFormData({
            email: parsed.email || "",
            phone: parsed.phone || "",
          });
          setAuthMethod(parsed.authMethod || "sms");
          setSignupType(parsed.signupType || "new_company");
          if (parsed.invitationToken) {
            setInvitationToken(parsed.invitationToken);
          }
          console.log("🔄 Restored form data from backup");
        }
      }
    } catch (error) {
      console.warn("Failed to restore form data:", error);
    }
  }, [searchParams]);

  const loadInvitationData = async (token: string) => {
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

    // Store form data immediately to prevent data loss
    const formDataToStore = {
      email: formData.email,
      phone: formData.phone,
      authMethod,
      signupType,
      invitationToken: invitationToken || undefined,
      hubId,
      timestamp: new Date().toISOString()
    };
    
    try {
      sessionStorage.setItem("signup_data_backup", JSON.stringify(formDataToStore));
    } catch (error) {
      console.warn("Failed to backup form data:", error);
    }

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
    } catch (err: unknown) {
      console.error("Signup error:", err);
      setError(err instanceof Error ? err.message : "Failed to create account");
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
            <h2 className="text-2xl font-bold mb-2 text-gray-900">
              Verification Sent!
            </h2>
            <p className="text-gray-700 mb-4 font-medium">
              We've sent a verification code to your{" "}
              {authMethod === "sms" ? "phone" : "email"}
            </p>
            <p className="text-sm text-gray-600 font-medium">
              Redirecting to verification page...
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
      <Card className="w-full max-w-md">
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
                : "Create Business Account"}
            </CardTitle>
            <CardDescription className="text-gray-700 font-medium">
              {signupType === "invited_user"
                ? `You've been invited to join ${invitationData?.companies?.public_name || hubConfig.displayName}`
                : `Start your business with ${hubConfig.displayName}`}
            </CardDescription>
          </div>
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

          {/* Pathway selection removed - defaulting to new business */}

          {/* Invitation input removed - defaulting to new business */}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="space-y-3 mt-3">
                <label
                  className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-all hover:border-orange-300 ${authMethod === "sms" ? "border-orange-500 bg-orange-50" : "border-gray-200"}`}
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
                        <span className="font-semibold text-orange-600">
                          SMS Verification
                        </span>
                        <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                          Faster
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 mt-1 font-medium">
                        Receive your code instantly via SMS
                      </p>
                    </div>
                </label>

                <label
                  className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-all hover:border-gray-300 ${authMethod === "email" ? "border-gray-500 bg-gray-50" : "border-gray-200"}`}
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
                        <span className="font-semibold text-gray-700">
                          Email Verification
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 mt-1 font-medium">
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

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full hub-bg-primary hover:hub-bg-primary/90"
            >
              {isSubmitting ? "Sending Verification..." : "Start Your Business"}
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
