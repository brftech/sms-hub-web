import {
  Phone,
  Clock,
  Shield,
  CheckCircle,
  Cigarette,
  Star,
  Zap,
  Users,
} from "lucide-react";
import ClientPageTemplate from "./ClientPageTemplate";
import michaelsLogo from "@sms-hub/ui/assets/michaels-logo.png";

export default function Michaels() {
  const features = [
    {
      icon: <Phone className="w-8 h-8 text-black" />,
      title: "Direct Communication",
      description:
        "Get instant updates about new cigar arrivals, exclusive blends, and special events directly to your phone.",
    },
    {
      icon: <Clock className="w-8 h-8 text-black" />,
      title: "Tasting Events",
      description:
        "Be the first to know about our exclusive cigar tastings and premium tobacco events.",
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
      title: "Exclusive Releases",
      description:
        "Access to limited edition cigars and premium tobacco products before they're available to the public.",
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
        "Real-time alerts for new arrivals, special events, and exclusive offers.",
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
      clientName="Michaels"
      clientDescription="Premium Cigar & Tobacco"
      clientLogo={michaelsLogo}
      clientIcon={<Cigarette className="w-5 h-5 text-black" />}
      phoneNumber="555-123-MIKE"
      address="456 Tobacco Road, San Francisco, CA 94102"
      hours="Mon-Sat: 9AM-9PM, Sun: 11AM-7PM"
      features={features}
      benefits={benefits}
      ctaText="Stay connected with Michaels for premium cigar releases, exclusive tobacco products, and luxury lifestyle updates delivered directly to your phone."
      ctaButtonText="JOIN MICHAELS"
    />
  );
}
