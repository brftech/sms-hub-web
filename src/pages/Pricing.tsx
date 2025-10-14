import { PageLayout, SEO, useHub } from "@sms-hub/ui/marketing";
import { handleDirectCheckout } from "../utils/checkout";
import { getHubPricingContent, getHubMetadata } from "@sms-hub/hub-logic";

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
  Heart,
} from "lucide-react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const Pricing = () => {
  const { currentHub } = useHub();
  const pricingContent = getHubPricingContent(currentHub);
  const hubMetadata = getHubMetadata(currentHub);
  const [isLoading, setIsLoading] = useState(false);

  // Wrapper for loading state
  const handleCheckoutWithLoading = async () => {
    setIsLoading(true);
    try {
      handleDirectCheckout();
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
      description: "Perfect for small businesses starting with customer communications.",
      features: [
        "200 SMS per month",
        "Up to 50 contacts",
        "1 user account",
        "1 phone number",
        "10/min throughput",
        "1 max segment",
        "Basic campaigns",
      ],
    },
    {
      name: "Core",
      price: "$179",
      period: "per month",
      description: "For established businesses ready to grow customer communications.",
      features: [
        "1,500 SMS per month",
        "Up to 500 contacts",
        "3 user accounts",
        "1 phone number",
        "40/min throughput",
        "3 max segments",
        "Basic campaigns",
      ],
    },
    {
      name: "Elite",
      price: "$349",
      period: "per month",
      description: "For businesses with a thriving customer base.",
      features: [
        "8,000 SMS per month",
        "Up to 3,000 contacts",
        "Unlimited users",
        "2 phone numbers",
        "200/min throughput",
        "8 max segments",
        "AI, Zapier, VIP support",
      ],
    },
  ];

  const everyPlanIncludes = [
    { icon: Shield, text: "Full compliance & regulatory expertise" },
    { icon: MessageSquare, text: "Professional SMS delivery platform" },
    { icon: Phone, text: "Dedicated phone number included" },
    { icon: Headphones, text: "Expert customer support" },
  ];

  // Map whyChooseUs to icons
  const iconMap = [Target, Star, Users, Heart];

  return (
    <PageLayout
      showNavigation={true}
      showFooter={true}
      navigation={<Navigation />}
      footer={<Footer />}
    >
      <SEO
        title={`Pricing - ${hubMetadata.displayName}`}
        description={`${pricingContent.description} ${pricingContent.highlightText}`}
        keywords={`SMS pricing, ${hubMetadata.displayName}, business texting cost`}
      />

      <div className="min-h-screen bg-black pt-20 pb-12 relative">
        {/* Subtle background elements */}
        <div className="absolute inset-0">
          <div
            className={`absolute top-0 left-1/4 w-96 h-96 bg-${hubMetadata.color}-500/5 rounded-full blur-3xl`}
          ></div>
          <div
            className={`absolute bottom-0 right-1/4 w-96 h-96 bg-${hubMetadata.color}-500/5 rounded-full blur-3xl`}
          ></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          {/* Hero Section - Hub-aware */}
          <div className="text-center mb-20">
            <div
              className={`inline-flex items-center px-4 py-2 rounded-full bg-${hubMetadata.color}-500/20 border border-${hubMetadata.color}-500/30 mb-8`}
            >
              <Zap className={`w-4 h-4 text-${hubMetadata.color}-400 mr-2`} />
              <span className={`text-sm font-medium text-${hubMetadata.color}-400`}>
                {pricingContent.badge}
              </span>
            </div>

            <h1
              className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              {pricingContent.title}
              <span className="gradient-text block">{pricingContent.subtitle}</span>
            </h1>

            <p
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              {pricingContent.description}
              <span className={`text-${hubMetadata.color}-400`}>
                {" "}
                {pricingContent.highlightText}
              </span>
            </p>

            <div className="flex items-center justify-center space-x-8 text-gray-400 text-sm">
              <div className="flex items-center">
                <Check className={`w-4 h-4 text-${hubMetadata.color}-500 mr-2`} />
                <span>7-10 day setup</span>
              </div>
              <div className="flex items-center">
                <Check className={`w-4 h-4 text-${hubMetadata.color}-500 mr-2`} />
                <span>Full compliance</span>
              </div>
              <div className="flex items-center">
                <Check className={`w-4 h-4 text-${hubMetadata.color}-500 mr-2`} />
                <span>Month-to-month</span>
              </div>
            </div>
          </div>

          {/* Main Pricing Card - Center Stage */}
          <div className="mb-20">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-12 max-w-3xl mx-auto text-center">
              <div
                className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-${hubMetadata.color}-500/20 border border-${hubMetadata.color}-500/30 mb-8`}
              >
                <Zap className={`w-10 h-10 text-${hubMetadata.color}-400`} />
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
                <div className="text-gray-400 text-lg">{onboardingPlan.type}</div>
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
                    <Check className={`w-6 h-6 text-${hubMetadata.color}-500 mr-4 flex-shrink-0`} />
                    <span className="text-lg">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckoutWithLoading()}
                disabled={isLoading}
                className={`px-10 py-4 bg-${hubMetadata.color}-600 text-white font-bold rounded-full hover:bg-${hubMetadata.color}-700 disabled:bg-${hubMetadata.color}-400 disabled:cursor-not-allowed transition-all duration-300 text-lg tracking-wide uppercase flex items-center justify-center mx-auto group mb-6`}
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                {isLoading ? "Starting Checkout..." : "Get Started Today - $179"}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>

              <div className="flex items-center justify-center text-gray-400 text-sm">
                <Clock className="w-4 h-4 mr-2" />
                <span>Setup takes 7-10 business days</span>
              </div>
            </div>
          </div>

          {/* Why Choose Us Section - Hub-aware */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl font-bold text-white mb-6"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Why businesses choose us
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {pricingContent.whyChooseUs.map((item, index) => {
                const IconComponent = iconMap[index] || Target;
                return (
                  <div key={index} className="text-center">
                    <div
                      className={`w-16 h-16 bg-${hubMetadata.color}-500/20 border border-${hubMetadata.color}-500/30 rounded-xl flex items-center justify-center mx-auto mb-6`}
                    >
                      <IconComponent className={`w-8 h-8 text-${hubMetadata.color}-400`} />
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
                );
              })}
            </div>
          </div>

          {/* Monthly Plans Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2
                className={`text-3xl md:text-4xl font-bold text-${hubMetadata.color}-500 mb-6`}
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                After setup, choose your monthly plan
              </h2>
              <p
                className="text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Your first month is included in onboarding. After that, pick the plan that fits your
                usage.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {monthlyPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 hover:border-${hubMetadata.color}-500/30 transition-all duration-300`}
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
                      <span className="text-lg text-gray-400 font-normal">/month</span>
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
                      <li key={featureIndex} className="flex items-center text-gray-300">
                        <Check
                          className={`w-5 h-5 text-${hubMetadata.color}-500 mr-3 flex-shrink-0`}
                        />
                        <span style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
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
                Premium features that come standard because excellence shouldn't be optional.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {everyPlanIncludes.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center p-6 bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-${hubMetadata.color}-500/30 transition-all duration-300`}
                >
                  <div
                    className={`w-16 h-16 bg-${hubMetadata.color}-500/20 border border-${hubMetadata.color}-500/30 rounded-xl flex items-center justify-center mr-6 flex-shrink-0`}
                  >
                    <item.icon className={`w-8 h-8 text-${hubMetadata.color}-400`} />
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

          {/* FAQ Section - Hub-aware */}
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
              {pricingContent.faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 hover:border-${hubMetadata.color}-500/30 transition-all duration-300`}
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

          {/* Final CTA - Hub-aware */}
          <div className="text-center">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-12 max-w-4xl mx-auto">
              <h2
                className="text-3xl md:text-4xl font-bold text-white mb-6"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                {pricingContent.ctaTitle}
              </h2>
              <p
                className="text-gray-300 mb-10 max-w-2xl mx-auto text-lg leading-relaxed"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                {pricingContent.ctaDescription}
              </p>
              <button
                onClick={() => handleCheckoutWithLoading()}
                disabled={isLoading}
                className={`px-10 py-4 bg-${hubMetadata.color}-600 text-white font-bold rounded-full hover:bg-${hubMetadata.color}-700 disabled:bg-${hubMetadata.color}-400 disabled:cursor-not-allowed transition-all duration-300 text-lg tracking-wide uppercase flex items-center justify-center mx-auto group`}
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                {isLoading ? "Starting Checkout..." : "Get Started Today - $179"}
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
