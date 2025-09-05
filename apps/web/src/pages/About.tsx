import { PageLayout } from "@sms-hub/ui";

import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Shield, Users, CheckCircle, Star, X, Clock } from "lucide-react";
// Import Bryan's profile image from UI assets
import bryanProfileImage from "@sms-hub/ui/assets/bryan-profile.png";

const About = () => {
  return (
    <PageLayout
      showNavigation={true}
      showFooter={true}
      navigation={<Navigation />}
      footer={<Footer />}
    >
      <div className="min-h-screen bg-black pt-20 pb-12 relative">
        {/* Minimal background */}
        <div className="absolute inset-0 bg-black"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          {/* Hero - Why We Exist */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 mb-6">
              <Shield className="w-4 h-4 text-orange-400 mr-2" />
              <span className="text-xs font-medium text-orange-400">
                WHY WE EXIST
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              We serve the businesses
              <span className="gradient-text block">others reject</span>
            </h1>

            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
              Cigar retailers, private clubs, and premium venues get rejected by
              traditional SMS platforms. We built a platform specifically for
              you.
            </p>
          </div>

          {/* The Bryan Story - Why This Matters */}
          <div className="mb-16">
            <div className="card-modern rounded-2xl p-8">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="relative flex-shrink-0">
                  <img
                    src={bryanProfileImage}
                    alt="Bryan - Founder"
                    className="w-32 h-32 rounded-full object-cover border-4 border-orange-500/30 shadow-2xl"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Built by someone who gets it
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    <strong>Bryan</strong> spent years watching quality
                    businesses get rejected by SMS platforms simply because of
                    their industry. Cigar retailers were labeled "high-risk."
                    Private clubs were deemed "non-compliant." Premium venues
                    were turned away.
                  </p>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    The problem wasn't these businesses - it was platforms that
                    didn't understand regulated industries. So Bryan built one
                    that does.
                  </p>
                  <div className="flex items-center text-orange-400 text-sm">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>10+ years in regulated business compliance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How We're Different */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                How we're different
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                We don't just accept regulated businesses - we specialize in
                them.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Other Platforms */}
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <X className="w-6 h-6 text-red-400 mr-3" />
                  <h3 className="text-lg font-bold text-white">
                    Other Platforms
                  </h3>
                </div>
                <ul className="space-y-3 text-gray-300 text-sm">
                  <li>❌ "High-risk" business restrictions</li>
                  <li>❌ Generic compliance (doesn't fit your industry)</li>
                  <li>❌ Account suspensions and bans</li>
                  <li>❌ No understanding of regulated businesses</li>
                  <li>❌ Cookie-cutter solutions</li>
                </ul>
              </div>

              {/* Our Platform */}
              <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                  <h3 className="text-lg font-bold text-white">Our Platform</h3>
                </div>
                <ul className="space-y-3 text-gray-300 text-sm">
                  <li>✅ Specializes in regulated businesses</li>
                  <li>✅ Industry-specific compliance expertise</li>
                  <li>✅ Never banned or suspended</li>
                  <li>✅ Deep understanding of your challenges</li>
                  <li>✅ Custom solutions for premium venues</li>
                </ul>
              </div>
            </div>
          </div>

          {/* What You Get */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                What you get with us
              </h2>
              <p className="text-gray-300">
                More than SMS - a partner who understands your business.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Compliance Expertise
                </h3>
                <p className="text-gray-400 text-sm">
                  We know your industry's regulations inside and out. No
                  surprises, no violations.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Personal Service
                </h3>
                <p className="text-gray-400 text-sm">
                  You're not ticket #47291. You get dedicated support from
                  people who know your name.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Quick Setup
                </h3>
                <p className="text-gray-400 text-sm">
                  We handle everything. Setup in 7-10 days, not 6-8 weeks like
                  competitors.
                </p>
              </div>
            </div>
          </div>

          {/* Simple CTA */}
          <div className="text-center">
            <div className="card-modern rounded-2xl p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to work with people who get it?
              </h2>
              <p className="text-gray-300 mb-6 max-w-xl mx-auto">
                No more rejections. No more compliance headaches. Just SMS that
                works for your business.
              </p>
              <button
                onClick={() => (window.location.href = "/contact")}
                className="btn-modern px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25"
              >
                Get Started for $179
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default About;
