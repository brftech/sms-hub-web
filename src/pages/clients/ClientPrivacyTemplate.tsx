import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@sms-hub/ui";
import { Link } from "react-router-dom";
import gnymbleIconLogo from "@sms-hub/ui/assets/gnymble-icon-logo.svg";

interface ClientPrivacyTemplateProps {
  clientName: string;
  clientDescription: string;
  clientLogo: string;
  clientIcon: React.ReactNode;
  phoneNumber: string;
  address: string;
  hours: string;
  businessType: string; // e.g., "cigar shop", "restaurant", "retail store"
  industryContext: string; // e.g., "cigars and tobacco products", "food and dining", "retail products"
  shortCode?: string; // Optional short code for texting
  website?: string; // Optional website URL
}

export default function ClientPrivacyTemplate({
  clientName,
  clientDescription,
  clientLogo,
  clientIcon,
  phoneNumber,
  address,
  hours,
  businessType,
  industryContext,
  shortCode,
  website,
}: ClientPrivacyTemplateProps) {
  return (
    <>
      {/* SEO handled by useEffect */}

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
                  to={`/clients/${clientName.toLowerCase().replace(/\s+/g, "-")}/privacy`}
                  className="text-orange-200 hover:text-orange-500 transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  to={`/clients/${clientName.toLowerCase().replace(/\s+/g, "-")}/terms`}
                  className="text-orange-200 hover:text-orange-500 transition-colors"
                >
                  Terms & Conditions
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-32 h-32 mx-auto mb-6 bg-orange-500 rounded-full flex items-center justify-center">
                {website ? (
                  <a
                    href={website}
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
              <h1 className="text-4xl font-bold text-white mb-4">
                Privacy Policy
              </h1>
              <p className="text-xl text-orange-200">
                Your privacy and data protection are our top priorities
              </p>
              <p className="text-sm text-orange-300 mt-2">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-8">
              <Card className="bg-gray-800 border-orange-500">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    1. Information We Collect
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-orange-200">
                      Personal Information
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-orange-100">
                      <li>
                        Phone numbers for SMS communication about{" "}
                        {industryContext}
                      </li>
                      <li>
                        Names and contact information for personalized service
                      </li>
                      <li>
                        Email addresses (when provided) for additional
                        communications
                      </li>
                      <li>
                        Communication preferences for {businessType} content
                      </li>
                      <li>Purchase history and preferences</li>
                      <li>Event attendance and preferences</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-orange-200">
                      Usage Information
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-orange-100">
                      <li>
                        SMS delivery and engagement metrics for promotions
                      </li>
                      <li>
                        Website interaction data on our products and services
                      </li>
                      <li>
                        Device and browser information for service optimization
                      </li>
                      <li>
                        IP addresses and location data for local notifications
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-orange-500">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    2. How We Use Your Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-orange-200">
                      Marketing & Communications
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-orange-100">
                      <li>
                        Send notifications about new products and special offers
                      </li>
                      <li>
                        Provide updates about exclusive events and promotions
                      </li>
                      <li>Send reminders about special deals and discounts</li>
                      <li>Share information about products and services</li>
                      <li>Notify about store events and recommendations</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-orange-200">
                      Service Improvement
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-orange-100">
                      <li>
                        Analyze communication effectiveness for promotions
                      </li>
                      <li>Improve our services and customer experience</li>
                      <li>Personalize recommendations and content</li>
                      <li>
                        Prevent fraud and ensure security of your information
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-orange-500">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    3. SMS Marketing Consent
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-orange-100">
                    We only send SMS messages about {industryContext} to
                    customers who have explicitly opted in to receive them. You
                    can opt in by:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-orange-100">
                    {shortCode && (
                      <li>Texting a keyword to our short code: {shortCode}</li>
                    )}
                    <li>Checking a box during in-store purchases</li>
                    <li>Providing verbal consent at our location</li>
                    <li>Completing a sign-up form for events</li>
                  </ul>

                  <div className="bg-orange-900 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-100 mb-2">
                      Your Rights
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-orange-200">
                      <li>Reply STOP to any message to opt out</li>
                      <li>Reply HELP for assistance with questions</li>
                      <li>
                        Contact us directly at {phoneNumber} to update
                        preferences
                      </li>
                      <li>Visit us at {address} to discuss your preferences</li>
                      <li>Request data deletion at any time</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-orange-500">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    4. Data Protection & Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-orange-200">
                      Security Measures
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-orange-100">
                      <li>End-to-end encryption for all communications</li>
                      <li>
                        Secure data storage with industry-standard protocols
                      </li>
                      <li>Regular security audits and updates</li>
                      <li>Access controls and authentication systems</li>
                      <li>Employee training on data protection and privacy</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-orange-200">
                      Data Retention
                    </h3>
                    <p className="text-orange-100">
                      We retain your personal information only as long as
                      necessary to provide our services and comply with legal
                      obligations. Typically, this means:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-orange-100 mt-2">
                      <li>
                        Active customer data: Until you opt out or request
                        deletion
                      </li>
                      <li>
                        Communication records: 3 years for compliance purposes
                      </li>
                      <li>Analytics data: 2 years in anonymized form</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-orange-500">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    5. Third-Party Services
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-orange-100">
                    We work with trusted third-party service providers to
                    deliver SMS messages and manage our communications. These
                    partners are bound by strict data protection agreements and
                    include:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-orange-100">
                    <li>SMS service providers (Twilio, Bandwidth, etc.)</li>
                    <li>Customer relationship management platforms</li>
                    <li>Analytics and reporting tools</li>
                    <li>Payment processing services</li>
                  </ul>

                  <p className="text-orange-100">
                    We never sell, rent, or share your personal information with
                    third parties for their marketing purposes without your
                    explicit consent.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-orange-500">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    6. Your Rights & Choices
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-orange-200">
                        Access & Control
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-orange-100">
                        <li>View your personal data</li>
                        <li>Update your information</li>
                        <li>Download your data</li>
                        <li>Delete your account</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-orange-200">
                        Communication Preferences
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-orange-100">
                        <li>Opt out of SMS messages</li>
                        <li>Choose message frequency</li>
                        <li>Select content preferences</li>
                        <li>Update contact methods</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-orange-500">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    7. Compliance & Regulations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-orange-100">
                    We comply with all applicable laws and regulations,
                    including:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-orange-100">
                    <li>TCPA (Telephone Consumer Protection Act)</li>
                    <li>CAN-SPAM Act</li>
                    <li>CCPA (California Consumer Privacy Act)</li>
                    <li>GDPR (General Data Protection Regulation)</li>
                    <li>State and local privacy laws</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-orange-500">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    8. Contact Us
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-orange-100">
                    If you have questions about this privacy policy or want to
                    exercise your rights, please contact us:
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2 text-orange-200">
                        Phone
                      </h3>
                      <p className="text-orange-100">{phoneNumber}</p>
                    </div>
                    {shortCode && (
                      <div>
                        <h3 className="font-semibold mb-2 text-orange-200">
                          Text Us
                        </h3>
                        <p className="text-orange-100">{shortCode}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-orange-200">
                      Visit Us
                    </h3>
                    <p className="text-orange-100">
                      {clientName}
                      <br />
                      {address}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-orange-200">
                      Hours
                    </h3>
                    <p className="text-orange-100">{hours}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <p className="text-sm text-orange-300">
                This privacy policy may be updated periodically. We will notify
                you of any significant changes via email or SMS.
              </p>
            </div>
          </div>
        </div>

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
                  to={`/clients/${clientName.toLowerCase().replace(/\s+/g, "-")}/privacy`}
                  className="text-orange-200 hover:text-orange-500 transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  to={`/clients/${clientName.toLowerCase().replace(/\s+/g, "-")}/terms`}
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
