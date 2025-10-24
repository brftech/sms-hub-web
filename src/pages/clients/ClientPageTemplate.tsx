import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@sms-hub/ui/marketing";
import { Link } from "react-router-dom";
import { Phone, MapPin, Clock, MessageCircle, ExternalLink } from "lucide-react";
import type { ClientColors } from "@sms-hub/clients";

interface ClientPageTemplateProps {
  clientId: string;
  clientName: string;
  clientDescription: string;
  clientLogo: string;
  clientIcon?: React.ReactNode; // Optional, kept for backwards compatibility
  phoneNumber: string;
  address: string;
  hours: string;
  features: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
  benefits: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
  ctaText: string;
  ctaButtonText: string;
  clientWebsite?: string;
  privacyLink?: string;
  termsLink?: string;
  colors?: ClientColors; // Optional custom color scheme
}

// Default colors (blue/purple theme)
const defaultColors: ClientColors = {
  primaryFrom: "#2563eb", // blue-600
  primaryTo: "#9333ea", // purple-600
  accentLight: "#60a5fa", // blue-400
  accentMedium: "#a855f7", // purple-400
  accentDark: "#ec4899", // pink-500
  bgFrom: "#111827", // gray-900
  bgVia: "#1f2937", // gray-800
  bgTo: "#111827", // gray-900
};

export default function ClientPageTemplate({
  clientId,
  clientName,
  clientDescription,
  clientLogo,
  clientIcon: _clientIcon, // Renamed to indicate intentionally unused
  phoneNumber,
  address,
  hours,
  features,
  benefits,
  ctaText,
  ctaButtonText,
  clientWebsite,
  privacyLink,
  termsLink,
  colors,
}: ClientPageTemplateProps) {
  // Use provided colors or fall back to defaults
  const theme = colors || defaultColors;

  useEffect(() => {
    document.title = `${clientName} - Join Our Exclusive SMS Community`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        `Join ${clientName}'s exclusive SMS community for special offers, events, and updates.`
      );
    }
  }, [clientName]);

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: `linear-gradient(to bottom right, ${theme.bgFrom}, ${theme.bgVia}, ${theme.bgTo})`,
      }}
    >
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Link
                to={`/clients/${clientId}`}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <img
                  src={clientLogo}
                  alt={`${clientName} Logo`}
                  className="h-10 w-10 object-contain rounded-lg bg-white/5 p-1"
                />
                <div>
                  <span className="text-white font-bold text-lg">{clientName}</span>
                  <p className="text-gray-400 text-sm">{clientDescription}</p>
                </div>
              </Link>
            </div>

            {/* Truly Centered Gnymble Branding - Absolute positioning */}
            <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <a
                href="https://gnymble.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 text-xs flex items-center gap-1.5 hover:text-orange-400 transition-colors group whitespace-nowrap"
              >
                <span>Powered by</span>
                <span className="font-semibold text-orange-400 group-hover:text-orange-300">
                  Gnymble
                </span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <nav className="hidden md:flex space-x-6">
              <Link
                to={privacyLink || "/privacy"}
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Privacy
              </Link>
              <Link
                to={termsLink || "/terms"}
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Terms
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo */}
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center p-6 shadow-2xl">
                {clientWebsite ? (
                  <a
                    href={clientWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full"
                  >
                    <img
                      src={clientLogo}
                      alt={`${clientName} Logo`}
                      className="w-full h-full object-contain hover:scale-105 transition-transform cursor-pointer"
                    />
                  </a>
                ) : (
                  <img
                    src={clientLogo}
                    alt={`${clientName} Logo`}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              {/* Headline */}
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Join Our Exclusive
                <br />
                <span
                  className="text-transparent bg-clip-text"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${theme.accentLight}, ${theme.accentMedium})`,
                  }}
                >
                  SMS Community
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                {ctaText}
              </p>
            </div>

            {/* CTA Box */}
            <div
              className="backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-white/10 shadow-2xl mb-12"
              style={{
                backgroundImage: `linear-gradient(to bottom right, ${theme.primaryFrom}33, ${theme.primaryTo}33)`,
              }}
            >
              <MessageCircle
                className="w-12 h-12 mx-auto mb-4"
                style={{ color: theme.accentLight }}
              />
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Get Started Today</h2>

              <div className="flex justify-center">
                <a
                  href={`sms:${phoneNumber}?&body=${encodeURIComponent(ctaButtonText.split(" ")[1] || "JOIN")}`}
                  className="text-white font-bold py-4 px-12 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${theme.primaryFrom}, ${theme.primaryTo})`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundImage = `linear-gradient(to right, ${theme.accentMedium}, ${theme.accentLight})`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundImage = `linear-gradient(to right, ${theme.primaryFrom}, ${theme.primaryTo})`;
                  }}
                >
                  {ctaButtonText}
                </a>
              </div>

              <p className="text-gray-400 text-sm mt-6">
                Standard messaging rates may apply. Reply STOP to unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-black/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
              Why Join Our SMS Community?
            </h2>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <CardHeader>
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10"
                      style={{
                        backgroundImage: `linear-gradient(to bottom right, ${theme.primaryFrom}33, ${theme.primaryTo}33)`,
                      }}
                    >
                      {feature.icon}
                    </div>
                    <CardTitle className="text-white text-center text-xl">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-center leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
              Member Benefits
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border border-white/20"
                    style={{
                      backgroundImage: `linear-gradient(to bottom right, ${theme.primaryFrom}4D, ${theme.primaryTo}4D)`,
                    }}
                  >
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 md:py-20 bg-black/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">Visit Us</h2>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              <div className="flex flex-col items-center bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10">
                <Phone className="w-12 h-12 mb-4" style={{ color: theme.accentLight }} />
                <h3 className="text-xl font-bold text-white mb-2">Contact</h3>
                <p className="text-gray-300">
                  {phoneNumber.length === 10
                    ? `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`
                    : phoneNumber}
                </p>
              </div>
              <div className="flex flex-col items-center bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10">
                <MapPin className="w-12 h-12 mb-4" style={{ color: theme.accentMedium }} />
                <h3 className="text-xl font-bold text-white mb-2">Location</h3>
                <p className="text-gray-300">{address}</p>
              </div>
              <div className="flex flex-col items-center bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10">
                <Clock className="w-12 h-12 mb-4" style={{ color: theme.accentDark }} />
                <h3 className="text-xl font-bold text-white mb-2">Hours</h3>
                <p className="text-gray-300">{hours}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-white/10 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <img
                src={clientLogo}
                alt={`${clientName} Logo`}
                className="h-8 w-8 object-contain rounded-lg bg-white/5 p-1"
              />
              <div className="text-center md:text-left">
                <h3 className="text-white font-bold">{clientName}</h3>
                <p className="text-gray-400 text-sm">{clientDescription}</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link
                to={privacyLink || "/privacy"}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to={termsLink || "/terms"}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms & Conditions
              </Link>
              {clientWebsite && (
                <a
                  href={clientWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  Visit Website
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 text-center space-y-3">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} {clientName}. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
              <span>Powered by</span>
              <a
                href="https://gnymble.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-orange-400 hover:text-orange-300 transition-colors inline-flex items-center gap-1"
              >
                Gnymble
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-gray-600">SMS Marketing Platform</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
