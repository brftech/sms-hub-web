/**
 * Client data for SMS marketing pages
 * This contains configuration, branding, and content for each client
 */
import {
  Phone,
  Clock,
  Shield,
  CheckCircle,
  Star,
  Zap,
  Users,
  Cigarette,
  Target,
  Award,
  MapPin,
} from "lucide-react";
import donsBurlingameLogo from "./assets/dons-burlingame/dons-burlingame-logo.png";
import harlemCigarLogo from "./assets/harlem-cigar/harlem-cigar-logo.png";
import firstRoundAmmoLogo from "./assets/1st-round-ammo/1st-round-ammo-logo.png";
import michaelsLogo from "./assets/michaels-tobacco/michaels-logo.png";

export interface ClientData {
  id: string;
  name: string;
  description: string;
  logo: string;
  icon: React.ReactNode;
  phoneNumber: string;
  address: string;
  hours: string;
  features: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
  benefits: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
  ctaText: string;
  ctaButtonText: string;
  privacyLink: string;
  termsLink: string;
  clientWebsite?: string;
  // Privacy and Terms specific data
  businessType: string;
  industryContext: string;
  shortCode: string;
}

export const clientData: Record<string, ClientData> = {
  donsbt: {
    id: "donsbt",
    name: "DONSBT",
    description: "Premium Cigars & Tobacco",
    logo: donsBurlingameLogo,
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
  },
  harlem: {
    id: "harlem",
    name: "Harlem Cigar Room",
    description: "New York's Premier Cigar Lounge",
    logo: harlemCigarLogo,
    icon: <Cigarette className="w-5 h-5 text-black" />,
    phoneNumber: "2125551234",
    address: "Harlem, New York, NY",
    hours: "Mon-Sat 12PM-10PM, Sun 1PM-8PM",
    features: [
      {
        icon: <Phone className="w-8 h-8 text-black" />,
        title: "VIP Updates",
        description:
          "Get exclusive access to rare cigars, private events, and member-only tastings.",
      },
      {
        icon: <Clock className="w-8 h-8 text-black" />,
        title: "Event Notifications",
        description:
          "Stay informed about our legendary cigar evenings, jazz nights, and special releases.",
      },
      {
        icon: <Shield className="w-8 h-8 text-black" />,
        title: "Secure Membership",
        description: "Your personal information is protected and never shared with third parties.",
      },
    ],
    benefits: [
      {
        icon: <MapPin className="w-5 h-5 text-black" />,
        title: "Iconic Location",
        description:
          "Experience New York's most distinguished cigar lounge in the heart of Harlem.",
      },
      {
        icon: <Star className="w-5 h-5 text-black" />,
        title: "Curated Selection",
        description: "Access to rare and exclusive cigars handpicked by our master tobacconists.",
      },
      {
        icon: <Award className="w-5 h-5 text-black" />,
        title: "Member Rewards",
        description: "Earn points, enjoy discounts, and get first access to limited releases.",
      },
      {
        icon: <Users className="w-5 h-5 text-black" />,
        title: "Community",
        description: "Connect with fellow cigar enthusiasts in New York's most vibrant lounge.",
      },
    ],
    ctaText: "Text 'HARLEM' to (212) 555-1234 to join New York's premier cigar community.",
    ctaButtonText: "Text HARLEM to (212) 555-1234",
    privacyLink: "/clients/harlem/privacy",
    termsLink: "/clients/harlem/terms",
    clientWebsite: "https://harlemcigarroom.com",
    businessType: "Premium Cigar Lounge",
    industryContext: "upscale cigar lounges and social clubs",
    shortCode: "555-1234",
  },
  "1st-round": {
    id: "1st-round",
    name: "1st Round Ammo",
    description: "Your Trusted Firearms & Ammunition Dealer",
    logo: firstRoundAmmoLogo,
    icon: <Target className="w-5 h-5 text-black" />,
    phoneNumber: "5555551234",
    address: "Various Locations - Check Website",
    hours: "Mon-Sat 9AM-6PM, Sun Closed",
    features: [
      {
        icon: <Phone className="w-8 h-8 text-black" />,
        title: "Inventory Alerts",
        description:
          "Be the first to know when hard-to-find ammunition and firearms are back in stock.",
      },
      {
        icon: <Clock className="w-8 h-8 text-black" />,
        title: "Event Notifications",
        description:
          "Get updates about safety training classes, shooting events, and special promotions.",
      },
      {
        icon: <Shield className="w-8 h-8 text-black" />,
        title: "Privacy & Security",
        description: "Your information is kept strictly confidential and secure.",
      },
    ],
    benefits: [
      {
        icon: <CheckCircle className="w-5 h-5 text-black" />,
        title: "Priority Access",
        description: "Early notification of new inventory and exclusive member-only deals.",
      },
      {
        icon: <Star className="w-5 h-5 text-black" />,
        title: "Expert Guidance",
        description:
          "Get recommendations from our experienced firearms and ammunition specialists.",
      },
      {
        icon: <Zap className="w-5 h-5 text-black" />,
        title: "Instant Updates",
        description: "Real-time stock alerts for the ammunition and firearms you're looking for.",
      },
      {
        icon: <Users className="w-5 h-5 text-black" />,
        title: "Community",
        description: "Join our community of responsible gun owners and shooting enthusiasts.",
      },
    ],
    ctaText: "Text 'AMMO' to (555) 555-1234 for exclusive firearms and ammunition updates.",
    ctaButtonText: "Text AMMO to (555) 555-1234",
    privacyLink: "/clients/1st-round/privacy",
    termsLink: "/clients/1st-round/terms",
    clientWebsite: "https://1stroundammo.com",
    businessType: "Licensed Firearms Dealer",
    industryContext: "licensed firearms and ammunition dealers",
    shortCode: "555-1234",
  },
  michaels: {
    id: "michaels",
    name: "Michael's Tobacco",
    description: "Fine Cigars & Premium Tobacco Since 1978",
    logo: michaelsLogo,
    icon: <Cigarette className="w-5 h-5 text-black" />,
    phoneNumber: "5105551234",
    address: "Berkeley, CA",
    hours: "Mon-Sat 10AM-7PM, Sun 11AM-5PM",
    features: [
      {
        icon: <Phone className="w-8 h-8 text-black" />,
        title: "Direct Updates",
        description:
          "Get notified about new cigar releases, rare finds, and exclusive member events.",
      },
      {
        icon: <Clock className="w-8 h-8 text-black" />,
        title: "Event Invitations",
        description: "First access to cigar tastings, pairing events, and exclusive gatherings.",
      },
      {
        icon: <Shield className="w-8 h-8 text-black" />,
        title: "Privacy First",
        description: "Your information is secure and will never be shared with third parties.",
      },
    ],
    benefits: [
      {
        icon: <CheckCircle className="w-5 h-5 text-black" />,
        title: "Member Pricing",
        description: "Exclusive discounts and special offers on premium cigars and tobacco.",
      },
      {
        icon: <Star className="w-5 h-5 text-black" />,
        title: "Expert Selection",
        description: "Personalized recommendations from our 45+ years of cigar expertise.",
      },
      {
        icon: <Zap className="w-5 h-5 text-black" />,
        title: "Instant Alerts",
        description: "Be the first to know about limited releases and hard-to-find cigars.",
      },
      {
        icon: <Users className="w-5 h-5 text-black" />,
        title: "Community",
        description:
          "Join Berkeley's longest-running cigar community and connect with fellow enthusiasts.",
      },
    ],
    ctaText: "Text 'CIGARS' to (510) 555-1234 to join Berkeley's premier cigar community.",
    ctaButtonText: "Text CIGARS to (510) 555-1234",
    privacyLink: "/clients/michaels/privacy",
    termsLink: "/clients/michaels/terms",
    clientWebsite: "https://michaelstobacco.com",
    businessType: "Fine Cigar & Tobacco Retailer",
    industryContext: "fine cigar and tobacco retail establishments",
    shortCode: "555-1234",
  },
};
