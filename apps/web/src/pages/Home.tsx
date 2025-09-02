import { useState, useEffect } from "react";
import { useHub, HubLogo } from "@sms-hub/ui";
import { getHubColorClasses } from "@sms-hub/utils";
import { Shield, MessageSquare, ArrowRight, CheckCircle, X, Star } from "lucide-react";
import AppLayout from "../components/AppLayout";
import SEO from "../components/SEO";
import cigarImage from "@sms-hub/ui/assets/cigar.png";

const Home = () => {
  const [showText, setShowText] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { currentHub, hubConfig } = useHub();
  const hubColors = getHubColorClasses(currentHub);

  const textParts = ["SMS for businesses others reject"];
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

  const handleClick = () => {
    setShowText(true);
    setCurrentIndex(totalLength);
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
      
      {/* HERO SECTION */}
      <div
        className="min-h-screen bg-black relative cursor-pointer pt-16 hero-section"
        style={{
          backgroundImage: `url(${cigarImage})`,
          backgroundSize: "40%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        onClick={handleClick}
      >
        {/* Background overlay */}
        <div className="absolute inset-0 bg-black opacity-80"></div>
        
        {/* Logo */}
        <div className="absolute top-1/4 left-0 right-0 flex justify-center z-10 px-4">
          <HubLogo
            hubType={currentHub}
            variant="text"
            size="xl"
            className="!flex-none !items-start h-16 w-auto sm:h-20 md:h-24"
          />
        </div>

        {/* Typewriter text */}
        {showText && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-full px-4 typewriter-text">
            <div className="text-xl sm:text-2xl lg:text-4xl font-bold text-white text-center animate-fade-in">
              {renderText()}
              <span className="animate-pulse">|</span>
            </div>
            <div className="text-center mt-4 sm:mt-6">
              <p className="text-gray-300 text-base sm:text-lg mb-4 sm:mb-6 px-4">
                Compliant texting for cigar retailers, private clubs & premium venues
              </p>
              <button
                onClick={() => window.location.href = '/contact'}
                className="btn-modern px-6 sm:px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25 w-full sm:w-auto max-w-xs sm:max-w-none"
              >
                Get Started Today
              </button>
            </div>
          </div>
        )}

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white z-10 scroll-indicator">
          <div className="animate-bounce">
            <div className="w-6 h-6 border-b-2 border-r-2 border-white rotate-45 transform origin-center"></div>
          </div>
        </div>
      </div>

      {/* TRUST & DIFFERENTIATION SECTION */}
      <div className="min-h-screen bg-black py-12 sm:py-16 lg:py-20 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            
            {/* Left: Problem/Solution */}
            <div className="space-y-8 sm:space-y-12">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 mb-4 sm:mb-6">
                  <X className="w-4 h-4 text-red-400 mr-2" />
                  <span className="text-xs font-medium text-red-400">THE PROBLEM</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                  Other platforms 
                  <span className="text-red-400"> reject</span> your business
                </h2>
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                  Cigar retailers, private clubs, and premium venues are labeled "high-risk" 
                  by traditional SMS platforms. You get rejected, banned, or worse.
                </p>
              </div>

              <div className="text-center lg:text-left">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 mb-4 sm:mb-6">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-xs font-medium text-green-400">OUR SOLUTION</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                  We 
                  <span className="gradient-text">specialize</span> in your industry
                </h2>
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                  Built specifically for regulated businesses. Full compliance expertise, 
                  premium service, and the sophistication your customers expect.
                </p>
                
                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {[
                    "HIPAA-compliant messaging",
                    "Built-in regulatory expertise", 
                    "Premium customer service",
                    "Sophisticated business tools"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Shield className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0" />
                      <span className="text-white">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => window.location.href = '/pricing'}
                  className="btn-modern px-6 py-3 border border-orange-500/50 text-orange-400 font-semibold rounded-lg hover:bg-orange-500/10 hover:border-orange-400 transition-all duration-300"
                >
                  View Pricing
                </button>
              </div>
            </div>

            {/* Right: Phone Demo */}
            <div className="flex justify-center lg:justify-end">
              <StaticPhone />
            </div>
          </div>
        </div>
      </div>

      {/* TESTIMONIALS SECTION */}
      <div className="bg-black py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 mb-6">
              <CheckCircle className="w-4 h-4 text-orange-400 mr-2" />
              <span className="text-xs font-medium text-orange-400">PROVEN RESULTS</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Trusted by businesses
              <span className="gradient-text"> others reject</span>
            </h2>
            
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              See how regulated businesses are thriving with compliant SMS that actually works.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Testimonial 1 - Cigar Retailer */}
            <div className="card-modern rounded-xl p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-orange-400 fill-current" />
                ))}
              </div>
              
              <p className="text-gray-300 mb-6 italic">
                "Other platforms rejected us immediately when they saw 'cigar retailer.' 
                These guys not only accepted us but helped us stay compliant. 
                Customer engagement up 40% in two months."
              </p>
              
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-500/20 border border-orange-500/30 rounded-full flex items-center justify-center mr-3">
                  <span className="text-orange-400 font-semibold text-sm">SC</span>
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">Sarah Chen</div>
                  <div className="text-xs text-gray-400">Azure Wine & Cigar, SF</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 - Private Club */}
            <div className="card-modern rounded-xl p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-orange-400 fill-current" />
                ))}
              </div>
              
              <p className="text-gray-300 mb-6 italic">
                "We needed sophisticated communication for our members. 
                The compliance expertise gives us peace of mind, and the 
                personalized campaigns maintain our exclusive feel."
              </p>
              
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-500/20 border border-orange-500/30 rounded-full flex items-center justify-center mr-3">
                  <span className="text-orange-400 font-semibold text-sm">DT</span>
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">David Thompson</div>
                  <div className="text-xs text-gray-400">The Gentleman's Club, NYC</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 - Premium Venue (New) */}
            <div className="card-modern rounded-xl p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-orange-400 fill-current" />
                ))}
              </div>
              
              <p className="text-gray-300 mb-6 italic">
                "Setup took exactly 8 days like they promised. The $179 onboarding 
                was worth it just for the compliance consultation alone. 
                No more worrying about regulations."
              </p>
              
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-500/20 border border-orange-500/30 rounded-full flex items-center justify-center mr-3">
                  <span className="text-orange-400 font-semibold text-sm">MR</span>
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">Marcus Rodriguez</div>
                  <div className="text-xs text-gray-400">The Velvet Lounge, Miami</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="text-center">
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-2xl font-bold text-white mb-1">98%</div>
                <div className="text-gray-400 text-sm">Satisfaction Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">40%</div>
                <div className="text-gray-400 text-sm">Avg. Engagement Boost</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">100%</div>
                <div className="text-gray-400 text-sm">Compliance Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SIMPLE NEXT STEPS SECTION */}
      <div className="bg-black py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 mb-6">
            <MessageSquare className="w-4 h-4 text-orange-400 mr-2" />
            <span className="text-xs font-medium text-orange-400">GET STARTED</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to start texting your customers?
          </h2>
          
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            No rejections. No compliance headaches. No generic service. 
            Just premium SMS that works for your business.
          </p>

          {/* Simple 3-step process */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { 
                step: "1", 
                title: "Contact Us", 
                desc: "Tell us about your business and SMS needs" 
              },
              { 
                step: "2", 
                title: "Get Set Up", 
                desc: "We handle compliance, setup, and training" 
              },
              { 
                step: "3", 
                title: "Start Texting", 
                desc: "Engage customers with confidence" 
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-orange-400 font-bold">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="card-modern rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to join the businesses we serve?
            </h3>
            <p className="text-gray-300 mb-6">
              No more rejections. No more compliance worries. Premium SMS for premium businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/contact'}
                className="btn-modern px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25"
              >
                Contact Us Today
              </button>
              <button
                onClick={() => window.location.href = '/pricing'}
                className="btn-modern px-8 py-3 border border-orange-500/50 text-orange-400 font-semibold rounded-lg hover:bg-orange-500/10 hover:border-orange-400 transition-all duration-300"
              >
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Home;
