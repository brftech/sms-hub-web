import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  useHub,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@sms-hub/ui";
import { useCreateTempSignup } from "../hooks/useAuth";
import { SignupData } from "@sms-hub/types";
import { toast } from "sonner";
import { Phone, Mail, ArrowLeft } from "lucide-react";

export function Signup() {
  const { hubConfig } = useHub();
  const createTempSignup = useCreateTempSignup();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<SignupData>({
    hub_id: hubConfig.hubNumber,
    company_name: "",
    first_name: "",
    last_name: "",
    mobile_phone_number: "",
    email: "",
    auth_method: "sms",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await createTempSignup.mutateAsync({
        ...formData,
        hub_id: hubConfig.hubNumber,
      });

      toast.success("Verification code sent! Check your phone.");

      // Navigate to verification page
      navigate(`/verify?id=${result.id}`);
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error("Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof SignupData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back to Home Link */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-extrabold hub-text-primary">
            Join {hubConfig.displayName}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account to start your SMS journey
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>
              Enter your details to get started with SMS campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  type="text"
                  value={formData.company_name}
                  onChange={(e) => updateFormData("company_name", e.target.value)}
                  placeholder="Your Company"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => updateFormData("first_name", e.target.value)}
                    placeholder="John"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => updateFormData("last_name", e.target.value)}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  placeholder="john@company.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile_phone_number">Phone Number</Label>
                <Input
                  id="mobile_phone_number"
                  type="tel"
                  value={formData.mobile_phone_number}
                  onChange={(e) => updateFormData("mobile_phone_number", e.target.value)}
                  placeholder="(555) 123-4567"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Verification Method</Label>
                <div className="space-y-2">
                  <div 
                    className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.auth_method === 'sms' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => updateFormData("auth_method", "sms")}
                  >
                    <input
                      type="radio"
                      name="auth_method"
                      value="sms"
                      checked={formData.auth_method === 'sms'}
                      onChange={() => updateFormData("auth_method", "sms")}
                      className="text-blue-600"
                    />
                    <Phone className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">Send code via SMS</span>
                  </div>
                  <div 
                    className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.auth_method === 'email' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => updateFormData("auth_method", "email")}
                  >
                    <input
                      type="radio"
                      name="auth_method"
                      value="email"
                      checked={formData.auth_method === 'email'}
                      onChange={() => updateFormData("auth_method", "email")}
                      className="text-blue-600"
                    />
                    <Mail className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">Send code via Email</span>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full hub-bg-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium hub-text-primary hover:opacity-80"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
