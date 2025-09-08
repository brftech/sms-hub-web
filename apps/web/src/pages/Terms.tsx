import { PageLayout, useHub, SEO } from "@sms-hub/ui";
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

  return (
    <PageLayout
      showNavigation={true}
      showFooter={true}
      navigation={<Navigation />}
      footer={<Footer />}
    >
      <SEO
        title="Terms of Service - Clear & Fair Terms"
        description="Transparent, fair terms that protect both our users and our commitment to providing exceptional SMS messaging services for regulated businesses."
        keywords="terms of service, SMS terms, business texting terms, compliance terms, regulated business SMS"
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
              <FileText className="w-4 h-4 text-orange-400 mr-2" />
              <span className="text-sm font-medium text-orange-400">
                TERMS OF SERVICE
              </span>
            </div>
            <h1
              className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              Terms of Service
              <span className="gradient-text block">Clear & Fair</span>
            </h1>
            <p
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              We believe in transparent, fair terms that protect both our users
              and our commitment to providing exceptional SMS messaging
              services.
            </p>
            <div
              className="mt-8 text-sm text-gray-400"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>

          {/* Key Principles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 hover:border-orange-500/30 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-orange-400" />
              </div>
              <h3
                className="text-lg font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Regulatory Excellence
              </h3>
              <p
                className="text-gray-400 text-sm leading-relaxed"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Built to exceed TCPA, HIPAA, and industry compliance standards
              </p>
            </div>

            <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 hover:border-orange-500/30 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-8 h-8 text-orange-400" />
              </div>
              <h3
                className="text-lg font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Clear Expectations
              </h3>
              <p
                className="text-gray-400 text-sm leading-relaxed"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Transparent terms that protect your business and our partnership
              </p>
            </div>

            <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 hover:border-orange-500/30 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Scale className="w-8 h-8 text-orange-400" />
              </div>
              <h3
                className="text-lg font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Fair & Balanced
              </h3>
              <p
                className="text-gray-400 text-sm leading-relaxed"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Terms designed to benefit both parties and ensure long-term
                success
              </p>
            </div>
          </div>

          {/* Terms Content */}
          <div className="space-y-12">
            <section className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-3xl border border-gray-700/30 p-8">
              <h2
                className="text-3xl font-bold text-white mb-6 flex items-center"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                <FileText className="w-8 h-8 text-orange-400 mr-3" />
                Acceptance of Terms
              </h2>
              <p
                className="text-lg text-gray-300 leading-relaxed"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
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
              <h2
                className="text-3xl font-bold text-white mb-6"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Questions About Terms?
              </h2>
              <p
                className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
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
