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
import donsBurlingameLogo from "./shared-client-data/assets/dons-burlingame/dons-burlingame-logo.png";
import harlemCigarLogo from "./shared-client-data/assets/harlem-cigar/harlem-cigar-logo.png";
import firstRoundAmmoLogo from "./shared-client-data/assets/1st-round-ammo/1st-round-ammo-logo.png";
import michaelsLogo from "./shared-client-data/assets/michaels-tobacco/michaels-logo.png";

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
        description:
          "Your information is secure and will never be shared with third parties.",
      },
    ],
    benefits: [
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
    ],
    ctaText:
      "Stay connected with DONS Burlingame Tobacconist for exclusive cigar releases, tasting events, and premium tobacco products delivered directly to your phone.",
    ctaButtonText: "JOIN DONSBT",
    privacyLink: "/clients/donsbt/privacy",
    termsLink: "/clients/donsbt/terms",
    businessType: "cigar shop",
    industryContext: "cigars and tobacco products",
    shortCode: "6502298355",
  },
  harlemCigar: {
    id: "harlemCigar",
    name: "Harlem Cigar",
    description: "Premium Cigars & Boutique Cigars",
    logo: harlemCigarLogo,
    icon: <Cigarette className="w-5 h-5 text-black" />,
    phoneNumber: "+1 (470) 479-3766",
    address: "1124 Lawrenceville Hwy 301A, Lawrenceville, GA 30046",
    hours: "Mon-Sat: 10AM-8PM, Sun: 12PM-6PM",
    features: [
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
    ],
    benefits: [
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
    ],
    ctaText:
      "Join Harlem Cigar's exclusive SMS community and discover the finest cigars from around the world. Get updates on new arrivals, special events, and expert recommendations from our master tobacconists.",
    ctaButtonText: "Join Our Cigar Community",
    privacyLink: "/clients/harlemCigar/privacy",
    termsLink: "/clients/harlemCigar/terms",
    clientWebsite: "https://www.harlem-cigar.com/",
    businessType: "cigar shop",
    industryContext: "cigars and tobacco products",
    shortCode: "4704793766",
  },
  firstRoundAmmo: {
    id: "firstRoundAmmo",
    name: "1st Round Ammunition",
    description: "Premium Ammunition & Firearms",
    logo: firstRoundAmmoLogo,
    icon: <Target className="w-5 h-5 text-black" />,
    phoneNumber: "239-205-6098",
    address: "Fort Myers, FL 33912",
    hours: "Mon-Fri: 9AM-6PM, Sat: 10AM-4PM, Sun: Closed",
    features: [
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
    ],
    benefits: [
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
    ],
    ctaText:
      "Stay connected with 1st Round Ammunition for exclusive ammunition releases, restock alerts, and premium firearms delivered directly to your phone.",
    ctaButtonText: "JOIN 1ST ROUND",
    privacyLink: "/clients/firstRoundAmmo/privacy",
    termsLink: "/clients/firstRoundAmmo/terms",
    clientWebsite: "https://1stroundammo.com/",
    businessType: "ammunition retailer",
    industryContext: "firearms and ammunition",
    shortCode: "2392056098",
  },
  michaelsTobacco: {
    id: "michaelsTobacco",
    name: "Michaels Tobacco",
    description: "Premium Cigar & Tobacco",
    logo: michaelsLogo,
    icon: <Cigarette className="w-5 h-5 text-black" />,
    phoneNumber: "555-123-MIKE",
    address: "456 Tobacco Road, San Francisco, CA 94102",
    hours: "Mon-Sat: 9AM-9PM, Sun: 11AM-7PM",
    features: [
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
    ],
    benefits: [
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
    ],
    ctaText:
      "Stay connected with Michaels for premium cigar releases, exclusive tobacco products, and luxury lifestyle updates delivered directly to your phone.",
    ctaButtonText: "JOIN MICHAELS",
    privacyLink: "/clients/michaelsTobacco/privacy",
    termsLink: "/clients/michaelsTobacco/terms",
    businessType: "cigar shop",
    industryContext: "cigars and tobacco products",
    shortCode: "5551236453",
  },
};
