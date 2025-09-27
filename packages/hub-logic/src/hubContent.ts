import { HubType } from "./types";

// Hero Content Types
export interface HeroContent {
  fixedText: string;
  tagline: {
    line1: string;
    line2: string;
  };
  description: string;
  ctaText: string;
}

// CTA Content Types
export interface CTAStep {
  number: string;
  title: string;
  description: string;
}

export interface CTAContent {
  title: string;
  titleHighlight: string;
  description: string;
  descriptionHighlight: string;
  steps: CTAStep[];
  ctaText: string;
  ctaSubtext: string;
  guaranteeText: string;
  badge?: {
    text: string;
    variant?: string;
    [key: string]: unknown;
  };
}

// Problem Solution Content Types
export interface ProblemSolutionContent {
  title: {
    prefix: string;
    highlight: string;
  };
  description: string;
  deliver: {
    title: string;
    features: string[];
  };
  overlook: {
    title: string;
    items: string[];
  };
  badge: string;
}

// Stats Content Types
export interface StatItem {
  value: string;
  label: string;
  description: string;
}

export interface StatsContent {
  title: string;
  stats: StatItem[];
}

// Testimonials Content Types
export interface Testimonial {
  category: string;
  quote: string;
  name: string;
  company: string;
  location: string;
}

export interface TestimonialsContent {
  title: {
    highlight: string;
    suffix: string;
  };
  description: string;
  testimonials: Testimonial[];
}

// Hub Content Interface
export interface HubContentData {
  hero: HeroContent;
  cta: CTAContent;
  problemSolution: ProblemSolutionContent;
  stats: StatsContent;
  testimonials: TestimonialsContent;
}

// Gnymble Content
const gnymbleContent: HubContentData = {
  hero: {
    fixedText: "Compliant SMS texting for",
    tagline: {
      line1: "We do it really well.",
      line2: "Others...don't do it at all.",
    },
    description:
      "Built for businesses that need reliable, compliant messaging.",
    ctaText: "🔥 For business owners who demand SMS that delivers",
  },
  cta: {
    title: "Ready to Find Your",
    titleHighlight: "SMS Home?",
    description:
      "Experience the platform built for businesses that dare to be different.",
    descriptionHighlight: "Your success demands SMS that delivers results.",
    steps: [
      {
        number: "01",
        title: "REACH OUT",
        description: "Share your vision. We craft the perfect SMS solution.",
      },
      {
        number: "02",
        title: "GET SET UP",
        description:
          "Lightning-fast 8-day deployment. Master-level compliance included.",
      },
      {
        number: "03",
        title: "GROW YOUR BUSINESS",
        description:
          "Connect powerfully with customers, employees, and stakeholders.",
      },
    ],
    ctaText: "🚀 GET STARTED NOW",
    ctaSubtext: "📱 SEE IT IN ACTION",
    guaranteeText:
      "If we can't get you set up in 8 days, your $179 onboarding is free.",
    badge: {
      text: "PCA PREMIUM CIGAR ASSOCIATION",
      variant: "component",
    },
  },
  problemSolution: {
    title: {
      prefix: "The Platform",
      highlight: "Advantage",
    },
    description:
      "While others exclude, we excel. We champion every business that dares to be different.",
    deliver: {
      title: "WE DELIVER WHAT OTHERS PROMISE",
      features: [
        "Master-level compliance expertise for every industry",
        "8-day setup guarantee that we actually honor",
        "White-glove service that exceeds expectations",
        "Expert humans who solve problems fast",
      ],
    },
    overlook: {
      title: "WHAT OTHERS OVERLOOK",
      items: [
        "Complex industries need expert guidance",
        "Regulated businesses demand proven compliance",
        "Growing companies require scalable solutions",
        "Professional teams deserve premium support",
      ],
    },
    badge: "COMPLIANT ✓",
  },
  stats: {
    title: "BATTLE-TESTED RESULTS",
    stats: [
      {
        value: "98%",
        label: "Client Retention",
        description: "Nobody leaves the family",
      },
      {
        value: "40%",
        label: "Revenue Boost",
        description: "Average first year",
      },
      {
        value: "0",
        label: "Compliance Issues",
        description: "Perfect track record",
      },
    ],
  },
  testimonials: {
    title: {
      highlight: "Real",
      suffix: "Reviews",
    },
    description:
      "From regulated industries to retail giants - businesses that chose excellence over compromise.",
    testimonials: [
      {
        category: "CIGAR LOUNGE",
        quote:
          "The first time we used Gnymble to publicize an event..we had a record turnout!",
        name: "Charles Oxendine",
        company: "Anstead's Tobacco",
        location: "Premium Cigar Association",
      },
      {
        category: "TEAM BUILDER",
        quote:
          "Gnymble transformed our employee communications - streamlined, compliant, and powerful. Their expertise saved us major headaches.",
        name: "David Thompson",
        company: "Thompson Construction Co.",
        location: "Miami, FL",
      },
      {
        category: "PREMIUM CLIENT",
        quote:
          "Lightning-fast 8-day setup delivered exactly as promised. The $179 investment pays for itself - our events are consistently sold out!",
        name: "Marcus Rodriguez",
        company: "Iron & Oak Cigar Lounge",
        location: "Las Vegas, NV",
      },
    ],
  },
};

// PercyMD Content
const percymdContent: HubContentData = {
  hero: {
    fixedText: "HIPAA-compliant SMS for",
    tagline: {
      line1: "Secure. Compliant. Effective.",
      line2: "Patient communication that works.",
    },
    description:
      "HIPAA-compliant SMS solutions designed specifically for healthcare providers. Secure patient communication that meets all compliance requirements.",
    ctaText: "🏥 For healthcare providers who demand SMS that protects",
  },
  cta: {
    title: "Ready to Transform Your",
    titleHighlight: "Patient Communication?",
    description:
      "Experience the platform built for healthcare providers who demand secure, compliant communication.",
    descriptionHighlight:
      "Your patients deserve SMS that protects their privacy and improves their care.",
    steps: [
      {
        number: "01",
        title: "REACH OUT",
        description:
          "Share your practice needs. We craft the perfect HIPAA-compliant solution.",
      },
      {
        number: "02",
        title: "GET SECURED",
        description:
          "Lightning-fast 8-day deployment. Bulletproof HIPAA compliance included.",
      },
      {
        number: "03",
        title: "IMPROVE OUTCOMES",
        description:
          "Connect powerfully with patients, reduce no-shows, and improve care quality.",
      },
    ],
    ctaText: "🏥 GET STARTED NOW",
    ctaSubtext: "📱 SEE THE PROOF",
    guaranteeText:
      "If we can't get you set up in 8 days, your $179 onboarding is free. Plus, we guarantee HIPAA compliance from day one.",
    // badge: undefined, // No badge for this content
  },
  problemSolution: {
    title: {
      prefix: "The Healthcare",
      highlight: "Communication Crisis",
    },
    description:
      "While others struggle with HIPAA compliance and patient privacy, we've cracked the code. We champion healthcare providers who demand secure, effective patient communication.",
    deliver: {
      title: "WE DELIVER HEALTHCARE EXCELLENCE",
      features: [
        "Bulletproof HIPAA compliance built from day one",
        "8-day setup with healthcare-specific expertise",
        "Patient communication that actually improves outcomes",
        "Healthcare experts who understand your challenges",
      ],
    },
    overlook: {
      title: "WHAT OTHERS GET WRONG",
      items: [
        "HIPAA compliance isn't just a checkbox",
        "Patient privacy requires bulletproof security",
        "Healthcare communication needs specialized expertise",
        "Medical practices deserve enterprise-grade solutions",
      ],
    },
    badge: "HIPAA ✓",
  },
  stats: {
    title: "HEALTHCARE-PROVEN RESULTS",
    stats: [
      {
        value: "98%",
        label: "Patient Satisfaction",
        description: "Happy patients, better outcomes",
      },
      {
        value: "40%",
        label: "No-Show Reduction",
        description: "Fewer missed appointments",
      },
      {
        value: "0",
        label: "HIPAA Violations",
        description: "Perfect security record",
      },
    ],
  },
  testimonials: {
    title: {
      highlight: "Real",
      suffix: "Reviews",
    },
    description:
      "From medical practices to specialty clinics - healthcare providers who chose secure, compliant communication over compromise.",
    testimonials: [
      {
        category: "MEDICAL PRACTICE",
        quote:
          "While others struggled with HIPAA compliance, PercyMD delivered bulletproof security in a week - our patient communication has never been smoother!",
        name: "Dr. Sarah Chen",
        company: "Austin Family Medicine",
        location: "Austin, TX",
      },
      {
        category: "SPECIALTY CLINIC",
        quote:
          "PercyMD transformed our patient communications - HIPAA-compliant, secure, and incredibly effective. Our no-show rate dropped by 40%!",
        name: "Dr. Michael Rodriguez",
        company: "Miami Cardiology Associates",
        location: "Miami, FL",
      },
      {
        category: "DENTAL PRACTICE",
        quote:
          "Lightning-fast 8-day setup delivered exactly as promised. The $179 investment pays for itself - our patient satisfaction scores are through the roof!",
        name: "Dr. Jennifer Walsh",
        company: "Las Vegas Dental Group",
        location: "Las Vegas, NV",
      },
    ],
  },
};

// Hub Content Map
const hubContentMap: Record<HubType, HubContentData> = {
  gnymble: gnymbleContent,
  percymd: percymdContent,
  percytech: gnymbleContent, // Default to gnymble for now
  percytext: gnymbleContent, // Default to gnymble for now
};

// Export functions to get specific content
export const getHubHeroContent = (hubType: HubType): HeroContent => {
  return hubContentMap[hubType]?.hero || gnymbleContent.hero;
};

export const getHubCTAContent = (hubType: HubType): CTAContent => {
  return hubContentMap[hubType]?.cta || gnymbleContent.cta;
};

export const getHubProblemSolutionContent = (
  hubType: HubType
): ProblemSolutionContent => {
  return (
    hubContentMap[hubType]?.problemSolution || gnymbleContent.problemSolution
  );
};

export const getHubStatsContent = (hubType: HubType): StatsContent => {
  return hubContentMap[hubType]?.stats || gnymbleContent.stats;
};

export const getHubTestimonialsContent = (
  hubType: HubType
): TestimonialsContent => {
  return hubContentMap[hubType]?.testimonials || gnymbleContent.testimonials;
};

export const getHubContent = (hubType: HubType): HubContentData => {
  return hubContentMap[hubType] || gnymbleContent;
};

// Export individual content objects for backward compatibility
export const gnymbleHero = gnymbleContent.hero;
export const gnymbleCTA = gnymbleContent.cta;
export const gnymbleProblemSolution = gnymbleContent.problemSolution;
export const gnymbleStats = gnymbleContent.stats;
export const gnymbleTestimonials = gnymbleContent.testimonials;

export const percymdHero = percymdContent.hero;
export const percymdCTA = percymdContent.cta;
export const percymdProblemSolution = percymdContent.problemSolution;
export const percymdStats = percymdContent.stats;
export const percymdTestimonials = percymdContent.testimonials;
