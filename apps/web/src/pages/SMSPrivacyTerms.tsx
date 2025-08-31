import React, { useState } from "react";
import { PageLayout } from "@/components/layout";

import { FormField, FormContainer } from "@/components/forms";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const SMSPrivacyTerms: React.FC = () => {
  const [shopName, setShopName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShopName(e.target.value);
  };

  const generatePrivacyAndTerms = () => {
    const currentDate = new Date().toLocaleDateString();
    const effectiveShopName = shopName.trim() || "[Your Shop Name]";

    return `SMS TEXTING PRIVACY POLICY & TERMS OF SERVICE
${effectiveShopName}

Effective Date: ${currentDate}

═══════════════════════════════════════════════════════════════════════════════
PRIVACY POLICY
═══════════════════════════════════════════════════════════════════════════════

OVERVIEW
This SMS Texting Privacy Policy governs the collection, use, and disclosure of personal information when you opt-in to receive text messages from ${effectiveShopName}. By providing your mobile phone number and consenting to receive SMS messages, you agree to the terms outlined in this policy.

INFORMATION WE COLLECT
When you subscribe to our SMS services, we collect:
• Your mobile phone number
• Your name (if provided)
• Your consent preferences
• Message delivery and engagement data
• Device and carrier information

HOW WE USE YOUR INFORMATION
We use your information to:
• Send promotional messages about cigars, tobacco products, and special offers
• Provide order updates and delivery notifications
• Send event invitations and store announcements
• Improve our SMS marketing effectiveness
• Comply with legal and regulatory requirements

CIGAR RETAIL SPECIFIC CONSIDERATIONS
As a cigar retailer, ${effectiveShopName} operates under specific regulations:
• We verify that SMS recipients are 21 years of age or older
• We comply with all applicable tobacco advertising regulations
• We respect local and state laws regarding tobacco marketing
• We maintain records as required by tobacco control authorities

DATA SHARING
We do not sell your personal information. We may share your data with:
• SMS service providers who help deliver messages
• Analytics providers for improving our services
• Legal authorities when required by law
• Business partners only with your explicit consent

DATA SECURITY
We implement appropriate technical and organizational measures to protect your personal information, including:
• Secure data transmission protocols
• Regular security assessments
• Access controls and employee training
• Secure data storage practices

RETENTION POLICY
We retain your SMS data for:
• Active subscribers: Until you opt-out plus 30 days
• Opt-out records: 3 years for compliance purposes
• Analytics data: 2 years in aggregated, non-identifiable form

YOUR PRIVACY RIGHTS
You have the right to:
• Access your personal information we hold
• Request correction of inaccurate information
• Request deletion of your data (subject to legal requirements)
• Object to processing of your data
• Receive a copy of your data in a portable format

═══════════════════════════════════════════════════════════════════════════════
TERMS OF SERVICE
═══════════════════════════════════════════════════════════════════════════════

ACCEPTANCE OF TERMS
By providing your mobile phone number to ${effectiveShopName} and opting-in to receive SMS messages, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not subscribe to our SMS services.

SERVICE DESCRIPTION
${effectiveShopName} offers SMS messaging services to provide:
• Product promotions and special offers on cigars and tobacco products
• New arrival notifications and inventory updates
• Event announcements and store hours updates
• Order confirmations and delivery notifications
• Exclusive member benefits and loyalty program updates

ELIGIBILITY AND AGE REQUIREMENTS
To subscribe to our SMS services, you must:
• Be at least 21 years of age
• Provide a valid mobile phone number
• Have the authority to agree to receive SMS messages on the provided number
• Comply with all applicable local, state, and federal tobacco laws

CONSENT AND SUBSCRIPTION
• Subscription is voluntary and requires explicit opt-in consent
• You may receive up to 5 messages per week, unless otherwise specified
• Message frequency may vary based on promotions and seasonal events
• You can modify your subscription preferences by contacting us directly
• Consent is not required as a condition of purchase

OPT-OUT PROCEDURES
You may opt-out of SMS messages at any time by:
• Texting STOP to our SMS number
• Calling ${effectiveShopName} directly
• Visiting our store location
• Emailing us at [your email address]

Upon opting out:
• You will receive a confirmation message
• All future SMS messages will cease within 24 hours
• You may still receive transactional messages related to existing orders

MESSAGING COSTS AND CHARGES
• Standard message and data rates apply
• ${effectiveShopName} is not responsible for carrier charges
• Contact your mobile carrier for information about your messaging plan
• Messages may be delivered via various short codes or phone numbers

PROHIBITED USES
You agree not to:
• Share our SMS content for commercial purposes without permission
• Forward promotional messages that may violate age restrictions
• Use our SMS service to distribute unauthorized content
• Attempt to interfere with or disrupt our messaging systems
• Provide false information during subscription

MESSAGE CONTENT AND ACCURACY
• SMS messages are for informational and promotional purposes
• Product availability and pricing are subject to change
• Promotions may have limited time frames or quantity restrictions
• ${effectiveShopName} reserves the right to modify or cancel offers
• Messages may contain links to our website for additional information

LIABILITY LIMITATIONS
${effectiveShopName} shall not be liable for:
• Delayed or failed message delivery due to carrier issues
• Charges incurred from your mobile carrier
• Any damages resulting from SMS content or delivery
• Technical malfunctions or system downtime
• Unauthorized access to your mobile device

INDEMNIFICATION
You agree to indemnify and hold ${effectiveShopName} harmless from any claims, damages, or expenses arising from:
• Your violation of these terms
• Your misuse of our SMS services
• False information provided during subscription
• Any illegal activity related to our SMS communications

MODIFICATIONS TO TERMS
${effectiveShopName} reserves the right to modify these terms at any time:
• Changes will be communicated via SMS to active subscribers
• Continued subscription after notification constitutes acceptance
• Material changes will require new opt-in consent
• You may opt-out if you disagree with modifications

TERMINATION
${effectiveShopName} may terminate SMS services:
• For violation of these terms
• If your mobile number becomes invalid
• For technical or business reasons
• As required by law or regulation

GOVERNING LAW
These terms are governed by the laws of [Your State], without regard to conflict of law provisions. Any disputes shall be resolved in the courts of [Your County], [Your State].

CONTACT INFORMATION
For questions about this Privacy Policy & Terms of Service or to exercise your rights:

${effectiveShopName}
[Your Address]
[Your Phone Number]
[Your Email Address]

SMS Support:
• To opt-out: Text STOP to [Your SMS Number]
• For help: Text HELP to [Your SMS Number]

COMPLIANCE
This policy and terms comply with:
• Telephone Consumer Protection Act (TCPA)
• CAN-SPAM Act
• Federal Trade Commission guidelines
• FDA Tobacco Regulations
• State tobacco advertising regulations
• CTIA Messaging Principles and Best Practices

Last Updated: ${currentDate}

DISCLAIMER
This privacy policy and terms template is provided for informational purposes. ${effectiveShopName} should consult with legal counsel to ensure compliance with all applicable federal, state, and local laws regarding SMS marketing and tobacco retail regulations.`;
  };

  const handleDownload = () => {
    if (!shopName.trim()) {
      toast({
        title: "Shop Name Required",
        description: "Please enter your shop name before downloading.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const documentText = generatePrivacyAndTerms();
      const blob = new Blob([documentText], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${shopName.replace(/\s+/g, "_")}_SMS_Privacy_Terms.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setIsGenerating(false);
      toast({
        title: "Download Complete",
        description:
          "Your SMS privacy policy & terms have been downloaded successfully.",
      });
    }, 1000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleDownload();
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-8">
              <FormContainer
                title="Generate SMS Privacy Policy & Terms"
                subtitle="Create a comprehensive privacy policy and terms of service for your cigar retail SMS marketing"
                onSubmit={handleFormSubmit}
                submitText="Generate & Download Privacy Policy & Terms"
                isSubmitting={isGenerating}
                className="max-w-none"
              >
                <FormField
                  label="Shop Name"
                  name="shopName"
                  type="text"
                  placeholder="e.g., Premium Cigars & Tobacco"
                  required
                  value={shopName}
                  onChange={handleInputChange}
                />

                <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <h3 className="text-orange-400 font-semibold mb-3">
                    Your Document Will Include:
                  </h3>
                  <div className="grid md:grid-cols-2 gap-2">
                    <ul className="text-white/70 text-sm space-y-1">
                      <li>• TCPA and CAN-SPAM compliance</li>
                      <li>• Age verification requirements (21+)</li>
                      <li>• Privacy data collection & usage</li>
                      <li>• Clear opt-out procedures</li>
                    </ul>
                    <ul className="text-white/70 text-sm space-y-1">
                      <li>• Terms of service and eligibility</li>
                      <li>• Liability limitations & indemnification</li>
                      <li>• Governing law and dispute resolution</li>
                      <li>• Regulatory compliance framework</li>
                    </ul>
                  </div>
                </div>
              </FormContainer>
            </CardContent>
          </Card>
        </div>

        {/* Legal Disclaimer */}
        <Card className="mt-8 bg-yellow-500/10 border-yellow-500/20">
          <CardContent className="p-6">
            <h3 className="text-yellow-400 font-semibold mb-2">
              Legal Disclaimer
            </h3>
            <p className="text-white/70 text-sm">
              This privacy policy and terms template is provided for
              informational purposes only. We strongly recommend consulting with
              legal counsel to ensure full compliance with all applicable
              federal, state, and local laws regarding SMS marketing, consumer
              protection, and tobacco retail regulations in your jurisdiction.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default SMSPrivacyTerms;
