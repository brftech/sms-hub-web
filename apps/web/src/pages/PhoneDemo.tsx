
import { PhoneInteractive, LiveMessagingProvider, PageLayout } from "@sms-hub/ui";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export default function PhoneDemo() {
  return (
    <PageLayout
      showNavigation={true}
      showFooter={true}
      navigation={<Navigation />}
      footer={<Footer />}
    >
      {/* Hero Section with proper top padding for fixed navigation */}
      <div className="min-h-screen bg-black pt-24 pb-16 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          {/* Hero Content */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-8">
              <span className="text-sm font-medium text-orange-400">
                Interactive Demo
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              <span className="block">Phone Interactive</span>
              <span className="bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
                SMS Demo
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Experience our interactive SMS demo with a realistic phone interface. 
              See how businesses can engage with customers through our platform.
            </p>
          </div>

          {/* Phone Interactive Component */}
          <div className="flex justify-center mb-20">
            <LiveMessagingProvider>
              <PhoneInteractive />
            </LiveMessagingProvider>
          </div>

          {/* Additional Info */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 border border-orange-500/20 rounded-3xl p-12 backdrop-blur-sm">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Try the Platform Demo
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Open the Platform Demo in another tab to see the business side and experience 
                real-time interaction between customer and business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.open('/platform-demo', '_blank')}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25"
                >
                  Open Platform Demo
                </button>
                <button
                  onClick={() => window.location.href = '/contact'}
                  className="px-8 py-4 border-2 border-orange-500/50 text-orange-400 font-semibold rounded-xl hover:bg-orange-500/10 hover:border-orange-400 transition-all duration-300"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
