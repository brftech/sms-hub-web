import { useState, useEffect } from "react";
import { useHub, HubLogo } from "@sms-hub/ui";
import { getHubColorClasses } from "@sms-hub/utils";
import AppLayout from "../components/AppLayout";
import SEO from "../components/SEO";
import cigarImage from "@sms-hub/ui/assets/cigar.png";

const Home = () => {
  const [showText, setShowText] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { currentHub, hubConfig } = useHub();
  const hubColors = getHubColorClasses(currentHub);

  const textParts = ["Compliant texting for cigar retailers..."];
  const totalLength = textParts.join("").length;

  useEffect(() => {
    // Scroll to top of page on load/refresh
    window.scrollTo(0, 0);

    // Only wait 2 seconds on initial website entry, not on refresh/back
    const hasVisited = sessionStorage.getItem("hasVisitedHome");

    if (!hasVisited) {
      sessionStorage.setItem("hasVisitedHome", "true");
      const textTimer = setTimeout(() => {
        setShowText(true);
      }, 2000);
      return () => clearTimeout(textTimer);
    } else {
      // Show text immediately on subsequent visits
      setShowText(true);
    }
  }, []);

  useEffect(() => {
    if (!showText) return;

    if (currentIndex < totalLength) {
      const typeTimer = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(typeTimer);
    }
  }, [showText, currentIndex, totalLength]);

  const renderText = () => {
    let displayedLength = 0;
    const result = [];

    for (let i = 0; i < textParts.length; i++) {
      const part = textParts[i];
      const partLength = part.length;

      if (currentIndex > displayedLength) {
        const visibleLength = Math.min(
          partLength,
          currentIndex - displayedLength
        );
        const visibleText = part.slice(0, visibleLength);

        if (i === 1) {
          // The 's' part - use dynamic hub colors
          result.push(
            <span key={i} className={hubColors.text}>
              {visibleText}
            </span>
          );
        } else {
          result.push(visibleText);
        }
      }

      displayedLength += partLength;
    }

    return result;
  };

  const handleClick = () => {
    setShowText(true);
    setCurrentIndex(totalLength);
  };

  return (
    <AppLayout>
      <SEO 
        title="SMS Hub - Compliant Texting for Cigar Retailers"
        description="Professional SMS platform for cigar retailers. Compliant texting, customer engagement, and business growth tools."
        keywords="SMS, texting, cigar retailers, business communication, customer engagement"
      />
      <div
        className="min-h-screen bg-black relative cursor-pointer pt-16"
        style={{
          backgroundImage: `url(${cigarImage})`,
          backgroundSize: "40%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        onClick={handleClick}
      >
        {/* Background overlay for opacity - makes cigar image appear at 10% opacity */}
        <div className="absolute inset-0 bg-black opacity-75"></div>
        {/* Logo - Horizontally centered, positioned higher up */}
        <div className="absolute top-1/4 left-0 right-0 flex justify-center">
          <HubLogo
            hubType={currentHub}
            variant="text"
            size="xl"
            className="!flex-none !items-start h-24 w-auto"
          />
        </div>

        {/* Typewriter text - Positioned below logo */}
        {showText && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-2xl lg:text-4xl font-bold text-white text-center animate-fade-in">
              {currentHub === "gnymble"
                ? renderText()
                : hubConfig.content.heroSubtitle}
            </div>
          </div>
        )}

        {/* Scroll Down Arrow */}
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-6">
          <div className="animate-bounce">
            <div className="w-6 h-6 border-b-2 border-r-2 border-white rotate-45 transform origin-center"></div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Home;
