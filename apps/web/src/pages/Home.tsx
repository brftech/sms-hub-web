import { useState, useEffect } from "react";
import { useHub, HubLogo, SEO } from "@sms-hub/ui";

import { ArrowRight, Shield, Zap, Users, Clock } from "lucide-react";
import AppLayout from "../components/AppLayout";


const businessTypes = [
  "cigar lounges...",
  "employers...", 
  "dog groomers...",
  "whiskey bars...",
  "construction crews...",
  "retail stores..."
];

const Home = () => {
  const [showText, setShowText] = useState(false);

  const { currentHub } = useHub();

  const fixedText = "Compliant, slick SMS for";
  
  const [currentBusinessIndex, setCurrentBusinessIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [displayedBusiness, setDisplayedBusiness] = useState("");
  const [charIndex, setCharIndex] = useState(0);

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

  // Business type cycling animation
  useEffect(() => {
    if (!showText) return;

    const currentBusiness = businessTypes[currentBusinessIndex];
    
    if (isTyping) {
      // Typing the current business
      if (charIndex < currentBusiness.length) {
        const typeTimer = setTimeout(() => {
          setDisplayedBusiness(currentBusiness.slice(0, charIndex + 1));
          setCharIndex(prev => prev + 1);
        }, 100);
        return () => clearTimeout(typeTimer);
      } else {
        // Finished typing, wait then start backspacing
        const pauseTimer = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
        return () => clearTimeout(pauseTimer);
      }
    } else {
      // Backspacing
      if (charIndex > 0) {
        const backspaceTimer = setTimeout(() => {
          setDisplayedBusiness(currentBusiness.slice(0, charIndex - 1));
          setCharIndex(prev => prev - 1);
        }, 50);
        return () => clearTimeout(backspaceTimer);
      } else {
        // Finished backspacing, move to next business
        setCurrentBusinessIndex((prev) => (prev + 1) % businessTypes.length);
        setIsTyping(true);
      }
    }
  }, [showText, isTyping, charIndex, currentBusinessIndex, businessTypes]);





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
        title="Gnymble - SMS for Businesses That Break the Mold"
        description="The SMS platform that delivers excellence for regulated businesses, employers, and retailers that demand SMS that actually works."
        keywords="SMS platform, business texting, regulated businesses, compliance, employee communication, retail SMS, premium messaging"
      />
      
      {/* HERO SECTION - Minimal */}
      <div className="min-h-screen bg-black relative flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 text-center py-12 md:py-20">
          {/* Logo - Larger presence */}
          <div className="mb-12 md:mb-16">
            <HubLogo
              hubType={currentHub}
              variant="text"
              size="xl"
              className="!flex-none !items-center justify-center opacity-90"
              style={{ transform: 'scale(1.5)', transformOrigin: 'center' }}
            />
          </div>

          {/* Main message with cycling animation */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-light text-white mb-6 md:mb-8 leading-tight">
            {showText ? (
              <>
                {fixedText}
                <br />
                <span className="text-amber-400">
                  {displayedBusiness}
                  <span className="animate-pulse">|</span>
                </span>
              </>
            ) : (
              <span className="opacity-0">Compliant, slick SMS for<br />cigar lounges...</span>
            )}
          </h1>
          
          <p className="text-amber-200/80 text-lg md:text-xl mb-10 md:mb-12 max-w-3xl mx-auto font-light italic">
            "For regulated businesses, employers, and retailers that demand SMS excellence."
          </p>
          
          {/* Edgy CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6 md:mb-8">
            <button
              onClick={() => window.location.href = '/contact'}
              className="px-8 py-4 bg-amber-600 text-black font-bold rounded-sm hover:bg-amber-500 transition-all duration-300 text-sm tracking-wide uppercase shadow-lg"
            >
              JOIN THE REBELLION
            </button>
            <button
              onClick={() => window.location.href = '/phone-demo'}
              className="px-8 py-4 border-2 border-amber-600 text-amber-600 font-bold rounded-sm hover:bg-amber-600 hover:text-black transition-all duration-300 text-sm tracking-wide uppercase"
            >
              SEE THE EVIDENCE
            </button>
          </div>
          
          <p className="text-gray-500 text-sm">
            🔥 For business owners who demand SMS that delivers
          </p>
        </div>

        {/* Subtle scroll indicator */}
        <div className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 text-gray-600">
          <div className="w-5 h-5 border-b border-r border-gray-600 rotate-45 transform origin-center"></div>
        </div>
      </div>

      {/* THE UNDERGROUND TRUTH */}
      <div className="bg-gradient-to-b from-black via-gray-900 to-black py-16 md:py-24 lg:py-32 relative">
        {/* Ambient lighting effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/10 via-transparent to-amber-900/10"></div>
        
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center mb-12 md:mb-16 lg:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
              The Platform <span className="text-amber-500">Problem</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              While others exclude, we excel. We champion every business that dares to be different.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20 items-center">
            
            {/* Left: The Hard Truth */}
            <div className="space-y-8 md:space-y-12">
              {/* What Others Miss */}
              <div className="border-l-4 border-red-600 pl-6 md:pl-8">
                <h3 className="text-xl md:text-2xl font-bold text-red-400 mb-3 md:mb-4">
                  WHAT OTHERS OVERLOOK
                </h3>
                <div className="space-y-3 md:space-y-4 text-gray-300">
                  <p className="text-base md:text-lg">❌ Complex industries need expert guidance</p>
                  <p className="text-base md:text-lg">❌ Regulated businesses demand proven compliance</p>
                  <p className="text-base md:text-lg">❌ Growing companies require scalable solutions</p>
                  <p className="text-base md:text-lg">❌ Professional teams deserve premium support</p>
                </div>
              </div>

              {/* What We Deliver */}
              <div className="border-l-4 border-amber-600 pl-6 md:pl-8">
                <h3 className="text-xl md:text-2xl font-bold text-amber-400 mb-3 md:mb-4">
                  WE DELIVER WHAT OTHERS PROMISE
                </h3>
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center text-gray-200">
                    <Shield className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0" />
                    <span className="font-medium text-sm md:text-base">Master-level compliance expertise for every industry</span>
                  </div>
                  <div className="flex items-center text-gray-200">
                    <Zap className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0" />
                    <span className="font-medium text-sm md:text-base">8-day setup guarantee that we actually honor</span>
                  </div>
                  <div className="flex items-center text-gray-200">
                    <Users className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0" />
                    <span className="font-medium text-sm md:text-base">White-glove service that exceeds expectations</span>
                  </div>
                  <div className="flex items-center text-gray-200">
                    <Clock className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0" />
                    <span className="font-medium text-sm md:text-base">Expert humans who solve problems fast</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Enhanced Phone Demo */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full scale-150"></div>
                <StaticPhone />
                {/* Badge overlay */}
                <div className="absolute -bottom-4 -right-4 bg-amber-600 text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  COMPLIANT ✓
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VOICES FROM THE UNDERGROUND */}
      <div className="bg-black py-16 md:py-24 lg:py-32 border-t border-amber-900/30 relative">
        {/* Smoky atmosphere effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/5 via-transparent to-amber-900/5"></div>
        
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center mb-12 md:mb-16 lg:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
              <span className="text-amber-500">Real</span> Reviews
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              From regulated industries to retail giants - businesses that chose excellence over compromise.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-12 md:mb-16 lg:mb-20">
            {/* Testimonial 1 - Retail */}
            <div className="bg-gray-900/50 p-8 rounded-lg border border-amber-900/30 hover:border-amber-600/50 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="text-amber-500 text-2xl mr-2">★★★★★</div>
                <span className="text-amber-400 font-bold text-sm">RETAIL HERO</span>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6 italic">
                "While others struggled with our appointment system, Gnymble delivered flawlessly in a week - now we're booked solid and growing!"
              </p>
              <div className="border-t border-gray-700 pt-4">
                <div className="font-bold text-white">Sarah Chen</div>
                <div className="text-amber-400 text-sm">Paws & Claws Pet Grooming</div>
                <div className="text-gray-500 text-xs">Austin, TX</div>
              </div>
            </div>

            {/* Testimonial 2 - Employer */}
            <div className="bg-gray-900/50 p-8 rounded-lg border border-amber-900/30 hover:border-amber-600/50 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="text-amber-500 text-2xl mr-2">★★★★★</div>
                <span className="text-amber-400 font-bold text-sm">TEAM BUILDER</span>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6 italic">
                "Gnymble transformed our employee communications - streamlined, compliant, and powerful. Their expertise saved us major headaches."
              </p>
              <div className="border-t border-gray-700 pt-4">
                <div className="font-bold text-white">David Thompson</div>
                <div className="text-amber-400 text-sm">Thompson Construction Co.</div>
                <div className="text-gray-500 text-xs">Miami, FL</div>
              </div>
            </div>

            {/* Testimonial 3 - Premium */}
            <div className="bg-gray-900/50 p-8 rounded-lg border border-amber-900/30 hover:border-amber-600/50 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="text-amber-500 text-2xl mr-2">★★★★★</div>
                <span className="text-amber-400 font-bold text-sm">PREMIUM CLIENT</span>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6 italic">
                "Lightning-fast 8-day setup delivered exactly as promised. The $179 investment pays for itself - our events are consistently sold out!"
              </p>
              <div className="border-t border-gray-700 pt-4">
                <div className="font-bold text-white">Marcus Rodriguez</div>
                <div className="text-amber-400 text-sm">Iron & Oak Cigar Lounge</div>
                <div className="text-gray-500 text-xs">Las Vegas, NV</div>
              </div>
            </div>
          </div>

          {/* Battle-tested stats */}
          <div className="bg-gradient-to-r from-amber-900/20 via-amber-800/10 to-amber-900/20 rounded-lg p-12">
            <h3 className="text-2xl font-bold text-amber-400 text-center mb-8">BATTLE-TESTED RESULTS</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">98%</div>
                <div className="text-amber-400 font-medium">Client Retention</div>
                <div className="text-gray-500 text-sm">Nobody leaves the family</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">40%</div>
                <div className="text-amber-400 font-medium">Revenue Boost</div>
                <div className="text-gray-500 text-sm">Average first year</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">0</div>
                <div className="text-amber-400 font-medium">Compliance Issues</div>
                <div className="text-gray-500 text-sm">Perfect track record</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* THE INVITATION */}
      <div className="bg-gradient-to-b from-black to-gray-900 py-16 md:py-24 lg:py-32 relative">
        {/* Dramatic lighting */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 via-transparent to-amber-900/20"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 md:mb-8 leading-tight">
            Ready to Find Your 
            <span className="text-amber-500 block">SMS Home?</span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-300 mb-10 md:mb-12 max-w-3xl mx-auto">
            Experience the platform built for businesses that dare to be different.<br/>
            <span className="text-amber-400 font-medium">Your success demands SMS that delivers results.</span>
          </p>

          {/* Your path to SMS success */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
            <div className="bg-gray-900/50 border border-amber-900/30 rounded-lg p-6">
              <div className="text-amber-500 text-4xl font-bold mb-2">01</div>
              <h3 className="text-white font-bold mb-2">REACH OUT</h3>
              <p className="text-gray-400 text-sm">Share your vision. We craft the perfect SMS solution.</p>
            </div>
            <div className="bg-gray-900/50 border border-amber-900/30 rounded-lg p-6">
              <div className="text-amber-500 text-4xl font-bold mb-2">02</div>
              <h3 className="text-white font-bold mb-2">GET SET UP</h3>
              <p className="text-gray-400 text-sm">Lightning-fast 8-day deployment. Master-level compliance included.</p>
            </div>
            <div className="bg-gray-900/50 border border-amber-900/30 rounded-lg p-6">
              <div className="text-amber-500 text-4xl font-bold mb-2">03</div>
              <h3 className="text-white font-bold mb-2">GROW YOUR BUSINESS</h3>
              <p className="text-gray-400 text-sm">Connect powerfully with customers, employees, and stakeholders.</p>
            </div>
          </div>

          {/* The decision */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-500 p-8 rounded-lg mb-12">
            <h3 className="text-black text-2xl font-bold mb-4">
              Choose Excellence Over Compromise
            </h3>
            <p className="text-black/80 text-lg mb-6">
              Join the SMS platform that champions your success and amplifies your growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/contact'}
                className="px-10 py-4 bg-black text-amber-400 font-bold rounded-sm hover:bg-gray-900 transition-all duration-300 text-sm tracking-wide uppercase shadow-lg"
              >
                🚀 GET STARTED NOW
              </button>
              <button
                onClick={() => window.location.href = '/phone-demo'}
                className="px-10 py-4 border-2 border-black text-black font-bold rounded-sm hover:bg-black hover:text-amber-400 transition-all duration-300 text-sm tracking-wide uppercase"
              >
                📱 SEE IT IN ACTION
              </button>
            </div>
          </div>

          <p className="text-gray-500 text-sm">
            <span className="text-amber-400">💯 Guarantee:</span> If we can't get you set up in 8 days, your $179 onboarding is free.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Home;
