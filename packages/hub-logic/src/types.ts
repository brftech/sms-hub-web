/**
 * Shared types for hub-logic package
 */

// Hub Types
export type HubType = "gnymble" | "percytech" | "percymd" | "percytext";

export interface HubConfig {
  id: number;
  name: string;
  hubNumber: number;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

// Hub color configuration
export interface HubColors {
  primary: string;
  secondary: string;
  accent: string;
  tailwind: {
    text: string;
    textHover: string;
    bg: string;
    bgHover: string;
    bgLight: string;
    border: string;
    borderLight: string;
    gradient: string;
    shadow: string;
    contactButton: string;
  };
}

// Hub metadata extended with colors and assets
export interface HubMetadata {
  id: number;
  name: string;
  displayName: string;
  domain: string;
  iconPath: string;
  description: string;
  color: string;
  colors?: HubColors;
}

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
  shaftNote?: string;
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

// FAQ Content Types
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQCategory {
  category: string;
  items: FAQItem[];
}

export interface FAQPageContent {
  title: string;
  subtitle: string;
  description: string;
  badges: string[];
  categories: FAQCategory[];
  ctaTitle: string;
  ctaDescription: string;
}

// About Content Types
export interface AboutPageContent {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  highlightText: string;
  badges: string[];
  storyTitle: string;
  storyParagraphs: string[];
  valuesTitle: string;
  values: Array<{
    title: string;
    description: string;
  }>;
  founderSection: {
    title: string;
    subtitle: string;
    quote: string;
    name: string;
    role: string;
  };
  ctaTitle: string;
  ctaDescription: string;
}

// Pricing Content Types
export interface PricingPageContent {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  highlightText: string;
  whyChooseUs: Array<{
    title: string;
    description: string;
  }>;
  faqs: Array<{
    q: string;
    a: string;
  }>;
  ctaTitle: string;
  ctaDescription: string;
}

// Complete Hub Content
export interface HubContentData {
  hero: HeroContent;
  cta: CTAContent;
  problemSolution: ProblemSolutionContent;
  stats: StatsContent;
  testimonials: TestimonialsContent;
}
