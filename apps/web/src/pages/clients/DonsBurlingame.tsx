import {
  Phone,
  Clock,
  Shield,
  CheckCircle,
  Star,
  Zap,
  Users,
  Cigarette,
} from "lucide-react";
import ClientPageTemplate from "./ClientPageTemplate";
import donsBurlingameLogo from "@sms-hub/ui/assets/dons-burlingame-logo.png";

export default function DonsBurlingame() {
  const features = [
    {
      icon: <Phone className="w-8 h-8 text-black" />,
      title: "Direct Communication",
      description:
        "Get instant updates about new cigar arrivals, limited editions, and exclusive events directly to your phone.",
    },
    {
      icon: <Clock className="w-8 h-8 text-black" />,
      title: "Cigar Events",
      description:
        "Be the first to know about our exclusive cigar tastings, pairing events, and special releases.",
    },
    {
      icon: <Shield className="w-8 h-8 text-black" />,
      title: "Privacy Protected",
      description:
        "Your information is secure and will never be shared with third parties.",
    },
  ];

  const benefits = [
    {
      icon: <CheckCircle className="w-5 h-5 text-black" />,
      title: "Exclusive Offers",
      description:
        "Access to members-only discounts and early access to limited edition cigars.",
    },
    {
      icon: <Star className="w-5 h-5 text-black" />,
      title: "Premium Selection",
      description:
        "Curated recommendations from our expert tobacconists and cigar specialists.",
    },
    {
      icon: <Zap className="w-5 h-5 text-black" />,
      title: "Instant Notifications",
      description:
        "Real-time alerts for new arrivals, restocks, and special cigar events.",
    },
    {
      icon: <Users className="w-5 h-5 text-black" />,
      title: "Community Access",
      description:
        "Connect with fellow cigar enthusiasts and share your passion for premium tobacco.",
    },
    {
      icon: <Shield className="w-5 h-5 text-black" />,
      title: "Secure & Private",
      description:
        "Your data is protected with enterprise-grade security and privacy controls.",
    },
    {
      icon: <Phone className="w-5 h-5 text-black" />,
      title: "Easy Opt-Out",
      description:
        "Unsubscribe anytime with a simple text message - no hassle, no questions asked.",
    },
  ];

  return (
    <ClientPageTemplate
      clientName="DONSBT"
      clientDescription="Premium Cigars & Tobacco"
      clientLogo={donsBurlingameLogo}
      clientIcon={<Cigarette className="w-5 h-5 text-black" />}
      phoneNumber="6502298355"
      address="1404 Burlingame Avenue, Burlingame CA 94010"
      hours="Mon-Fri 10AM-8PM, Sat-Sun 11AM-6PM"
      features={features}
      benefits={benefits}
      ctaText="Stay connected with DONS Burlingame Tobacconist for exclusive cigar releases, tasting events, and premium tobacco products delivered directly to your phone."
      ctaButtonText="JOIN DONSBT"
      privacyLink="/clients/donsbt/privacy"
      termsLink="/clients/donsbt/terms"
    />
  );
}
