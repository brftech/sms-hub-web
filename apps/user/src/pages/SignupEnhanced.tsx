import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useHub, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@sms-hub/ui";
import { Input, Label, Checkbox, Alert, AlertDescription } from "@sms-hub/ui";
import { Shield, Smartphone, Zap, Lock, Bell, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Back to Home Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-400 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-xl shadow-2xl p-6 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-lg font-bold text-orange-500">
                {hubConfig.displayName.charAt(0)}
              </span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">
              Join {hubConfig.displayName}
            </h1>
            <p className="text-xs text-gray-600">
              Get started in under 2 minutes
            </p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                <span className="text-sm text-red-800">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Top Row: Company Name */}
            <div>
              <Label htmlFor="company_name" className="text-sm font-medium text-gray-700">
                Company Name
              </Label>
              <Input
                id="company_name"
                type="text"
                placeholder="Your company"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="mt-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Second Row: Name, Email */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name" className="text-sm font-medium text-gray-700">
                  First Name
                </Label>
                <Input
                  id="first_name"
                  type="text"
                  placeholder="John"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="mt-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="last_name" className="text-sm font-medium text-gray-700">
                  Last Name
                </Label>
                <Input
                  id="last_name"
                  type="text"
                  placeholder="Doe"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="mt-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Third Row: Phone, Email */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className="mt-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  required
                  disabled={isSubmitting}
                />
                {authMethod === "sms" && (
                  <p className="text-xs font-semibold text-orange-600 mt-1">
                    We'll send a verification code to this number
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  required
                  disabled={isSubmitting}
                />
                {authMethod === "email" && (
                  <p className="text-xs font-semibold text-orange-600 mt-1">
                    We'll send a verification code to this email
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Row: Verification Method & Terms */}
            <div className="grid grid-cols-2 gap-4">
              {/* Verification Method */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Verification Method</Label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="auth_method"
                      value="sms"
                      checked={authMethod === "sms"}
                      onChange={() => setAuthMethod("sms")}
                      className="w-4 h-4 text-orange-600"
                    />
                    <span className="text-sm text-gray-900">SMS</span>
                    <span className="px-1.5 py-0.5 text-xs font-semibold bg-orange-100 text-orange-800 rounded-full">BEST</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="auth_method"
                      value="email"
                      checked={authMethod === "email"}
                      onChange={() => setAuthMethod("email")}
                      className="w-4 h-4 text-orange-600"
                    />
                    <span className="text-sm text-gray-900">Email</span>
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
                  className="mt-0.5"
                />
                <Label htmlFor="agree_terms" className="text-xs leading-relaxed text-gray-600">
                  I agree to the{" "}
                  <a href="/terms" target="_blank" className="text-orange-600 hover:text-orange-700 font-medium">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" target="_blank" className="text-orange-600 hover:text-orange-700 font-medium">
                    Privacy Policy
                  </a>
                </Label>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-2.5 rounded-lg transition-colors"
              disabled={isSubmitting || !formData.agree_terms}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>

            {/* Login Link */}
            <div className="text-center pt-3 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-orange-600 hover:text-orange-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}