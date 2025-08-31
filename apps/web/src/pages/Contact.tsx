import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { contactService } from "@/services";
import { ContactData } from "@/types";
import { FormContainer, FormField } from "@/components/forms";
import { PageLayout } from "@/components/layout";
import { useHub } from "@/contexts/HubContext";

import { CheckCircle, Loader2 } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState<ContactData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { hubConfig } = useHub();
  const firstNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (firstNameRef.current) {
      firstNameRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim()
    ) {
      toast({
        title: "Required fields missing",
        description:
          "Please fill in your first name, last name, and email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await contactService.submitContact(formData, hubConfig.hubNumber);

      // Show success modal
      setShowSuccess(true);

      // Clear form data
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        message: "",
      });

      // Redirect to home page after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Something went sideways",
        description: "Please try again or reach out directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-black p-8 relative">
        {/* Contact Form */}
        <div className="flex justify-center pt-4">
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 shadow-2xl max-w-md w-full">
            <FormContainer
              title="Get in Touch"
              onSubmit={handleSubmit}
              submitText="Submit"
              isSubmitting={isSubmitting}
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="First Name"
                  name="firstName"
                  type="text"
                  placeholder="John"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  autoComplete="given-name"
                />
                <FormField
                  label="Last Name"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  autoComplete="family-name"
                />
              </div>

              <FormField
                label="Email"
                name="email"
                type="email"
                placeholder="john@speakeasy.com"
                required
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />

              <FormField
                label="Phone (Optional)"
                name="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
              />

              <FormField
                label="Company (Optional)"
                name="company"
                type="text"
                placeholder="Company Name"
                value={formData.company}
                onChange={handleChange}
                autoComplete="organization"
              />

              <FormField
                label="Message (Optional)"
                name="message"
                type="textarea"
                placeholder="Tell us about your venue or interest..."
                value={formData.message}
                onChange={handleChange}
              />
            </FormContainer>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 p-8 shadow-2xl max-w-md w-full text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-4">
              Message Sent Successfully!
            </h3>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Thank you for reaching out. We'll respond within 24 hours.
            </p>

            <div className="flex items-center justify-center text-sm text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Redirecting to home page...
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default Contact;
