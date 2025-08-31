import { PageLayout, useHub } from "@sms-hub/ui";
import { getHubColorClasses } from "@sms-hub/utils";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const Terms = () => {
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
            Terms of Service
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Please read these terms carefully before using our services.
          </p>
        </div>

        {/* Terms Content Card */}
        <div className="flex justify-center pt-4">
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 shadow-2xl max-w-md w-full max-h-[500px] overflow-y-auto scrollbar-thin ${hubColors.scrollbar}/50 scrollbar-track-gray-800/50">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-white">
                  Terms of Service
                </h2>
                <p className="text-gray-400 text-sm">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>

              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-bold ${hubColors.text} mb-2">
                    1. Acceptance of Terms
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    By accessing and using{" "}
                    {currentHub === "gnymble"
                      ? "Gnymble"
                      : currentHub === "percytech"
                        ? "PercyTech"
                        : currentHub === "percymd"
                          ? "PercyMD"
                          : currentHub === "percytext"
                            ? "PercyText"
                            : "our platform"}
                    's services, you accept and agree to be bound by the terms
                    and provision of this agreement. If you do not agree to
                    abide by the above, please do not use this service.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-bold ${hubColors.text} mb-2">
                    2. Service Description
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {currentHub === "gnymble"
                      ? "Gnymble"
                      : currentHub === "percytech"
                        ? "PercyTech"
                        : currentHub === "percymd"
                          ? "PercyMD"
                          : currentHub === "percytext"
                            ? "PercyText"
                            : "Our platform"}{" "}
                    provides compliant SMS messaging services for businesses,
                    with specialized platforms for healthcare (Virtue) and
                    premium retail (Vice) communications. Our services include
                    regulatory compliance monitoring, message delivery, and
                    customer engagement tools.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-bold ${hubColors.text} mb-2">
                    3. User Responsibilities
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-2">
                    Users are responsible for:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 text-sm space-y-1 ml-2">
                    <li>Providing accurate account information</li>
                    <li>
                      Maintaining the security of their account credentials
                    </li>
                    <li>Complying with all applicable laws and regulations</li>
                    <li>
                      Ensuring proper consent for all messaging recipients
                    </li>
                    <li>Using the service only for lawful business purposes</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-bold ${hubColors.text} mb-2">
                    4. Compliance and Regulations
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    While{" "}
                    {currentHub === "gnymble"
                      ? "Gnymble"
                      : currentHub === "percytech"
                        ? "PercyTech"
                        : currentHub === "percymd"
                          ? "PercyMD"
                          : currentHub === "percytext"
                            ? "PercyText"
                            : "our platform"}{" "}
                    provides compliance monitoring tools, users remain
                    ultimately responsible for ensuring their communications
                    comply with TCPA, HIPAA, and other applicable regulations.
                    Our platform assists with compliance but does not guarantee
                    legal compliance.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-bold ${hubColors.text} mb-2">
                    5. Payment Terms
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Service fees are billed monthly in advance. Users are
                    responsible for all charges incurred under their account.
                    Refunds are provided only as required by law or at{" "}
                    {currentHub === "gnymble"
                      ? "Gnymble"
                      : currentHub === "percytech"
                        ? "PercyTech"
                        : currentHub === "percymd"
                          ? "PercyMD"
                          : currentHub === "percytext"
                            ? "PercyText"
                            : "our platform"}
                    's discretion.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-bold ${hubColors.text} mb-2">
                    6. Limitation of Liability
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {currentHub === "gnymble"
                      ? "Gnymble"
                      : currentHub === "percytech"
                        ? "PercyTech"
                        : currentHub === "percymd"
                          ? "PercyMD"
                          : currentHub === "percytext"
                            ? "PercyText"
                            : "Our platform"}{" "}
                    shall not be liable for any indirect, incidental, special,
                    consequential, or punitive damages, including without
                    limitation, loss of profits, data, use, goodwill, or other
                    intangible losses, resulting from your use of the service.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-bold ${hubColors.text} mb-2">
                    7. Termination
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Either party may terminate this agreement at any time with
                    30 days written notice.{" "}
                    {currentHub === "gnymble"
                      ? "Gnymble"
                      : currentHub === "percytech"
                        ? "PercyTech"
                        : currentHub === "percymd"
                          ? "PercyMD"
                          : currentHub === "percytext"
                            ? "PercyText"
                            : "Our platform"}{" "}
                    reserves the right to suspend or terminate accounts that
                    violate these terms or engage in fraudulent or illegal
                    activities.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-bold ${hubColors.text} mb-2">
                    8. Contact Information
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-2">
                    For questions about these Terms of Service, please contact
                    us at:
                  </p>
                  <div className="text-gray-300 text-sm">
                    <p>
                      Email: legal@
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

export default Terms;
