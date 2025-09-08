import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useToast,
  FormContainerComponent,
  FormFieldComponent,
  PageLayout,
  useHub,
  SEO,
} from "@sms-hub/ui";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { contactService } from "../services/contactService";

import {
  CheckCircle,
  Loader2,
  MessageSquare,
  Mail,
  Phone,
  Building,
  User,
  ArrowRight,
  Star,
  Shield,
  Zap,
} from "lucide-react";

const Contact = () => {
  const { hubConfig } = useHub();
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
      // Submit to Edge Function
      await contactService.submitContact({
        ...formData,
        hub_id: hubConfig.hubNumber,
      });

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

      // Redirect to landing page after 3 seconds
      setTimeout(() => {
        navigate("/");
        // Ensure we scroll to the top after navigation
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
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
      <SEO
        title="Contact Us - Get SMS That Actually Works"
        description="Ready to transform your business communication? Get in touch with our team to discuss how our compliant SMS platform can elevate your customer engagement."
        keywords="contact SMS platform, business texting consultation, SMS compliance help, premium messaging solutions"
      />

      <div className="min-h-screen bg-black pt-20 pb-12 relative">
        {/* Subtle background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          {/* Hero Section - Matching Homepage Style */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 mb-8">
              <span className="text-sm font-medium text-orange-400">
                GET IN TOUCH
              </span>
            </div>

            <h1
              className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              Ready to get
              <span className="gradient-text block">SMS that works?</span>
            </h1>

            <p
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              No more SMS rejections. No compliance headaches. Just professional
              texting that works for your regulated business. Let's discuss how
              we can transform your customer communication.
            </p>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto mb-12 sm:mb-16">
              <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-4 sm:p-6 hover:border-orange-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400" />
                </div>
                <h3
                  className="text-base sm:text-lg font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  Email Support
                </h3>
                <p
                  className="text-gray-400 text-xs sm:text-sm leading-relaxed"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  Get detailed responses within 24 hours
                </p>
              </div>

              <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-4 sm:p-6 hover:border-orange-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400" />
                </div>
                <h3
                  className="text-base sm:text-lg font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  Phone Consultation
                </h3>
                <p
                  className="text-gray-400 text-xs sm:text-sm leading-relaxed"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  Schedule a personalized consultation call
                </p>
              </div>

              <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-4 sm:p-6 hover:border-orange-500/30 transition-all duration-300 hover:transform hover:scale-105 sm:col-span-2 lg:col-span-1">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400" />
                </div>
                <h3
                  className="text-base sm:text-lg font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  Live Chat
                </h3>
                <p
                  className="text-gray-400 text-xs sm:text-sm leading-relaxed"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  Instant support during business hours
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="mb-12 sm:mb-16 lg:mb-20">
            <div className="text-center mb-8 sm:mb-12">
              <h2
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Let's Get You Started
              </h2>
              <p
                className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Tell us about your business and how we can help you get SMS that
                actually works for your regulated industry.
              </p>
            </div>

            <div className="max-w-4xl mx-auto px-2 sm:px-0">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-gray-700/50 p-4 sm:p-6 lg:p-8 shadow-2xl relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-purple-500/5"></div>

                <div className="relative z-10">
                  <FormContainerComponent
                    onSubmit={handleSubmit}
                    submitText="Send Message"
                    submitLoading={isSubmitting}
                    submitDisabled={isSubmitting}
                  >
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="group">
                        <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-orange-400 transition-colors">
                          <User className="w-4 h-4 inline mr-2" />
                          First Name *
                        </label>
                        <FormFieldComponent
                          label="First Name"
                          name="firstName"
                          type="text"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              firstName: value,
                            }))
                          }
                        />
                      </div>

                      <div className="group">
                        <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-orange-400 transition-colors">
                          <User className="w-4 h-4 inline mr-2" />
                          Last Name *
                        </label>
                        <FormFieldComponent
                          label="Last Name"
                          name="lastName"
                          type="text"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              lastName: value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="group">
                        <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-orange-400 transition-colors">
                          <Mail className="w-4 h-4 inline mr-2" />
                          Email *
                        </label>
                        <FormFieldComponent
                          label="Email"
                          name="email"
                          type="email"
                          placeholder="john@speakeasy.com"
                          value={formData.email}
                          onChange={(value) =>
                            setFormData((prev) => ({ ...prev, email: value }))
                          }
                        />
                      </div>

                      <div className="group">
                        <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-orange-400 transition-colors">
                          <Phone className="w-4 h-4 inline mr-2" />
                          Phone (Optional)
                        </label>
                        <FormFieldComponent
                          label="Phone"
                          name="phone"
                          type="tel"
                          placeholder="(555) 123-4567"
                          value={formData.phone}
                          onChange={(value) =>
                            setFormData((prev) => ({ ...prev, phone: value }))
                          }
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="group">
                        <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-orange-400 transition-colors">
                          <Building className="w-4 h-4 inline mr-2" />
                          Company (Optional)
                        </label>
                        <FormFieldComponent
                          label="Company"
                          name="company"
                          type="text"
                          placeholder="Company Name"
                          value={formData.company}
                          onChange={(value) =>
                            setFormData((prev) => ({ ...prev, company: value }))
                          }
                        />
                      </div>
                    </div>

                    <div className="mb-8">
                      <div className="group">
                        <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-orange-400 transition-colors">
                          <MessageSquare className="w-4 h-4 inline mr-2" />
                          Message (Optional)
                        </label>
                        <FormFieldComponent
                          label="Message"
                          name="message"
                          type="textarea"
                          placeholder="Tell us about your venue, your needs, and how we can help elevate your customer communication..."
                          value={formData.message}
                          onChange={(value) =>
                            setFormData((prev) => ({ ...prev, message: value }))
                          }
                        />
                      </div>
                    </div>

                    <div className="text-center">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-4 bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25 flex items-center justify-center mx-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Sending Message...
                          </>
                        ) : (
                          <>
                            Send Message
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </button>
                    </div>
                  </FormContainerComponent>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="mb-20">
            <div className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 border border-orange-500/20 rounded-3xl p-12 backdrop-blur-sm">
              <div className="text-center mb-12">
                <h2
                  className="text-3xl md:text-4xl font-bold text-white mb-6"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  Why We're Different
                </h2>
                <p
                  className="text-xl text-gray-300 max-w-3xl mx-auto"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  We're not just another SMS provider. We're the platform that
                  actually works for regulated businesses.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Star className="w-8 h-8 text-orange-400" />
                  </div>
                  <h3
                    className="text-xl font-semibold text-white mb-3"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    Regulatory Expertise
                  </h3>
                  <p
                    className="text-gray-300 text-sm leading-relaxed"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    Built-in compliance features that exceed industry standards
                    and regulatory requirements.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-8 h-8 text-orange-400" />
                  </div>
                  <h3
                    className="text-xl font-semibold text-white mb-3"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    Premium Support
                  </h3>
                  <p
                    className="text-gray-300 text-sm leading-relaxed"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    Dedicated assistance that matches your business standards
                    and exceeds expectations.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Zap className="w-8 h-8 text-orange-400" />
                  </div>
                  <h3
                    className="text-xl font-semibold text-white mb-3"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    Custom Solutions
                  </h3>
                  <p
                    className="text-gray-300 text-sm leading-relaxed"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    Tailored platforms built specifically for regulated
                    businesses that demand excellence.
                  </p>
                </div>
              </div>
            </div>
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
