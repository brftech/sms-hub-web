import { useState, useEffect, useRef } from "react";
import {
  useHub,
  HubLogo,
  FormFieldComponent,
  useToast,
  StaticPhoneDemo,
} from "@sms-hub/ui";
import { ArrowRight, Loader2 } from "lucide-react";
import { SEO } from "@sms-hub/ui";
import { contactService } from "../services/contactService";
import cigarImage from "@sms-hub/ui/assets/cigar.jpg";

const CigarLanding = () => {
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

  // Cigar industry demo messages
  const cigarMessages = [
    {
      id: "cigar-1",
      text: "🚨 JUST ARRIVED! Limited Edition Arturo Fuente OpusX 25th Anniversary Only 2 boxes available. These won't last!",
      sender: "business" as const,
      businessName: "gnymble",
    },
    {
      id: "cigar-2",
      text: "Hold one for me! I'll be there in 30 minutes.",
      sender: "user" as const,
    },
    {
      id: "cigar-3",
      text: "✅ Done! Come to the first counter, we'll take care of you.",
      sender: "business" as const,
      businessName: "gnymble",
    },
  ];

  useEffect(() => {
    // Fade in effect
    setTimeout(() => setIsVisible(true), 100);
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
      // Submit to Edge Function with cigar-specific context
      await contactService.submitContact({
        ...formData,
        hub_id: hubConfig.hubNumber,
        message: `CIGAR INDUSTRY INQUIRY: ${formData.message}`,
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
        title: "Something went wrong",
        description: "Please try again or reach out directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      // Focus on first field after scroll completes
      setTimeout(() => {
        const firstInput = formRef.current?.querySelector(
          'input[name="firstName"]'
        ) as HTMLInputElement;
        if (firstInput) {
          firstInput.focus();
        }
      }, 800);
    }
  };

  return (
    <>
      <SEO
        title="Gnymble - Compliant SMS Cigar Texting"
        description="We do it well. Others don't do it all. Compliant SMS texting for premium cigar retailers and tobacco companies."
        keywords="cigar texting, SMS marketing, tobacco compliance, premium cigars, PCA, cigar retail"
      />

      {/* Hero Section with Black Background */}
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full border-2 border-white"></div>
          <div className="absolute top-40 right-20 w-24 h-24 rounded-full border border-white"></div>
          <div className="absolute bottom-32 left-1/4 w-16 h-16 rounded-full border border-white"></div>
        </div>

        {/* Contact Button */}
        <button
          onClick={scrollToForm}
          className="absolute top-6 right-4 sm:top-8 sm:right-8 md:right-12 lg:right-24 xl:right-32 z-50 px-4 sm:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-medium rounded-full hover:bg-white/20 transition-all duration-300 text-sm"
          style={{ fontFamily: "Inter, system-ui, sans-serif" }}
        >
          Contact Us
        </button>

        <div className="min-h-screen flex items-center justify-center px-4 sm:px-8 md:px-12 lg:px-24 xl:px-32 py-20">
          <div
            className={`w-full max-w-6xl text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            {/* Gnymble Logo */}
            <div className="mb-12">
              <HubLogo
                hubType={currentHub}
                variant="main"
                size="xl"
                className="!flex-none !items-center justify-center opacity-90 transform scale-125 sm:scale-150 md:scale-175 lg:scale-200"
                style={{ transformOrigin: "center" }}
              />
            </div>

            {/* Main Headline */}
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 tracking-tight leading-tight"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              <span className="text-white">Compliant</span>{" "}
              <span className="text-white">SMS</span>{" "}
              <span className="text-white">Cigar Texting</span>
            </h1>

            {/* Tagline */}
            <div
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-orange-400 mb-12 font-bold"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              <div className="mb-2">We do it really well.</div>
              <div>Others...don't do it at all.</div>
            </div>

            {/* Phone Demo */}
            <div className="mb-16 scale-90 sm:scale-100 md:scale-110">
              <StaticPhoneDemo messages={cigarMessages} time="12:21" />
            </div>

            {/* Call to Action */}
            <div
              className="text-xl sm:text-2xl md:text-3xl text-white mb-12 font-medium"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              Text 'PCA' to <span className="font-bold">757-XXX-XXXX</span>
            </div>

            <div
              className="text-lg sm:text-xl text-white mb-16 font-medium"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              cigar.gnymble.com
            </div>

            {/* Customer Testimonial */}
            <div className="bg-black/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8 mb-16 max-w-4xl mx-auto">
              <p
                className="text-xl sm:text-2xl md:text-3xl text-orange-200 mb-6 font-medium italic"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                "The first time we used Gnymble to publicize
                <br />
                an event...we had a{" "}
                <span className="text-white font-bold underline decoration-orange-300">
                  record turnout!
                </span>
                "
              </p>
              <p
                className="text-white font-semibold text-lg"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                - Anstead's Tobacco Company
              </p>
            </div>

            {/* Bottom Text */}
            <div
              className="text-gray-300 text-base sm:text-lg mb-8"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              Texting rates apply. We respect your privacy and appreciate your
              trust.
              <br />
              Privacy and terms at www.gnymble.com.
            </div>

            {/* PCA Partnership Badge */}
            <div className="flex justify-center items-center mb-16">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 px-8 py-6 flex items-center space-x-6">
                <img
                  src={cigarImage}
                  alt="Premium Cigar"
                  className="w-12 h-12 object-contain"
                />
                <div className="text-right">
                  <div
                    className="text-white text-lg font-bold mb-1"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    PCA
                  </div>
                  <div
                    className="text-white text-sm opacity-80"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    Premium Cigar Association
                  </div>
                  <div
                    className="text-white text-xs opacity-60"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    Preferred Partner
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mb-20">
              <button
                onClick={() => {
                  const paymentLink = import.meta.env.VITE_STRIPE_PAYMENT_LINK;
                  if (paymentLink) {
                    window.location.href = paymentLink;
                  } else {
                    scrollToForm();
                  }
                }}
                className="px-8 py-4 bg-orange-600 text-white font-bold rounded-full hover:bg-orange-700 transition-all duration-300 text-lg tracking-wide flex items-center justify-center mx-auto group shadow-2xl"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Get Started Today
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-black py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 md:px-12 lg:px-24 xl:px-32">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              Built for Cigar Retailers
            </h2>
            <p
              className="text-xl text-gray-400 max-w-3xl mx-auto"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              From limited releases to customer loyalty programs, we understand
              the unique needs of premium cigar businesses.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mb-6 mx-auto">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              </div>
              <h3
                className="text-white font-bold text-xl mb-4"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                TCR Compliant
              </h3>
              <p
                className="text-gray-400 leading-relaxed"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Full 10DLC registration and campaign approval for tobacco
                industry messaging. We handle the complexity.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mb-6 mx-auto">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              </div>
              <h3
                className="text-white font-bold text-xl mb-4"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Premium Support
              </h3>
              <p
                className="text-gray-400 leading-relaxed"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Dedicated account management and same-day support for
                time-sensitive releases and events.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mb-6 mx-auto">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              </div>
              <h3
                className="text-white font-bold text-xl mb-4"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Industry Expertise
              </h3>
              <p
                className="text-gray-400 leading-relaxed"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                We specialize in regulated industries where others won't work.
                Your business is safe with us.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div ref={formRef} id="contact-form" className="max-w-4xl mx-auto">
            <h3
              className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              Ready to Enhance Your Customer Experience?
            </h3>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8 lg:p-12">
              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <FormFieldComponent
                    label="First Name *"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, firstName: value }))
                    }
                    required
                  />

                  <FormFieldComponent
                    label="Last Name *"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, lastName: value }))
                    }
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <FormFieldComponent
                    label="Email *"
                    name="email"
                    type="email"
                    placeholder="john@cigarcompany.com"
                    value={formData.email}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, email: value }))
                    }
                    required
                  />

                  <FormFieldComponent
                    label="Phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, phone: value }))
                    }
                  />
                </div>

                <div className="mb-8">
                  <FormFieldComponent
                    label="Company/Store Name"
                    name="company"
                    type="text"
                    placeholder="Premium Cigar Lounge"
                    value={formData.company}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, company: value }))
                    }
                  />
                </div>

                <div className="mb-10">
                  <FormFieldComponent
                    label="Tell us about your business"
                    name="message"
                    type="textarea"
                    placeholder="Number of locations, current customer communication methods, specific needs for texting campaigns..."
                    value={formData.message}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, message: value }))
                    }
                  />
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-12 py-4 bg-orange-600 text-white font-bold rounded-full hover:bg-orange-700 transition-all duration-300 text-lg tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto shadow-xl"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Start Your Campaign
                        <ArrowRight className="w-5 h-5 ml-3" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <p
              className="text-gray-500 text-center mt-8 leading-relaxed"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              Join the premium cigar retailers who trust Gnymble for compliant
              customer communication.
            </p>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 p-8 shadow-2xl max-w-md w-full text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-4">
              Message Sent Successfully!
            </h3>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Thank you for your interest. We'll respond within 24 hours with
              information specific to cigar retailers.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default CigarLanding;
