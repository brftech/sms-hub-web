import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@sms-hub/ui";

export default function Privacy() {
  useEffect(() => {
    document.title = "Privacy Policy - SMS Marketing & Communication";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Privacy policy for SMS marketing and communication services. Learn how we protect your data and respect your privacy.');
    }
  }, []);

  return (
    <>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Privacy Policy
              </h1>
              <p className="text-xl text-muted-foreground">
                Your privacy and data protection are our top priorities
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    1. Information We Collect
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Personal Information
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Phone numbers for SMS communication</li>
                      <li>Names and contact information</li>
                      <li>Email addresses (when provided)</li>
                      <li>Communication preferences</li>
                      <li>Purchase history and preferences</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Usage Information
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>SMS delivery and engagement metrics</li>
                      <li>Website interaction data</li>
                      <li>Device and browser information</li>
                      <li>IP addresses and location data</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    2. How We Use Your Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      SMS Marketing
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Send promotional messages and offers</li>
                      <li>Provide order updates and shipping notifications</li>
                      <li>Send appointment reminders and confirmations</li>
                      <li>Share important business updates</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Service Improvement
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Analyze communication effectiveness</li>
                      <li>Improve our services and customer experience</li>
                      <li>Personalize content and offers</li>
                      <li>Prevent fraud and ensure security</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    3. SMS Marketing Consent
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    We only send SMS messages to customers who have explicitly
                    opted in to receive them. You can opt in by:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Texting a keyword to our short code</li>
                    <li>Checking a box during online checkout</li>
                    <li>Providing verbal consent in-store</li>
                    <li>Completing a sign-up form</li>
                  </ul>

                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Your Rights
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200">
                      <li>Reply STOP to any message to opt out</li>
                      <li>Reply HELP for assistance</li>
                      <li>Contact us directly to update preferences</li>
                      <li>Request data deletion at any time</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    4. Data Protection & Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Security Measures
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>End-to-end encryption for all communications</li>
                      <li>
                        Secure data storage with industry-standard protocols
                      </li>
                      <li>Regular security audits and updates</li>
                      <li>Access controls and authentication systems</li>
                      <li>Employee training on data protection</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Data Retention
                    </h3>
                    <p className="text-muted-foreground">
                      We retain your personal information only as long as
                      necessary to provide our services and comply with legal
                      obligations. Typically, this means:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-2">
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

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    5. Third-Party Services
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    We work with trusted third-party service providers to
                    deliver SMS messages and manage our communications. These
                    partners are bound by strict data protection agreements and
                    include:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>SMS service providers (Twilio, Bandwidth, etc.)</li>
                    <li>Customer relationship management platforms</li>
                    <li>Analytics and reporting tools</li>
                    <li>Payment processing services</li>
                  </ul>

                  <p className="text-muted-foreground">
                    We never sell, rent, or share your personal information with
                    third parties for their marketing purposes without your
                    explicit consent.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    6. Your Rights & Choices
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Access & Control
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>View your personal data</li>
                        <li>Update your information</li>
                        <li>Download your data</li>
                        <li>Delete your account</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Communication Preferences
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Opt out of SMS messages</li>
                        <li>Choose message frequency</li>
                        <li>Select content preferences</li>
                        <li>Update contact methods</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    7. Compliance & Regulations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    We comply with all applicable laws and regulations,
                    including:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>TCPA (Telephone Consumer Protection Act)</li>
                    <li>CAN-SPAM Act</li>
                    <li>CCPA (California Consumer Privacy Act)</li>
                    <li>GDPR (General Data Protection Regulation)</li>
                    <li>State and local privacy laws</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">8. Contact Us</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    If you have questions about this privacy policy or want to
                    exercise your rights, please contact us:
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Email</h3>
                      <p className="text-muted-foreground">
                        privacy@gnymble.com
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Phone</h3>
                      <p className="text-muted-foreground">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Address</h3>
                    <p className="text-muted-foreground">
                      Gnymble Privacy Officer
                      <br />
                      123 Business Street
                      <br />
                      San Francisco, CA 94105
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground">
                This privacy policy may be updated periodically. We will notify
                you of any significant changes via email or SMS.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
