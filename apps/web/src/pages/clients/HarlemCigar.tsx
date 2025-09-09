import {
  Cigarette,
  Phone,
  MapPin,
  Star,
  Award,
  Users,
  Zap,
} from "lucide-react";
import ClientPageTemplate from "./ClientPageTemplate";
import harlemCigarLogo from "@sms-hub/ui/assets/harlem-cigar-logo.png";

export default function HarlemCigar() {
  return (
    <ClientPageTemplate
      clientName="Harlem Cigar"
      clientDescription="Premium Cigars & Boutique Cigars"
      clientLogo={harlemCigarLogo}
      clientIcon={<Cigarette className="w-5 h-5 text-black" />}
      phoneNumber="+1 (470) 479-3766"
      address="1124 Lawrenceville Hwy 301A, Lawrenceville, GA 30046"
      hours="Mon-Sat: 10AM-8PM, Sun: 12PM-6PM"
      features={[
        {
          icon: <Star className="w-8 h-8 text-black" />,
          title: "Premium Cigar Selection",
          description:
            "Curated collection of super-premium, boutique, and rare cigars from Dominican Republic, Nicaragua, and Honduras.",
        },
        {
          icon: <Award className="w-8 h-8 text-black" />,
          title: "Hand-Rolled Excellence",
          description:
            "Expert craftsmanship with traditional techniques, ensuring each cigar is perfectly constructed and aged to perfection.",
        },
        {
          icon: <Users className="w-8 h-8 text-black" />,
          title: "Cigar Rolling Events",
          description:
            "Join our exclusive cigar rolling events and learn from master craftsmen while enjoying premium cigars.",
        },
      ]}
      benefits={[
        {
          icon: <Zap className="w-6 h-6 text-orange-500" />,
          title: "Exclusive New Arrivals",
          description:
            "Be the first to know about limited production and small batch cigars as they arrive.",
        },
        {
          icon: <Star className="w-6 h-6 text-orange-500" />,
          title: "Special Events & Tastings",
          description:
            "Get invited to private cigar tastings, rolling demonstrations, and exclusive events.",
        },
        {
          icon: <Award className="w-6 h-6 text-orange-500" />,
          title: "Expert Recommendations",
          description:
            "Personalized cigar recommendations from our knowledgeable tobacconists based on your preferences.",
        },
        {
          icon: <Phone className="w-6 h-6 text-orange-500" />,
          title: "Priority Customer Service",
          description:
            "Direct access to our team for questions, special orders, and personalized assistance.",
        },
        {
          icon: <Users className="w-6 h-6 text-orange-500" />,
          title: "VIP Member Benefits",
          description:
            "Access to member-only pricing, early access to rare releases, and exclusive cigar collections.",
        },
        {
          icon: <MapPin className="w-6 h-6 text-orange-500" />,
          title: "Store Updates & Hours",
          description:
            "Stay informed about store hours, special events, and any changes to our Lawrenceville location.",
        },
      ]}
      ctaText="Join Harlem Cigar's exclusive SMS community and discover the finest cigars from around the world. Get updates on new arrivals, special events, and expert recommendations from our master tobacconists."
      ctaButtonText="Join Our Cigar Community"
      clientWebsite="https://www.harlem-cigar.com/"
    />
  );
}
