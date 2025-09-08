import { useState, useEffect } from "react";
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
  const [showText, setShowText] = useState(false);
  const { currentHub } = useHub();

  const [currentBusinessIndex, setCurrentBusinessIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [displayedBusiness, setDisplayedBusiness] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    // Scroll to top of page on load/refresh
    window.scrollTo(0, 0);

    // Show text after a brief delay
    const textTimer = setTimeout(() => setShowText(true), 500);
    return () => clearTimeout(textTimer);
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
    <div className="min-h-screen bg-black pt-12 pb-16 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center py-10 md:py-16 relative">
        {/* Logo */}
        <div className="mb-16 md:mb-20">
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
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-16 md:mb-20 leading-tight"
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

        <p className="text-amber-200/80 text-lg md:text-xl mb-20 md:mb-24 max-w-3xl mx-auto font-light italic">
          {content.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20 md:mb-24">
          <a
            href="/contact"
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-200 text-lg"
          >
            Get Started
          </a>
          <a
            href="/demo"
            className="border-2 border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-white font-bold py-4 px-8 rounded-lg transition-colors duration-200 text-lg"
          >
            See Demo
          </a>
        </div>

        {/* Bold tagline - moved lower */}
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-amber-400 mb-8 md:mb-10">
          <div className="mb-2">{content.tagline.line1}</div>
          <div>{content.tagline.line2}</div>
        </h2>

        <p className="text-gray-500 text-sm">{content.ctaText}</p>
      </div>
    </div>
  );
};
