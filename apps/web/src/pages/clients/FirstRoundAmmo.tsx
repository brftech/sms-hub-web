import {
  Phone,
  Clock,
  Shield,
  CheckCircle,
  Target,
  Zap,
  Users,
  AlertTriangle,
} from "lucide-react";
import ClientPageTemplate from "./ClientPageTemplate";
import firstRoundAmmoLogo from "@sms-hub/ui/assets/1st-round-ammo-logo.png";

export default function FirstRoundAmmo() {
  const features = [
    {
      icon: <Phone className="w-8 h-8 text-black" />,
      title: "Direct Communication",
      description:
        "Get instant updates about ammunition availability, new arrivals, and special offers directly to your phone.",
    },
    {
      icon: <Clock className="w-8 h-8 text-black" />,
      title: "Restock Alerts",
      description:
        "Be the first to know when your favorite calibers are back in stock or when new shipments arrive.",
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
        "Access to members-only discounts and early access to limited edition ammunition.",
    },
    {
      icon: <Target className="w-5 h-5 text-black" />,
      title: "Premium Selection",
      description:
        "Curated recommendations from our expert gunsmiths and ammunition specialists.",
    },
    {
      icon: <Zap className="w-5 h-5 text-black" />,
      title: "Instant Notifications",
      description:
        "Real-time alerts for new arrivals, restocks, and special promotions.",
    },
    {
      icon: <Users className="w-5 h-5 text-black" />,
      title: "Community Access",
      description:
        "Connect with fellow shooting enthusiasts and share your passion for firearms.",
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
      clientName="1st Round Ammunition"
      clientDescription="Premium Ammunition & Firearms"
      clientLogo={firstRoundAmmoLogo}
      clientIcon={<Target className="w-5 h-5 text-black" />}
      phoneNumber="239-205-6098"
      address="Fort Myers, FL 33912"
      hours="Mon-Fri: 9AM-6PM, Sat: 10AM-4PM, Sun: Closed"
      features={features}
      benefits={benefits}
      ctaText="Stay connected with 1st Round Ammunition for exclusive ammunition releases, restock alerts, and premium firearms delivered directly to your phone."
      ctaButtonText="JOIN 1ST ROUND"
      clientWebsite="https://1stroundammo.com/"
    />
  );
}
