/**
 * DONSBT - Premium Cigars & Tobacco
 * Burlingame, CA
 */
import { Phone, Clock, Shield, CheckCircle, Star, Zap, Users, Cigarette } from "lucide-react";
import type { ClientData } from "../types";
import logo from "./logo.png";

export const donsbtData: ClientData = {
  id: "donsbt",
  name: "DONSBT",
  description: "Premium Cigars & Tobacco",
  logo,
  icon: <Cigarette className="w-5 h-5 text-black" />,
  phoneNumber: "6502298355",
  address: "1404 Burlingame Avenue, Burlingame CA 94010",
  hours: "Mon-Fri 10AM-8PM, Sat-Sun 11AM-6PM",
  features: [
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
      description: "Your information is secure and will never be shared with third parties.",
    },
  ],
  benefits: [
    {
      icon: <CheckCircle className="w-5 h-5 text-black" />,
      title: "Exclusive Offers",
      description: "Access to members-only discounts and early access to limited edition cigars.",
    },
    {
      icon: <Star className="w-5 h-5 text-black" />,
      title: "Premium Selection",
      description: "Curated recommendations from our expert tobacconists and cigar specialists.",
    },
    {
      icon: <Zap className="w-5 h-5 text-black" />,
      title: "Instant Notifications",
      description: "Real-time alerts for new arrivals, restocks, and special cigar events.",
    },
    {
      icon: <Users className="w-5 h-5 text-black" />,
      title: "Community Access",
      description: "Join our community of cigar enthusiasts and connect with fellow aficionados.",
    },
  ],
  ctaText: "Text 'JOIN' to (650) 229-8355 and start your premium cigar journey today.",
  ctaButtonText: "Text JOIN to (650) 229-8355",
  privacyLink: "/clients/donsbt/privacy",
  termsLink: "/clients/donsbt/terms",
  clientWebsite: "https://donsburlingame.com",
  businessType: "Premium Cigar Retail",
  industryContext: "cigar and tobacco retail establishments",
  shortCode: "229-8355",
};
