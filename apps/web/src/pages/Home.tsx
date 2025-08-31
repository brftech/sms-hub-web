import { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout";
import { DemoRequestButton } from "@/components";
import { useHub } from "@/contexts/HubContext";
import cigarImage from "@/assets/cigar.png";
import gnymbleTextLogo from "@/assets/gnymble-text-logo.svg";
import percytechTextLogo from "@/assets/percytech-text-logo.svg";

const Home = () => {
  const [showText, setShowText] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const [showSmiley, setShowSmiley] = useState(false);
  const { currentHub, hubConfig, switchHub, showHubSwitcher } = useHub();

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

    // Show buttons immediately when text starts showing
    setShowButtons(true);

    if (currentIndex < totalLength) {
      const typeTimer = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(typeTimer);
    } else {
      // Text is complete, wait 2 seconds then show smiley
      const smileyTimer = setTimeout(() => {
        setShowSmiley(true);
      }, 2000);
      return () => clearTimeout(smileyTimer);
    }
  }, [showText, currentIndex, totalLength]);

  useEffect(() => {
    // Show buttons immediately on page load without delay
    setShowButtons(true);
  }, []);

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
          // The 's' part
          result.push(
            <span key={i} className="text-orange-400">
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
    setShowSmiley(true);
    setShowButtons(true);
  };

  return (
    <PageLayout>
      <div
        className="min-h-screen bg-black relative cursor-pointer"
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
        {/* Logo - Fixed position higher up */}
        <div className="absolute top-1/4 md:top-1/4 top-1/5 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-6xl lg:text-8xl font-black tracking-tight animate-fade-in">
            {currentHub === "percytech" ? (
              <img
                src={percytechTextLogo}
                alt="PercyTech Logo"
                className="w-[600px] h-auto"
              />
            ) : (
              <img
                src={gnymbleTextLogo}
                alt="Gnymble Logo"
                className="w-[600px] h-auto"
              />
            )}
          </h1>
        </div>

        {/* Typewriter text - Positioned below logo */}
        {showText && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-2xl lg:text-4xl font-bold text-white text-center animate-fade-in">
              {currentHub === "percytech"
                ? hubConfig.content.heroSubtitle
                : renderText()}
            </div>
          </div>
        )}

        {/* Demo Access Button and Scroll Down Arrow - Centered Together */}
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-6">
          <DemoRequestButton />
          <div className="animate-bounce">
            <div className="w-6 h-6 border-b-2 border-r-2 border-white rotate-45 transform origin-center"></div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Home;
