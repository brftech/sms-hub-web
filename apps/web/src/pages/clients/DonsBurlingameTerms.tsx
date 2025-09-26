import { Cigarette } from "lucide-react";
import ClientTermsTemplate from "./ClientTermsTemplate";
import donsBurlingameLogo from "@sms-hub/ui/assets/dons-burlingame-logo.png";

export default function DonsBurlingameTerms() {
  return (
    <ClientTermsTemplate
      clientName="DONSBT"
      clientDescription="Premium Cigars & Tobacco"
      clientLogo={donsBurlingameLogo}
      clientIcon={<Cigarette className="w-5 h-5 text-black" />}
      phoneNumber="(650) 343-3300"
      address="1404 Burlingame Avenue, Burlingame CA 94010"
      hours="Mon-Fri 10AM-8PM, Sat-Sun 11AM-6PM"
      businessType="cigar shop"
      industryContext="cigars and tobacco products"
      shortCode="6502298355"
    />
  );
}
