import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
import { Mail, Phone, User, Building, Key, UserPlus, ChevronLeft, ChevronRight } from "lucide-react";
import styled from "styled-components";

const SignupContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #2d1b1b 0%, #4a2c2c 50%, #3d2424 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow-x: hidden;
`;

const StyledLabel = styled(Label)`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--foreground);
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 1rem;
`;

const Step = styled.div<{ active: boolean; completed: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  transition: all 0.3s ease;
  
  ${props => props.active && `
    background: var(--hub-primary);
    color: white;
    border: 2px solid var(--hub-primary);
  `}
  
  ${props => props.completed && !props.active && `
    background: #10b981;
    color: white;
    border: 2px solid #10b981;
  `}
  
  ${props => !props.active && !props.completed && `
    background: transparent;
    color: #6b7280;
    border: 2px solid #6b7280;
  `}
`;

const StepConnector = styled.div<{ completed: boolean }>`
  width: 40px;
  height: 2px;
  background: ${props => props.completed ? '#10b981' : '#6b7280'};
  margin-top: 19px;
`;

export function Signup() {
  const { hubConfig } = useHub();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isFormReady, setIsFormReady] = useState(false);
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

  const validateStep = (step: number) => {
    setError("");
    
    switch (step) {
      case 1:
        if (!formData.companyName.trim()) {
          setError("Please enter your company name");
          return false;
        }
        if (!formData.email.trim()) {
          setError("Please enter your email address");
          return false;
        }
        if (!formData.phone.trim()) {
          setError("Please enter your phone number");
          return false;
        }
        {
          const phoneDigits = formData.phone.replace(/\D/g, "");
          if (phoneDigits.length !== 10) {
            setError("Please enter a valid 10-digit phone number");
            return false;
          }
        }
        return true;
      
      case 2:
        if (!formData.firstName.trim()) {
          setError("Please enter your first name");
          return false;
        }
        if (!formData.lastName.trim()) {
          setError("Please enter your last name");
          return false;
        }
        return true;
      
      case 3:
        if (!formData.password) {
          setError("Please enter a password");
          return false;
        }
        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters");
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError("");
  };

  // Set form as ready when hub config is loaded
  useEffect(() => {
    if (hubConfig && hubConfig.id) {
      const timer = setTimeout(() => {
        setIsFormReady(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [hubConfig]);

  // Handle focus for the first field of each step
  useEffect(() => {
    if (!isFormReady) return;
    
    const timer = setTimeout(() => {
      const firstInput = document.querySelector('input[type="text"], input[type="email"], input[type="tel"], input[type="password"]') as HTMLInputElement;
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [currentStep, isFormReady]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(3)) {
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

      // Check if confirmation email was sent successfully or if user is already confirmed (dev mode)
      if (result.confirmation_email_sent) {
        console.log("Confirmation email sent successfully to:", result.email);
        
        // Store email for the check-email page
        sessionStorage.setItem('signup_email', result.email);
        
        // Redirect to check email page
        window.location.href = '/check-email';
      } else if (result.dev_mode) {
        console.log("Dev mode: User already confirmed, creating business records...");
        
        // Store account data for immediate processing
        sessionStorage.setItem('account_data', JSON.stringify({
          email: formData.email,
          companyName: formData.companyName,
          firstName: formData.firstName,
          lastName: formData.lastName,
          hubId: hubConfig.hubNumber,
        }));
        
        // Redirect directly to verify-auth to create business records
        window.location.href = '/verify-auth?type=signup&dev_mode=true';
      } else {
        console.warn("Confirmation email failed to send");
        setError("Account created but email failed to send. Please contact support or try logging in directly.");
      }

    } catch (err: unknown) {
      console.error("Signup error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to create account";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="space-y-2">
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
                className="w-full bg-white text-black border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-2">
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
                className="w-full bg-white text-black border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-2">
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
                className="w-full bg-white text-black border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
          </>
        );

      case 2:
        return (
          <>
            <div className="space-y-2">
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
                className="w-full bg-white text-black border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-2">
              <StyledLabel htmlFor="lastName">
                <User className="w-4 h-4 inline mr-1" />
                Last Name
              </StyledLabel>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                placeholder="Doe"
                required
                className="w-full bg-white text-black border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
          </>
        );

      case 3:
        return (
          <>
            <div className="space-y-2">
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
                className="w-full bg-white text-black border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-2">
              <StyledLabel htmlFor="confirmPassword">
                <Key className="w-4 h-4 inline mr-1" />
                Confirm Password
              </StyledLabel>
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
                className="w-full bg-white text-black border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Company Information";
      case 2:
        return "Personal Information";
      case 3:
        return "Create Password";
      default:
        return "Create Your Account";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Tell us about your company";
      case 2:
        return "Tell us about yourself";
      case 3:
        return "Secure your account";
      default:
        return "Start your business with " + hubConfig.displayName;
    }
  };

  if (!isFormReady) {
    return (
      <SignupContainer>
        <Card className="w-full max-w-md mx-auto">
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
                Loading...
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          </CardContent>
        </Card>
      </SignupContainer>
    );
  }

  return (
    <SignupContainer>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="text-center mb-6">
            <HubLogo
              hubType={hubConfig.id}
              variant="icon"
              size="md"
              className="mx-auto mb-4"
            />
            <CardTitle className="text-2xl font-bold">
              {getStepTitle()}
            </CardTitle>
            <CardDescription>
              {getStepDescription()}
            </CardDescription>
          </div>
          
          <StepIndicator>
            <Step active={currentStep === 1} completed={currentStep > 1}>1</Step>
            <StepConnector completed={currentStep > 1} />
            <Step active={currentStep === 2} completed={currentStep > 2}>2</Step>
            <StepConnector completed={currentStep > 2} />
            <Step active={currentStep === 3} completed={false}>3</Step>
          </StepIndicator>
        </CardHeader>

        <CardContent className="px-4 sm:px-6">
          <form onSubmit={currentStep === 3 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }} className="space-y-4 sm:space-y-6">
            {renderStepContent()}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="flex-1"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
              )}
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`${currentStep === 1 ? 'w-full' : 'flex-1'} hub-bg-primary hover:hub-bg-primary/90`}
              >
                {isSubmitting ? "Creating Account..." : currentStep === 3 ? "Create Account" : "Next"}
                {currentStep === 3 ? (
                  <UserPlus className="w-4 h-4 ml-2" />
                ) : (
                  <ChevronRight className="w-4 h-4 ml-1" />
                )}
              </Button>
            </div>
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