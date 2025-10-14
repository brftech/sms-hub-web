import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useToast,
  FormContainerComponent,
  FormFieldComponent,
  PageLayout,
  useHub,
  SEO,
} from "@sms-hub/ui/marketing";
import { getHubColors } from "@sms-hub/hub-logic";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { contactService } from "../services/contactService";
import { CloudflareTurnstile } from "../components/CloudflareTurnstile";

import { CheckCircle, Loader2, Star, Shield, Zap } from "lucide-react";
import { HOME_PATH } from "@/utils/routes";

const Contact = () => {
  const { hubConfig, currentHub } = useHub();
  const hubColors = getHubColors(currentHub).tailwind;
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
    message: string;
    emailSignup: boolean;
    smsSignup: boolean;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    emailSignup: false,
    smsSignup: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [honeypot, setHoneypot] = useState(""); // Spam protection
  const [formStartTime] = useState(Date.now()); // Spam protection
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
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

    // Spam protection checks
    if (honeypot) {
      // Honeypot field filled - likely spam
      toast({
        title: "Submission blocked",
        description: "Please try again with a valid submission.",
        variant: "destructive",
      });
      return;
    }

    const formTime = Date.now() - formStartTime;
    if (formTime < 3000) {
      // Form submitted too quickly - likely spam
      toast({
        title: "Please take your time",
        description: "Please fill out the form completely before submitting.",
        variant: "destructive",
      });
      return;
    }

    // Client-side validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please fill in your first name, last name, and email address.",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid email address",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Turnstile verification (if enabled)
    const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
    if (turnstileSiteKey && !turnstileToken) {
      toast({
        title: "Please complete verification",
        description: "Please complete the verification challenge before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get client IP (best effort)
      const clientIP = await fetch("https://api.ipify.org?format=json")
        .then((res) => res.json())
        .then((data) => data.ip)
        .catch(() => null);

      // Submit to Edge Function with signup preferences and spam protection
      await contactService.submitContact({
        ...formData,
        hub_id: hubConfig.hubNumber,
        email_signup: formData.emailSignup,
        sms_signup: formData.smsSignup,
        turnstile_token: turnstileToken,
        client_ip: clientIP,
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
        emailSignup: false,
        smsSignup: false,
      });

      // Reset turnstile token
      setTurnstileToken(null);

      // Redirect to landing page after 3 seconds
      setTimeout(() => {
        navigate(HOME_PATH);
        // Ensure we scroll to the top after navigation
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
      }, 3000);
    } catch {
      // Error handled by UI state
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
          <div
            className={`absolute top-0 left-1/4 w-96 h-96 ${hubColors.bgLight} rounded-full blur-3xl`}
          ></div>
          <div
            className={`absolute bottom-0 right-1/4 w-96 h-96 ${hubColors.bgLight} rounded-full blur-3xl`}
          ></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          {/* Hero Section - Matching Homepage Style */}
          <div className="text-center mb-20">
            <div
              className={`inline-flex items-center px-4 py-2 rounded-full ${hubColors.bgLight} ${hubColors.borderLight} mb-8`}
            >
              <span className={`text-sm font-medium ${hubColors.text}`}>GET IN TOUCH</span>
            </div>

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
                  <FormContainerComponent
                    onSubmit={handleSubmit}
                    submitText="Send Message"
                    submitLoading={isSubmitting}
                    submitDisabled={isSubmitting}
                    buttonClassName={`${hubColors.bg} ${hubColors.text} hover:${hubColors.bgHover} transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105`}
                  >
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="group">
                        <FormFieldComponent
                          label="First Name *"
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
                        <FormFieldComponent
                          label="Last Name *"
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
                        <FormFieldComponent
                          label="Email *"
                          name="email"
                          type="email"
                          placeholder="john@speakeasy.com"
                          value={formData.email}
                          onChange={(value) => setFormData((prev) => ({ ...prev, email: value }))}
                        />
                      </div>

                      <div className="group">
                        <FormFieldComponent
                          label="Phone (Optional)"
                          name="phone"
                          type="tel"
                          placeholder="(555) 123-4567"
                          value={formData.phone}
                          onChange={(value) => setFormData((prev) => ({ ...prev, phone: value }))}
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="group">
                        <FormFieldComponent
                          label="Company (Optional)"
                          name="company"
                          type="text"
                          placeholder="Company Name"
                          value={formData.company}
                          onChange={(value) => setFormData((prev) => ({ ...prev, company: value }))}
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="group">
                        <FormFieldComponent
                          label="Message (Optional)"
                          name="message"
                          type="textarea"
                          placeholder="Tell us about your venue, your needs, and how we can help elevate your customer communication..."
                          value={formData.message}
                          onChange={(value) => setFormData((prev) => ({ ...prev, message: value }))}
                          className="[&_textarea]:bg-white [&_textarea]:text-black [&_textarea]:placeholder-gray-500"
                        />
                      </div>
                    </div>

                    {/* Signup Preferences */}
                    <div className="mb-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                      <h3 className="text-sm font-medium text-white mb-3">
                        Stay Updated (Optional)
                      </h3>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.emailSignup}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                emailSignup: e.target.checked,
                              }))
                            }
                            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-sm text-gray-300">
                            Email updates about SMS platform features and industry insights
                          </span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.smsSignup}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                smsSignup: e.target.checked,
                              }))
                            }
                            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-sm text-gray-300">
                            SMS notifications about important updates and new features
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Honeypot field - hidden from users */}
                    <div style={{ display: "none" }}>
                      <label htmlFor="website">Website (leave blank)</label>
                      <input
                        type="text"
                        id="website"
                        name="website"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    {/* Cloudflare Turnstile - Spam Protection */}
                    {import.meta.env.VITE_TURNSTILE_SITE_KEY && (
                      <div className="mb-6">
                        <CloudflareTurnstile
                          siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                          onVerify={(token) => {
                            // eslint-disable-next-line no-console
                            console.log(
                              "🎫 Turnstile token received:",
                              `${token.substring(0, 20)}...`
                            );
                            setTurnstileToken(token);
                          }}
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
                  </FormContainerComponent>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
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
