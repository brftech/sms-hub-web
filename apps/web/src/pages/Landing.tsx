import { useState, useEffect, useRef } from "react";
import { useHub, HubLogo, FormContainerComponent, FormFieldComponent, useToast } from "@sms-hub/ui";
import { ArrowRight, Loader2 } from "lucide-react";
import SEO from "../components/SEO";
import { contactService } from "../services/contactService";

const Landing = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const { currentHub, hubConfig } = useHub();
  const { toast } = useToast();
  const formRef = useRef<HTMLDivElement>(null);

  // Static phone component for demo
  const StaticPhone = () => (
    <div className="flex justify-center">
      <div className="phone-3d">
        <div className="phone-screen">
          {/* Phone Status Bar */}
          <div className="phone-status-bar">
            <span>9:41 AM</span>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-2 border border-white rounded-sm">
                <div className="w-3 h-1 bg-white rounded-sm"></div>
              </div>
            </div>
          </div>
          
          {/* Messages Area */}
          <div className="phone-messages-area">
            <div className="phone-messages">
              {/* Business Message */}
              <div className="flex justify-start mb-3">
                <div className="bg-gray-200 rounded-2xl rounded-bl-sm px-4 py-2 max-w-[85%]">
                  <p className="text-sm text-gray-800 text-left">🎉 Big news! We're transforming Gnymble with new features and a fresh look.</p>
                  <div className="text-xs text-gray-500 mt-1 text-left">Gnymble</div>
                </div>
              </div>
              
              {/* User Response */}
              <div className="flex justify-end mb-3">
                <div className="bg-blue-500 rounded-2xl rounded-br-sm px-4 py-2 max-w-[85%]">
                  <p className="text-sm text-white text-left">Can't wait to see what's new!</p>
                </div>
              </div>
              
              {/* Follow-up Message */}
              <div className="flex justify-start">
                <div className="bg-gray-200 rounded-2xl rounded-bl-sm px-4 py-2 max-w-[85%]">
                  <p className="text-sm text-gray-800 text-left">Get started today and be the first to experience our new features as they launch!</p>
                  <div className="text-xs text-gray-500 mt-1 text-left">Gnymble</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Input Area */}
          <div className="phone-input-area">
            <div className="phone-input-field flex items-center justify-center text-gray-400 text-sm">
              Message...
            </div>
            <div className="phone-send-button">
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    // Fade in effect
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please fill in your first name, last name, and email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit to Edge Function - using the exact same structure as Contact page
      await contactService.submitContact({
        ...formData,
        hub_id: hubConfig.hubNumber,
      });

      // Show success
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

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
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

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Focus on first field after scroll completes
      setTimeout(() => {
        const firstInput = formRef.current?.querySelector('input[name="firstName"]') as HTMLInputElement;
        if (firstInput) {
          firstInput.focus();
        }
      }, 800);
    }
  };

  return (
    <>
      <SEO 
        title="Gnymble - New Era Coming Soon"
        description="Gnymble is evolving. New brand, new features, same commitment to businesses others won't serve."
        keywords="Gnymble, SMS, business texting, rebrand, announcement"
      />
      
      {/* Teaser Landing Page */}
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Contact Us button - absolute top right with padding */}
        <button
          onClick={scrollToForm}
          className="absolute top-6 right-4 sm:top-8 sm:right-8 md:right-12 lg:right-24 xl:right-32 z-50 px-4 sm:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-full hover:bg-white/20 transition-all duration-300 text-sm"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          Contact Us
        </button>

        {/* Subtle gradient background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="min-h-screen flex items-center justify-center px-4 sm:px-8 md:px-12 lg:px-24 xl:px-32 py-16 sm:py-20 md:py-24 lg:py-32">
          <div className={`w-full max-w-6xl text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Logo */}
            <div className="mb-16 sm:mb-20 md:mb-24 lg:mb-32">
              <HubLogo
                hubType={currentHub}
                variant="text"
                size="xl"
                className="!flex-none !items-center justify-center opacity-90 transform scale-125 sm:scale-150 md:scale-175 lg:scale-200"
                style={{ transformOrigin: 'center' }}
              />
            </div>

            {/* Teaser Message - Under Logo */}
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 md:mb-8 lg:mb-10 tracking-tight" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Big, <span className="text-orange-500">gn</span>ew texting things coming soon...😏💬
            </h1>
            
            {/* Subheading - Inclusive */}
            <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-10 md:mb-12 lg:mb-16 max-w-3xl mx-auto" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Professional SMS for regulated industries, forward-thinking employers, and customer-focused businesses
            </p>

            {/* Phone Demo - More Prominent */}
            <div className="mb-10 sm:mb-12 md:mb-16 lg:mb-20 scale-90 sm:scale-100 md:scale-110">
              <StaticPhone />
            </div>
            
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto mb-8 md:mb-10 lg:mb-12"></div>
            
            <div className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-10 md:mb-12 lg:mb-16 max-w-4xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              <div className="mb-1"><span className="text-orange-500 font-bold">gnymble</span> is transforming.</div>
              <div className="mb-1">New brand identity, <span className="text-orange-500 font-semibold">powerful features</span>, enhanced platform.</div>
              <div>Same commitment to serving businesses others <span className="text-orange-500 font-semibold">reject</span>.</div>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12 mb-12 sm:mb-16 md:mb-20 lg:mb-28 text-left max-w-4xl mx-auto">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center mb-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              </div>
              <h3 className="text-white font-semibold" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>Full Compliance</h3>
              <p className="text-gray-400 text-sm" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>Built for regulated industries from day one</p>
            </div>
            
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center mb-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              </div>
              <h3 className="text-white font-semibold" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>Premium Service</h3>
              <p className="text-gray-400 text-sm" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>White-glove support for businesses that matter</p>
            </div>
            
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center mb-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              </div>
              <h3 className="text-white font-semibold" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>No Rejections</h3>
              <p className="text-gray-400 text-sm" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>We specialize where others say no</p>
            </div>
          </div>

            {/* Contact Form - Using the exact same components as Contact page */}
            <div ref={formRef} id="contact-form" className="max-w-4xl mx-auto">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Get Started Today
              </h3>
              
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 lg:p-8">
                <FormContainerComponent
                  onSubmit={handleSubmit}
                  submitText="Send Message"
                  submitLoading={isSubmitting}
                  submitDisabled={isSubmitting}
                >
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <FormFieldComponent
                      label="First Name *"
                      name="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(value) => setFormData((prev) => ({ ...prev, firstName: value }))}
                      required
                    />
                    
                    <FormFieldComponent
                      label="Last Name *"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(value) => setFormData((prev) => ({ ...prev, lastName: value }))}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <FormFieldComponent
                      label="Email *"
                      name="email"
                      type="email"
                      placeholder="john@company.com"
                      value={formData.email}
                      onChange={(value) => setFormData((prev) => ({ ...prev, email: value }))}
                      required
                    />
                    
                    <FormFieldComponent
                      label="Phone"
                      name="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(value) => setFormData((prev) => ({ ...prev, phone: value }))}
                    />
                  </div>

                  <div className="mb-6">
                    <FormFieldComponent
                      label="Company"
                      name="company"
                      type="text"
                      placeholder="Company Name"
                      value={formData.company}
                      onChange={(value) => setFormData((prev) => ({ ...prev, company: value }))}
                    />
                  </div>

                  <div className="mb-8">
                    <FormFieldComponent
                      label="Message"
                      name="message"
                      type="textarea"
                      placeholder="Tell us about your business and how we can help..."
                      value={formData.message}
                      onChange={(value) => setFormData((prev) => ({ ...prev, message: value }))}
                    />
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition-all duration-300 text-sm tracking-wide uppercase disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Get Started
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                </FormContainerComponent>
              </div>
              
              <p className="text-gray-500 text-sm mt-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                We're open and ready to serve your business today
              </p>
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
                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-4">
              Message Sent Successfully!
            </h3>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Thank you for reaching out. We'll respond within 24 hours.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Landing;