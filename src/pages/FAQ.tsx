import { PageLayout, SEO, useHub } from "@sms-hub/ui/marketing";
import { handleDirectCheckout } from "../utils/checkout";
import { getHubFAQContent, getHubMetadata, getHubColors } from "@sms-hub/hub-logic";

import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { PageBadge } from "../components";
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
import { PRICING_PATH } from "@/utils/routes";

const FAQ = () => {
  const { currentHub } = useHub();
  const faqContent = getHubFAQContent(currentHub);
  const hubMetadata = getHubMetadata(currentHub);
  const hubColors = getHubColors(currentHub);
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

  // Map category names to icons
  const categoryIcons: Record<string, typeof HelpCircle> = {
    "Getting Started": HelpCircle,
    "Compliance & Regulations": Shield,
    "HIPAA & Compliance": Shield,
    "Pricing & Billing": CreditCard,
    Pricing: CreditCard,
    "For Specific Industries": Building,
    "For Healthcare Providers": Building,
    "Features & Capabilities": Target,
    Features: Target,
    "Technical Questions": Building,
    Support: HelpCircle,
  };

  return (
    <PageLayout
      showNavigation={true}
      showFooter={true}
      navigation={<Navigation />}
      footer={<Footer />}
    >
      <SEO
        title={`FAQ - ${hubMetadata.displayName}`}
        description={faqContent.description}
        keywords={`SMS FAQ, ${hubMetadata.displayName}, business texting questions, SMS compliance`}
      />

      <div className="min-h-screen bg-black pt-20 pb-12 relative">
        {/* Subtle background elements */}
        <div className="absolute inset-0">
          <div
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl"
            style={{ backgroundColor: `${hubColors.primary}0D` }}
          ></div>
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl"
            style={{ backgroundColor: `${hubColors.primary}0D` }}
          ></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          {/* Hero Section - Hub-aware */}
          <div className="text-center mb-20">
            <PageBadge text="COMMON QUESTIONS" icon={Target} className="mb-8" />

            <h1
              className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              {faqContent.title}
              <span className="gradient-text block">{faqContent.subtitle}</span>
            </h1>

            <p
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              {faqContent.description}
            </p>

            <div className="flex items-center justify-center space-x-8 text-gray-400 text-sm">
              {faqContent.badges.map((badge, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className={`w-4 h-4 ${hubColors.tailwind.text} mr-2`} />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-16">
            {faqContent.categories.map((category, categoryIndex) => {
              const CategoryIcon = categoryIcons[category.category] || HelpCircle;

              return (
                <div key={categoryIndex} className="space-y-8">
                  <div className="text-center mb-12">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 ${hubColors.tailwind.bgLight} border ${hubColors.tailwind.borderLight} rounded-xl mb-6`}
                    >
                      <CategoryIcon className={`w-8 h-8 ${hubColors.tailwind.text}`} />
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
                        className={`bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden transition-all duration-300 hover:${hubColors.tailwind.borderLight}`}
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
                              <ChevronUp className={`w-6 h-6 ${hubColors.tailwind.text}`} />
                            ) : (
                              <ChevronDown className={`w-6 h-6 ${hubColors.tailwind.text}`} />
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
              );
            })}
          </div>

          {/* Final CTA */}
          <div className="text-center mt-20">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-12 max-w-4xl mx-auto">
              <h2
                className="text-3xl md:text-4xl font-bold text-white mb-6"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                {faqContent.ctaTitle}
              </h2>
              <p
                className="text-gray-300 mb-10 max-w-2xl mx-auto text-lg leading-relaxed"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                {faqContent.ctaDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleDirectCheckout}
                  className={`px-10 py-4 ${hubColors.tailwind.bg} text-white font-bold rounded-full ${hubColors.tailwind.bgHover} transition-all duration-300 text-lg tracking-wide uppercase flex items-center justify-center group`}
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  Get Started Today
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                <a
                  href={PRICING_PATH}
                  className={`px-10 py-4 ${hubColors.tailwind.contactButton} font-bold rounded-full transition-all duration-300 text-lg tracking-wide uppercase flex items-center justify-center`}
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
