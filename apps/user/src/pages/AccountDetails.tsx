import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useHub, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@sms-hub/ui";
import { Input, Label, Alert, AlertDescription } from "@sms-hub/ui";
import { Building, User, Key, AlertCircle, CheckCircle2 } from "lucide-react";
import styled from "styled-components";

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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const verificationId = searchParams.get("id");
  const signupData = JSON.parse(sessionStorage.getItem('signup_data') || '{}');
  
  const [formData, setFormData] = useState({
    companyName: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationId) {
      setError("Session expired. Please start over.");
      setTimeout(() => navigate("/signup"), 2000);
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
      formData: { ...formData, password: "***", confirmPassword: "***" }
    });

    try {
      // Update verifications with the collected info
      const updateResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/verifications?id=eq.${verificationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY,
          "Prefer": "return=representation"
        },
        body: JSON.stringify({
          company_name: formData.companyName,
          first_name: formData.firstName,
          last_name: formData.lastName
        }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        console.error("Failed to update verification:", errorData);
        throw new Error("Failed to update information");
      }

      // Create the account
      const createAccountPayload = {
        verification_id: verificationId,
        password: formData.password,
        company_name: formData.companyName,
        first_name: formData.firstName,
        last_name: formData.lastName
      };
      
      console.log("Sending create-account request:", createAccountPayload);
      
      const accountResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(createAccountPayload),
      });

      const accountData = await accountResponse.json();
      console.log("Create account response:", accountResponse.status, accountData);

      if (!accountResponse.ok) {
        throw new Error(accountData.error || "Failed to create account");
      }

      // Store user info for checkout
      sessionStorage.setItem('account_data', JSON.stringify({
        user_id: accountData.user_id,
        company_id: accountData.company_id,
        email: accountData.email,
        hub_id: accountData.hub_id,
        customer_type: accountData.customer_type,
        company_name: formData.companyName,
        verification_id: accountData.verification_id
      }));

      setSuccess(true);

      // Always use magic link to authenticate first
      if (accountData.magic_link) {
        console.log("Using magic link for authentication...");
        // Store account data for after login
        sessionStorage.setItem('pending_checkout', JSON.stringify({
          email: accountData.email,
          userId: accountData.user_id,
          companyId: accountData.company_id,
          hubId: accountData.hub_id,
          customerType: accountData.customer_type || signupData.customer_type
        }));
        // Redirect to magic link which will log them in
        window.location.href = accountData.magic_link;
        return;
      } else {
        // Fallback - shouldn't happen
        console.error("No magic link generated");
        navigate("/login");
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
            <h2 className="text-2xl font-bold mb-2">Account Created!</h2>
            <p className="text-gray-600 mb-4">
              Welcome to {hubConfig.displayName}!
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to payment setup...
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

            {signupData.customer_type !== 'individual' && (
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
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    placeholder="Enter your company name"
                    required
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
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    placeholder="First name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    placeholder="Last name"
                    required
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
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Create a password"
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
            </FormSection>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Create Account & Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}