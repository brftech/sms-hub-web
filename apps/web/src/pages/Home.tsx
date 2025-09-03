import { useState, useEffect } from "react";
import { useHub, HubLogo } from "@sms-hub/ui";

import { ArrowRight } from "lucide-react";
import AppLayout from "../components/AppLayout";
import SEO from "../components/SEO";


const Home = () => {
  const [showText, setShowText] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { currentHub } = useHub();

  const textParts = ["SMS for businesses others won't serve..."];
  const totalLength = textParts.join("").length;

  useEffect(() => {
    // Scroll to top of page on load/refresh
    window.scrollTo(0, 0);

    // Only wait 1.5 seconds on initial website entry, not on refresh/back
    const hasVisited = sessionStorage.getItem("hasVisitedHome");

    if (!hasVisited) {
      sessionStorage.setItem("hasVisitedHome", "true");
      const textTimer = setTimeout(() => {
        setShowText(true);
      }, 1500);
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
      }, 80);
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
        result.push(visibleText);
      }

      displayedLength += partLength;
    }

    return result;
  };



  // Static phone component for demo
  const StaticPhone = () => (
    <div className="phone-3d mx-auto">
      <div className="phone-screen">
        {/* Phone Status Bar */}
        <div className="phone-status-bar">
          <span>9:41 AM</span>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-2 border border-white rounded-sm">
              <div className="w-3 h-1 bg-white rounded-sm"></div>
            </div>
          </div>
        </div>
        
        {/* Messages Area */}
        <div className="phone-messages-area">
          <div className="phone-messages">
            {/* Business Message */}
            <div className="flex mb-3">
              <div className="bg-gray-200 rounded-2xl rounded-bl-sm px-4 py-2 max-w-[200px]">
                <p className="text-sm text-gray-800">🔥 EXCLUSIVE: Drew Estate Masterclass this Saturday 7PM! Only 15 spots left. Call to RSVP!</p>
                <span className="text-xs text-gray-500">Premium Cigars & Co</span>
              </div>
            </div>
            
            {/* User Response */}
            <div className="flex justify-end mb-3">
              <div className="bg-blue-500 rounded-2xl rounded-br-sm px-4 py-2 max-w-[200px]">
                <p className="text-sm text-white">Count me in! Can't wait 🎉</p>
              </div>
            </div>
            
            {/* Business Follow-up */}
            <div className="flex">
              <div className="bg-gray-200 rounded-2xl rounded-bl-sm px-4 py-2 max-w-[200px]">
                <p className="text-sm text-gray-800">Perfect! See you Saturday. Age 21+ required at door.</p>
                <span className="text-xs text-gray-500">Premium Cigars & Co</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Input Area */}
        <div className="phone-input-area">
          <div className="phone-input-field flex items-center justify-center text-gray-400 text-sm">
            Message...
          </div>
          <div className="phone-send-button">
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AppLayout>
      <SEO 
        title="SMS Hub - SMS for Businesses Others Reject"
        description="Compliant SMS platform for cigar retailers, private clubs, and premium venues. We serve the businesses others won't."
        keywords="SMS, texting, cigar retailers, compliance, regulated businesses, premium venues"
      />
      
      {/* HERO SECTION - Minimal */}
      <div className="min-h-screen bg-black relative flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 text-center py-20">
          {/* Logo - Larger presence */}
          <div className="mb-16">
            <HubLogo
              hubType={currentHub}
              variant="text"
              size="xl"
              className="!flex-none !items-center justify-center opacity-90"
              style={{ transform: 'scale(1.5)', transformOrigin: 'center' }}
            />
          </div>

          {/* Main message - Clean and simple */}
          <h1 className="text-3xl md:text-5xl font-light text-white mb-8 leading-tight">
            {showText ? (
              <>
                {renderText()}
              </>
            ) : (
              <span className="opacity-0">SMS for businesses others won't serve...</span>
            )}
          </h1>
          
          <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto font-light">
            Professional SMS for regulated industries, employers, and businesses with unique needs
          </p>
          
          {/* Single CTA - Cleaner */}
          <button
            onClick={() => window.location.href = '/contact'}
            className="px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-gray-100 transition-all duration-300 text-sm tracking-wide"
          >
            GET STARTED
          </button>
        </div>

        {/* Subtle scroll indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-gray-600">
          <div className="w-5 h-5 border-b border-r border-gray-600 rotate-45 transform origin-center"></div>
        </div>
      </div>

      {/* PROBLEM & SOLUTION - Minimal */}
      <div className="bg-black py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            
            {/* Left: Content */}
            <div className="space-y-16">
              {/* Problem */}
              <div>
                <p className="text-red-500 text-sm font-medium mb-4">THE PROBLEM</p>
                <h2 className="text-3xl font-light text-white mb-6">
                  Other platforms reject your business
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed font-light">
                  Cigar retailers, private clubs, and premium venues are labeled "high-risk" 
                  by traditional SMS platforms.
                </p>
              </div>

              {/* Solution */}
              <div>
                <p className="text-green-500 text-sm font-medium mb-4">OUR SOLUTION</p>
                <h2 className="text-3xl font-light text-white mb-6">
                  We specialize in your industry
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-8 font-light">
                  Built specifically for regulated businesses with full compliance expertise.
                </p>
                
                <div className="space-y-4">
                  {[
                    "HIPAA-compliant messaging",
                    "Regulatory expertise", 
                    "Premium service",
                    "Sophisticated tools"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center text-gray-300">
                      <div className="w-1 h-1 bg-orange-500 rounded-full mr-4"></div>
                      <span className="font-light">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Phone Demo - Simplified */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <StaticPhone />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TESTIMONIALS - Minimal */}
      <div className="bg-black py-32 border-t border-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-light text-white mb-4">
              Trusted by businesses others reject
            </h2>
            <p className="text-gray-400 text-lg font-light">
              Real results from regulated businesses.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 mb-20">
            {/* Testimonial 1 */}
            <div className="space-y-6">
              <p className="text-gray-300 font-light leading-relaxed">
                "Other platforms rejected us immediately. These guys not only accepted us but helped us stay compliant. Engagement up 40%."
              </p>
              <div>
                <div className="font-medium text-white">Sarah Chen</div>
                <div className="text-sm text-gray-500">Azure Wine & Cigar</div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="space-y-6">
              <p className="text-gray-300 font-light leading-relaxed">
                "The compliance expertise gives us peace of mind, and the personalized campaigns maintain our exclusive feel."
              </p>
              <div>
                <div className="font-medium text-white">David Thompson</div>
                <div className="text-sm text-gray-500">The Gentleman's Club</div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="space-y-6">
              <p className="text-gray-300 font-light leading-relaxed">
                "Setup took 8 days as promised. The $179 onboarding was worth it for the compliance consultation alone."
              </p>
              <div>
                <div className="font-medium text-white">Marcus Rodriguez</div>
                <div className="text-sm text-gray-500">The Velvet Lounge</div>
              </div>
            </div>
          </div>

          {/* Stats - Minimal */}
          <div className="flex justify-center gap-20">
            <div className="text-center">
              <div className="text-4xl font-light text-white mb-2">98%</div>
              <div className="text-gray-500 text-sm">Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-white mb-2">40%</div>
              <div className="text-gray-500 text-sm">Engagement Boost</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-white mb-2">100%</div>
              <div className="text-gray-500 text-sm">Compliance</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA - Minimal */}
      <div className="bg-black py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-light text-white mb-8">
            Ready to start texting your customers?
          </h2>
          
          <p className="text-gray-400 text-lg mb-12 font-light">
            No rejections. No compliance headaches. Just premium SMS.
          </p>

          {/* Simple steps */}
          <div className="flex justify-center gap-12 mb-16">
            <div className="text-gray-500 font-light">
              <span className="text-white">1.</span> Contact us
            </div>
            <div className="text-gray-500 font-light">
              <span className="text-white">2.</span> Get set up
            </div>
            <div className="text-gray-500 font-light">
              <span className="text-white">3.</span> Start texting
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/contact'}
              className="px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-gray-100 transition-all duration-300 text-sm tracking-wide"
            >
              CONTACT US
            </button>
            <button
              onClick={() => window.location.href = '/pricing'}
              className="px-8 py-4 border border-gray-700 text-white font-medium rounded-full hover:border-gray-500 transition-all duration-300 text-sm tracking-wide"
            >
              VIEW PRICING
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Home;
