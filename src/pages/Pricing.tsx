import { PageLayout, SEO } from "@sms-hub/ui";

import { useState } from "react";
import {
  Check,
  Zap,
  Shield,
  Clock,
  MessageSquare,
  Phone,
  Headphones,
  ArrowRight,
  Star,
  Users,
  Target,
} from "lucide-react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const Pricing = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Payment link handler - much simpler!
  const handleDirectCheckout = async (planType: string) => {
    setIsLoading(true);

    try {
      // Map plan types to payment links
      const paymentLinks = {
        starter:
          import.meta.env.VITE_STRIPE_PAYMENT_LINK_STARTER ||
          import.meta.env.VITE_STRIPE_PAYMENT_LINK,
        core:
          import.meta.env.VITE_STRIPE_PAYMENT_LINK_CORE ||
          import.meta.env.VITE_STRIPE_PAYMENT_LINK,
        elite:
          import.meta.env.VITE_STRIPE_PAYMENT_LINK_ELITE ||
          import.meta.env.VITE_STRIPE_PAYMENT_LINK,
      };

      const paymentLink = paymentLinks[planType as keyof typeof paymentLinks];

      if (!paymentLink) {
        // Payment link not configured
        throw new Error(`Payment link not configured for plan: ${planType}. Please check environment variables.`);
      }

      // Redirect directly to Stripe Payment Link
      window.location.href = paymentLink;
    } catch {
      // Error handled by UI
      alert("Failed to start checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onboardingPlan = {
    name: "Get Started Package",
    price: "$179",
    type: "one-time setup",
    description:
      "Everything you need to start texting your customers compliantly. We handle the heavy lifting.",
    features: [
      "Complete business setup & training",
      "Compliance consultation & setup",
      "Dedicated onboarding specialist",
      "First month of chosen plan included",
    ],
  };

  const monthlyPlans = [
    {
      name: "Starter",
      price: "$79",
      period: "per month",
      description:
        "Perfect for small shops starting with customer communications.",
      features: [
        "1 dedicated phone number",
        "Up to 50 contacts",
        "Up to 200 messages per month",
        "Text-centered customer support",
      ],
    },
    {
      name: "Core",
      price: "$179",
      period: "per month",
      description:
        "For established shops ready to grow their customer communications.",
      features: [
        "1 dedicated phone number",
        "Up to 500 contacts",
        "Up to 1,500 messages per month",
        "Text-centered customer support",
      ],
    },
    {
      name: "Elite",
      price: "$349",
      period: "per month",
      description: "For retailers with a thriving customer base.",
      features: [
        "1 dedicated or hosted phone number",
        "Up to 3,000 contacts",
        "Up to 8,000 messages per month",
        "Priority text and video support",
      ],
    },
  ];

  const everyPlanIncludes = [
    { icon: Shield, text: "Full compliance & regulatory expertise" },
    { icon: MessageSquare, text: "Professional SMS delivery platform" },
    { icon: Phone, text: "Dedicated phone number included" },
    { icon: Headphones, text: "Expert customer support" },
  ];

  const whyChooseUs = [
    {
      icon: Target,
      title: "We Get It",
      description:
        "While others reject your industry, we specialize in it. Cigar lounges, distilleries, premium venues - we understand your business.",
    },
    {
      icon: Star,
      title: "Premium Service",
      description:
        "White-glove support from day one. No chatbots, no runaround. Real experts who know your industry inside and out.",
    },
    {
      icon: Users,
      title: "Proven Results",
      description:
        "Our clients see real ROI. Better customer engagement, higher retention, and SMS that actually delivers results.",
    },
  ];

  const faqs = [
    {
      q: "How long does setup take?",
      a: "Setup takes 7-10 business days. We handle all compliance, carrier approvals, and platform configuration. No shortcuts, no surprises.",
    },
    {
      q: "Can I change plans later?",
      a: "Absolutely. After your first month, you can upgrade or downgrade based on your actual usage and needs. We're flexible because your business grows.",
    },
    {
      q: "What makes you different from other SMS providers?",
      a: "We specialize in regulated businesses. While others reject cigar retailers and premium venues, we provide compliant solutions designed for your industry. We get it.",
    },
    {
      q: "Is there a contract?",
      a: "No long-term contracts. Just the one-time onboarding fee to get started, then month-to-month service. We're confident you'll stay because we deliver.",
    },
  ];

  return (
    <PageLayout
      showNavigation={true}
      showFooter={true}
      navigation={<Navigation />}
      footer={<Footer />}
    >
      <SEO
        title="Pricing - Gnymble SMS Platform"
        description="Transparent pricing for compliant SMS solutions. Start for $179. No contracts, no rejections, just results."
        keywords="SMS pricing, business texting cost, compliant messaging, regulated industries"
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
              <Zap className="w-4 h-4 text-orange-400 mr-2" />
              <span className="text-sm font-medium text-orange-400">
                SIMPLE PRICING
              </span>
            </div>

            <h1
              className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              SMS that actually
              <span className="gradient-text block"> works</span>
            </h1>

            <p
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              One simple fee gets you set up, compliant, and ready to text.
              <span className="text-orange-400">
                {" "}
                No contracts. No hidden costs. No rejections.
              </span>
            </p>

            <div className="flex items-center justify-center space-x-8 text-gray-400 text-sm">
              <div className="flex items-center">
                <Check className="w-4 h-4 text-orange-500 mr-2" />
                <span>7-10 day setup</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-orange-500 mr-2" />
                <span>Full compliance</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-orange-500 mr-2" />
                <span>Month-to-month</span>
              </div>
            </div>
          </div>

          {/* Main Pricing Card - Center Stage */}
          <div className="mb-20">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-12 max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-orange-500/20 border border-orange-500/30 mb-8">
                <Zap className="w-10 h-10 text-orange-400" />
              </div>

              <h2
                className="text-4xl font-bold text-white mb-6"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                {onboardingPlan.name}
              </h2>

              <div className="mb-8">
                <div
                  className="text-6xl font-bold text-white mb-3"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  {onboardingPlan.price}
                </div>
                <div className="text-gray-400 text-lg">
                  {onboardingPlan.type}
                </div>
              </div>

              <p
                className="text-xl text-gray-300 mb-10 leading-relaxed"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                {onboardingPlan.description}
              </p>

              <ul className="text-left space-y-4 mb-10 max-w-lg mx-auto">
                {onboardingPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <Check className="w-6 h-6 text-orange-500 mr-4 flex-shrink-0" />
                    <span className="text-lg">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleDirectCheckout("starter")}
                disabled={isLoading}
                className="px-10 py-4 bg-orange-600 text-white font-bold rounded-full hover:bg-orange-700 disabled:bg-orange-400 disabled:cursor-not-allowed transition-all duration-300 text-lg tracking-wide uppercase flex items-center justify-center mx-auto group mb-6"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                {isLoading
                  ? "Starting Checkout..."
                  : "Get Started Today - $179"}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>

              <div className="flex items-center justify-center text-gray-400 text-sm">
                <Clock className="w-4 h-4 mr-2" />
                <span>Setup takes 7-10 business days</span>
              </div>
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl font-bold text-white mb-6"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Why businesses choose us
              </h2>
              <p
                className="text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                We do it really well. Others...don't do it at all.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {whyChooseUs.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <item.icon className="w-8 h-8 text-orange-400" />
                  </div>
                  <h3
                    className="text-xl font-semibold text-white mb-4"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-gray-400 leading-relaxed"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Plans Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl font-bold text-orange-500 mb-6"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                After setup, choose your monthly plan
              </h2>
              <p
                className="text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Your first month is included in onboarding. After that, pick the
                plan that fits your usage.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {monthlyPlans.map((plan, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 hover:border-orange-500/30 transition-all duration-300"
                >
                  <div className="text-center mb-8">
                    <h3
                      className="text-2xl font-bold text-white mb-4"
                      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                    >
                      {plan.name}
                    </h3>
                    <div
                      className="text-4xl font-bold text-white mb-2"
                      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                    >
                      {plan.price}
                      <span className="text-lg text-gray-400 font-normal">
                        /month
                      </span>
                    </div>
                    <p
                      className="text-gray-400 leading-relaxed"
                      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                    >
                      {plan.description}
                    </p>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center text-gray-300"
                      >
                        <Check className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0" />
                        <span
                          style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Every Plan Includes */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl font-bold text-white mb-6"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Every plan includes
              </h2>
              <p
                className="text-gray-300 text-lg leading-relaxed"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Premium features that come standard because excellence shouldn't
                be optional.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {everyPlanIncludes.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center p-6 bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center justify-center mr-6 flex-shrink-0">
                    <item.icon className="w-8 h-8 text-orange-400" />
                  </div>
                  <span
                    className="text-white font-medium text-lg"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl font-bold text-white mb-6"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Common questions
              </h2>
            </div>

            <div className="space-y-6 max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 hover:border-orange-500/30 transition-all duration-300"
                >
                  <h3
                    className="text-xl font-semibold text-white mb-4"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    {faq.q}
                  </h3>
                  <p
                    className="text-gray-300 leading-relaxed"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-12 max-w-4xl mx-auto">
              <h2
                className="text-3xl md:text-4xl font-bold text-white mb-6"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Ready to start for $179?
              </h2>
              <p
                className="text-gray-300 mb-10 max-w-2xl mx-auto text-lg leading-relaxed"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                No more SMS rejections. No compliance headaches. Just premium
                texting that works.
              </p>
              <button
                onClick={() => handleDirectCheckout("starter")}
                disabled={isLoading}
                className="px-10 py-4 bg-orange-600 text-white font-bold rounded-full hover:bg-orange-700 disabled:bg-orange-400 disabled:cursor-not-allowed transition-all duration-300 text-lg tracking-wide uppercase flex items-center justify-center mx-auto group"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                {isLoading
                  ? "Starting Checkout..."
                  : "Get Started Today - $179"}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Pricing;
