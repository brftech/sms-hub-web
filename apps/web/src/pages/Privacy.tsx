import { PageLayout, useHub } from "@sms-hub/ui";
import { getHubColorClasses } from "@sms-hub/utils";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const Privacy = () => {
  const { currentHub } = useHub();
  const hubColors = getHubColorClasses(currentHub);

  return (
    <PageLayout
      showNavigation={true}
      showFooter={true}
      navigation={<Navigation />}
      footer={<Footer />}
    >
      <div className="min-h-screen bg-black p-8 relative">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and
            protect your information.
          </p>
        </div>

        {/* Privacy Content Card */}
        <div className="flex justify-center pt-4">
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 shadow-2xl max-w-md w-full max-h-[500px] overflow-y-auto scrollbar-thin ${hubColors.scrollbar}/50 scrollbar-track-gray-800/50">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-white">Privacy Policy</h2>
                <p className="text-gray-400 text-sm">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>

              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-bold ${hubColors.text} mb-2">
                    1. Information We Collect
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-2">
                    We collect information you provide directly to us, such as
                    when you create an account, use our services, or contact us
                    for support. This includes:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 text-sm space-y-1 ml-2">
                    <li>
                      Account information (name, email, phone number, company
                      name)
                    </li>
                    <li>
                      Payment information (processed securely through our
                      payment providers)
                    </li>
                    <li>
                      Communication data (messages sent through our platform)
                    </li>
                    <li>
                      Usage information (how you interact with our services)
                    </li>
                    <li>
                      Device and technical information (IP address, browser
                      type, device identifiers)
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-bold ${hubColors.text} mb-2">
                    2. How We Use Your Information
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-2">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 text-sm space-y-1 ml-2">
                    <li>
                      Provide, maintain, and improve our messaging services
                    </li>
                    <li>
                      Process transactions and send billing-related
                      communications
                    </li>
                    <li>Monitor compliance with regulatory requirements</li>
                    <li>Provide customer support and respond to inquiries</li>
                    <li>Send service-related announcements and updates</li>
                    <li>Protect against fraud and unauthorized access</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-bold ${hubColors.text} mb-2">
                    3. Information Sharing
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-2">
                    We do not sell, trade, or rent your personal information. We
                    may share your information only in the following
                    circumstances:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 text-sm space-y-1 ml-2">
                    <li>With your explicit consent</li>
                    <li>To comply with legal obligations or court orders</li>
                    <li>
                      To protect our rights, property, or safety, or that of our
                      users
                    </li>
                    <li>
                      In connection with a business transfer or acquisition
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-bold ${hubColors.text} mb-2">
                    4. Data Security
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    We implement appropriate technical and organizational
                    security measures to protect your personal information
                    against unauthorized access, alteration, disclosure, or
                    destruction. This includes encryption, secure data
                    transmission, and regular security assessments.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-bold ${hubColors.text} mb-2">
                    5. HIPAA Compliance
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    For healthcare communications through our Virtue platform,
                    we maintain HIPAA compliance standards including business
                    associate agreements, encryption of protected health
                    information, audit trails, and secure data handling
                    procedures.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-bold ${hubColors.text} mb-2">
                    6. Data Retention
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    We retain your personal information for as long as necessary
                    to provide our services, comply with legal obligations,
                    resolve disputes, and enforce our agreements. Message data
                    is retained according to regulatory requirements and
                    customer preferences.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-bold ${hubColors.text} mb-2">
                    7. Your Rights
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-2">
                    You have the right to:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 text-sm space-y-1 ml-2">
                    <li>Access and update your personal information</li>
                    <li>
                      Request deletion of your data (subject to legal and
                      contractual obligations)
                    </li>
                    <li>Opt out of non-essential communications</li>
                    <li>Request a copy of your data</li>
                    <li>
                      File a complaint with relevant data protection authorities
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-bold ${hubColors.text} mb-2">
                    8. Changes to This Policy
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    We may update this Privacy Policy from time to time. We will
                    notify you of any changes by posting the new Privacy Policy
                    on this page and updating the "Last updated" date.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-bold ${hubColors.text} mb-2">
                    9. Contact Information
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-2">
                    For questions about this Privacy Policy or our data
                    practices, please contact us at:
                  </p>
                  <div className="text-gray-300 text-sm">
                    <p>
                      Email: privacy@
                      {currentHub === "gnymble"
                        ? "gnymble"
                        : currentHub === "percytech"
                          ? "percytech"
                          : currentHub === "percymd"
                            ? "percymd"
                            : currentHub === "percytext"
                              ? "percytext"
                              : "ourplatform"}
                      .com
                    </p>
                    <p>Phone: 757-295-8725</p>
                    <p>
                      Address:{" "}
                      {currentHub === "gnymble"
                        ? "Gnymble"
                        : currentHub === "percytech"
                          ? "PercyTech"
                          : currentHub === "percymd"
                            ? "PercyMD"
                            : currentHub === "percytext"
                              ? "PercyText"
                              : "Our Platform"}{" "}
                      Privacy Office
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Privacy;
