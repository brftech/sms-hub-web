/**
 * PercyTech Pricing Page Content
 */

import type { PricingPageContent } from "../../types";

export const percytechPricing: PricingPageContent = {
  badge: "TRANSPARENT PRICING",
  title: "Enterprise SMS",
  subtitle: "without enterprise complexity",
  description: "Reliable, scalable SMS with developer-friendly APIs and transparent pricing.",
  highlightText: "Enterprise infrastructure. Fair pricing. No surprises. No BS.",
  whyChooseUs: [
    {
      title: "Enterprise Without the Tax",
      description:
        "99.9% uptime, redundant infrastructure, scalable delivery - without paying enterprise markup. Reliable SMS shouldn't require a six-figure contract.",
    },
    {
      title: "Developer Friendly",
      description:
        "Clean APIs, comprehensive docs, helpful errors, and fast support. Built for developers who have real work to do, not endless time for troubleshooting.",
    },
    {
      title: "Transparent & Predictable",
      description:
        "No surprise fees. No hidden charges. Clear pricing that makes sense. You always know what you're paying and why. No bill shock, ever.",
    },
  ],
  faqs: [
    {
      q: "How quickly can I get started?",
      a: "Most businesses are live within 7-10 business days. For API integrations, our docs get you sending messages in hours. We handle the carrier and compliance setup.",
    },
    {
      q: "Do you offer API access?",
      a: "Yes, all plans include full API access with comprehensive documentation. RESTful APIs, webhooks, and real-time delivery tracking.",
    },
    {
      q: "Can I upgrade as my volume grows?",
      a: "Yes, upgrade or downgrade anytime. Most businesses start with one plan and scale up as they grow. We'll help optimize based on usage.",
    },
    {
      q: "Do you offer enterprise pricing?",
      a: "Yes. For high-volume senders (50K+ messages/month), we offer custom enterprise pricing with dedicated support, SLA guarantees, and volume discounts.",
    },
    {
      q: "What's your uptime guarantee?",
      a: "We maintain 99.9% uptime with redundant infrastructure and 24/7 monitoring. Enterprise plans include SLA guarantees with credits for downtime.",
    },
  ],
  ctaTitle: "Ready for enterprise SMS that makes sense?",
  ctaDescription:
    "Reliable infrastructure, developer-friendly tools, and support that actually helps.",
};
