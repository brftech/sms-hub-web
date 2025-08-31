import { PageLayout } from "@sms-hub/ui";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const About = () => {
  return (
    <PageLayout
      showNavigation={true}
      showFooter={true}
      navigation={<Navigation />}
      footer={<Footer />}
    >
      <div className="min-h-screen bg-black py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About Gnymble
            </h1>

            {/* Profile Image */}
            <div className="flex justify-center mb-6">
              <img
                src="/lovable-uploads/3f02e35e-f9db-4cc0-9c10-f9c6aa64d8ef.png"
                alt="Bryan - Creator of Gnymble"
                className="w-32 h-32 rounded-full object-cover border-4 border-orange-500/50 shadow-2xl"
              />
            </div>

            <p className="text-xl text-orange-400 font-semibold">
              Built by Bryan
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-16">
            {/* Problem Section */}
            <section className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                The Problem We Solve
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Premium venues face a unique challenge: traditional SMS
                platforms categorize sophisticated establishments as "high-risk"
                and refuse service. Generic solutions lack the regulatory
                expertise needed for specialized industries.
              </p>
            </section>

            {/* Solution Section */}
            <section className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                Our Solution
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Gnymble exclusively serves establishments others reject, with
                deep expertise in premium hospitality. We've built custom
                platforms that reflect the sophistication of your establishment
                while ensuring complete regulatory compliance.
              </p>
            </section>

            {/* Industry Focus Section */}
            <section className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                Industry Focus
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                We specialize in serving premium establishments including:
              </p>
              <ul className="grid md:grid-cols-2 gap-3">
                <li className="flex items-center text-gray-300 text-lg">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                  Cigar lounges and whiskey bars
                </li>
                <li className="flex items-center text-gray-300 text-lg">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                  Private clubs and wine bars
                </li>
                <li className="flex items-center text-gray-300 text-lg">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                  Premium hospitality venues
                </li>
                <li className="flex items-center text-gray-300 text-lg">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                  Sophisticated entertainment establishments
                </li>
              </ul>
            </section>

            {/* Key Solutions Section */}
            <section className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                Key Solutions
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-300 text-lg">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                    VIP reservation management
                  </li>
                  <li className="flex items-center text-gray-300 text-lg">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                    Private event coordination
                  </li>
                  <li className="flex items-center text-gray-300 text-lg">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                    Membership communications
                  </li>
                </ul>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-300 text-lg">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                    Concierge service integration
                  </li>
                  <li className="flex items-center text-gray-300 text-lg">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                    Built-in compliance monitoring
                  </li>
                  <li className="flex items-center text-gray-300 text-lg">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                    Regulatory expertise and legal oversight
                  </li>
                </ul>
              </div>
            </section>

            {/* Why Choose Section */}
            <section className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                Why Choose Gnymble?
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-300 text-lg">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                    Industry specialists who understand your sector
                  </li>
                  <li className="flex items-center text-gray-300 text-lg">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                    Bespoke platforms built for sophistication
                  </li>
                  <li className="flex items-center text-gray-300 text-lg">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                    Regulatory mastery with ongoing compliance
                  </li>
                </ul>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-300 text-lg">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                    Exclusive focus on premium establishments
                  </li>
                  <li className="flex items-center text-gray-300 text-lg">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                    Custom solutions others won't provide
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default About;
