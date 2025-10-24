import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@sms-hub/ui/marketing";
import { Link } from "react-router-dom";
import { ExternalLink, Shield } from "lucide-react";
import type { ClientColors } from "@sms-hub/clients";

interface ClientPrivacyTemplateProps {
  clientId: string;
  clientName: string;
  clientDescription: string;
  clientLogo: string;
  clientIcon?: React.ReactNode;
  phoneNumber: string;
  address: string;
  hours: string;
  businessType: string;
  industryContext: string;
  shortCode?: string;
  clientWebsite?: string;
  colors?: ClientColors;
}

// Default colors (blue/purple theme)
const defaultColors: ClientColors = {
  primaryFrom: "#2563eb",
  primaryTo: "#9333ea",
  accentLight: "#60a5fa",
  accentMedium: "#a855f7",
  accentDark: "#ec4899",
  bgFrom: "#111827",
  bgVia: "#1f2937",
  bgTo: "#111827",
};

export default function ClientPrivacyTemplate({
  clientId,
  clientName,
  clientDescription,
  clientLogo,
  clientIcon: _clientIcon,
  phoneNumber,
  address,
  hours,
  businessType,
  industryContext,
  shortCode,
  clientWebsite,
  colors,
}: ClientPrivacyTemplateProps) {
  const theme = colors || defaultColors;
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    document.title = `${clientName} - Privacy Policy`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        `Privacy policy for ${clientName} SMS marketing services.`
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
                to={`/clients/${clientName.toLowerCase().replace(/\s+/g, "")}`}
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Home
              </Link>
              <Link
                to={`/clients/${clientName.toLowerCase().replace(/\s+/g, "")}/terms`}
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Terms
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  backgroundImage: `linear-gradient(to bottom right, ${theme.primaryFrom}33, ${theme.primaryTo}33)`,
                }}
              >
                <Shield className="w-8 h-8" style={{ color: theme.accentLight }} />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-gray-300 text-lg">{clientName} SMS Marketing Services</p>
            <p className="text-gray-400 text-sm mt-2">Last Updated: {today}</p>
          </div>

          {/* Privacy Content */}
          <div className="space-y-6">
            {/* Section 1 */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-2xl">1. Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>
                  This Privacy Policy describes how {clientName} ({businessType}) collects, uses,
                  and protects your personal information when you participate in our SMS marketing
                  program. By opting into our SMS communications, you acknowledge and agree to this
                  Privacy Policy.
                </p>
              </CardContent>
            </Card>

            {/* Section 2 */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-2xl">2. Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>When you opt into our SMS program, we collect:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Mobile Phone Number:</strong> Required for sending SMS messages
                  </li>
                  <li>
                    <strong>Opt-in Confirmation:</strong> Records of your consent to receive
                    messages
                  </li>
                  <li>
                    <strong>Message History:</strong> Records of messages sent and received
                  </li>
                  <li>
                    <strong>Engagement Data:</strong> Information about which messages you interact
                    with
                  </li>
                  <li>
                    <strong>Opt-out Requests:</strong> Records of unsubscribe requests
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 3 */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-2xl">
                  3. How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>We use your information to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Send you promotional SMS messages about {industryContext}</li>
                  <li>Notify you about special offers, events, and updates</li>
                  <li>Respond to your inquiries and feedback</li>
                  <li>Improve our SMS marketing program and services</li>
                  <li>Comply with legal obligations and enforce our Terms and Conditions</li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 4 */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-2xl">4. Message Frequency & Costs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>
                  Message frequency varies depending on your preferences and our promotional
                  activities. You may receive up to 10 messages per month. Standard messaging and
                  data rates may apply as determined by your mobile carrier. Check with your carrier
                  for details on your specific plan.
                </p>
              </CardContent>
            </Card>

            {/* Section 5 */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-2xl">
                  5. Data Sharing & Third Parties
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>
                  We do not sell, rent, or share your personal information with third parties for
                  their marketing purposes. We may share your information with:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>SMS Service Providers:</strong> To deliver messages to your mobile
                    device
                  </li>
                  <li>
                    <strong>Analytics Partners:</strong> To understand program effectiveness
                    (anonymized data only)
                  </li>
                  <li>
                    <strong>Legal Authorities:</strong> When required by law or to protect our
                    rights
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 6 */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-2xl">6. Data Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>
                  We implement reasonable security measures to protect your personal information
                  from unauthorized access, disclosure, alteration, or destruction. However, no
                  method of transmission over the internet or electronic storage is 100% secure.
                  While we strive to protect your information, we cannot guarantee absolute
                  security.
                </p>
              </CardContent>
            </Card>

            {/* Section 7 */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-2xl">7. Your Rights & Choices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Opt-out:</strong> Reply STOP to any message to unsubscribe at any time
                  </li>
                  <li>
                    <strong>Get Help:</strong> Reply HELP for assistance or contact information
                  </li>
                  <li>
                    <strong>Access Your Data:</strong> Request a copy of the information we have
                    about you
                  </li>
                  <li>
                    <strong>Correct Your Data:</strong> Request corrections to inaccurate
                    information
                  </li>
                  <li>
                    <strong>Delete Your Data:</strong> Request deletion of your personal information
                  </li>
                </ul>
                <p className="mt-4">
                  To exercise these rights, please contact us using the information provided below.
                </p>
              </CardContent>
            </Card>

            {/* Section 8 - Contact */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-2xl">8. Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>
                  If you have questions about this Privacy Policy or want to exercise your rights,
                  please contact us:
                </p>
                <div className="bg-white/5 rounded-lg p-6 space-y-4 mt-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-white">{clientName}</h3>
                    <p>{address}</p>
                  </div>
                  {shortCode && (
                    <div>
                      <h3 className="font-semibold mb-2 text-white">Text Us</h3>
                      <p>{shortCode}</p>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold mb-2 text-white">Phone</h3>
                    <p>
                      {phoneNumber.length === 10
                        ? `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`
                        : phoneNumber}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-white">Hours</h3>
                    <p>{hours}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 9 */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-2xl">9. Changes to This Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any
                  material changes by sending a message to your mobile number or by posting a notice
                  on our website. Your continued participation in our SMS program after such
                  notification constitutes acceptance of the updated policy.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Footer Note */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-400">
              By opting in to our SMS program, you acknowledge that you have read, understood, and
              agree to this Privacy Policy.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-white/10 py-8 mt-12">
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
                to={`/clients/${clientName.toLowerCase().replace(/\s+/g, "")}`}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                to={`/clients/${clientName.toLowerCase().replace(/\s+/g, "")}/terms`}
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

          <div className="mt-6 pt-6 border-t border-white/10 text-center space-y-3">
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
