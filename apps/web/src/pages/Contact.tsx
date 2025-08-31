import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useToast,
  FormContainerComponent,
  FormFieldComponent,
  PageLayout,
} from "@sms-hub/ui";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

import { CheckCircle, Loader2 } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
    message: string;
  }>({
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
      // TODO: Implement contact submission
      console.log("Contact form submitted:", formData);

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

  return (
    <PageLayout
      showNavigation={true}
      showFooter={true}
      navigation={<Navigation />}
      footer={<Footer />}
    >
      <div className="min-h-screen bg-black p-8 relative">
        {/* Contact Form */}
        <div className="flex justify-center pt-4">
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 shadow-2xl max-w-md w-full">
            <FormContainerComponent
              onSubmit={handleSubmit}
              submitText="Submit"
              submitLoading={isSubmitting}
              submitDisabled={isSubmitting}
            >
              <div className="grid grid-cols-2 gap-4">
                <FormFieldComponent
                  label="First Name"
                  name="firstName"
                  type="text"
                  placeholder="John"
                  required
                  value={formData.firstName}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, firstName: value }))
                  }
                />
                <FormFieldComponent
                  label="Last Name"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  required
                  value={formData.lastName}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, lastName: value }))
                  }
                />
              </div>

              <FormFieldComponent
                label="Email"
                name="email"
                type="email"
                placeholder="john@speakeasy.com"
                required
                value={formData.email}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, email: value }))
                }
              />

              <FormFieldComponent
                label="Phone (Optional)"
                name="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, phone: value }))
                }
              />

              <FormFieldComponent
                label="Company (Optional)"
                name="company"
                type="text"
                placeholder="Company Name"
                value={formData.company}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, company: value }))
                }
              />

              <FormFieldComponent
                label="Message (Optional)"
                name="message"
                type="textarea"
                placeholder="Tell us about your venue or interest..."
                value={formData.message}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, message: value }))
                }
              />
            </FormContainerComponent>
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
