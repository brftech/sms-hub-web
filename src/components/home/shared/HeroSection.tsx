import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHub, HubLogo } from "@sms-hub/ui";

interface HeroContent {
  fixedText: string;
  tagline: {
    line1: string;
    line2: string;
  };
  description: string;
  ctaText: string;
}

interface HeroSectionProps {
  businessTypes: string[];
  content: HeroContent;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  businessTypes,
  content,
}) => {
  const navigate = useNavigate();
  const { currentHub } = useHub();

  const [currentBusinessIndex, setCurrentBusinessIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [displayedBusiness, setDisplayedBusiness] = useState("");
  const [charIndex, setCharIndex] = useState(0);

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
    <div className="min-h-screen bg-black pt-16 pb-20 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 md:px-6 text-center py-8 md:py-12 lg:py-20 relative">
        {/* Logo */}
        <div className="mb-12 md:mb-16 lg:mb-20">
          <HubLogo
            hubType={currentHub}
            variant="main"
            size="xl"
            className="!flex-none !items-center justify-center opacity-90"
            style={{ transform: "scale(1.5)", transformOrigin: "center" }}
          />
        </div>

        {/* Main message with typing animation */}
        <h1
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-12 md:mb-16 lg:mb-20 leading-tight"
          style={{ fontFamily: "Inter, system-ui, sans-serif" }}
        >
          <span>
            {content.fixedText}
            <br />
            <span className="text-amber-400 min-h-[1.2em] inline-block">
              {displayedBusiness}
              <span className="animate-pulse">|</span>
            </span>
          </span>
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 md:mb-20 lg:mb-24">
          <button
            onClick={() => navigate("/demo")}
            className="mobile-cta-button border-2 border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-white font-bold py-4 px-8 rounded-lg transition-colors duration-200 text-lg w-full sm:w-auto"
          >
            See Demo
          </button>
        </div>

        {/* Bold tagline - moved lower */}
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-amber-400 mb-8 md:mb-12 lg:mb-16">
          <div className="mb-2">{content.tagline.line1}</div>
          <div>{content.tagline.line2}</div>
        </h2>

        <p className="text-gray-500 text-sm mt-4">{content.ctaText}</p>
      </div>
    </div>
  );
};
