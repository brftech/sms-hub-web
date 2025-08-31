import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { PageLayout } from "@/components/layout";

const Pricing = () => {
  const navigate = useNavigate();

  const onboardingPlan = {
    name: "Onboarding",
    price: "$179",
    type: "one-time setup",
    description:
      "Complete setup, training, and plan selection for your business.",
    features: [
      "Complete business setup & training",
      "Plan selection consultation",
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
        "Perfect for small shops dipping their toes in customer communications.",
      features: [
        "1 dedicated phone number",
        "Up to 50 contacts",
        "Up to 200 messages per month",
        "Text-centered customer support",
      ],
      popular: false,
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
      popular: true,
    },
    {
      name: "Elite",
      price: "$349",
      period: "per month",
      description:
        "The perfect blend for retailers with a thriving customer base.",
      features: [
        "1 dedicated or hosted phone number",
        "Up to 3,000 contacts",
        "Up to 8,000 messages per month",
        "Priority text and video support",
      ],
      popular: false,
    },
  ];

  return (
    <PageLayout>
      <div className="min-h-screen bg-black py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              One plan. Get Started. No hidden fees.
            </p>
          </div>

          {/* Onboarding Plan */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 shadow-2xl mb-16">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-4">
                {onboardingPlan.name}
              </h2>
              <div className="flex items-baseline justify-center mb-4">
                <span className="text-5xl font-bold text-orange-400">
                  {onboardingPlan.price}
                </span>
                <span className="text-xl text-gray-400 ml-3">
                  {onboardingPlan.type}
                </span>
              </div>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                {onboardingPlan.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <ul className="space-y-3">
                {onboardingPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-lg">
                    <Check className="w-5 h-5 text-orange-400 mr-3 flex-shrink-0" />
                    <span className="text-white">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="text-center">
                <Button
                  size="lg"
                  onClick={() => navigate("/contact")}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-lg px-8 py-3"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>

          {/* Monthly Plans */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Monthly Plans
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {monthlyPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl border p-8 shadow-2xl h-full ${
                    plan.popular
                      ? "border-orange-500/50 bg-orange-500/10"
                      : "border-gray-700/50"
                  }`}
                >
                  {plan.popular && (
                    <div className="text-center mb-4">
                      <span className="bg-orange-500 text-white text-sm px-4 py-2 rounded-full font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline justify-center mb-4">
                      <span className="text-4xl font-bold text-orange-400">
                        {plan.price}
                      </span>
                      <span className="text-lg text-gray-400 ml-2">
                        {plan.period}
                      </span>
                    </div>
                    <p className="text-gray-300 text-base leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center text-base"
                      >
                        <Check className="w-5 h-5 text-orange-400 mr-3 flex-shrink-0" />
                        <span className="text-white">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-gray-600 text-white hover:bg-gray-700 text-lg py-3"
                    onClick={() => navigate("/contact")}
                  >
                    Learn More
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* All Plans Include */}
          <div>
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              All Plans Include
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Compliance
                </h3>
                <p className="text-gray-400">Built-in regulatory compliance</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Security
                </h3>
                <p className="text-gray-400">Enterprise-grade encryption</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Analytics
                </h3>
                <p className="text-gray-400">Detailed reporting</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Support
                </h3>
                <p className="text-gray-400">Expert assistance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Pricing;
