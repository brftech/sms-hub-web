import { PageLayout } from "@sms-hub/ui";

import { useNavigate } from "react-router-dom";
import { Check, Zap, Shield, Clock, MessageSquare, Phone, Headphones } from "lucide-react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const Pricing = () => {
  const navigate = useNavigate();


  const onboardingPlan = {
    name: "Onboarding Package",
    price: "$179",
    type: "one-time setup",
    description: "Everything you need to start texting your customers compliantly.",
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
      description: "Perfect for small shops starting with customer communications.",
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
      description: "For established shops ready to grow their customer communications.",
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

  const faqs = [
    {
      q: "How long does setup take?",
      a: "Setup takes 7-10 business days. We handle all compliance, carrier approvals, and platform configuration."
    },
    {
      q: "Can I change plans later?",
      a: "Yes! After your first month, you can upgrade or downgrade based on your actual usage and needs."
    },
    {
      q: "What makes you different from other SMS providers?",
      a: "We specialize in regulated businesses. While others reject cigar retailers and premium venues, we provide compliant solutions designed for your industry."
    },
    {
      q: "Is there a contract?",
      a: "No long-term contracts. Just the one-time onboarding fee to get started, then month-to-month service."
    }
  ];

  return (
    <PageLayout
      showNavigation={true}
      showFooter={true}
      navigation={<Navigation />}
      footer={<Footer />}
    >
      <div className="min-h-screen bg-black pt-20 pb-12 relative">
        {/* Minimal background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/20 to-black"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          {/* Hero - Focus on the $179 decision */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 mb-6">
              <Zap className="w-4 h-4 text-orange-400 mr-2" />
              <span className="text-xs font-medium text-orange-400">GET STARTED</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Start texting your customers for
              <span className="gradient-text block"> $179</span>
            </h1>
            
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
              One simple fee gets you set up, compliant, and ready to text. 
              No contracts. No hidden costs. No rejections.
            </p>
          </div>

          {/* THE Onboarding Plan - Center Stage */}
          <div className="mb-16">
            <div className="card-modern rounded-3xl p-10 max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500/20 border border-orange-500/30 mb-6">
                <Zap className="w-8 h-8 text-orange-400" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">{onboardingPlan.name}</h2>
              
              <div className="mb-6">
                <div className="text-5xl font-bold text-white mb-2">{onboardingPlan.price}</div>
                <div className="text-gray-400">{onboardingPlan.type}</div>
              </div>
              
              <p className="text-xl text-gray-300 mb-8">{onboardingPlan.description}</p>
              
              <ul className="text-left space-y-3 mb-8 max-w-md mx-auto">
                {onboardingPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => navigate('/contact')}
                className="btn-modern px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25 text-lg"
              >
                Get Started Today
              </button>
              
              <div className="mt-6 flex items-center justify-center text-gray-400 text-sm">
                <Clock className="w-4 h-4 mr-2" />
                Setup takes 7-10 business days
              </div>
            </div>
          </div>

          {/* What happens after onboarding - Monthly plans */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                After setup, choose your monthly plan
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Your first month is included in onboarding. After that, pick the plan that fits your usage.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {monthlyPlans.map((plan, index) => (
                <div key={index} className="card-modern rounded-xl p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>
                    <div className="text-2xl font-bold text-white mb-1">{plan.price}<span className="text-sm text-gray-400 font-normal">/month</span></div>
                    <p className="text-gray-400 text-sm">{plan.description}</p>
                  </div>
                  
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-400 text-sm">
                        <Check className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Every Plan Includes */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Every plan includes
              </h2>
              <p className="text-gray-300">
                Premium features that come standard because excellence shouldn't be optional.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {everyPlanIncludes.map((item, index) => (
                <div key={index} className="flex items-center p-4 bg-black/40 rounded-xl border border-gray-800/50">
                  <div className="w-12 h-12 bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center justify-center mr-4">
                    <item.icon className="w-6 h-6 text-orange-400" />
                  </div>
                  <span className="text-white font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick FAQs */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Common questions
              </h2>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="card-modern rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">{faq.q}</h3>
                  <p className="text-gray-300">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center">
            <div className="card-modern rounded-2xl p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to start for $179?
              </h2>
              <p className="text-gray-300 mb-6 max-w-xl mx-auto">
                No more SMS rejections. No compliance headaches. Just premium texting that works.
              </p>
              <button
                onClick={() => navigate('/contact')}
                className="btn-modern px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25"
              >
                Get Started Today
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Pricing;
