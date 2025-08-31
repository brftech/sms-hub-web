// Hub-specific demo scenarios for the PhoneInteractive component
// These are static scenarios that cycle through to showcase different use cases per hub

export interface DemoMessage {
  id: string;
  text: string;
  sender: "user" | "business";
  timestamp: string;
  businessName?: string;
  metadata: { source: string; [key: string]: string | number | boolean };
}

export interface DemoScenario {
  id: number;
  title: string;
  messages: DemoMessage[];
}

// Gnymble-specific scenarios (retail/consumer focus)
export const GNYMBLE_SCENARIOS: DemoScenario[] = [
  {
    id: 1,
    title: "Flash Sale Alert",
    messages: [
      {
        id: "gnymble-1-1",
        text: "🔥 FLASH SALE: 30% off all premium cigars today only! Limited stock available. Shop now before midnight!",
        sender: "business",
        timestamp: new Date().toISOString(),
        businessName: "Premium Cigars & Co",
        metadata: { source: "gnymble-demo", scenario: "flash-sale" },
      },
      {
        id: "gnymble-1-2",
        text: "Perfect timing! I've been eyeing those Montecristo No. 2s. On my way!",
        sender: "user",
        timestamp: new Date().toISOString(),
        metadata: { source: "gnymble-demo", intent: "purchase" },
      },
    ],
  },
  {
    id: 2,
    title: "Customer Loyalty",
    messages: [
      {
        id: "gnymble-2-1",
        text: "🎉 Congratulations! You've earned VIP status. Enjoy 15% off all purchases, early access to new arrivals, and complimentary humidor maintenance!",
        sender: "business",
        timestamp: new Date().toISOString(),
        businessName: "Elite Tobacco Lounge",
        metadata: { source: "gnymble-demo", scenario: "loyalty" },
      },
      {
        id: "gnymble-2-2",
        text: "This is amazing! Thank you for taking such great care of your customers. 🙏",
        sender: "user",
        timestamp: new Date().toISOString(),
        metadata: { source: "gnymble-demo", sentiment: "positive" },
      },
    ],
  },
  {
    id: 3,
    title: "Event Invitation",
    messages: [
      {
        id: "gnymble-3-1",
        text: "🥃 Join us Friday 7PM for our monthly whiskey & cigar pairing event! This month: Macallan 18 with Drew Estate Liga Privada. $85 per person. RSVP required.",
        sender: "business",
        timestamp: new Date().toISOString(),
        businessName: "The Cigar Room",
        metadata: { source: "gnymble-demo", scenario: "event" },
      },
    ],
  },
];

// PercyTech-specific scenarios (B2B/enterprise focus)
export const PERCYTECH_SCENARIOS: DemoScenario[] = [
  {
    id: 1,
    title: "Campaign Performance",
    messages: [
      {
        id: "percytech-1-1",
        text: "📊 Your SMS campaign achieved 45% open rate and 12% conversion rate! That's 3x higher than industry average. Ready to scale up your messaging strategy?",
        sender: "business",
        timestamp: new Date().toISOString(),
        businessName: "PercyTech Analytics",
        metadata: { source: "percytech-demo", scenario: "performance" },
      },
      {
        id: "percytech-1-2",
        text: "These results are incredible! Let's discuss expanding to our other product lines. Can we schedule a strategy call this week?",
        sender: "user",
        timestamp: new Date().toISOString(),
        metadata: { source: "percytech-demo", intent: "expansion" },
      },
    ],
  },
  {
    id: 2,
    title: "System Integration",
    messages: [
      {
        id: "percytech-2-1",
        text: "🔧 Your CRM integration is complete! PercyTech now syncs automatically with Salesforce. Customer data flows seamlessly for targeted campaigns. View dashboard →",
        sender: "business",
        timestamp: new Date().toISOString(),
        businessName: "PercyTech Support",
        metadata: { source: "percytech-demo", scenario: "integration" },
      },
      {
        id: "percytech-2-2",
        text: "Fantastic! This will save our team hours every week. The automation is exactly what we needed.",
        sender: "user",
        timestamp: new Date().toISOString(),
        metadata: { source: "percytech-demo", sentiment: "satisfied" },
      },
    ],
  },
  {
    id: 3,
    title: "Enterprise Onboarding",
    messages: [
      {
        id: "percytech-3-1",
        text: "🚀 Welcome to PercyTech Enterprise! Your dedicated account manager is Sarah Chen. She'll help optimize your messaging strategy and ensure 99.9% uptime. Schedule intro call →",
        sender: "business",
        timestamp: new Date().toISOString(),
        businessName: "PercyTech Enterprise",
        metadata: { source: "percytech-demo", scenario: "onboarding" },
      },
    ],
  },
];

export const getHubScenarios = (
  hub: "gnymble" | "percytech"
): DemoScenario[] => {
  return hub === "gnymble" ? GNYMBLE_SCENARIOS : PERCYTECH_SCENARIOS;
};
