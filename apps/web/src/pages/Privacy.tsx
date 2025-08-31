import { PageLayout, useHub } from "@sms-hub/ui";
import { getHubColorClasses } from "@sms-hub/utils";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Shield, Lock, Eye, FileText, Calendar, Phone, Mail, MapPin } from "lucide-react";

const Privacy = () => {
  const { currentHub } = useHub();
  const hubColors = getHubColorClasses(currentHub);

  return (
    <PageLayout
      showNavigation={true}
      showFooter={true}
      navigation={<Navigation />}
      footer={<Footer />}
    >
      <div className="min-h-screen bg-black pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-8">
              <Shield className="w-5 h-5 text-orange-400 mr-2" />
              <span className={`text-sm font-medium ${hubColors.text}`}>
                Your Privacy Matters
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              <span className="block">Privacy Policy</span>
              <span className={`${hubColors.text} bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent`}>
                Built on Trust
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              We believe transparency and security are the foundation of every great relationship. 
              Learn how we protect your information and maintain the highest standards of data privacy.
            </p>
            <div className="mt-8 text-sm text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>

          {/* Privacy Principles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 hover:border-orange-500/30 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Lock className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors">
                Secure by Design
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Enterprise-grade encryption and security measures protect your data at every level
              </p>
            </div>

            <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 hover:border-orange-500/30 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Eye className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors">
                Complete Transparency
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Clear visibility into how we collect, use, and protect your information
              </p>
            </div>

            <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 hover:border-orange-500/30 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors">
                Regulatory Compliance
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Built to meet and exceed industry standards including HIPAA and TCPA
              </p>
            </div>
          </div>

          {/* Privacy Content */}
          <div className="space-y-12">
            <section className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-3xl border border-gray-700/30 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Shield className="w-8 h-8 text-orange-400 mr-3" />
                Information We Collect
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                We collect information you provide directly to us, such as when you create an account, 
                use our services, or contact us for support. This includes:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Account information (name, email, phone number, company name)</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Payment information (processed securely through our payment providers)</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Communication data (messages sent through our platform)</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Usage information (how you interact with our services)</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Device and technical information (IP address, browser type, device identifiers)</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-3xl border border-gray-700/30 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Lock className="w-8 h-8 text-orange-400 mr-3" />
                How We Use Your Information
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                We use the information we collect to provide exceptional service and maintain the highest standards:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Provide, maintain, and improve our messaging services</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Process transactions and send billing-related communications</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Monitor compliance with regulatory requirements</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Provide customer support and respond to inquiries</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Send service-related announcements and updates</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Protect against fraud and unauthorized access</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-3xl border border-gray-700/30 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Shield className="w-8 h-8 text-orange-400 mr-3" />
                HIPAA Compliance
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                For healthcare communications through our Virtue platform, we maintain the highest HIPAA compliance standards:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Business associate agreements</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Encryption of protected health information</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Comprehensive audit trails</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Secure data handling procedures</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-3xl border border-gray-700/30 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Eye className="w-8 h-8 text-orange-400 mr-3" />
                Your Rights
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                You have complete control over your data and the right to:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Access and update your personal information</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Request deletion of your data</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Opt out of non-essential communications</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Request a copy of your data</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">File a complaint with relevant authorities</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-3xl border border-gray-700/30 p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Questions About Privacy?</h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                We're committed to transparency and are here to answer any questions about our data practices.
              </p>
              <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-center space-x-3 text-gray-300">
                  <Mail className="w-5 h-5 text-orange-400" />
                  <span>privacy@{currentHub === "gnymble" ? "gnymble" : currentHub === "percytech" ? "percytech" : currentHub === "percymd" ? "percymd" : currentHub === "percytext" ? "percytext" : "ourplatform"}.com</span>
                </div>
                <div className="flex items-center justify-center space-x-3 text-gray-300">
                  <Phone className="w-5 h-5 text-orange-400" />
                  <span>757-295-8725</span>
                </div>
                <div className="flex items-center justify-center space-x-3 text-gray-300">
                  <MapPin className="w-5 h-5 text-orange-400" />
                  <span>{currentHub === "gnymble" ? "Gnymble" : currentHub === "percytech" ? "PercyTech" : currentHub === "percymd" ? "PercyMD" : currentHub === "percytext" ? "PercyText" : "Our Platform"} Privacy Office</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Privacy;
