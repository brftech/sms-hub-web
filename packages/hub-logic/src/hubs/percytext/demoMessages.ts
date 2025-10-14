/**
 * PercyText Demo Messages - Fitness/Wellness focused
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

export const percytextDemoMessages: DemoScenario[] = [
  {
    id: 1,
    title: "Class Reminder",
    messages: [
      {
        id: "scenario-1-1",
        content:
          "Hey Alex! Your Yoga Flow class is tomorrow at 6:00 PM with instructor Maya. Don't forget your mat! Reply 'C' to confirm or 'CANCEL' to cancel (12hr notice required).",
        sender: "business",
        timestamp: new Date(),
        businessName: "Zenith Fitness Studio",
        metadata: { source: "demo-scenario" },
      },
      {
        id: "scenario-1-2",
        content: "C - Can't wait! Is there still space in the class?",
        sender: "user",
        timestamp: new Date(),
        metadata: { source: "demo-scenario" },
      },
      {
        id: "scenario-1-3",
        content: "Yes! Only 3 spots left. You're all set for tomorrow at 6 PM. Arrive 10 min early to set up. 🧘",
        sender: "business",
        timestamp: new Date(),
        businessName: "",
        metadata: { source: "demo-scenario" },
      },
    ],
  },
  {
    id: 2,
    title: "New Class Alert",
    messages: [
      {
        id: "scenario-2-1",
        content:
          "🎉 NEW CLASS ALERT: High-Intensity Interval Training (HIIT) starts next Monday! 7 AM & 6 PM sessions. First class FREE for members. Text 'HIIT' to register!",
        sender: "business",
        timestamp: new Date(),
        businessName: "Zenith Fitness Studio",
        metadata: { source: "demo-scenario" },
      },
      {
        id: "scenario-2-2",
        content: "HIIT - I'll try the 6 PM class!",
        sender: "user",
        timestamp: new Date(),
        metadata: { source: "demo-scenario" },
      },
      {
        id: "scenario-2-3",
        content: "Awesome! You're registered for Monday 6 PM HIIT. Bring water and a towel. Get ready to sweat! 💪",
        sender: "business",
        timestamp: new Date(),
        businessName: "",
        metadata: { source: "demo-scenario" },
      },
    ],
  },
  {
    id: 3,
    title: "Membership Update",
    messages: [
      {
        id: "scenario-3-1",
        content:
          "Hi Taylor! Your monthly membership renews in 3 days. We've added NEW perks: Free guest passes (2/month) & nutrition consultations. Enjoy! 🌟",
        sender: "business",
        timestamp: new Date(),
        businessName: "Zenith Fitness Studio",
        metadata: { source: "demo-scenario" },
      },
      {
        id: "scenario-3-2",
        content: "Love the new perks! How do I schedule a nutrition consultation?",
        sender: "user",
        timestamp: new Date(),
        metadata: { source: "demo-scenario" },
      },
      {
        id: "scenario-3-3",
        content: "Check our app or reply 'NUTRITION' to see available times. Our nutritionist Sarah has slots this week!",
        sender: "business",
        timestamp: new Date(),
        businessName: "",
        metadata: { source: "demo-scenario" },
      },
    ],
  },
];

