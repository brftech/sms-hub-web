import { useNavigate } from "react-router-dom";
import {
  PhoneInteractive,
  PlatformDemo,
  LiveMessagingProvider,
  PageLayout,
  SEO,
} from "@sms-hub/ui/marketing";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import {
  MessageSquare,
  ArrowRight,
  Eye,
  Monitor,
  Phone,
  ArrowRightLeft,
  CheckCircle,
  Target,
  Users,
} from "lucide-react";
import { useState } from "react";
import { CONTACT_PATH } from "@/utils/routes";

export default function Demo() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"phone" | "platform">("phone");

  return (
    <PageLayout
      showNavigation={true}
      showFooter={true}
      navigation={<Navigation />}
      footer={<Footer />}
    >
      <SEO
        title="Static Preview - Gnymble SMS Platform"
        description="Preview our SMS platform interface. See both the customer experience and business dashboard in this static representation. Contact us for a live demo."
        keywords="SMS preview, business texting preview, platform preview, customer experience, business dashboard, contact for demo"
      />

      <div className="min-h-screen bg-black pt-20 pb-12 relative">
        {/* Subtle background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Hero Section - Matching Homepage Style */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 mb-8">
              <Target className="w-4 h-4 text-orange-400 mr-2" />
              <span className="text-sm font-medium text-orange-400">STATIC PREVIEW</span>
            </div>

            <h1
              className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              See SMS in
              <span className="gradient-text block">static preview</span>
            </h1>

            <p
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              Preview both sides of our SMS platform through this static representation. See what
              your customers receive and how easy it is to manage from your business dashboard.
            </p>

            <div className="flex items-center justify-center space-x-8 text-gray-400 text-sm">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-orange-500 mr-2" />
                <span>Static preview</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-orange-500 mr-2" />
                <span>Both perspectives</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-orange-500 mr-2" />
                <span>Contact for live demo</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-2">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab("phone")}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    activeTab === "phone"
                      ? "bg-orange-600 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                  }`}
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  <Phone className="w-5 h-5" />
                  <span>Customer View</span>
                </button>
                <button
                  onClick={() => setActiveTab("platform")}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    activeTab === "platform"
                      ? "bg-orange-600 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                  }`}
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  <Monitor className="w-5 h-5" />
                  <span>Business Dashboard</span>
                </button>
              </div>
            </div>
          </div>

          {/* Static Preview Notice */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full border bg-blue-500/20 border-blue-500/30 text-blue-400">
              <div className="w-2 h-2 rounded-full mr-2 bg-blue-400"></div>
              <span
                className="text-sm font-medium"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Static Preview - Contact us for a live demo
              </span>
            </div>
          </div>

          {/* Demo Content */}
          <div className="mb-20">
            <LiveMessagingProvider>
              {activeTab === "phone" ? (
                <div className="text-center">
                  <div className="mb-8">
                    <h2
                      className="text-2xl md:text-3xl font-bold text-white mb-4"
                      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                    >
                      What Your Customers See
                    </h2>
                    <p
                      className="text-gray-300 text-lg"
                      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                    >
                      Professional, engaging SMS messages that build trust and drive action. (Static
                      preview)
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <PhoneInteractive />
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-8">
                    <h2
                      className="text-2xl md:text-3xl font-bold text-white mb-4"
                      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                    >
                      Your Business Dashboard
                    </h2>
                    <p
                      className="text-gray-300 text-lg"
                      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                    >
                      Simple, powerful tools to manage conversations and grow your business. (Static
                      preview)
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <PlatformDemo />
                  </div>
                </div>
              )}
            </LiveMessagingProvider>
          </div>

          {/* Connection Flow Visualization */}
          <div className="mb-20">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-12">
              <div className="text-center mb-12">
                <h2
                  className="text-3xl md:text-4xl font-bold text-white mb-6"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  Seamless Communication Flow
                </h2>
                <p
                  className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  See how messages flow between your business dashboard and your customer's phone in
                  this static preview.
                </p>
              </div>

              {/* Flow Diagram */}
              <div className="flex items-center justify-center space-x-8 mb-12">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Monitor className="w-10 h-10 text-blue-400" />
                  </div>
                  <h3
                    className="text-lg font-semibold text-white mb-2"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    Business Dashboard
                  </h3>
                  <p
                    className="text-gray-400 text-sm"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    Send messages
                  </p>
                </div>

                <ArrowRightLeft className="w-8 h-8 text-orange-400 animate-pulse" />

                <div className="text-center">
                  <div className="w-20 h-20 bg-green-500/20 border border-green-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-10 h-10 text-green-400" />
                  </div>
                  <h3
                    className="text-lg font-semibold text-white mb-2"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    Customer Phone
                  </h3>
                  <p
                    className="text-gray-400 text-sm"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    Receive messages
                  </p>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-6 h-6 text-orange-400" />
                  </div>
                  <h3
                    className="text-lg font-semibold text-white mb-2"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    Preview Interface
                  </h3>
                  <p
                    className="text-gray-400 text-sm"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    Switch to Business Dashboard to see the interface
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3
                    className="text-lg font-semibold text-white mb-2"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    See Both Sides
                  </h3>
                  <p
                    className="text-gray-400 text-sm"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    Preview how messages appear on both sides
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-green-400" />
                  </div>
                  <h3
                    className="text-lg font-semibold text-white mb-2"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    Contact for Demo
                  </h3>
                  <p
                    className="text-gray-400 text-sm"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    Submit our contact form to schedule a live demo
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-12 max-w-4xl mx-auto">
              <h2
                className="text-3xl md:text-4xl font-bold text-white mb-6"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Ready to see it live?
              </h2>
              <p
                className="text-gray-300 mb-10 max-w-2xl mx-auto text-lg leading-relaxed"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                This was just a static preview. No more SMS rejections. No compliance headaches.
                Just professional texting that works for your regulated business.
                <br />
                <span className="text-orange-400 font-medium">
                  Submit our contact form to schedule a live demo with real SMS.
                </span>
              </p>
              <button
                onClick={() => navigate(CONTACT_PATH)}
                className="px-10 py-4 bg-orange-600 text-white font-bold rounded-full hover:bg-orange-700 transition-all duration-300 text-lg tracking-wide uppercase flex items-center justify-center mx-auto group"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Schedule Live Demo
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
