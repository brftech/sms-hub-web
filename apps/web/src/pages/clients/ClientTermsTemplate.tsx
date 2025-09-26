import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@sms-hub/ui";
import { Link } from "react-router-dom";
import gnymbleIconLogo from "@sms-hub/ui/assets/gnymble-icon-logo.svg";

interface ClientTermsTemplateProps {
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

export default function ClientTermsTemplate({
  clientName,
  clientDescription,
  clientLogo,
  clientIcon,
  phoneNumber,
  address,
  hours,
  businessType, // eslint-disable-line @typescript-eslint/no-unused-vars
  industryContext,
  shortCode,
  website,
}: ClientTermsTemplateProps) {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions - {clientName} SMS Services</title>
        <meta
          name="description"
          content={`Terms and conditions for ${clientName} SMS marketing and communication services. Understand your rights and responsibilities.`}
        />
      </Helmet>

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
                Terms & Conditions
              </h1>
              <p className="text-xl text-orange-200">
                Please read these terms carefully before using our SMS services
              </p>
              <p className="text-sm text-orange-300 mt-2">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-8">
              <Card className="bg-gray-800 border-orange-500">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    1. Acceptance of Terms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-orange-100">
                    By using our SMS marketing and communication services, you
                    agree to be bound by these Terms and Conditions. If you do
                    not agree to these terms, please do not use our services.
                  </p>
                  <p className="text-orange-100">
                    These terms apply to all users of our SMS services,
                    including customers who receive messages about{" "}
                    {industryContext}
                    and businesses that send them.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-orange-500">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    2. SMS Service Description
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-orange-200">
                      What We Provide
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-orange-100">
                      <li>
                        SMS marketing and promotional messages about{" "}
                        {industryContext}
                      </li>
                      <li>Order confirmations and shipping updates</li>
                      <li>Appointment reminders and notifications</li>
                      <li>Customer service communications</li>
                      <li>Opt-in/opt-out management</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-orange-200">
                      Service Availability
                    </h3>
                    <p className="text-orange-100">
                      We strive to provide reliable service but cannot guarantee
                      100% uptime. Service may be temporarily unavailable due to
                      maintenance, technical issues, or circumstances beyond our
                      control.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-orange-500">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    3. User Responsibilities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-orange-200">
                      For Message Recipients
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-orange-100">
                      <li>Provide accurate contact information</li>
                      <li>Keep your contact details up to date</li>
                      <li>
                        Use opt-out methods if you no longer wish to receive
                        messages
                      </li>
                      <li>Report any unauthorized use of your phone number</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-orange-200">
                      For Businesses Using Our Service
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-orange-100">
                      <li>
                        Obtain proper consent before sending marketing messages
                      </li>
                      <li>Comply with all applicable laws and regulations</li>
                      <li>Respect opt-out requests immediately</li>
                      <li>Maintain accurate records of consent</li>
                      <li>
                        Use our service only for legitimate business purposes
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-orange-500">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    4. Consent and Opt-In Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-green-900 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-100 mb-2">
                      Required for SMS Marketing
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-green-200">
                      <li>Clear and conspicuous opt-in language</li>
                      <li>Written or electronic consent</li>
                      <li>Identification of the business sending messages</li>
                      <li>Description of message frequency and content</li>
                      <li>Instructions for opting out</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-orange-200">
                      Valid Consent Methods
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-orange-100">
                      {shortCode && <li>Texting a keyword to {shortCode}</li>}
                      <li>Checking a box during online checkout</li>
                      <li>Completing a sign-up form</li>
                      <li>
                        Providing verbal consent in-store (with documentation)
                      </li>
                      <li>Online opt-in forms with clear disclosure</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-orange-500">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    5. Opt-Out and Unsubscribe
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-orange-200">
                      How to Opt Out
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-orange-100">
                      <li>Reply STOP to any message</li>
                      <li>Reply UNSUBSCRIBE to any message</li>
                      <li>Contact us directly via email or phone</li>
                      <li>Use the unsubscribe link in any message</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-orange-200">
                      Our Obligations
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-orange-100">
                      <li>Process opt-out requests within 24 hours</li>
                      <li>Send confirmation of opt-out</li>
                      <li>Remove phone numbers from marketing lists</li>
                      <li>Honor opt-out requests for at least 5 years</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-orange-500">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    6. Prohibited Uses
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-orange-100">
                    You may not use our SMS services for:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-orange-100">
                    <li>Spam or unsolicited commercial messages</li>
                    <li>Harassment, threats, or abusive content</li>
                    <li>Illegal activities or content</li>
                    <li>Phishing or fraudulent schemes</li>
                    <li>Violation of any applicable laws or regulations</li>
                    <li>Impersonation of other individuals or businesses</li>
                    <li>Distribution of malware or harmful content</li>
                    <li>Messages to numbers without proper consent</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-orange-500">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    7. Message Content Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-orange-200">
                      Required Information
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-orange-100">
                      <li>Clear identification of the sender</li>
                      <li>Opt-out instructions (STOP, HELP)</li>
                      <li>Valid business contact information</li>
                      <li>Compliance with character limits</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-orange-200">
                      Content Restrictions
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-orange-100">
                      <li>No misleading or deceptive content</li>
                      <li>No adult content or inappropriate material</li>
                      <li>No content promoting illegal activities</li>
                      <li>No excessive use of special characters or symbols</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-orange-500">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    8. Data and Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-orange-100">
                    Your privacy is important to us. Our collection, use, and
                    protection of your personal information is governed by our
                    Privacy Policy, which is incorporated into these terms by
                    reference.
                  </p>
                  <p className="text-orange-100">
                    We implement appropriate security measures to protect your
                    data and comply with applicable privacy laws and
                    regulations.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-orange-500">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    9. Limitation of Liability
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-orange-100">
                    To the maximum extent permitted by law, we shall not be
                    liable for any indirect, incidental, special, consequential,
                    or punitive damages, including but not limited to loss of
                    profits, data, or business opportunities.
                  </p>
                  <p className="text-orange-100">
                    Our total liability for any claims arising from these terms
                    or our services shall not exceed the amount paid by you for
                    our services in the 12 months preceding the claim.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-orange-500">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    10. Indemnification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-orange-100">
                    You agree to indemnify and hold us harmless from any claims,
                    damages, or expenses arising from your use of our services,
                    violation of these terms, or infringement of any third-party
                    rights.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-orange-500">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    11. Termination
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-orange-100">
                    We may terminate or suspend your access to our services at
                    any time, with or without notice, for any reason, including
                    violation of these terms.
                  </p>
                  <p className="text-orange-100">
                    You may terminate your use of our services at any time by
                    opting out of messages or contacting us directly.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-orange-500">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    12. Changes to Terms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-orange-100">
                    We reserve the right to modify these terms at any time. We
                    will notify you of any material changes via email or SMS at
                    least 30 days before they take effect.
                  </p>
                  <p className="text-orange-100">
                    Your continued use of our services after changes become
                    effective constitutes acceptance of the new terms.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-orange-500">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    13. Governing Law
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-orange-100">
                    These terms are governed by the laws of the State of
                    California, without regard to conflict of law principles.
                    Any disputes shall be resolved in the courts of San
                    Francisco County, California.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-orange-500">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    14. Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-orange-100">
                    If you have questions about these terms, please contact us:
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
                By using our SMS services, you acknowledge that you have read,
                understood, and agree to be bound by these Terms and Conditions.
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
