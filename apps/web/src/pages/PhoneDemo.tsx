
import { PhoneInteractive, LiveMessagingProvider, PageLayout } from "@sms-hub/ui";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { MessageSquare, ArrowRight, Eye } from "lucide-react";

export default function PhoneDemo() {
  return (
    <PageLayout
      showNavigation={true}
      showFooter={true}
      navigation={<Navigation />}
      footer={<Footer />}
    >
      {/* Hero Section */}
      <div className="min-h-screen bg-black pt-24 pb-16 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          {/* Hero Content */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-8">
              <Eye className="w-4 h-4 text-orange-400 mr-2" />
              <span className="text-sm font-medium text-orange-400">
                Customer Experience Preview
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="block">What Your</span>
              <span className="bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
                Customers See
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              This is exactly what your customers experience when you send them SMS messages. 
              Professional, engaging, and compliant.
            </p>
          </div>

          {/* Phone Demo */}
          <div className="flex justify-center mb-16">
            <LiveMessagingProvider>
              <PhoneInteractive />
            </LiveMessagingProvider>
          </div>

          {/* Business Side CTA */}
          <div className="text-center">
            <div className="card-modern rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-orange-400" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                See the Business Side
              </h2>
              <p className="text-gray-300 mb-6">
                Want to see how easy it is to send these messages? Check out the platform demo to see the business dashboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => window.open('/platform-demo', '_blank')}
                  className="btn-modern bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-orange-600 hover:to-purple-700 flex items-center justify-center gap-2"
                >
                  Platform Demo
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="btn-modern border-2 border-orange-500/50 text-orange-400 font-semibold px-6 py-3 rounded-xl hover:bg-orange-500/10 hover:border-orange-400"
                >
                  Get Started for $179
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
