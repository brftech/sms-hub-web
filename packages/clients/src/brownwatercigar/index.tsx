/**
 * Brown Water Cigar - Premium Handmade Cigars & Lounge
 * Sophisticated cigar lounge experience
 */
import { Phone, Clock, Shield, CheckCircle, Star, Zap, Users, Cigarette } from "lucide-react";
import type { ClientData } from "../types";
import logo from "./logo.png";

export const brownwatercigarData: ClientData = {
  id: "brownwatercigar",
  name: "Brown Water Cigar",
  description: "Premium Handmade Cigars & Lounge",
  logo,
  icon: <Cigarette className="w-5 h-5 text-amber-900" />,
  phoneNumber: "9795519019",
  address: "200 W. Alamo St., Brenham, TX 77833",
  hours: "Closed Mon-Tue, Wed-Thu 11AM-9PM, Fri-Sat 11AM-10PM, Sun 12PM-6PM",
  features: [
    {
      icon: <Phone className="w-8 h-8 text-amber-900" />,
      title: "Exclusive Updates",
      description:
        "Receive notifications about new premium cigar arrivals, rare collections, and member-only lounge events.",
    },
    {
      icon: <Clock className="w-8 h-8 text-amber-900" />,
      title: "Private Events",
      description:
        "Get invited to intimate cigar tastings, pairing experiences, and special gatherings in our sophisticated lounge.",
    },
    {
      icon: <Shield className="w-8 h-8 text-amber-900" />,
      title: "Privacy Assured",
      description: "Your information remains confidential and is never shared with third parties.",
    },
  ],
  benefits: [
    {
      icon: <CheckCircle className="w-5 h-5 text-amber-900" />,
      title: "Member Privileges",
      description:
        "Enjoy exclusive discounts, early access to limited releases, and VIP lounge benefits.",
    },
    {
      icon: <Star className="w-5 h-5 text-amber-900" />,
      title: "Curated Selection",
      description:
        "Access our expertly curated collection of premium handmade cigars from around the world.",
    },
    {
      icon: <Zap className="w-5 h-5 text-amber-900" />,
      title: "Real-Time Alerts",
      description: "Be the first to know when rare cigars arrive and special events are scheduled.",
    },
    {
      icon: <Users className="w-5 h-5 text-amber-900" />,
      title: "Sophisticated Community",
      description: "Connect with fellow cigar enthusiasts in an elegant, refined atmosphere.",
    },
  ],
  ctaText:
    "Text 'JOIN' to (979) 216-3274 and join our exclusive community to experience the finest in premium cigars and lounge culture.",
  ctaButtonText: "Text JOIN to (979) 216-3274",
  privacyLink: "/clients/brownwatercigar/privacy",
  termsLink: "/clients/brownwatercigar/terms",
  clientWebsite: "https://brownwatercigar.com",
  businessType: "Premium Cigar Lounge",
  industryContext: "premium cigar lounges and tobacco retail",
  shortCode: "9792163274",
  // Custom earthy, sophisticated color scheme inspired by Brown Water Cigar's branding
  colors: {
    primaryFrom: "#78350f", // amber-900
    primaryTo: "#92400e", // amber-800
    accentLight: "#d97706", // amber-600
    accentMedium: "#b45309", // amber-700
    accentDark: "#78350f", // amber-900
    bgFrom: "#1c1917", // stone-900
    bgVia: "#292524", // stone-800
    bgTo: "#1c1917", // stone-900
  },
};
