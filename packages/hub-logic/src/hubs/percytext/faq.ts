/**
 * PercyText FAQ Page Content
 */

import type { FAQPageContent } from "../../types";

export const percytextFAQ: FAQPageContent = {
  title: "Questions about",
  subtitle: "simple SMS messaging",
  description:
    "Common questions about our straightforward SMS platform for businesses that just need reliable, easy-to-use text messaging.",
  badges: ["Easy setup", "No complexity", "Fair pricing"],
  categories: [
    {
      category: "Getting Started",
      items: [
        {
          id: "why-different",
          question: "What makes PercyText simple?",
          answer:
            "No enterprise complexity, no overwhelming features. PercyText gives you exactly what you need: send texts, track delivery, manage contacts. Clean interface, straightforward pricing, and support when you need it.",
        },
        {
          id: "setup-time",
          question: "How fast can I start sending messages?",
          answer:
            "Most customers are sending messages within 7-10 days. We handle the carrier approvals and compliance setup. You focus on your messages, we handle the technical stuff.",
        },
        {
          id: "technical-knowledge",
          question: "Do I need technical knowledge?",
          answer:
            "Nope. Our platform is designed for non-technical users. If you can send an email, you can use PercyText. For developers, we also provide API access for custom integrations.",
        },
      ],
    },
    {
      category: "Features",
      items: [
        {
          id: "what-can-do",
          question: "What can I do with PercyText?",
          answer:
            "Send one-off messages or bulk campaigns, schedule messages for later, manage contact lists, track delivery, handle opt-outs automatically, and see basic analytics. Everything you need, nothing you don't.",
        },
        {
          id: "contact-management",
          question: "How does contact management work?",
          answer:
            "Upload contacts via CSV, add them manually, or integrate with your existing systems. We automatically handle opt-outs, invalid numbers, and duplicates. Keep your lists clean without the hassle.",
        },
        {
          id: "api-available",
          question: "Do you have an API?",
          answer:
            "Yes. All plans include API access. Simple REST API with clear documentation. Send messages from your app, website, or internal systems. No complex setup required.",
        },
      ],
    },
    {
      category: "Pricing",
      items: [
        {
          id: "total-cost",
          question: "What's the total cost?",
          answer:
            "$179 to get started (includes setup + first month). Then $79-$349/month depending on your volume. No surprise fees, no per-message charges within your plan limits.",
        },
        {
          id: "plan-selection",
          question: "How do I know which plan to choose?",
          answer:
            "Start with the plan that matches your monthly message volume. Most small businesses start with Core (1,500 messages/month). You can always adjust later based on actual usage.",
        },
        {
          id: "overage-fees",
          question: "What if I go over my plan limit?",
          answer:
            "We'll notify you before you hit your limit. You can either upgrade your plan or pay a small per-message fee for overages. No bill shock - you're always in control.",
        },
      ],
    },
    {
      category: "Support",
      items: [
        {
          id: "help-available",
          question: "What if I need help?",
          answer:
            "Email and chat support for all plans. We respond fast and actually help solve your problems. No chatbots, no runaround. Real people who know SMS and want you to succeed.",
        },
        {
          id: "getting-started-help",
          question: "Will you help me get started?",
          answer:
            "Absolutely. Every new customer gets onboarding support. We'll help you upload contacts, send your first campaign, and answer any questions. We want you to feel confident using the platform.",
        },
        {
          id: "compliance-help",
          question: "Do you help with compliance?",
          answer:
            "Yes. We handle the technical compliance (TCPA, carrier requirements) automatically. We'll also provide best practices for opt-ins, opt-outs, and message content to keep you compliant.",
        },
      ],
    },
  ],
  ctaTitle: "Ready for straightforward SMS?",
  ctaDescription:
    "No complexity. No surprises. Just reliable text messaging that works. Get started in minutes, not weeks.",
};

/**
 * ABOUT PAGE CONTENT
 */
