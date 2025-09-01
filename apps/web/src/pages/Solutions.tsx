import { PageLayout, useHub } from "@sms-hub/ui";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { getHubColorClasses } from "@sms-hub/utils";
import { Shield, MessageSquare, Zap, Users, CheckCircle } from "lucide-react";

const Solutions = () => {
  const { currentHub } = useHub();
  const hubColors = getHubColorClasses(currentHub);

  const solutions = [
    {
      icon: Shield,
      title: "Regulatory Compliance",
      description: "Built-in compliance features that meet industry standards and regulatory requirements for premium venues.",
      features: ["HIPAA-compliant messaging", "Audit trails", "Secure data handling"]
    },
    {
      icon: MessageSquare,
      title: "Premium SMS Platform",
      description: "High-quality SMS delivery with advanced features designed specifically for sophisticated establishments.",
      features: ["99.9% delivery rate", "Advanced analytics", "Custom branding"]
    },
    {
      icon: Users,
      title: "Venue Management",
      description: "Comprehensive tools to manage customer relationships and communication across multiple venues.",
      features: ["Multi-location support", "Customer segmentation", "Automated workflows"]
    },
    {
      icon: Zap,
      title: "Automated Campaigns",
      description: "Smart automation that engages customers at the right time with personalized messaging.",
      features: ["Behavioral triggers", "A/B testing", "Performance optimization"]
    }
  ];

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
              <span className={`text-sm font-medium ${hubColors.text}`}>
                Premium SMS Solutions
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              <span className="block">Solutions that</span>
                  <span className={`${hubColors.text} bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent`}>
                    elevate your venue
                  </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Premium venues deserve premium solutions. We provide the regulatory expertise, 
              technical excellence, and personalized service that sophisticated establishments require.
            </p>
          </div>

          {/* Solutions Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {solutions.map((solution, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 hover:border-orange-500/30 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <solution.icon className={`w-8 h-8 ${hubColors.text}`} />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors">
                  {solution.title}
                </h3>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {solution.description}
                </p>
                
                <ul className="space-y-2">
                  {solution.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-400">
                      <CheckCircle className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 border border-orange-500/20 rounded-3xl p-12 backdrop-blur-sm">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to elevate your venue?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join the premium venues that trust us with their communication needs. 
                Let's discuss how we can transform your customer engagement.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.href = '/contact'}
                  className={`px-8 py-4 bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25`}
                >
                  Get Started Today
                </button>
                <button
                  onClick={() => window.location.href = '/pricing'}
                  className="px-8 py-4 border-2 border-orange-500/50 text-orange-400 font-semibold rounded-xl hover:bg-orange-500/10 hover:border-orange-400 transition-all duration-300"
                >
                  View Pricing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Solutions;
