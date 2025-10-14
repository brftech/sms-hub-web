import { useState, useEffect } from "react";
import { LiveMessagingProvider, PhoneInteractive, HubLogo, useHub } from "@sms-hub/ui/marketing";
import { getHubHeroContent } from "@sms-hub/hub-logic";
import { useNavigate } from "react-router-dom";
import { handleDirectCheckout } from "@/utils/checkout";
import { CONTACT_PATH } from "@/utils/routes";

interface HeroSectionProps {
  businessTypes: string[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ businessTypes }) => {
  const { currentHub } = useHub();
  const content = getHubHeroContent(currentHub);
  const [currentBusinessIndex, setCurrentBusinessIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [displayedBusiness, setDisplayedBusiness] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top of page on load/refresh
    window.scrollTo(0, 0);
  }, []);

  // Typing animation for business types
  useEffect(() => {
    if (!isTyping) return;

    const currentBusiness = businessTypes[currentBusinessIndex];
    const timeout = setTimeout(() => {
      if (charIndex < currentBusiness.length) {
        setDisplayedBusiness(currentBusiness.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else {
        // Finished typing, wait then start backspacing
        setTimeout(() => setIsTyping(false), 2000);
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [charIndex, isTyping, currentBusinessIndex, businessTypes]);

  // Backspacing animation
  useEffect(() => {
    if (isTyping) return;

    const timeout = setTimeout(() => {
      if (displayedBusiness.length > 0) {
        setDisplayedBusiness(displayedBusiness.slice(0, -1));
      } else {
        // Finished backspacing, move to next business type
        setCurrentBusinessIndex((prev) => (prev + 1) % businessTypes.length);
        setCharIndex(0);
        setIsTyping(true);
      }
    }, 50);

    return () => clearTimeout(timeout);
  }, [displayedBusiness, isTyping, businessTypes.length]);

  return (
    <div className="min-h-screen bg-black pt-20 pb-20 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative">
        {/* Optional small wordmark (desktop-only) - larger and more prominent */}
        <div className="hidden md:flex justify-center mb-12 opacity-90 pt-8">
          <HubLogo hubType={currentHub} variant="main" size="xl" />
        </div>

        {/* Header */}
        <div className="text-center py-6 md:py-8 mb-0">
          <h1
            className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: "Inter, system-ui, sans-serif" }}
          >
            {content.fixedText}
            <br />
            <span className="text-amber-400 min-h-[1.2em] inline-block">
              {displayedBusiness}
              <span className="animate-pulse">|</span>
            </span>
          </h1>
        </div>

        {/* Interactive Phone - centered at 0.75 scale */}
        <div className="flex justify-center mb-8" data-testid="hero-phone">
          <LiveMessagingProvider>
            <div className="scale-75 origin-center">
              <PhoneInteractive />
            </div>
          </LiveMessagingProvider>
        </div>

        {/* Tagline - underneath phone */}
        <div className="text-center text-xl md:text-2xl max-w-2xl mx-auto mb-8">
          <div className="text-amber-400 font-bold" data-testid="hero-tagline-1">
            {content.tagline.line1}
          </div>
          <div className="text-amber-400 font-bold" data-testid="hero-tagline-2">
            {content.tagline.line2}
          </div>
        </div>

        {/* Minimal helper text */}
        <div className="text-center mt-6">
          <p
            className="text-xs text-gray-500"
            style={{ fontFamily: "Inter, system-ui, sans-serif" }}
          >
            Interactive demo — no real SMS will be sent
          </p>
        </div>

        {/* Calm hero footer: CTAs + trust inline */}
        <div className="mt-8 md:mt-10 flex flex-col items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate(CONTACT_PATH)}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-md transition-colors"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              Contact
            </button>
            {import.meta.env.DEV && (
              <button
                onClick={() => handleDirectCheckout()}
                className="px-6 py-3 border border-orange-600 text-orange-400 hover:bg-orange-600/10 rounded-md font-semibold transition-colors"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                SignUp
              </button>
            )}
          </div>
          <div className="text-xs text-gray-400">
            Compliance-ready • Age-verified • TCPA compliant
          </div>
        </div>
      </div>
    </div>
  );
};
