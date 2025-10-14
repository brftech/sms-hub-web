/**
 * PercyTech Demo Messages - General business focused
 */

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "business";
  timestamp: Date;
  businessName?: string;
  metadata?: Record<string, unknown>;
}

export interface DemoScenario {
  id: number;
  title: string;
  messages: ChatMessage[];
}

export const percytechDemoMessages: DemoScenario[] = [
  {
    id: 1,
    title: "Appointment Reminder",
    messages: [
      {
        id: "scenario-1-1",
        content:
          "Hi Sarah! This is PercyTech Services. Reminder: Your consultation is scheduled for tomorrow at 2:00 PM. Reply 'C' to confirm or 'R' to reschedule.",
        sender: "business",
        timestamp: new Date(),
        businessName: "PercyTech Services",
        metadata: { source: "demo-scenario" },
      },
      {
        id: "scenario-1-2",
        content: "C - Looking forward to it!",
        sender: "user",
        timestamp: new Date(),
        metadata: { source: "demo-scenario" },
      },
      {
        id: "scenario-1-3",
        content: "Perfect! We'll see you tomorrow at 2 PM. Please arrive 10 minutes early to complete any necessary paperwork.",
        sender: "business",
        timestamp: new Date(),
        businessName: "",
        metadata: { source: "demo-scenario" },
      },
    ],
  },
  {
    id: 2,
    title: "Service Update",
    messages: [
      {
        id: "scenario-2-1",
        content:
          "📢 Important Update: We've expanded our hours! Now open Monday-Saturday 8 AM - 7 PM. Same great service, more convenient times for you!",
        sender: "business",
        timestamp: new Date(),
        businessName: "PercyTech Services",
        metadata: { source: "demo-scenario" },
      },
      {
        id: "scenario-2-2",
        content: "That's great! Can I schedule an appointment for this Saturday morning?",
        sender: "user",
        timestamp: new Date(),
        metadata: { source: "demo-scenario" },
      },
      {
        id: "scenario-2-3",
        content: "Absolutely! We have availability at 9 AM and 11 AM. Which works better for you?",
        sender: "business",
        timestamp: new Date(),
        businessName: "",
        metadata: { source: "demo-scenario" },
      },
    ],
  },
  {
    id: 3,
    title: "Customer Follow-up",
    messages: [
      {
        id: "scenario-3-1",
        content:
          "Hi Mark! Thanks for visiting us last week. How is everything working out? We'd love to hear your feedback!",
        sender: "business",
        timestamp: new Date(),
        businessName: "PercyTech Services",
        metadata: { source: "demo-scenario" },
      },
      {
        id: "scenario-3-2",
        content: "Everything's been great! Really happy with the service. Will definitely recommend to friends.",
        sender: "user",
        timestamp: new Date(),
        metadata: { source: "demo-scenario" },
      },
      {
        id: "scenario-3-3",
        content: "That's wonderful to hear! We appreciate your business and referrals. Thank you! 🙏",
        sender: "business",
        timestamp: new Date(),
        businessName: "",
        metadata: { source: "demo-scenario" },
      },
    ],
  },
];

