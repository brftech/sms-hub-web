import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHub, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@sms-hub/ui";
import { Input, Label, Checkbox, Alert, AlertDescription } from "@sms-hub/ui";
import { Shield, Smartphone, Zap, Lock, Bell, CheckCircle2, AlertCircle } from "lucide-react";
import styled from "styled-components";

const BenefitsList = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 1.5rem;
  color: white;
  margin-bottom: 1.5rem;
`;

// Helper function to map hub IDs to database values
const getHubIdForDatabase = (hubId: string): number => {
  const hubMap: Record<string, number> = {
    "percytech": 1,
    "gnymble": 2,
    "percymd": 3,
    "percytext": 4,
  };
  return hubMap[hubId] || 2; // Default to Gnymble if not found
};

const BenefitItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export function SignupEnhanced() {
  const { hubConfig } = useHub();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [authMethod, setAuthMethod] = useState<"sms" | "email">("sms");
  
  // Form fields
  const [formData, setFormData] = useState({
    company_name: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    agree_terms: false,
  });

  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/\D/g, "");
    if (phoneNumber.length <= 3) return phoneNumber;
    if (phoneNumber.length <= 6) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.company_name || !formData.first_name || !formData.last_name || !formData.email || !formData.phone) {
      setError("All fields are required");
      return;
    }
    
    if (!formData.agree_terms) {
      setError("Please agree to the terms and conditions");
      return;
    }

    // Clean phone number for submission
    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-temp-signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          hub_id: getHubIdForDatabase(hubConfig.id),
          company_name: formData.company_name,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          mobile_phone_number: `+1${cleanPhone}`,
          auth_method: authMethod,
        }),
      });

      const data = await response.json();
      console.log("Signup response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      if (!data.id) {
        console.error("No ID in signup response:", data);
        throw new Error("Failed to get signup ID");
      }

      // Navigate to verification page
      console.log("Navigating to verify with ID:", data.id);
      navigate(`/verify?id=${data.id}&method=${authMethod}`);
    } catch (err: any) {
      setError(err.message || "An error occurred during signup");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* SMS Benefits Card */}
        {authMethod === "sms" && (
          <BenefitsList>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Shield className="w-6 h-6 mr-2" />
              SMS Verification Benefits
            </h3>
            <BenefitItem>
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span><strong>2-Factor Authentication:</strong> Extra security for your account</span>
            </BenefitItem>
            <BenefitItem>
              <Zap className="w-5 h-5 flex-shrink-0" />
              <span><strong>Instant Alerts:</strong> Real-time notifications for critical updates</span>
            </BenefitItem>
            <BenefitItem>
              <Lock className="w-5 h-5 flex-shrink-0" />
              <span><strong>Passwordless Login:</strong> Quick access with SMS codes</span>
            </BenefitItem>
            <BenefitItem>
              <Bell className="w-5 h-5 flex-shrink-0" />
              <span><strong>Priority Support:</strong> SMS-verified users get faster response times</span>
            </BenefitItem>
            <BenefitItem>
              <Smartphone className="w-5 h-5 flex-shrink-0" />
              <span><strong>Mobile Dashboard:</strong> Exclusive access to mobile features</span>
            </BenefitItem>
          </BenefitsList>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Create Your {hubConfig.displayName} Account
            </CardTitle>
            <CardDescription className="text-center">
              Join thousands of businesses streamlining their communications
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Company Name - Required */}
              <div>
                <Label htmlFor="company_name">
                  Company Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="company_name"
                  type="text"
                  placeholder="Acme Corporation"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="first_name"
                    type="text"
                    placeholder="John"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="last_name"
                    type="text"
                    placeholder="Doe"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@acme.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone">
                  Cell Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  required
                  disabled={isSubmitting}
                />
                <p className="text-sm text-gray-500 mt-1">
                  We'll send a verification code to this number
                </p>
              </div>

              {/* Authentication Method Choice */}
              <div className="border rounded-lg p-4 space-y-3">
                <Label>Verification Method</Label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="auth_method"
                      value="sms"
                      checked={authMethod === "sms"}
                      onChange={() => setAuthMethod("sms")}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="flex-1">
                      <strong>SMS Verification (Recommended)</strong>
                      <p className="text-sm text-gray-500">Get exclusive benefits and enhanced security</p>
                    </span>
                    <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded">BEST VALUE</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="auth_method"
                      value="email"
                      checked={authMethod === "email"}
                      onChange={() => setAuthMethod("email")}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span>
                      <strong>Email Verification</strong>
                      <p className="text-sm text-gray-500">Standard verification via email</p>
                    </span>
                  </label>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agree_terms"
                  checked={formData.agree_terms}
                  onCheckedChange={(checked) => setFormData({ ...formData, agree_terms: checked as boolean })}
                  disabled={isSubmitting}
                />
                <Label htmlFor="agree_terms" className="text-sm leading-relaxed">
                  I agree to the{" "}
                  <a href="/terms" target="_blank" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" target="_blank" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting || !formData.agree_terms}
              >
                {isSubmitting ? "Creating Account..." : "Continue with Verification"}
              </Button>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <a href="/login" className="text-blue-600 hover:underline">
                  Sign in
                </a>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}