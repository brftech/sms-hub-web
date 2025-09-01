import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useHub, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@sms-hub/ui";
import { Input, Label, Alert, AlertDescription } from "@sms-hub/ui";
import { Shield, CheckCircle, Mail, ArrowLeft, ArrowRight, User, Building, Phone } from "lucide-react";
import styled from "styled-components";
import logoIcon from "@sms-hub/ui/assets/gnymble-icon-logo.svg";

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
  max-width: 400px;
`;

const LogoSection = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const LogoImage = styled.img`
  width: 48px;
  height: 48px;
  margin: 0 auto 1rem;
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
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const StyledInput = styled(Input)`
  width: 100%;
  height: 36px;
  font-size: 0.875rem;
`;

const SubmitButton = styled(Button)`
  width: 100%;
  height: 48px;
  font-size: 1rem;
  font-weight: 600;
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 0.75rem;
`;

const Step = styled.div<{ $active: boolean; $completed: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  margin: 0 0.25rem;
  background: ${props => props.$completed ? '#10b981' : props.$active ? '#3b82f6' : '#e5e7eb'};
  color: ${props => props.$completed || props.$active ? 'white' : '#6b7280'};
  transition: all 0.2s ease;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  transition: color 0.2s ease;
  
  &:hover {
    color: #374151;
  }
`;

const VerificationMethod = styled.div`
  margin-bottom: 1rem;
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

export function Signup() {
  const { hubConfig } = useHub();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [authMethod, setAuthMethod] = useState<"sms" | "email">("sms");
  
  const [formData, setFormData] = useState({
    company_name: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, "");
    
    // If it starts with 1, remove it (we'll add +1 later)
    const withoutCountryCode = cleaned.startsWith('1') ? cleaned.slice(1) : cleaned;
    
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
    const withoutCountryCode = cleaned.startsWith('1') ? cleaned.slice(1) : cleaned;
    return `+1${withoutCountryCode}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      if (!formData.company_name || !formData.first_name || !formData.last_name) {
        setError("Please fill in all required fields");
        return;
      }
      setError("");
      setCurrentStep(2);
      return;
    }

    if (!formData.email || !formData.phone) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const hubId = getHubIdForDatabase(hubConfig.id);
      
      const requestBody = {
        company_name: formData.company_name,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        mobile_phone_number: getPhoneForAPI(formData.phone),
        auth_method: authMethod,
        hub_id: hubId,
      };
      
      console.log('► Request body:', requestBody);
      console.log('► Phone formatting:', {
        original: formData.phone,
        formatted: getPhoneForAPI(formData.phone),
        length: getPhoneForAPI(formData.phone).length
      });
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-temp-signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      console.log('► API response:', result);

      if (!response.ok) {
        throw new Error(result.error || "Failed to create account");
      }

      setSuccess(true);
      
      // Store data for verification page
      sessionStorage.setItem('signup_data', JSON.stringify({
        ...formData,
        authMethod,
        hubId
      }));
      
      // Redirect to verification page
      setTimeout(() => {
        navigate(`/verify?id=${result.id}`);
      }, 2000);

    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "Failed to create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  const prevStep = () => {
    setError("");
    setCurrentStep(1);
  };

  if (success) {
    return (
      <SignupContainer>
        <SignupCard>
          <CardContent className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Account Created!</h2>
            <p className="text-gray-600 mb-4">
              We've sent a verification code to your {authMethod === "sms" ? "phone" : "email"}
            </p>
            <p className="text-sm text-gray-500">
              Please check your {authMethod === "sms" ? "phone" : "email"} and enter the code to complete your registration.
            </p>
          </CardContent>
        </SignupCard>
      </SignupContainer>
    );
  }

  return (
    <SignupContainer>
      <SignupCard>
        <CardHeader>
          <LogoSection>
            <LogoImage src={logoIcon} alt="Logo" />
            <CardTitle className="text-xl">
              {currentStep === 1 ? "Create Account" : "Contact Info"}
            </CardTitle>
            <CardDescription className="text-sm">
              {currentStep === 1 
                ? "" 
                : "How should we contact you?"
              }
            </CardDescription>
          </LogoSection>
          
          <StepIndicator>
            <Step $active={currentStep === 1} $completed={currentStep > 1}>1</Step>
            <Step $active={currentStep === 2} $completed={false}>2</Step>
          </StepIndicator>
        </CardHeader>
        
        <CardContent>
          {currentStep > 1 && (
            <BackButton onClick={prevStep}>
              <ArrowLeft className="w-3 h-3 mr-1" />
              Back
            </BackButton>
          )}
          
          <FormSection onSubmit={handleSubmit}>
            {currentStep === 1 ? (
              <>
                <FormGroup>
                  <StyledLabel htmlFor="company_name">
                    Company Name *
                  </StyledLabel>
                  <StyledInput
                    id="company_name"
                    type="text"
                    placeholder="Your company"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    disabled={isSubmitting}
                    autoFocus
                  />
                </FormGroup>

                <NameRow>
                  <NameField>
                    <StyledLabel htmlFor="first_name">
                      First Name *
                    </StyledLabel>
                    <StyledInput
                      id="first_name"
                      type="text"
                      placeholder="John"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      disabled={isSubmitting}
                    />
                  </NameField>
                  
                  <NameField>
                    <StyledLabel htmlFor="last_name">
                      Last Name *
                    </StyledLabel>
                    <StyledInput
                      id="last_name"
                      type="text"
                      placeholder="Doe"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      disabled={isSubmitting}
                    />
                  </NameField>
                </NameRow>
              </>
            ) : (
              <>
                <NameRow>
                  <NameField>
                    <StyledLabel htmlFor="phone">
                      Phone Number *
                    </StyledLabel>
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
                    <StyledLabel htmlFor="email">
                      Email Address *
                    </StyledLabel>
                    <StyledInput
                      id="email"
                      type="email"
                      placeholder="john@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={isSubmitting}
                    />
                  </NameField>
                </NameRow>

                <VerificationMethod>
                  <StyledLabel>Verification Method</StyledLabel>
                  <div className="flex items-center justify-center space-x-6 mt-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="auth_method"
                        value="sms"
                        checked={authMethod === "sms"}
                        onChange={() => setAuthMethod("sms")}
                        className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                      />
                      <span className={`text-sm font-medium ${authMethod === "sms" ? "text-orange-600" : "text-gray-700"}`}>
                        SMS
                      </span>
                    </label>
                    
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="auth_method"
                        value="email"
                        checked={authMethod === "email"}
                        onChange={() => setAuthMethod("email")}
                        className="w-4 h-4 text-gray-600 border-gray-300 focus:ring-gray-500"
                      />
                      <span className={`text-sm font-medium ${authMethod === "email" ? "text-gray-900" : "text-gray-700"}`}>
                        Email
                      </span>
                    </label>
                  </div>
                  <div className="text-center mt-2">
                    <p className="text-xs text-gray-600">
                      Choose how to receive your verification code
                    </p>
                  </div>
                </VerificationMethod>
              </>
            )}
            
            {error && (
              <Alert variant="destructive" className="mb-3">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                'Creating Account...'
              ) : currentStep === 1 ? (
                <>
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                'Create Account'
              )}
            </SubmitButton>
          </FormSection>
          
          <Footer>
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Log in
              </Link>
            </p>
          </Footer>
        </CardContent>
      </SignupCard>
    </SignupContainer>
  );
}