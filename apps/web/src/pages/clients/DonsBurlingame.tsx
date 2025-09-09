import {
  Phone,
  Clock,
  Shield,
  CheckCircle,
  Star,
  Zap,
  Users,
} from "lucide-react";
import ClientPageTemplate from "./ClientPageTemplate";
import donsBurlingameLogo from "@sms-hub/ui/assets/dons-burlingame-logo.png";

export default function DonsBurlingame() {
  const features = [
    {
      icon: <Phone className="w-8 h-8 text-black" />,
      title: "Direct Communication",
      description:
        "Get instant updates about new arrivals, sales, and exclusive events directly to your phone.",
    },
    {
      icon: <Clock className="w-8 h-8 text-black" />,
      title: "Tasting Events",
      description:
        "Be the first to know about our exclusive wine tastings and special events.",
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
        "Access to members-only discounts and early access to new arrivals.",
    },
    {
      icon: <Star className="w-5 h-5 text-black" />,
      title: "Premium Selection",
      description: "Curated recommendations from our expert sommeliers.",
    },
    {
      icon: <Zap className="w-5 h-5 text-black" />,
      title: "Instant Notifications",
      description: "Real-time alerts for limited releases and special events.",
    },
    {
      icon: <Users className="w-5 h-5 text-black" />,
      title: "Community Access",
      description:
        "Connect with fellow wine enthusiasts and share experiences.",
    },
    {
      icon: <Shield className="w-5 h-5 text-black" />,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security.",
    },
    {
      icon: <Phone className="w-5 h-5 text-black" />,
      title: "Easy Opt-Out",
      description: "Unsubscribe anytime with a simple text message.",
    },
  ];

  return (
    <ClientPageTemplate
      clientName="Don's Burlingame"
      clientDescription="Premium Wine & Spirits"
      clientLogo={donsBurlingameLogo}
      clientIcon={<span className="text-black font-bold">D</span>}
      phoneNumber="555-123-DONS"
      address="123 Main Street, Burlingame, CA 94010"
      hours="Mon-Sat: 10AM-8PM, Sun: 12PM-6PM"
      features={features}
      benefits={benefits}
      ctaText="Stay connected with Don's Burlingame for exclusive wine releases, tasting events, and premium spirits delivered directly to your phone."
      ctaButtonText="JOIN DON'S"
    />
  );
}
