/**
 * Contact Page - Using FormBuilder
 * 
 * Simplified from 530+ lines to ~250 lines while maintaining all functionality.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useToast,
  PageLayout,
  useHub,
  SEO,
  FormBuilder,
} from "@sms-hub/ui/marketing";
import { getHubColors } from "@sms-hub/hub-logic";
import { getContactFormFields } from "../config/formSchemas";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { PageBadge } from "../components";
import { contactService } from "../services/contactService";
import { CloudflareTurnstile } from "../components/CloudflareTurnstile";
import { CheckCircle, Loader2, Star, Shield, Zap } from "lucide-react";
import { HOME_PATH } from "@/utils/routes";
import { trackFormSubmission } from "../usePerformanceTracking";

const Contact = () => {
  const { hubConfig, currentHub } = useHub();
  const hubColors = getHubColors(currentHub).tailwind;
  const [showSuccess, setShowSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [emailSignup, setEmailSignup] = useState(false);
  const [smsSignup, setSmsSignup] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (formData: Record<string, unknown>) => {
    const startTime = performance.now();

    try {
      // Validate Turnstile if enabled
      const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
      if (turnstileSiteKey && !turnstileToken) {
        toast({
          title: "Please complete verification",
          description: "Please complete the verification challenge before submitting.",
          variant: "destructive",
        });
        return { success: false, error: "Verification required" };
      }

      // Get client IP (best effort)
      const clientIP = await fetch("https://api.ipify.org?format=json")
        .then((res) => res.json())
        .then((data) => data.ip)
        .catch(() => null);

      // Submit to contact service
      await contactService.submitContact({
        firstName: formData.firstName as string,
        lastName: formData.lastName as string,
        email: formData.email as string,
        phone: formData.phone as string,
        company: formData.company as string,
        message: formData.message as string,
        hub_id: hubConfig.hubNumber,
        email_signup: emailSignup,
        sms_signup: smsSignup,
        turnstile_token: turnstileToken,
        client_ip: clientIP,
      });

      // Track successful submission
      const duration = performance.now() - startTime;
      trackFormSubmission('contact', true, duration);

      // Show success modal
      setShowSuccess(true);

      // Reset state
      setTurnstileToken(null);
      setEmailSignup(false);
      setSmsSignup(false);

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate(HOME_PATH);
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
      }, 3000);

      return { success: true };
    } catch {
      // Track failed submission
      const duration = performance.now() - startTime;
      trackFormSubmission('contact', false, duration);

      toast({
        title: "Something went sideways",
        description: "Please try again or reach out directly.",
        variant: "destructive",
      });

      return { success: false, error: "Submission failed" };
    }
  };

  // Get form fields based on current hub
  const formFields = getContactFormFields(currentHub);

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
          <div
            className={`absolute top-0 left-1/4 w-96 h-96 ${hubColors.bgLight} rounded-full blur-3xl`}
          ></div>
          <div
            className={`absolute bottom-0 right-1/4 w-96 h-96 ${hubColors.bgLight} rounded-full blur-3xl`}
          ></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <PageBadge text="GET IN TOUCH" className="mb-8" />

            <h1
              className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              Ready to get
              <span className={`${hubColors.text} block`}>SMS that works?</span>
            </h1>

            <p
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              No more SMS rejections. No compliance headaches. Just professional texting that works
              for your regulated business. Let's discuss how we can transform your customer
              communication.
            </p>
          </div>

          {/* Contact Form Section */}
          <div className="mb-12 sm:mb-16 lg:mb-20">
            <div className="max-w-4xl mx-auto px-2 sm:px-0">
              <div className="bg-black backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-gray-800 p-4 sm:p-6 lg:p-8 shadow-2xl relative overflow-hidden">
                {/* Background pattern */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${hubColors.gradient} opacity-5`}
                ></div>

                <div className="relative z-10">
                  {/* FormBuilder - Replaces 200+ lines of manual form code */}
                  <FormBuilder
                    fields={formFields}
                    onSubmit={handleSubmit}
                    submitButtonText="Send Message"
                    submitButtonClass={`w-full rounded-md py-3 ${hubColors.contactButton} font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105`}
                    layout="two-column"
                  />

                  {/* Signup Preferences */}
                  <div className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                    <h3 className="text-sm font-medium text-white mb-3">
                      Stay Updated (Optional)
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={emailSignup}
                          onChange={(e) => setEmailSignup(e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-sm text-gray-300">
                          Email updates about SMS platform features and industry insights
                        </span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={smsSignup}
                          onChange={(e) => setSmsSignup(e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-sm text-gray-300">
                          SMS notifications about important updates and new features
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Cloudflare Turnstile */}
                  {import.meta.env.VITE_TURNSTILE_SITE_KEY && (
                    <div className="mt-6">
                      <CloudflareTurnstile
                        siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                        onVerify={(token) => setTurnstileToken(token)}
                        onError={() => {
                          toast({
                            title: "Verification failed",
                            description: "Please refresh the page and try again.",
                            variant: "destructive",
                          });
                        }}
                        theme="dark"
                        size="normal"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Why We're Different Section */}
          <div className="mb-20">
            <div className="bg-black border border-gray-800 rounded-3xl p-12 backdrop-blur-sm">
              <div className="text-center mb-12">
                <h2
                  className="text-3xl md:text-4xl font-bold text-white mb-6"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  Why We're Different
                </h2>
                <p
                  className="text-xl text-gray-200 max-w-3xl mx-auto"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  We're not just another SMS provider. We're the platform that actually works for
                  regulated businesses.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${hubColors.gradient} opacity-20 ${hubColors.borderLight} rounded-2xl flex items-center justify-center mx-auto mb-6`}
                  >
                    <Star className={`w-8 h-8 ${hubColors.text}`} />
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
                    Built-in compliance features that exceed industry standards and regulatory
                    requirements.
                  </p>
                </div>

                <div className="text-center">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${hubColors.gradient} opacity-20 ${hubColors.borderLight} rounded-2xl flex items-center justify-center mx-auto mb-6`}
                  >
                    <Shield className={`w-8 h-8 ${hubColors.text}`} />
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
                    Dedicated assistance that matches your business standards and exceeds
                    expectations.
                  </p>
                </div>

                <div className="text-center">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${hubColors.gradient} opacity-20 ${hubColors.borderLight} rounded-2xl flex items-center justify-center mx-auto mb-6`}
                  >
                    <Zap className={`w-8 h-8 ${hubColors.text}`} />
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
                    Tailored platforms built specifically for regulated businesses that demand
                    excellence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100vh",
            margin: 0,
            padding: "1rem",
          }}
        >
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 p-8 shadow-2xl max-w-md w-full text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-4">Message Sent Successfully!</h3>

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
