import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@sms-hub/ui/marketing";
import { Link } from "react-router-dom";
import { Phone, MapPin, Clock } from "lucide-react";
import gnymbleIconLogo from "@sms-hub/ui/assets/gnymble-icon-logo.svg";
import { handleDirectCheckout } from "../../utils/checkout";

interface ClientPageTemplateProps {
  clientName: string;
  clientDescription: string;
  clientLogo: string;
  clientIcon: React.ReactNode;
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
}

export default function ClientPageTemplate({
  clientName,
  clientDescription,
  clientLogo,
  clientIcon,
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
}: ClientPageTemplateProps) {
  useEffect(() => {
    document.title = `${clientName} SMS Marketing - Join Our Exclusive Community`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', `Join ${clientName}'s exclusive SMS community for updates, offers, and special events.`);
    }
  }, [clientName]);

  return (
    <>

      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <header className="bg-black border-b border-orange-500">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  to="/"
                  className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                >
                  <img
                    src={gnymbleIconLogo}
                    alt="Gnymble"
                    className="h-8 w-auto object-contain"
                  />
                  <span className="text-orange-500 font-bold text-lg">
                    Gnymble
                  </span>
                </Link>
                <div className="h-6 w-px bg-orange-500"></div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    {clientIcon}
                  </div>
                  <div>
                    <h1 className="text-white font-bold text-lg">
                      {clientName}
                    </h1>
                    <p className="text-orange-200 text-sm">
                      {clientDescription}
                    </p>
                  </div>
                </div>
              </div>
              <nav className="hidden md:flex space-x-6">
                <Link
                  to={privacyLink || "/privacy"}
                  className="text-orange-200 hover:text-orange-500 transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  to={termsLink || "/terms"}
                  className="text-orange-200 hover:text-orange-500 transition-colors"
                >
                  Terms & Conditions
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <div className="w-32 h-32 mx-auto mb-6 bg-orange-500 rounded-full flex items-center justify-center">
                  {clientWebsite ? (
                    <a
                      href={clientWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img
                        src={clientLogo}
                        alt={`${clientName} Logo`}
                        className="w-24 h-24 object-contain hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    </a>
                  ) : (
                    <img
                      src={clientLogo}
                      alt={`${clientName} Logo`}
                      className="w-24 h-24 object-contain"
                    />
                  )}
                </div>
                <h1 className="text-5xl font-bold text-white mb-6">
                  Join Our Exclusive SMS Community
                </h1>
                <p className="text-xl text-orange-200 mb-8">{ctaText}</p>
              </div>
              <div className="bg-orange-900 rounded-lg p-8 mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Get Started Today
                </h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                  <button
                    onClick={handleDirectCheckout}
                    className="bg-orange-500 hover:bg-orange-600 text-black font-bold py-3 px-8 rounded-lg transition-colors"
                  >
                    {ctaButtonText}
                  </button>
                  <div className="bg-white text-black px-4 py-2 rounded-lg font-mono">
                    {phoneNumber}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-center text-white mb-12">
                Why Join Our SMS Community?
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <Card key={index} className="bg-gray-800 border-orange-500">
                    <CardHeader>
                      <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-white text-center">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-orange-200 text-center">
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
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-center text-white mb-12">
                What You'll Get
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-orange-200">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Info Section */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-white mb-12">
                Visit Us Today
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center">
                  <Phone className="w-12 h-12 text-orange-500 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Text Us</h3>
                  <p className="text-orange-200">{phoneNumber}</p>
                </div>
                <div className="flex flex-col items-center">
                  <MapPin className="w-12 h-12 text-orange-500 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    Visit Us
                  </h3>
                  <p className="text-orange-200">{address}</p>
                </div>
                <div className="flex flex-col items-center">
                  <Clock className="w-12 h-12 text-orange-500 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Hours</h3>
                  <p className="text-orange-200">{hours}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black border-t border-orange-500 py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <Link
                  to="/"
                  className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                >
                  <img
                    src={gnymbleIconLogo}
                    alt="Gnymble"
                    className="h-8 w-auto object-contain"
                  />
                  <span className="text-orange-500 font-bold text-lg">
                    Gnymble
                  </span>
                </Link>
                <div className="h-6 w-px bg-orange-500"></div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    {clientIcon}
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{clientName}</h3>
                    <p className="text-orange-200 text-sm">
                      {clientDescription}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-6">
                <Link
                  to={privacyLink || "/privacy"}
                  className="text-orange-200 hover:text-orange-500 transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  to={termsLink || "/terms"}
                  className="text-orange-200 hover:text-orange-500 transition-colors"
                >
                  Terms & Conditions
                </Link>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-center">
              <p className="text-orange-200">
                © 2024 Gnymble. All rights reserved. | Powered by Gnymble SMS
                Marketing Platform
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
