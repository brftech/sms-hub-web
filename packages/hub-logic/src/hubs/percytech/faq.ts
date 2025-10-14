/**
 * PercyTech FAQ Page Content
 */

import type { FAQPageContent } from "../../types";

export const percytechFAQ: FAQPageContent = {
  title: "Questions about",
  subtitle: "the platform",
  description:
    "Common questions about our SMS platform, features, and capabilities for businesses looking for enterprise-grade messaging solutions.",
  badges: ["Enterprise ready", "Developer friendly", "Scalable"],
  categories: [
    {
      category: "Getting Started",
      items: [
        {
          id: "why-different",
          question: "What makes PercyTech different from other SMS platforms?",
          answer:
            "PercyTech is built for businesses that need reliability, compliance, and scale. We offer enterprise-grade infrastructure, developer-friendly APIs, comprehensive analytics, and expert support - without the enterprise pricing of competitors like Twilio.",
        },
        {
          id: "setup-time",
          question: "How quickly can I get started?",
          answer:
            "Setup typically takes 7-10 business days for full deployment. We handle carrier registrations, compliance setup, platform configuration, and team training. For API integrations, our developer docs get you sending messages in hours.",
        },
        {
          id: "onboarding-cost",
          question: "What does the $179 onboarding include?",
          answer:
            "The $179 covers platform setup, carrier approvals, compliance consultation, team training, API access, and your first month of service. It's a one-time investment that ensures you're set up correctly from day one.",
        },
      ],
    },
    {
      category: "Features & Capabilities",
      items: [
        {
          id: "api-access",
          question: "Do you provide API access?",
          answer:
            "Yes. All plans include full API access with comprehensive documentation. Send messages, manage contacts, track delivery, and integrate with your existing systems. We support RESTful APIs and webhooks for real-time updates.",
        },
        {
          id: "integrations",
          question: "What integrations do you support?",
          answer:
            "We integrate with Zapier, Salesforce, HubSpot, Shopify, and more. Our API allows custom integrations with any system. We also provide pre-built connectors for popular CRMs and e-commerce platforms.",
        },
        {
          id: "analytics",
          question: "What analytics and reporting do you provide?",
          answer:
            "Comprehensive analytics including delivery rates, response rates, opt-out tracking, campaign performance, and ROI metrics. Export reports, set up automated dashboards, and track every message with detailed logs.",
        },
      ],
    },
    {
      category: "Pricing & Billing",
      items: [
        {
          id: "total-cost",
          question: "What's the total cost to get started?",
          answer:
            "$179 to get started (setup + first month). Monthly plans start at $79/month. No contracts, no hidden fees. Pay only for what you use with transparent per-message pricing.",
        },
        {
          id: "plan-changes",
          question: "Can I upgrade as my volume grows?",
          answer:
            "Yes. Upgrade or downgrade anytime. Most businesses start with one plan and scale up as they grow. We'll help you optimize your plan based on actual usage patterns.",
        },
        {
          id: "enterprise",
          question: "Do you offer enterprise pricing?",
          answer:
            "Yes. For high-volume senders (50K+ messages/month), we offer custom enterprise pricing with dedicated support, SLA guarantees, and volume discounts. Contact us for a custom quote.",
        },
      ],
    },
    {
      category: "Technical Questions",
      items: [
        {
          id: "uptime",
          question: "What's your uptime guarantee?",
          answer:
            "We maintain 99.9% uptime with redundant infrastructure and 24/7 monitoring. Enterprise plans include SLA guarantees with credits for any downtime that exceeds our commitment.",
        },
        {
          id: "throughput",
          question: "How many messages can I send per minute?",
          answer:
            "Throughput varies by plan: Starter (10/min), Core (40/min), Elite (200/min). Enterprise plans support thousands per minute with dedicated infrastructure for high-volume campaigns.",
        },
        {
          id: "support",
          question: "What kind of technical support do you provide?",
          answer:
            "Email and chat support for all plans. Elite and Enterprise plans get priority support with faster response times. We also provide comprehensive API documentation, code examples, and dedicated account management for enterprise customers.",
        },
      ],
    },
  ],
  ctaTitle: "Ready for enterprise-grade SMS?",
  ctaDescription:
    "Reliable messaging, developer-friendly APIs, and expert support. Built for businesses that need SMS they can count on.",
};

/**
 * ABOUT PAGE CONTENT
 */
