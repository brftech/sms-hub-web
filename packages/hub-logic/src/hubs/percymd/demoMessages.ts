/**
 * PercyMD Demo Messages - Healthcare focused
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

export const percymdDemoMessages: DemoScenario[] = [
  {
    id: 1,
    title: "Appointment Reminder",
    messages: [
      {
        id: "scenario-1-1",
        content:
          "Hi Jennifer! This is Riverside Medical Center. Reminder: Dr. Smith appointment tomorrow at 10:30 AM. Reply 'C' to confirm or 'R' to reschedule. Please arrive 15 min early.",
        sender: "business",
        timestamp: new Date(),
        businessName: "Riverside Medical Center",
        metadata: { source: "demo-scenario" },
      },
      {
        id: "scenario-1-2",
        content: "C - I'll be there!",
        sender: "user",
        timestamp: new Date(),
        metadata: { source: "demo-scenario" },
      },
      {
        id: "scenario-1-3",
        content: "Great! See you tomorrow at 10:30 AM. Bring your insurance card and photo ID. Reply STOP to opt out.",
        sender: "business",
        timestamp: new Date(),
        businessName: "",
        metadata: { source: "demo-scenario" },
      },
    ],
  },
  {
    id: 2,
    title: "Lab Results Ready",
    messages: [
      {
        id: "scenario-2-1",
        content:
          "Your recent lab results are ready. Please log in to your patient portal to view them securely. Contact us at (555) 123-4567 if you have questions.",
        sender: "business",
        timestamp: new Date(),
        businessName: "Riverside Medical Center",
        metadata: { source: "demo-scenario" },
      },
      {
        id: "scenario-2-2",
        content: "Thanks! I'll check the portal now.",
        sender: "user",
        timestamp: new Date(),
        metadata: { source: "demo-scenario" },
      },
    ],
  },
  {
    id: 3,
    title: "Prescription Ready",
    messages: [
      {
        id: "scenario-3-1",
        content:
          "📋 Your prescription is ready for pickup at our pharmacy. We're open until 8 PM today. Bring your ID. Questions? Call (555) 123-4567.",
        sender: "business",
        timestamp: new Date(),
        businessName: "Riverside Medical Center",
        metadata: { source: "demo-scenario" },
      },
      {
        id: "scenario-3-2",
        content: "Perfect timing! I'll pick it up on my way home from work around 6 PM.",
        sender: "user",
        timestamp: new Date(),
        metadata: { source: "demo-scenario" },
      },
      {
        id: "scenario-3-3",
        content: "Sounds good! We'll have it ready at the counter for you. See you at 6 PM! 🏥",
        sender: "business",
        timestamp: new Date(),
        businessName: "",
        metadata: { source: "demo-scenario" },
      },
    ],
  },
];

