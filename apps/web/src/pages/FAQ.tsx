import { PageLayout, useHub } from "@sms-hub/ui";
import { getHubColorClasses } from "@sms-hub/utils";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { HelpCircle, MessageSquare, Shield, CreditCard, Users, Zap, ChevronDown, ChevronUp } from "lucide-react";
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
      category: "General Questions",
      icon: HelpCircle,
      items: [
        {
          id: "what-is-sms-hub",
          question: "What is SMS Hub and how does it work?",
          answer: "SMS Hub is a comprehensive SMS messaging platform designed for premium venues and businesses. We provide compliant, reliable SMS services with specialized platforms for healthcare (Virtue) and premium retail (Vice) communications. Our platform handles everything from message delivery to regulatory compliance monitoring."
        },
        {
          id: "who-is-it-for",
          question: "Who is SMS Hub designed for?",
          answer: "SMS Hub is designed for sophisticated businesses that require premium communication solutions. This includes healthcare providers, luxury retail establishments, premium venues, and any business that values regulatory compliance, reliability, and exceptional customer service."
        },
        {
          id: "how-to-get-started",
          question: "How do I get started with SMS Hub?",
          answer: "Getting started is simple. Contact our team for a personalized consultation where we'll assess your needs, explain our onboarding process, and create a custom implementation plan. We handle all the technical setup and provide comprehensive training for your team."
        }
      ]
    },
    {
      category: "Compliance & Security",
      icon: Shield,
      items: [
        {
          id: "tcpa-compliance",
          question: "How does SMS Hub ensure TCPA compliance?",
          answer: "We provide comprehensive TCPA compliance tools including consent management, opt-out handling, and regulatory monitoring. Our platform automatically tracks consent status, manages opt-outs, and provides audit trails to help you maintain compliance with all TCPA requirements."
        },
        {
          id: "hipaa-compliance",
          question: "What about HIPAA compliance for healthcare communications?",
          answer: "Our Virtue platform is built specifically for healthcare communications with full HIPAA compliance. This includes business associate agreements, encryption of protected health information, comprehensive audit trails, and secure data handling procedures that meet or exceed HIPAA standards."
        },
        {
          id: "data-security",
          question: "How secure is my data with SMS Hub?",
          answer: "We implement enterprise-grade security measures including end-to-end encryption, secure data transmission, regular security assessments, and compliance with industry security standards. Your data is protected at every level with multiple layers of security."
        }
      ]
    },
    {
      category: "Pricing & Billing",
      icon: CreditCard,
      items: [
        {
          id: "pricing-structure",
          question: "How does your pricing work?",
          answer: "We offer transparent, monthly pricing with no hidden fees. Our pricing is based on your messaging volume and specific needs. We provide a custom quote after understanding your requirements, ensuring you only pay for what you need."
        },
        {
          id: "billing-cycle",
          question: "What is your billing cycle?",
          answer: "We bill monthly in advance for all services. There are no setup fees or hidden charges. We provide clear invoices and can work with your accounting team to ensure smooth billing processes."
        },
        {
          id: "refund-policy",
          question: "What is your refund policy?",
          answer: "We provide refunds as required by law or at our discretion. We're committed to customer satisfaction and will work with you to resolve any issues. Most concerns can be resolved through our dedicated support team."
        }
      ]
    },
    {
      category: "Technical Support",
      icon: Users,
      items: [
        {
          id: "support-availability",
          question: "What kind of support do you provide?",
          answer: "We provide comprehensive support including 24/7 technical assistance, dedicated account management, and personalized training. Our support team includes SMS experts who understand your industry and can help with both technical and strategic questions."
        },
        {
          id: "onboarding-process",
          question: "What does your onboarding process look like?",
          answer: "Our onboarding process is comprehensive and personalized. We start with a detailed assessment of your needs, create a custom implementation plan, handle all technical setup, provide team training, and offer ongoing support to ensure your success."
        },
        {
          id: "integration-options",
          question: "What integration options do you offer?",
          answer: "We offer multiple integration options including API access, webhook support, and direct integrations with popular platforms. Our technical team will work with your developers to ensure seamless integration with your existing systems."
        }
      ]
    },
    {
      category: "Features & Capabilities",
      icon: Zap,
      items: [
        {
          id: "message-delivery",
          question: "How reliable is your message delivery?",
          answer: "We maintain 99.9%+ message delivery rates through redundant infrastructure and multiple carrier partnerships. Our platform automatically handles delivery confirmations and provides detailed analytics on message status and delivery performance."
        },
        {
          id: "analytics-reporting",
          question: "What analytics and reporting do you provide?",
          answer: "We provide comprehensive analytics including delivery rates, engagement metrics, compliance reports, and custom reporting. Our dashboard gives you real-time insights into your SMS performance and helps you optimize your messaging strategy."
        },
        {
          id: "customization-options",
          question: "How customizable is your platform?",
          answer: "Our platform is highly customizable to meet your specific needs. We can customize everything from message templates to compliance workflows, ensuring the platform works exactly how you need it to for your business."
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
      <div className="min-h-screen bg-black pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-8">
              <HelpCircle className="w-5 h-5 text-orange-400 mr-2" />
              <span className={`text-sm font-medium ${hubColors.text}`}>
                Frequently Asked Questions
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              <span className="block">Got Questions?</span>
              <span className={`${hubColors.text} bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent`}>
                We've Got Answers
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Everything you need to know about SMS Hub, our services, and how we can help 
              elevate your business communications.
            </p>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-16">
            {faqData.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-8">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-3xl mb-6">
                    <category.icon className="w-10 h-10 text-orange-400" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {category.category}
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-purple-500 mx-auto rounded-full"></div>
                </div>

                <div className="space-y-4">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-700/30 overflow-hidden transition-all duration-300 hover:border-orange-500/30"
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
          <section className="mt-20 bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-3xl border border-gray-700/30 p-12 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-white mb-6">
                Still Have Questions?
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Our team of SMS experts is here to help. Whether you have technical questions, 
                need pricing information, or want to discuss your specific use case, we're ready to assist.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold rounded-2xl hover:from-orange-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Contact Our Team
                </a>
                <a
                  href="/solutions"
                  className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-orange-500/30 text-orange-400 font-semibold rounded-2xl hover:bg-orange-500/10 hover:border-orange-500/50 transition-all duration-300"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  View Solutions
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
