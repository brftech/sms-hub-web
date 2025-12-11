/**
 * The Library Cigar Lounge - Premium Cigar Lounge & Community
 * Sophisticated cigar lounge with library atmosphere
 */
import { Phone, Clock, Shield, CheckCircle, Star, Zap, Users, BookOpen } from "lucide-react";
import type { ClientData } from "../types";
import logo from "./logo.png";

export const thelibrarycigarloungeData: ClientData = {
  id: "thelibrarycigarlounge",
  name: "The Library Cigar Lounge",
  description: "Premium Cigar Lounge & Community",
  logo,
  icon: <BookOpen className="w-5 h-5 text-amber-800" />,
  phoneNumber: "XXX-XXX-XXXX", // SMS code placeholder - to be updated
  address: "4400 U.S. 281, Bldg 1, Spring Branch, TX 78070",
  hours: "Mon-Thu 11AM-9PM, Fri-Sat 11AM-10PM, Sun 12PM-8PM",
  features: [
    {
      icon: <Phone className="w-8 h-8 text-amber-800" />,
      title: "Exclusive Updates",
      description:
        "Receive notifications about new premium cigar arrivals, special events, and member-only lounge gatherings.",
    },
    {
      icon: <Clock className="w-8 h-8 text-amber-800" />,
      title: "Event Invitations",
      description:
        "Get invited to live music events, food truck visits, specialty coffee tastings, and exclusive raffles.",
    },
    {
      icon: <Shield className="w-8 h-8 text-amber-800" />,
      title: "Privacy Assured",
      description: "Your information remains confidential and is never shared with third parties.",
    },
  ],
  benefits: [
    {
      icon: <CheckCircle className="w-5 h-5 text-amber-800" />,
      title: "Member Benefits",
      description: "Enjoy exclusive discounts, early access to events, and VIP lounge privileges.",
    },
    {
      icon: <Star className="w-5 h-5 text-amber-800" />,
      title: "Curated Selection",
      description:
        "Access our expertly curated collection of premium cigars from renowned manufacturers.",
    },
    {
      icon: <Zap className="w-5 h-5 text-amber-800" />,
      title: "Real-Time Alerts",
      description:
        "Be the first to know about new arrivals, special events, and limited-time offers.",
    },
    {
      icon: <Users className="w-5 h-5 text-amber-800" />,
      title: "Community Connection",
      description:
        "Connect with fellow cigar enthusiasts in our sophisticated library-inspired atmosphere.",
    },
  ],
  ctaText:
    "SMS code coming soon! Join our exclusive community to stay updated on events, new arrivals, and special offers.",
  ctaButtonText: "SMS Code Coming Soon",
  privacyLink: "/clients/thelibrarycigarlounge/privacy",
  termsLink: "/clients/thelibrarycigarlounge/terms",
  clientWebsite: "https://thelibrarycigarlounge.com",
  businessType: "Premium Cigar Lounge",
  industryContext: "premium cigar lounges and tobacco retail",
  shortCode: "XXX-XXX-XXXX", // SMS code placeholder - to be updated
  // Custom rich, library-inspired color scheme
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
