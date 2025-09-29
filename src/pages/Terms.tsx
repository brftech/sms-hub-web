import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@sms-hub/ui/marketing";

export default function Terms() {
  useEffect(() => {
    document.title = "Terms & Conditions - SMS Marketing Services";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Terms and conditions for SMS marketing and communication services. Understand your rights and responsibilities.');
    }
  }, []);

  return (
    <>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Terms & Conditions
              </h1>
              <p className="text-xl text-muted-foreground">
                Please read these terms carefully before using our SMS services
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    1. Acceptance of Terms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    By using our SMS marketing and communication services, you
                    agree to be bound by these Terms and Conditions. If you do
                    not agree to these terms, please do not use our services.
                  </p>
                  <p className="text-muted-foreground">
                    These terms apply to all users of our SMS services,
                    including customers who receive messages and businesses that
                    send them.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    2. SMS Service Description
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      What We Provide
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>SMS marketing and promotional messages</li>
                      <li>Order confirmations and shipping updates</li>
                      <li>Appointment reminders and notifications</li>
                      <li>Customer service communications</li>
                      <li>Opt-in/opt-out management</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Service Availability
                    </h3>
                    <p className="text-muted-foreground">
                      We strive to provide reliable service but cannot guarantee
                      100% uptime. Service may be temporarily unavailable due to
                      maintenance, technical issues, or circumstances beyond our
                      control.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    3. User Responsibilities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      For Message Recipients
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
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
                    <h3 className="text-lg font-semibold mb-2">
                      For Businesses Using Our Service
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
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

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    4. Consent and Opt-In Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                      Required for SMS Marketing
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-green-800 dark:text-green-200">
                      <li>Clear and conspicuous opt-in language</li>
                      <li>Written or electronic consent</li>
                      <li>Identification of the business sending messages</li>
                      <li>Description of message frequency and content</li>
                      <li>Instructions for opting out</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Valid Consent Methods
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Texting a keyword to a short code</li>
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

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    5. Opt-Out and Unsubscribe
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      How to Opt Out
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Reply STOP to any message</li>
                      <li>Reply UNSUBSCRIBE to any message</li>
                      <li>Contact us directly via email or phone</li>
                      <li>Use the unsubscribe link in any message</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Our Obligations
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Process opt-out requests within 24 hours</li>
                      <li>Send confirmation of opt-out</li>
                      <li>Remove phone numbers from marketing lists</li>
                      <li>Honor opt-out requests for at least 5 years</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">6. Prohibited Uses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    You may not use our SMS services for:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
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

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    7. Message Content Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Required Information
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Clear identification of the sender</li>
                      <li>Opt-out instructions (STOP, HELP)</li>
                      <li>Valid business contact information</li>
                      <li>Compliance with character limits</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Content Restrictions
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>No misleading or deceptive content</li>
                      <li>No adult content or inappropriate material</li>
                      <li>No content promoting illegal activities</li>
                      <li>No excessive use of special characters or symbols</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    8. Data and Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Your privacy is important to us. Our collection, use, and
                    protection of your personal information is governed by our
                    Privacy Policy, which is incorporated into these terms by
                    reference.
                  </p>
                  <p className="text-muted-foreground">
                    We implement appropriate security measures to protect your
                    data and comply with applicable privacy laws and
                    regulations.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    9. Limitation of Liability
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    To the maximum extent permitted by law, we shall not be
                    liable for any indirect, incidental, special, consequential,
                    or punitive damages, including but not limited to loss of
                    profits, data, or business opportunities.
                  </p>
                  <p className="text-muted-foreground">
                    Our total liability for any claims arising from these terms
                    or our services shall not exceed the amount paid by you for
                    our services in the 12 months preceding the claim.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    10. Indemnification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    You agree to indemnify and hold us harmless from any claims,
                    damages, or expenses arising from your use of our services,
                    violation of these terms, or infringement of any third-party
                    rights.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">11. Termination</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    We may terminate or suspend your access to our services at
                    any time, with or without notice, for any reason, including
                    violation of these terms.
                  </p>
                  <p className="text-muted-foreground">
                    You may terminate your use of our services at any time by
                    opting out of messages or contacting us directly.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    12. Changes to Terms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    We reserve the right to modify these terms at any time. We
                    will notify you of any material changes via email or SMS at
                    least 30 days before they take effect.
                  </p>
                  <p className="text-muted-foreground">
                    Your continued use of our services after changes become
                    effective constitutes acceptance of the new terms.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">13. Governing Law</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    These terms are governed by the laws of the State of
                    California, without regard to conflict of law principles.
                    Any disputes shall be resolved in the courts of San
                    Francisco County, California.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    14. Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    If you have questions about these terms, please contact us:
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Email</h3>
                      <p className="text-muted-foreground">legal@gnymble.com</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Phone</h3>
                      <p className="text-muted-foreground">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Address</h3>
                    <p className="text-muted-foreground">
                      Gnymble Legal Department
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
                By using our SMS services, you acknowledge that you have read,
                understood, and agree to be bound by these Terms and Conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
