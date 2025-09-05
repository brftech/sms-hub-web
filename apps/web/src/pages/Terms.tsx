import { PageLayout, useHub } from "@sms-hub/ui";
import { getHubColorClasses } from "@sms-hub/utils";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import {
  FileText,
  Shield,
  CheckCircle,
  AlertTriangle,
  Phone,
  Mail,
  Scale,
} from "lucide-react";

const Terms = () => {
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
        {/* Background */}
        <div className="absolute inset-0 bg-black"></div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-8">
              <FileText className="w-5 h-5 text-orange-400 mr-2" />
              <span className={`text-sm font-medium ${hubColors.text}`}>
                Terms of Service
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              <span className="block">Terms of Service</span>
              <span
                className={`${hubColors.text} bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent`}
              >
                Clear & Fair
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              We believe in transparent, fair terms that protect both our users
              and our commitment to providing exceptional SMS messaging
              services.
            </p>
            <div className="mt-8 text-sm text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>

          {/* Key Principles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 hover:border-orange-500/30 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors">
                Regulatory Excellence
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Built to exceed TCPA, HIPAA, and industry compliance standards
              </p>
            </div>

            <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 hover:border-orange-500/30 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors">
                Clear Expectations
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Transparent terms that protect your business and our partnership
              </p>
            </div>

            <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 hover:border-orange-500/30 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Scale className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors">
                Fair & Balanced
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Terms designed to benefit both parties and ensure long-term
                success
              </p>
            </div>
          </div>

          {/* Terms Content */}
          <div className="space-y-12">
            <section className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-3xl border border-gray-700/30 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <FileText className="w-8 h-8 text-orange-400 mr-3" />
                Acceptance of Terms
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                By accessing and using{" "}
                {currentHub === "gnymble"
                  ? "Gnymble"
                  : currentHub === "percytech"
                    ? "PercyTech"
                    : currentHub === "percymd"
                      ? "PercyMD"
                      : currentHub === "percytext"
                        ? "PercyText"
                        : "our platform"}
                's services, you accept and agree to be bound by the terms and
                provision of this agreement. If you do not agree to abide by the
                above, please do not use this service.
              </p>
            </section>

            <section className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-3xl border border-gray-700/30 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Shield className="w-8 h-8 text-orange-400 mr-3" />
                Service Description
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                {currentHub === "gnymble"
                  ? "Gnymble"
                  : currentHub === "percytech"
                    ? "PercyTech"
                    : currentHub === "percymd"
                      ? "PercyMD"
                      : currentHub === "percytext"
                        ? "PercyText"
                        : "Our platform"}{" "}
                provides compliant SMS messaging services for businesses, with
                specialized platforms for healthcare (Virtue) and premium retail
                (Vice) communications.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">
                      Regulatory compliance monitoring
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">
                      Message delivery optimization
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">
                      Customer engagement tools
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">
                      Analytics and reporting
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-3xl border border-gray-700/30 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <CheckCircle className="w-8 h-8 text-orange-400 mr-3" />
                User Responsibilities
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Users are responsible for maintaining the highest standards of
                business conduct:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">
                      Providing accurate account information
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">
                      Maintaining account security
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">
                      Complying with all applicable laws
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">
                      Ensuring proper consent for recipients
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">
                      Using service for lawful purposes only
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-3xl border border-gray-700/30 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Shield className="w-8 h-8 text-orange-400 mr-3" />
                Compliance & Regulations
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                While{" "}
                {currentHub === "gnymble"
                  ? "Gnymble"
                  : currentHub === "percytech"
                    ? "PercyTech"
                    : currentHub === "percymd"
                      ? "PercyMD"
                      : currentHub === "percytext"
                        ? "PercyText"
                        : "our platform"}{" "}
                provides comprehensive compliance monitoring tools, users remain
                ultimately responsible for ensuring their communications comply
                with TCPA, HIPAA, and other applicable regulations.
              </p>
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-2">
                      Important Note
                    </h4>
                    <p className="text-gray-300 text-sm">
                      Our platform assists with compliance but does not
                      guarantee legal compliance. We recommend consulting with
                      legal counsel for your specific use case.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-3xl border border-gray-700/30 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <CheckCircle className="w-8 h-8 text-orange-400 mr-3" />
                Payment Terms
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                We believe in fair, transparent pricing with no hidden fees:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">
                      Monthly billing in advance
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">
                      No setup or hidden fees
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">
                      Clear pricing structure
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">
                      30-day notice for changes
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-3xl border border-gray-700/30 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <AlertTriangle className="w-8 h-8 text-orange-400 mr-3" />
                Limitation of Liability
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                {currentHub === "gnymble"
                  ? "Gnymble"
                  : currentHub === "percytech"
                    ? "PercyTech"
                    : currentHub === "percymd"
                      ? "PercyMD"
                      : currentHub === "percytext"
                        ? "PercyText"
                        : "Our platform"}{" "}
                shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages, including without
                limitation, loss of profits, data, use, goodwill, or other
                intangible losses, resulting from your use of the service.
              </p>
            </section>

            <section className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-3xl border border-gray-700/30 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <CheckCircle className="w-8 h-8 text-orange-400 mr-3" />
                Termination
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                Either party may terminate this agreement at any time with 30
                days written notice.{" "}
                {currentHub === "gnymble"
                  ? "Gnymble"
                  : currentHub === "percytech"
                    ? "PercyTech"
                    : currentHub === "percymd"
                      ? "PercyMD"
                      : currentHub === "percytext"
                        ? "PercyText"
                        : "Our platform"}{" "}
                reserves the right to suspend or terminate accounts that violate
                these terms or engage in fraudulent or illegal activities.
              </p>
            </section>

            {/* Contact Section */}
            <section className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-3xl border border-gray-700/30 p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-6">
                Questions About Terms?
              </h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                We're here to clarify any questions about our terms of service
                and ensure you have a complete understanding.
              </p>
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-center space-x-3 text-gray-300">
                  <Mail className="w-5 h-5 text-orange-400" />
                  <span>
                    legal@
                    {currentHub === "gnymble"
                      ? "gnymble"
                      : currentHub === "percytech"
                        ? "percytech"
                        : currentHub === "percymd"
                          ? "percymd"
                          : currentHub === "percytext"
                            ? "percytext"
                            : "ourplatform"}
                    .com
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-3 text-gray-300">
                  <Phone className="w-5 h-5 text-orange-400" />
                  <span>757-295-8725</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Terms;
