/**
 * Gnymble Demo Messages - Cigar lounge focused
 */

import { ChatMessage } from "@sms-hub/ui";

export interface DemoScenario {
  id: number;
  title: string;
  messages: ChatMessage[];
}

export const gnymbleDemoMessages: DemoScenario[] = [
  {
    id: 1,
    title: "Gnymble Events",
    messages: [
      {
        id: "scenario-1-1",
        content:
          "Upcoming Events Bryan\n\n9/7  NFL Opener Lounge Potluck\n9/8  Now OPEN Mondays at 3p for Football\n9/19 Zino Davidoff Night 4p to 8p\n10/4 Quesada Oktoberfest",
        sender: "business",
        timestamp: new Date(),
        businessName: "",
        metadata: { source: "demo-scenario" },
      },
      {
        id: "scenario-1-2",
        content: "Perfect! I'll be there for the NFL opener. What should I bring for the potluck?",
        sender: "user",
        timestamp: new Date(),
        metadata: { source: "demo-scenario" },
      },
      {
        id: "scenario-1-3",
        content: "You can get tickets, and learn more about Gnymble, on IG @gnymble! See you soon!",
        sender: "business",
        timestamp: new Date(),
        businessName: "",
        metadata: { source: "demo-scenario" },
      },
    ],
  },
  {
    id: 2,
    title: "Event Announcement",
    messages: [
      {
        id: "scenario-2-1",
        content:
          "🔥 EXCLUSIVE: Drew Estate Masterclass this Saturday 7PM! Master blender Jonathan Drew will be here. Only 15 spots left. Age 21+ required. Call to RSVP!",
        sender: "business",
        timestamp: new Date(),
        businessName: "Gnymble Cigars",
        metadata: { source: "demo-scenario" },
      },
      {
        id: "scenario-2-2",
        content: "Absolutely! Can't wait to meet Jonathan Drew. Count me in!",
        sender: "user",
        timestamp: new Date(),
        metadata: { source: "demo-scenario" },
      },
    ],
  },
  {
    id: 3,
    title: "New Arrivals",
    messages: [
      {
        id: "scenario-3-1",
        content:
          "Just Arrived at Gnymble Cigars: 🚨 Limited Edition Arturo Fuente Opus X 25th Anniversary! Only 2 boxes available. These won't last long. First come, first served!",
        sender: "business",
        timestamp: new Date(),
        businessName: "",
        metadata: { source: "demo-scenario" },
      },
      {
        id: "scenario-3-2",
        content: "I'll take one box! Can I pick it up tonight?",
        sender: "user",
        timestamp: new Date(),
        metadata: { source: "demo-scenario" },
      },
      {
        id: "scenario-3-3",
        content: "Reserved for you! We're open until 10pm. See you soon! 🎉",
        sender: "business",
        timestamp: new Date(),
        businessName: "",
        metadata: { source: "demo-scenario" },
      },
    ],
  },
];

