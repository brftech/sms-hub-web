import { PageLayout, useHub } from "@sms-hub/ui";
import { getHubColorClasses } from "@sms-hub/utils";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { HelpCircle, MessageSquare, Shield, CreditCard, Users, Zap, Building, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const FAQ = () => {
  const { currentHub } = useHub();
  const hubColors = getHubColorClasses(currentHub);
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
          answer: "Most SMS platforms reject cigar retailers, private clubs, and premium venues as 'high-risk.' We built our platform specifically for regulated businesses. We understand your compliance needs, never ban accounts, and provide industry-specific expertise that generic platforms can't offer."
        },
        {
          id: "setup-time",
          question: "How long does setup actually take?",
          answer: "Setup takes 7-10 business days from payment to going live. We handle carrier approvals, compliance setup, platform configuration, and training. You'll have a dedicated specialist who keeps you updated every step of the way."
        },
        {
          id: "onboarding-cost",
          question: "Why do you charge $179 for onboarding?",
          answer: "The $179 covers compliance consultation, carrier approvals, platform setup, training, and your first month of service. It's a one-time fee that ensures you're set up correctly and compliantly from day one. Most competitors charge much more for similar setup services."
        },
        {
          id: "after-onboarding",
          question: "What happens after the onboarding month?",
          answer: "After your first month (included in onboarding), you choose a monthly plan based on your actual usage. You can upgrade, downgrade, or cancel at any time. Most businesses start with Core ($179/month) but you can adjust based on your needs."
        }
      ]
    },
    {
      category: "Compliance & Regulations",
      icon: Shield,
      items: [
        {
          id: "cigar-compliance",
          question: "Are you compliant for cigar retailers specifically?",
          answer: "Yes. We understand tobacco retail regulations, age verification requirements, and advertising restrictions. Our platform includes specific compliance features for cigar retailers including proper consent management and compliant messaging templates."
        },
        {
          id: "account-suspension",
          question: "Will my account get suspended like with other platforms?",
          answer: "No. We don't suspend accounts for being in regulated industries. Our compliance is built for your business type from the ground up. We work WITH you to maintain compliance, not against you by shutting you down."
        },
        {
          id: "tcpa-compliance",
          question: "How do you handle TCPA compliance?",
          answer: "We provide comprehensive TCPA compliance including proper consent collection, opt-out management, and audit trails. Our platform automatically handles compliance requirements and we provide ongoing monitoring to ensure you stay compliant."
        },
        {
          id: "legal-support",
          question: "Do you provide legal support for compliance issues?",
          answer: "While we're not a law firm, we have extensive experience with regulated business compliance and can connect you with legal experts who specialize in your industry. Our compliance features are designed to meet regulatory requirements."
        }
      ]
    },
    {
      category: "Pricing & Billing",
      icon: CreditCard,
      items: [
        {
          id: "total-cost",
          question: "What's the total cost to get started?",
          answer: "$179 total to get started. This includes setup, compliance consultation, training, and your first month of service. After that, monthly plans start at $79/month. No contracts, no hidden fees, no surprises."
        },
        {
          id: "plan-changes",
          question: "Can I change plans later?",
          answer: "Yes, you can upgrade or downgrade at any time after your first month. Most businesses start with one plan and adjust based on their actual usage. We'll help you pick the right plan as your business grows."
        },
        {
          id: "no-contract",
          question: "Are there contracts or cancellation fees?",
          answer: "No contracts. After the initial onboarding, all plans are month-to-month. You can cancel at any time with 30 days notice. No cancellation fees, no penalties."
        },
        {
          id: "what-included",
          question: "What's included in every plan?",
          answer: "Every plan includes: dedicated phone number, full compliance monitoring, customer support, message delivery, analytics, and all core platform features. The only difference between plans is contact limits and message volume."
        }
      ]
    },
    {
      category: "For Specific Industries",
      icon: Building,
      items: [
        {
          id: "cigar-retailers",
          question: "Do you work with cigar retailers?",
          answer: "Yes, cigar retailers are one of our primary focuses. We understand tobacco retail regulations, age verification, and advertising restrictions. Many cigar shops use our platform for event announcements, new arrivals, and customer loyalty programs."
        },
        {
          id: "private-clubs",
          question: "What about private clubs and member organizations?",
          answer: "Absolutely. We work with private clubs, member organizations, and exclusive venues. Our platform handles member communications, event notifications, and exclusive offers while maintaining the sophistication your members expect."
        },
        {
          id: "premium-venues",
          question: "Do you serve restaurants, bars, and hospitality venues?",
          answer: "Yes, especially premium venues that other platforms reject. We serve upscale restaurants, wine bars, cocktail lounges, and hospitality venues that need sophisticated, compliant communication tools."
        },
        {
          id: "other-regulated",
          question: "What about other regulated businesses?",
          answer: "We serve various regulated industries including healthcare, financial services, and any business that faces compliance challenges or has been rejected by other SMS platforms. Contact us to discuss your specific industry."
        }
      ]
    }
  ];

  return (
    <PageLayout
      showNavigation={true}
      showFooter={true}
      navigation={<Navigation />}
      footer={<Footer />}
    >
      <div className="min-h-screen bg-black pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative">
        {/* Minimal background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/20 to-black"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 mb-6">
              <HelpCircle className="w-4 h-4 text-orange-400 mr-2" />
              <span className="text-xs font-medium text-orange-400">
                COMMON QUESTIONS
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Questions from
              <span className="gradient-text block">regulated businesses</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              The most common questions we get from cigar retailers, private clubs, 
              and premium venues about SMS compliance and our platform.
            </p>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-12">
            {faqData.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-6">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-500/20 border border-orange-500/30 rounded-xl mb-4">
                    <category.icon className="w-6 h-6 text-orange-400" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    {category.category}
                  </h2>
                </div>

                <div className="space-y-3">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className="card-modern rounded-xl overflow-hidden transition-all duration-300 hover:border-orange-500/40"
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-800/20 transition-colors duration-200"
                      >
                        <h3 className="text-lg font-semibold text-white pr-4">
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
                        <div className="px-6 pb-6">
                          <div className="pt-4 border-t border-gray-700/30">
                            <p className="text-gray-300 leading-relaxed">
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

          {/* Contact CTA Section */}
          <section className="mt-20 card-modern rounded-2xl p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to get started for $179?
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                No more SMS rejections. No compliance headaches. Just professional texting 
                that works for your regulated business.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="/contact"
                  className="btn-modern inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Get Started Today
                </a>
                <a
                  href="/pricing"
                  className="btn-modern inline-flex items-center justify-center px-8 py-3 border border-orange-500/50 text-orange-400 font-semibold rounded-lg hover:bg-orange-500/10 hover:border-orange-400 transition-all duration-300"
                >
                  View Pricing Details
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  );
};

export default FAQ;

