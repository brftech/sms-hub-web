import { useNavigate } from "react-router-dom";
import { PageLayout, SEO } from "@sms-hub/ui";

import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import {
  Shield,
  Users,
  CheckCircle,
  Star,
  Clock,
  ArrowRight,
  Target,
} from "lucide-react";
// Import Bryan's profile image from UI assets
import bryanProfileImage from "@sms-hub/ui/assets/bryan-profile.png";

const About = () => {
  const navigate = useNavigate();
  return (
    <PageLayout
      showNavigation={true}
      showFooter={true}
      navigation={<Navigation />}
      footer={<Footer />}
    >
      <SEO
        title="About Gnymble - SMS for Businesses Others Reject"
        description="We serve the businesses others reject. Cigar retailers, distilleries, premium venues - we built SMS specifically for regulated industries."
        keywords="about gnymble, SMS for regulated businesses, cigar lounge SMS, premium venue texting, business compliance"
      />

      <div className="min-h-screen bg-black pt-20 pb-12 relative">
        {/* Subtle background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          {/* Hero Section - Matching Homepage Style */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 mb-8">
              <Target className="w-4 h-4 text-orange-400 mr-2" />
              <span className="text-sm font-medium text-orange-400">
                WHY WE EXIST
              </span>
            </div>

            <h1
              className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              We serve the businesses
              <span className="gradient-text block">others reject</span>
            </h1>

            <p
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              Cigar retailers, private clubs, and premium venues get rejected by
              traditional SMS platforms.
              <span className="text-orange-400">
                {" "}
                We built a platform specifically for you.
              </span>
            </p>

            <div className="flex items-center justify-center space-x-8 text-gray-400 text-sm">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-orange-500 mr-2" />
                <span>No rejections</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-orange-500 mr-2" />
                <span>Industry expertise</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-orange-500 mr-2" />
                <span>Real support</span>
              </div>
            </div>
          </div>

          {/* The Bryan Story - Why This Matters */}
          <div className="mb-20">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-12">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="relative flex-shrink-0">
                  <img
                    src={bryanProfileImage}
                    alt="Bryan - Founder"
                    className="w-40 h-40 rounded-full object-cover border-4 border-orange-500/30 shadow-2xl"
                  />
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="flex-1">
                  <h2
                    className="text-3xl md:text-4xl font-bold text-white mb-6"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    Built by someone who gets it
                  </h2>
                  <p
                    className="text-gray-300 leading-relaxed mb-6 text-lg"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    <strong className="text-orange-400">Bryan</strong> spent
                    years watching quality businesses get rejected by SMS
                    platforms simply because of their industry. Cigar retailers
                    were labeled "high-risk." Private clubs were deemed
                    "non-compliant." Premium venues were turned away.
                  </p>
                  <p
                    className="text-gray-300 leading-relaxed mb-8 text-lg"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    The problem wasn't these businesses - it was platforms that
                    didn't understand regulated industries.
                    <span className="text-orange-400">
                      {" "}
                      So Bryan built one that does.
                    </span>
                  </p>
                  <div className="flex items-center text-orange-400 text-lg font-medium">
                    <CheckCircle className="w-5 h-5 mr-3" />
                    <span
                      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                    >
                      5+ years in regulated business compliance
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How We're Different - Removed as redundant with home page */}

          {/* What You Get */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl font-bold text-white mb-6"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                What you get with us
              </h2>
              <p
                className="text-gray-300 text-lg leading-relaxed"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                More than SMS - a partner who understands your business.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-10 h-10 text-orange-400" />
                </div>
                <h3
                  className="text-xl font-semibold text-white mb-4"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  Compliance Expertise
                </h3>
                <p
                  className="text-gray-400 leading-relaxed"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  We know your industry's regulations inside and out. No
                  surprises, no violations.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-orange-400" />
                </div>
                <h3
                  className="text-xl font-semibold text-white mb-4"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  Personal Service
                </h3>
                <p
                  className="text-gray-400 leading-relaxed"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  You're not ticket #47291. You get dedicated support from
                  people who know your name.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-10 h-10 text-orange-400" />
                </div>
                <h3
                  className="text-xl font-semibold text-white mb-4"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  Quick Setup
                </h3>
                <p
                  className="text-gray-400 leading-relaxed"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  We handle everything. Setup in 7-10 days, not 6-8 weeks like
                  competitors.
                </p>
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
                Ready to work with people who get it?
              </h2>
              <p
                className="text-gray-300 mb-10 max-w-2xl mx-auto text-lg leading-relaxed"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                No more rejections. No more compliance headaches. Just SMS that
                works for your business.
              </p>
              <button
                onClick={() => navigate("/contact")}
                className="px-10 py-4 bg-orange-600 text-white font-bold rounded-full hover:bg-orange-700 transition-all duration-300 text-lg tracking-wide uppercase flex items-center justify-center mx-auto group"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Get Started for $179
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default About;
