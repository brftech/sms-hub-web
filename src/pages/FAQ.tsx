import { PageLayout, SEO } from "@sms-hub/ui";

import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import {
  HelpCircle,
  Shield,
  CreditCard,
  Building,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  CheckCircle,
  Target,
} from "lucide-react";
import { useState } from "react";

const FAQ = () => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const faqData = [
    {
      category: "Getting Started",
      icon: HelpCircle,
      items: [
        {
          id: "why-different",
          question: "Why should I use you instead of other SMS platforms?",
          answer:
            "Most SMS platforms reject cigar retailers, private clubs, and premium venues as 'high-risk.' We built our platform specifically for regulated businesses. We understand your compliance needs, never ban accounts, and provide industry-specific expertise that generic platforms can't offer.",
        },
        {
          id: "setup-time",
          question: "How long does setup actually take?",
          answer:
            "Setup takes 7-10 business days from payment to going live. We handle carrier approvals, compliance setup, platform configuration, and training. You'll have a dedicated specialist who keeps you updated every step of the way.",
        },
        {
          id: "onboarding-cost",
          question: "Why do you charge $179 for onboarding?",
          answer:
            "The $179 covers compliance consultation, carrier approvals, platform setup, training, and your first month of service. It's a one-time fee that ensures you're set up correctly and compliantly from day one. Most competitors charge much more for similar setup services.",
        },
        {
          id: "after-onboarding",
          question: "What happens after the onboarding month?",
          answer:
            "After your first month (included in onboarding), you choose a monthly plan based on your actual usage. You can upgrade, downgrade, or cancel at any time. Most businesses start with Core ($179/month) but you can adjust based on your needs.",
        },
      ],
    },
    {
      category: "Compliance & Regulations",
      icon: Shield,
      items: [
        {
          id: "cigar-compliance",
          question: "Are you compliant for cigar retailers specifically?",
          answer:
            "Yes. We understand tobacco retail regulations, age verification requirements, and advertising restrictions. Our platform includes specific compliance features for cigar retailers including proper consent management and compliant messaging templates.",
        },
        {
          id: "account-suspension",
          question: "Will my account get suspended like with other platforms?",
          answer:
            "No. We don't suspend accounts for being in regulated industries. Our compliance is built for your business type from the ground up. We work WITH you to maintain compliance, not against you by shutting you down.",
        },
        {
          id: "tcpa-compliance",
          question: "How do you handle TCPA compliance?",
          answer:
            "We provide comprehensive TCPA compliance including proper consent collection, opt-out management, and audit trails. Our platform automatically handles compliance requirements and we provide ongoing monitoring to ensure you stay compliant.",
        },
        {
          id: "legal-support",
          question: "Do you provide legal support for compliance issues?",
          answer:
            "While we're not a law firm, we have extensive experience with regulated business compliance and can connect you with legal experts who specialize in your industry. Our compliance features are designed to meet regulatory requirements.",
        },
      ],
    },
    {
      category: "Pricing & Billing",
      icon: CreditCard,
      items: [
        {
          id: "total-cost",
          question: "What's the total cost to get started?",
          answer:
            "$179 total to get started. This includes setup, compliance consultation, training, and your first month of service. After that, monthly plans start at $79/month. No contracts, no hidden fees, no surprises.",
        },
        {
          id: "plan-changes",
          question: "Can I change plans later?",
          answer:
            "Yes, you can upgrade or downgrade at any time after your first month. Most businesses start with one plan and adjust based on their actual usage. We'll help you pick the right plan as your business grows.",
        },
        {
          id: "no-contract",
          question: "Are there contracts or cancellation fees?",
          answer:
            "No contracts. After the initial onboarding, all plans are month-to-month. You can cancel at any time with 30 days notice. No cancellation fees, no penalties.",
        },
        {
          id: "what-included",
          question: "What's included in every plan?",
          answer:
            "Every plan includes: dedicated phone number, full compliance monitoring, customer support, message delivery, analytics, and all core platform features. The only difference between plans is contact limits and message volume.",
        },
      ],
    },
    {
      category: "For Specific Industries",
      icon: Building,
      items: [
        {
          id: "cigar-retailers",
          question: "Do you work with cigar retailers?",
          answer:
            "Yes, cigar retailers are one of our primary focuses. We understand tobacco retail regulations, age verification, and advertising restrictions. Many cigar shops use our platform for event announcements, new arrivals, and customer loyalty programs.",
        },
        {
          id: "private-clubs",
          question: "What about private clubs and member organizations?",
          answer:
            "Absolutely. We work with private clubs, member organizations, and exclusive venues. Our platform handles member communications, event notifications, and exclusive offers while maintaining the sophistication your members expect.",
        },
        {
          id: "premium-venues",
          question: "Do you serve restaurants, bars, and hospitality venues?",
          answer:
            "Yes, especially premium venues that other platforms reject. We serve upscale restaurants, wine bars, cocktail lounges, and hospitality venues that need sophisticated, compliant communication tools.",
        },
        {
          id: "other-regulated",
          question: "What about other regulated businesses?",
          answer:
            "We serve various regulated industries including healthcare, financial services, and any business that faces compliance challenges or has been rejected by other SMS platforms. Contact us to discuss your specific industry.",
        },
      ],
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
        title="FAQ - Gnymble SMS Platform"
        description="Common questions from regulated businesses about SMS compliance, setup, and our platform. Get answers about cigar retailers, private clubs, and premium venues."
        keywords="SMS FAQ, business texting questions, regulated business SMS, compliance questions, cigar retailer SMS"
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
              <Target className="w-4 h-4 text-orange-400 mr-2" />
              <span className="text-sm font-medium text-orange-400">
                COMMON QUESTIONS
              </span>
            </div>

            <h1
              className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              Questions from
              <span className="gradient-text block">regulated businesses</span>
            </h1>

            <p
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              The most common questions we get from cigar retailers, private
              clubs, and premium venues about SMS compliance and our platform.
            </p>

            <div className="flex items-center justify-center space-x-8 text-gray-400 text-sm">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-orange-500 mr-2" />
                <span>No rejections</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-orange-500 mr-2" />
                <span>Industry expertise</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-orange-500 mr-2" />
                <span>Real support</span>
              </div>
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-16">
            {faqData.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-8">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/20 border border-orange-500/30 rounded-xl mb-6">
                    <category.icon className="w-8 h-8 text-orange-400" />
                  </div>
                  <h2
                    className="text-3xl md:text-4xl font-bold text-white"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    {category.category}
                  </h2>
                </div>

                <div className="space-y-4">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden transition-all duration-300 hover:border-orange-500/30"
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="w-full p-8 text-left flex items-center justify-between hover:bg-gray-800/20 transition-colors duration-200"
                      >
                        <h3
                          className="text-xl font-semibold text-white pr-6"
                          style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                        >
                          {item.question}
                        </h3>
                        <div className="flex-shrink-0">
                          {openItems.has(item.id) ? (
                            <ChevronUp className="w-6 h-6 text-orange-400" />
                          ) : (
                            <ChevronDown className="w-6 h-6 text-orange-400" />
                          )}
                        </div>
                      </button>

                      {openItems.has(item.id) && (
                        <div className="px-8 pb-8">
                          <div className="pt-6 border-t border-gray-700/30">
                            <p
                              className="text-gray-300 leading-relaxed text-lg"
                              style={{
                                fontFamily: "Inter, system-ui, sans-serif",
                              }}
                            >
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Final CTA */}
          <div className="text-center mt-20">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-12 max-w-4xl mx-auto">
              <h2
                className="text-3xl md:text-4xl font-bold text-white mb-6"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Ready to get started for $179?
              </h2>
              <p
                className="text-gray-300 mb-10 max-w-2xl mx-auto text-lg leading-relaxed"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                No more SMS rejections. No compliance headaches. Just
                professional texting that works for your regulated business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    const paymentLink = import.meta.env.VITE_STRIPE_PAYMENT_LINK;
                    if (paymentLink) {
                      window.location.href = paymentLink;
                    } else {
                      window.location.href = "/pricing";
                    }
                  }}
                  className="px-10 py-4 bg-orange-600 text-white font-bold rounded-full hover:bg-orange-700 transition-all duration-300 text-lg tracking-wide uppercase flex items-center justify-center group"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  Get Started Today
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                <a
                  href="/pricing"
                  className="px-10 py-4 border border-orange-500/50 text-orange-400 font-bold rounded-full hover:bg-orange-500/10 hover:border-orange-400 transition-all duration-300 text-lg tracking-wide uppercase flex items-center justify-center"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  View Pricing Details
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default FAQ;
