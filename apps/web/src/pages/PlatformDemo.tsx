import { PlatformDemo, LiveMessagingProvider, PageLayout } from "@sms-hub/ui";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Monitor, Phone, ArrowRightLeft, Zap, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function PlatformDemoPage() {
  const [showConnectedIndicator, setShowConnectedIndicator] = useState(false);

  useEffect(() => {
    // Show connection indicator after a brief delay
    const timer = setTimeout(() => setShowConnectedIndicator(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenPhoneDemo = () => {
    window.open("/phone-demo", "_blank");
    // Show connection indicator when opening phone demo
    setShowConnectedIndicator(true);
  };

  return (
    <PageLayout
      showNavigation={true}
      showFooter={true}
      navigation={<Navigation />}
      footer={<Footer />}
    >
      {/* Hero Section */}
      <div className="min-h-screen bg-black pt-24 pb-16 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-black"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Hero Content */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
              <Monitor className="w-4 h-4 text-orange-400 mr-2" />
              <span className="text-sm font-medium text-orange-400">
                Business Dashboard Demo
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="block">Your SMS</span>
              <span className="bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
                Command Center
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              This is how simple SMS management looks for your business. Send
              messages, manage conversations, and track engagement—all in one
              place.
            </p>

            {/* Live Connection Indicator */}
            <div
              className={`inline-flex items-center px-4 py-2 rounded-full border transition-all duration-500 ${
                showConnectedIndicator
                  ? "bg-green-500/10 border-green-500/30 text-green-400"
                  : "bg-gray-500/10 border-gray-500/30 text-gray-400"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  showConnectedIndicator
                    ? "bg-green-400 animate-pulse"
                    : "bg-gray-400"
                }`}
              ></div>
              <span className="text-sm font-medium">
                {showConnectedIndicator ? "Live Demo Active" : "Demo Ready"}
              </span>
            </div>
          </div>

          {/* Platform Demo Component */}
          <div className="flex justify-center mb-12">
            <LiveMessagingProvider>
              <PlatformDemo />
            </LiveMessagingProvider>
          </div>

          {/* Real-Time Connection Section */}
          <div className="text-center">
            <div className="card-modern rounded-2xl p-8 max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-blue-400" />
                  </div>
                  <ArrowRightLeft className="w-6 h-6 text-orange-400 animate-pulse" />
                  <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                See Both Sides Live
              </h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Open the Phone Demo in another tab and watch messages flow
                between your business dashboard and your customer's phone in
                real-time.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleOpenPhoneDemo}
                  className="btn-modern bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-green-600 hover:to-blue-700 flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Open Customer View
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="btn-modern border-2 border-orange-500/50 text-orange-400 font-semibold px-6 py-3 rounded-xl hover:bg-orange-500/10 hover:border-orange-400 flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Get Started for $179
                </button>
              </div>

              {/* Quick Tips */}
              <div className="mt-8 pt-6 border-t border-gray-700/50">
                <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span>Try sending a message</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Watch real-time sync</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Experience both sides</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
