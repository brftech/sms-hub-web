/**
 * Gnymble FAQ Page Content
 */

import type { FAQPageContent } from "../../types";

export const gnymbleFAQ: FAQPageContent = {
  title: "Questions from",
  subtitle: "regulated businesses",
  description:
    "The most common questions we get from cigar retailers, private clubs, and premium venues about SMS compliance and our platform.",
  badges: ["No rejections", "Industry expertise", "Real support"],
  categories: [
    {
      category: "Getting Started",
      items: [
        {
          id: "why-different",
          question: "Why should I use you instead of other SMS platforms?",
          answer:
            "Most SMS platforms reject cigar retailers, private clubs, and premium venues as 'high-risk.' We built our platform specifically for regulated businesses. We understand your compliance needs, never ban accounts, and provide industry-specific expertise that generic platforms can't offer.",
        },
        {
          id: "setup-time",
          question: "How long does setup actually take?",
          answer:
            "Setup takes 7-10 business days from payment to going live. We handle carrier approvals, compliance setup, platform configuration, and training. You'll have a dedicated specialist who keeps you updated every step of the way.",
        },
        {
          id: "onboarding-cost",
          question: "Why do you charge $179 for onboarding?",
          answer:
            "The $179 covers compliance consultation, carrier approvals, platform setup, training, and your first month of service. It's a one-time fee that ensures you're set up correctly and compliantly from day one. Most competitors charge much more for similar setup services.",
        },
      ],
    },
    {
      category: "Compliance & Regulations",
      items: [
        {
          id: "shaft-compliance",
          question: "How do you handle SHAFT compliance?",
          answer:
            "We specialize in messaging for alcohol, firearms, and tobacco businesses. Our platform includes age-gated opt-ins, compliant content templates, proper carrier registration, and ongoing monitoring to ensure you stay within regulations.",
        },
        {
          id: "tcpa-compliance",
          question: "What about TCPA compliance?",
          answer:
            "We provide comprehensive TCPA compliance including proper consent collection, opt-out management, and audit trails. Our platform automatically handles compliance requirements and we provide ongoing monitoring to ensure you stay compliant.",
        },
        {
          id: "legal-support",
          question: "Do you provide legal support for compliance issues?",
          answer:
            "While we're not a law firm, we have extensive experience with regulated business compliance and can connect you with legal experts who specialize in your industry. Our compliance features are designed to meet regulatory requirements.",
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
            "$179 total to get started. This includes setup, compliance consultation, training, and your first month of service. After that, monthly plans start at $79/month. No contracts, no hidden fees, no surprises.",
        },
        {
          id: "plan-changes",
          question: "Can I change plans later?",
          answer:
            "Yes, you can upgrade or downgrade at any time after your first month. Most businesses start with one plan and adjust based on their actual usage. We'll help you pick the right plan as your business grows.",
        },
        {
          id: "no-contract",
          question: "Are there contracts or cancellation fees?",
          answer:
            "No contracts. After the initial onboarding, all plans are month-to-month. You can cancel at any time with 30 days notice. No cancellation fees, no penalties.",
        },
        {
          id: "what-included",
          question: "What's included in every plan?",
          answer:
            "Every plan includes: dedicated phone number(s), full compliance monitoring, customer support, message delivery, analytics, and all core platform features. Plans differ by SMS volume, contacts, users, phone numbers, throughput, and segments.",
        },
      ],
    },
    {
      category: "For Specific Industries",
      items: [
        {
          id: "cigar-lounges",
          question: "Do you work with cigar lounges and retailers?",
          answer:
            "Absolutely. Cigar retailers are one of our core specialties. We understand tobacco marketing restrictions, help with age verification, and ensure your messaging stays compliant while engaging your customers.",
        },
        {
          id: "gun-ranges",
          question: "Can firearms dealers and ranges use your platform?",
          answer:
            "Yes. We work with gun ranges, sporting goods stores, and firearms dealers. We understand ATF regulations and ensure your messaging complies with industry-specific requirements.",
        },
        {
          id: "alcohol-venues",
          question: "Do you support breweries, distilleries, and wine bars?",
          answer:
            "Definitely. We work with craft breweries, distilleries, wine bars, and liquor retailers. We handle age verification, comply with alcohol marketing regulations, and help you engage customers effectively.",
        },
      ],
    },
  ],
  ctaTitle: "Ready to start texting without rejection?",
  ctaDescription:
    "No more SMS rejections. No compliance headaches. Just professional texting that works for your regulated business.",
};

