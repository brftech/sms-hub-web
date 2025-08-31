import { PageLayout, useHub } from "@sms-hub/ui";
import { getHubColorClasses } from "@sms-hub/utils";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Shield, Users, Building, CheckCircle, Star, Zap, ArrowRight } from "lucide-react";
// Import Bryan's profile image from UI assets
import bryanProfileImage from "@sms-hub/ui/assets/bryan-profile.png";

const About = () => {
  const { currentHub } = useHub();
  const hubColors = getHubColorClasses(currentHub);

  return (
    <PageLayout
      showNavigation={true}
      showFooter={true}
      navigation={<Navigation />}
      footer={<Footer />}
    >
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
              <span className={`text-sm font-medium ${hubColors.text}`}>
                Our Story
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              <span className="block">About</span>
              <span className={`${hubColors.text} bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent`}>
                {currentHub === "gnymble"
                  ? "Gnymble"
                  : currentHub === "percytech"
                    ? "PercyTech"
                    : currentHub === "percymd"
                      ? "PercyMD"
                      : currentHub === "percytext"
                        ? "PercyText"
                        : "Our Platform"}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
              Premium venues deserve premium solutions. We're the platform that understands 
              sophisticated establishments and delivers the regulatory expertise they require.
            </p>

            {/* Bryan Profile Section */}
            <div className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 border border-orange-500/20 rounded-3xl p-8 backdrop-blur-sm max-w-2xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <img
                    src={bryanProfileImage}
                    alt="Bryan - Creator of Our Platform"
                    className="w-32 h-32 rounded-full object-cover border-4 border-orange-500/30 shadow-2xl"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white mb-2">Built by Bryan</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Industry expert with deep understanding of premium hospitality and regulatory compliance. 
                    Dedicated to serving establishments that others reject.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Problem & Solution Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {/* Problem Section */}
            <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 hover:border-orange-500/30 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-red-400 transition-colors">
                The Problem We Solve
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Premium venues face a unique challenge: traditional SMS platforms categorize sophisticated 
                establishments as "high-risk" and refuse service. Generic solutions lack the regulatory 
                expertise needed for specialized industries.
              </p>
            </div>

            {/* Solution Section */}
            <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 hover:border-orange-500/30 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors">
                Our Solution
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {currentHub === "gnymble"
                  ? "Gnymble"
                  : currentHub === "percytech"
                    ? "PercyTech"
                    : currentHub === "percymd"
                      ? "PercyMD"
                      : currentHub === "percytext"
                        ? "PercyText"
                        : "Our platform"}{" "}
                exclusively serves establishments others reject, with deep expertise in premium hospitality. 
                We've built custom platforms that reflect the sophistication of your establishment while 
                ensuring complete regulatory compliance.
              </p>
            </div>
          </div>

          {/* Industry Focus Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Industry Focus
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                We specialize in serving premium establishments that demand excellence and regulatory expertise.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Building className="w-10 h-10 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-orange-400 transition-colors">
                  Cigar Lounges
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">Premium tobacco establishments with sophisticated clientele</p>
              </div>
              
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-10 h-10 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-orange-400 transition-colors">
                  Private Clubs
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">Exclusive membership-based establishments</p>
              </div>
              
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-10 h-10 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-orange-400 transition-colors">
                  Wine Bars
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">Sophisticated wine and spirits venues</p>
              </div>
              
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-10 h-10 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-orange-400 transition-colors">
                  Premium Hospitality
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">High-end entertainment and dining venues</p>
              </div>
            </div>
          </div>

          {/* Key Solutions Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Key Solutions
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Comprehensive tools designed specifically for premium establishments and their unique needs.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 hover:border-orange-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors">
                  VIP Management
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Comprehensive tools for managing VIP reservations, private events, and membership communications.
                </p>
              </div>
              
              <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 hover:border-orange-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors">
                  Compliance Monitoring
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Built-in regulatory expertise with ongoing compliance monitoring and legal oversight.
                </p>
              </div>
              
              <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 hover:border-orange-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors">
                  Concierge Integration
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Seamless integration with concierge services and automated customer engagement workflows.
                </p>
              </div>
            </div>
          </div>

          {/* Why Choose Section */}
          <div className="mb-20">
            <div className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 border border-orange-500/20 rounded-3xl p-12 backdrop-blur-sm">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Why Choose{" "}
                  {currentHub === "gnymble"
                    ? "Gnymble"
                    : currentHub === "percytech"
                      ? "PercyTech"
                      : currentHub === "percymd"
                        ? "PercyMD"
                        : currentHub === "percytext"
                          ? "PercyText"
                          : "Our Platform"}
                  ?
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  We're not just another SMS platform. We're the platform that understands premium venues.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center mr-4 mt-1">
                      <CheckCircle className="w-4 h-4 text-orange-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Industry Specialists</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Deep understanding of premium hospitality and regulatory requirements.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center mr-4 mt-1">
                      <CheckCircle className="w-4 h-4 text-orange-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Bespoke Platforms</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Custom solutions built for sophistication and regulatory compliance.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center mr-4 mt-1">
                      <CheckCircle className="w-4 h-4 text-orange-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Exclusive Focus</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Dedicated to serving establishments that others reject.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center mr-4 mt-1">
                      <CheckCircle className="w-4 h-4 text-orange-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Regulatory Mastery</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Ongoing compliance monitoring and legal expertise built-in.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center mr-4 mt-1">
                      <CheckCircle className="w-4 h-4 text-orange-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Custom Solutions</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Tailored platforms that others won't provide for your industry.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center mr-4 mt-1">
                      <CheckCircle className="w-4 h-4 text-orange-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Premium Support</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Dedicated assistance that matches your establishment's standards.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 border border-orange-500/20 rounded-3xl p-12 backdrop-blur-sm">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to experience the difference?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join the premium venues that trust us with their communication needs. 
                Let's discuss how we can elevate your establishment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.href = '/contact'}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25 flex items-center justify-center"
                >
                  Get Started Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <button
                  onClick={() => window.location.href = '/solutions'}
                  className="px-8 py-4 border-2 border-orange-500/50 text-orange-400 font-semibold rounded-xl hover:bg-orange-500/10 hover:border-orange-400 transition-all duration-300"
                >
                  Explore Solutions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default About;
