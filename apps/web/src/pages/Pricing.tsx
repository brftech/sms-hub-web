import { Button, PageLayout, useHub } from "@sms-hub/ui";
import { getHubColorClasses } from "@sms-hub/utils";
import { useNavigate } from "react-router-dom";
import { Check, Star, Zap, Shield, Users, Building } from "lucide-react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const Pricing = () => {
  const navigate = useNavigate();
  const { currentHub } = useHub();
  const hubColors = getHubColorClasses(currentHub);

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
    <PageLayout
      showNavigation={true}
      showFooter={true}
      navigation={<Navigation />}
      footer={<Footer />}
    >
      <div className="min-h-screen bg-black pt-24 pb-16 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          {/* Hero Content */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-8">
              <span className={`text-sm font-medium ${hubColors.text}`}>
                Premium SMS Pricing
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              <span className="block">Simple,</span>
              <span className={`${hubColors.text} bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent`}>
                Transparent
              </span>
              <span className="block">Pricing</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Premium venues deserve premium solutions. No hidden fees, no surprises. 
              Just straightforward pricing that grows with your business.
            </p>
          </div>

          {/* Onboarding Plan */}
          <div className="mb-20">
            <div className="bg-gradient-to-br from-orange-500/10 to-purple-500/10 border border-orange-500/20 rounded-3xl p-12 backdrop-blur-sm relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-purple-500/5"></div>
              
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 mb-6">
                  <Star className="w-5 h-5 text-orange-400 mr-2" />
                  <span className="text-sm font-medium text-orange-300">One-Time Setup</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  {onboardingPlan.name}
                </h2>
                
                <div className="flex items-baseline justify-center mb-6">
                  <span className="text-6xl font-bold text-orange-400">
                    {onboardingPlan.price}
                  </span>
                  <span className="text-xl text-gray-400 ml-3">
                    {onboardingPlan.type}
                  </span>
                </div>
                
                <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
                  {onboardingPlan.description}
                </p>

                <div className="grid md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
                  <ul className="space-y-4 text-left">
                    {onboardingPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-lg">
                        <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center mr-3">
                          <Check className="w-4 h-4 text-orange-400" />
                        </div>
                        <span className="text-white">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="text-center">
                    <Button
                      size="lg"
                      onClick={() => navigate("/contact")}
                      className="bg-gradient-to-r from-orange-500 to-purple-600 text-white text-lg px-8 py-4 rounded-xl hover:from-orange-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25"
                    >
                      Get Started Today
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Plans */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Monthly Plans
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Choose the plan that grows with your business. All plans include our premium features.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {monthlyPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border p-8 shadow-2xl h-full transition-all duration-300 hover:transform hover:scale-105 ${
                    plan.popular
                      ? "border-orange-500/50 bg-orange-500/10"
                      : "border-gray-700/50 hover:border-orange-500/30"
                  }`}
                >
                  {plan.popular && (
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30">
                        <Star className="w-4 h-4 text-orange-400 mr-2" />
                        <span className="text-sm font-medium text-orange-300">Most Popular</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline justify-center mb-4">
                      <span className="text-5xl font-bold text-orange-400">
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

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center text-base"
                      >
                        <div className="w-5 h-5 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center mr-3 flex-shrink-0">
                          <Check className="w-3 h-3 text-orange-400" />
                        </div>
                        <span className="text-white">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant="outline"
                    size="lg"
                    className={`w-full text-lg py-4 rounded-xl transition-all duration-300 ${
                      plan.popular
                        ? "border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:border-orange-400"
                        : "border-gray-600 text-white hover:bg-orange-500/10 hover:border-orange-500/50"
                    }`}
                    onClick={() => navigate("/contact")}
                  >
                    {plan.popular ? "Get Started" : "Learn More"}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* All Plans Include */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                All Plans Include
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Premium features that come standard with every plan, because excellence shouldn't be optional.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-10 h-10 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-orange-400 transition-colors">
                  Compliance
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">Built-in regulatory compliance with audit trails</p>
              </div>
              
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-10 h-10 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-orange-400 transition-colors">
                  Security
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">Enterprise-grade encryption and data protection</p>
              </div>
              
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Building className="w-10 h-10 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-orange-400 transition-colors">
                  Analytics
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">Detailed reporting and performance insights</p>
              </div>
              
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-10 h-10 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-orange-400 transition-colors">
                  Support
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">Expert assistance and dedicated guidance</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 border border-orange-500/20 rounded-3xl p-12 backdrop-blur-sm">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to get started?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join the premium venues that trust us with their communication needs. 
                Let's discuss the perfect plan for your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/contact")}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25"
                >
                  Contact Us Today
                </button>
                <button
                  onClick={() => navigate("/solutions")}
                  className="px-8 py-4 border-2 border-orange-500/50 text-orange-400 font-semibold rounded-xl hover:bg-orange-500/10 hover:border-orange-400 transition-all duration-300"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Pricing;
