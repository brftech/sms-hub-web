import { PageLayout, SEO, useHub } from "@sms-hub/ui/marketing";
import { handleDirectCheckout } from "../utils/checkout";
import { getHubAboutContent, getHubMetadata } from "@sms-hub/hub-logic";

import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Shield, Users, CheckCircle, Star, ArrowRight, Target, Heart, Zap } from "lucide-react";
// Import Bryan's profile image from UI assets
import bryanProfileImage from "@sms-hub/ui/assets/bryan-profile.jpg";

const About = () => {
  const { currentHub } = useHub();
  const aboutContent = getHubAboutContent(currentHub);
  const hubMetadata = getHubMetadata(currentHub);

  // Map value descriptions to icons
  const valueIcons = [Shield, Users, Heart, Zap];

  return (
    <PageLayout
      showNavigation={true}
      showFooter={true}
      navigation={<Navigation />}
      footer={<Footer />}
    >
      <SEO
        title={`About ${hubMetadata.displayName} - ${aboutContent.subtitle}`}
        description={`${aboutContent.description} ${aboutContent.highlightText}`}
        keywords={`about ${hubMetadata.displayName}, SMS platform, business messaging`}
      />

      <div className="min-h-screen bg-black pt-20 pb-12 relative">
        {/* Subtle background elements */}
        <div className="absolute inset-0">
          <div
            className={`absolute top-0 left-1/4 w-96 h-96 bg-${hubMetadata.color}-500/5 rounded-full blur-3xl`}
          ></div>
          <div
            className={`absolute bottom-0 right-1/4 w-96 h-96 bg-${hubMetadata.color}-500/5 rounded-full blur-3xl`}
          ></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          {/* Hero Section - Hub-aware */}
          <div className="text-center mb-20">
            <div
              className={`inline-flex items-center px-4 py-2 rounded-full bg-${hubMetadata.color}-500/20 border border-${hubMetadata.color}-500/30 mb-8`}
            >
              <Target className={`w-4 h-4 text-${hubMetadata.color}-400 mr-2`} />
              <span className={`text-sm font-medium text-${hubMetadata.color}-400`}>
                {aboutContent.badge}
              </span>
            </div>

            <h1
              className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              {aboutContent.title}
              <span className="gradient-text block">{aboutContent.subtitle}</span>
            </h1>

            <p
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              {aboutContent.description}
              <span className={`text-${hubMetadata.color}-400`}> {aboutContent.highlightText}</span>
            </p>

            <div className="flex items-center justify-center space-x-8 text-gray-400 text-sm">
              {aboutContent.badges.map((badge, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className={`w-4 h-4 text-${hubMetadata.color}-500 mr-2`} />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Story Section */}
          <div className="mb-20">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-12">
              <div className="text-center mb-12">
                <h2
                  className="text-3xl md:text-4xl font-bold text-white mb-6"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  {aboutContent.storyTitle}
                </h2>
              </div>

              <div className="space-y-6">
                {aboutContent.storyParagraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-gray-300 leading-relaxed text-lg"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl font-bold text-white mb-6"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                {aboutContent.valuesTitle}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {aboutContent.values.map((value, index) => {
                const IconComponent = valueIcons[index] || Shield;
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 hover:border-gray-600/50 transition-all duration-300"
                  >
                    <div
                      className={`w-16 h-16 bg-${hubMetadata.color}-500/20 border border-${hubMetadata.color}-500/30 rounded-xl flex items-center justify-center mb-6`}
                    >
                      <IconComponent className={`w-8 h-8 text-${hubMetadata.color}-400`} />
                    </div>
                    <h3
                      className="text-2xl font-semibold text-white mb-4"
                      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                    >
                      {value.title}
                    </h3>
                    <p
                      className="text-gray-300 leading-relaxed text-lg"
                      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                    >
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Founder Section */}
          <div className="mb-20">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-12">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="relative flex-shrink-0">
                  <img
                    src={bryanProfileImage}
                    alt={aboutContent.founderSection.name}
                    className={`w-40 h-40 rounded-full object-cover border-4 border-${hubMetadata.color}-500/30 shadow-2xl`}
                  />
                  <div
                    className={`absolute -bottom-2 -right-2 w-10 h-10 bg-${hubMetadata.color}-500 rounded-full flex items-center justify-center`}
                  >
                    <Star className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="flex-1 text-center lg:text-left">
                  <h2
                    className="text-3xl md:text-4xl font-bold text-white mb-4"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    {aboutContent.founderSection.title}
                  </h2>
                  <p
                    className="text-gray-400 text-lg mb-6"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    {aboutContent.founderSection.subtitle}
                  </p>
                  <blockquote
                    className={`text-xl text-${hubMetadata.color}-400 italic mb-6 leading-relaxed`}
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    "{aboutContent.founderSection.quote}"
                  </blockquote>
                  <div>
                    <p
                      className="text-white font-bold text-lg"
                      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                    >
                      {aboutContent.founderSection.name}
                    </p>
                    <p
                      className="text-gray-400"
                      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                    >
                      {aboutContent.founderSection.role}
                    </p>
                  </div>
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
                {aboutContent.ctaTitle}
              </h2>
              <p
                className="text-gray-300 mb-10 max-w-2xl mx-auto text-lg leading-relaxed"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                {aboutContent.ctaDescription}
              </p>
              <button
                onClick={handleDirectCheckout}
                className={`px-10 py-4 bg-${hubMetadata.color}-600 text-white font-bold rounded-full hover:bg-${hubMetadata.color}-700 transition-all duration-300 text-lg tracking-wide uppercase flex items-center justify-center mx-auto group`}
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
