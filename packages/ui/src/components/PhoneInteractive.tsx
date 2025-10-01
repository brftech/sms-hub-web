// =============================================================================
// PHONE INTERACTIVE COMPONENT - PROPERLY ARCHITECTED
// =============================================================================

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useLiveMessaging } from "../contexts/LiveMessagingContext";
import SMSAuthModal from "./SMSAuthModal";
// Removed logger import - using console for debugging
import { ChatMessage } from "../types";
import "../styles/phone-components.css";

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface DemoScenario {
  id: number;
  title: string;
  messages: ChatMessage[];
}

interface PhoneState {
  isDemoActive: boolean;
  isInputFocused: boolean;
  currentScenarioIndex: number;
  isTransitioning: boolean;
  showSMSAuth: boolean;
  isAuthenticated: boolean;
  showInfo: boolean;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const DEMO_SCENARIOS: DemoScenario[] = [
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
        businessName: "Premium Cigars & Co",
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
        content: "Hold one for me! I'll be there in 30 minutes.",
        sender: "user",
        timestamp: new Date(),
        businessName: "User",
        metadata: { source: "demo-scenario" },
      },
      {
        id: "scenario-3-3",
        content: "Great, Bryan! You can always check us out on IG also, @gnymble",
        sender: "business",
        timestamp: new Date(),
        businessName: "",
        metadata: { source: "demo-scenario" },
      },
    ],
  },
  {
    id: 4,
    title: "Industry News",
    messages: [
      {
        id: "scenario-4-1",
        content:
          "🎉 BIG NEWS: We're now the exclusive regional dealer for Davidoff's new Master Selection series! Follow our Instagram @premiumcigarsco for the launch party details tomorrow!",
        sender: "business",
        timestamp: new Date(),
        businessName: "Premium Cigars & Co",
        metadata: { source: "demo-scenario" },
      },
    ],
  },
  {
    id: 5,
    title: "Band Event Special",
    messages: [
      {
        id: "scenario-5-1",
        content:
          "🎵 LIVE MUSIC TONIGHT! The Blue Notes Jazz Trio performing 8-11pm at Gnymble Cigars! Special event pricing: 20% off premium cigars & craft cocktails. Reservations recommended!",
        sender: "business",
        timestamp: new Date(),
        businessName: "",
        metadata: { source: "demo-scenario" },
      },
      {
        id: "scenario-5-2",
        content: "Sounds amazing! What's the cover charge?",
        sender: "user",
        timestamp: new Date(),
        metadata: { source: "demo-scenario" },
      },
      {
        id: "scenario-5-3",
        content:
          "No cover charge, Bryan! Just purchase a drink or cigar to enjoy the show. VIP seating available with bottle service. Call us at (555) 123-GNYM to reserve your spot!",
        sender: "business",
        timestamp: new Date(),
        businessName: "",
        metadata: { source: "demo-scenario" },
      },
    ],
  },
];

const PLACEHOLDER_TEXTS = [
  "Ask about our humidor...",
  "Upcoming cigar events?",
  "New arrivals this week?",
  "VIP membership info?",
  "Schedule a tasting...",
  "Premium cigar recommendations?",
];

const DEMO_STARTER_MESSAGE =
  "Hey there! 👋 I'm Smokey, your SMS Hub AI assistant. This is a simulation - no real SMS will be sent. Want to see what I can do? Ask me anything about premium cigars, events, or our exclusive lounge experience! 🚬✨";

// =============================================================================
// COMPONENT
// =============================================================================

export default function PhoneInteractive() {
  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================

  const [phoneState, setPhoneState] = useState<PhoneState>({
    isDemoActive: false,
    isInputFocused: false,
    currentScenarioIndex: 0,
    isTransitioning: false,
    showSMSAuth: false,
    isAuthenticated: false,
    showInfo: false,
  });

  const [inputValue, setInputValue] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([]);

  // =============================================================================
  // REFS
  // =============================================================================

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // =============================================================================
  // CONTEXT
  // =============================================================================

  const { addMessage, state: messagingState } = useLiveMessaging();

  // =============================================================================
  // EFFECTS
  // =============================================================================

  // Cycle through placeholder texts
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_TEXTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Scenario cycling (paused when demo is active or user interacts)
  useEffect(() => {
    if (phoneState.isDemoActive || phoneState.isTransitioning) return;

    const interval = setInterval(() => {
      setPhoneState((prev) => ({ ...prev, isTransitioning: true }));

      setTimeout(() => {
        setPhoneState((prev) => ({
          ...prev,
          currentScenarioIndex: (prev.currentScenarioIndex + 1) % DEMO_SCENARIOS.length,
          isTransitioning: false,
        }));
      }, 500);
    }, 8000);

    return () => clearInterval(interval);
  }, [phoneState.isDemoActive, phoneState.isTransitioning]);

  // Auto-scroll to bottom when messages change (only if we have messages and are in demo mode)
  useEffect(() => {
    if (phoneState.isDemoActive && currentMessages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentMessages, phoneState.isDemoActive]);

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return;

    try {
      // Log message sending for debugging
      if (import.meta.env.DEV) {
        console.log("User sending message from phone interface", {
          messageLength: inputValue.length,
          sessionId: messagingState.sessionId,
        });
      }

      // Add message to live messaging context
      await addMessage({
        content: inputValue.trim(),
        sender: "user",
        businessName: "Phone User",
      });

      // Clear input
      setInputValue("");

      if (import.meta.env.DEV) {
        console.log("Message sent successfully", {
          sessionId: messagingState.sessionId,
          messageLength: inputValue.trim().length,
        });
      }
    } catch (error) {
      console.error("Failed to send message from phone interface", error, {
        sessionId: messagingState.sessionId,
        operation: "handleSendMessage",
      });

      // Show user-friendly error
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        content: "Sorry, I'm having trouble sending your message. Please try again.",
        sender: "business",
        timestamp: new Date(),
        businessName: "SMS Hub System",
        metadata: { source: "error-handler" },
      };

      setCurrentMessages((prev) => [...prev, errorMessage]);
    }
  }, [inputValue, addMessage, messagingState.sessionId]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const startDemo = useCallback(() => {
    try {
      if (import.meta.env.DEV) {
        console.log("Starting interactive demo", {
          sessionId: messagingState.sessionId,
          isAuthenticated: phoneState.isAuthenticated,
        });
      }

      // Clear current messages and start demo
      setCurrentMessages([]);
      setPhoneState((prev) => ({
        ...prev,
        isDemoActive: true,
        isTransitioning: false,
      }));

      // Add demo starter message
      const demoMessage: ChatMessage = {
        id: `demo-starter-${Date.now()}`,
        content: DEMO_STARTER_MESSAGE,
        sender: "business",
        timestamp: new Date(),
        businessName: "SMS Hub AI",
        metadata: { source: "demo-starter" },
      };

      setCurrentMessages([demoMessage]);

      // Send to live messaging system for processing
      addMessage({
        content: DEMO_STARTER_MESSAGE,
        sender: "business",
        businessName: "SMS Hub AI",
      });
    } catch (error) {
      console.error("Failed to start demo", error, {
        sessionId: messagingState.sessionId,
        operation: "startDemo",
      });
    }
  }, [phoneState.isAuthenticated, messagingState.sessionId, addMessage]);

  const handleSMSAuthSuccess = useCallback(
    (phoneNumber: string) => {
      try {
        if (import.meta.env.DEV) {
          console.log("SMS authentication successful", {
            phoneNumber,
            sessionId: messagingState.sessionId,
          });
        }

        setPhoneState((prev) => ({
          ...prev,
          isAuthenticated: true,
          showSMSAuth: false,
        }));

        // Auto-start demo after successful auth
        setTimeout(() => {
          startDemo();
        }, 500);
      } catch (error) {
        console.error("Failed to handle SMS auth success", error, {
          phoneNumber,
          sessionId: messagingState.sessionId,
          operation: "handleSMSAuthSuccess",
        });
      }
    },
    [messagingState.sessionId, startDemo]
  );

  const handleSMSAuthClose = useCallback(() => {
    setPhoneState((prev) => ({ ...prev, showSMSAuth: false }));
  }, []);

  const handlePhoneMouseEnter = useCallback(() => {
    if (!phoneState.isDemoActive) {
      setPhoneState((prev) => ({ ...prev, isTransitioning: false }));
    }
  }, [phoneState.isDemoActive]);

  const handlePhoneMouseLeave = useCallback(() => {
    if (!phoneState.isDemoActive) {
      // Resume scenario cycling
      setPhoneState((prev) => ({ ...prev, isTransitioning: false }));
    }
  }, [phoneState.isDemoActive]);

  // =============================================================================
  // COMPUTED VALUES
  // =============================================================================

  const currentScenario = DEMO_SCENARIOS[phoneState.currentScenarioIndex];
  const displayMessages = phoneState.isDemoActive ? currentMessages : currentScenario.messages;
  const isInputDisabled = messagingState.isAIProcessing;

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div className="phone-container">
      {/* Authentic iPhone Interface */}
      <div
        className="phone-frame"
        onMouseEnter={handlePhoneMouseEnter}
        onMouseLeave={handlePhoneMouseLeave}
      >
        {/* iPhone Screen */}
        <div className="phone-screen">
          {/* Dynamic Island */}
          <div className="phone-dynamic-island"></div>

          {/* Status Bar */}
          <div className="phone-status-bar">
            <div className="phone-status-left">
              <span>●●●</span>
            </div>
            <div className="phone-status-center">11:17 AM</div>
            <div className="phone-status-right">
              <div className="phone-battery">
                <div className="phone-battery-fill"></div>
              </div>
              <span>100%</span>
            </div>
          </div>

          {/* Messages Area */}
          <div className="phone-messages-container">
            <div
              className={`phone-messages ${
                phoneState.isTransitioning ? "opacity-0" : "opacity-100"
              }`}
            >
              {/* Date Separator */}
              <div className="phone-date-separator">
                <span>
                  {new Date().toLocaleDateString([], {
                    weekday: "long",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </div>

              {/* Messages */}
              {displayMessages.map((message) => (
                <div key={message.id} className={`phone-message ${message.sender}`}>
                  <div className={`phone-message-bubble ${message.sender}`}>
                    {message.businessName && message.sender === "business" && (
                      <div className="phone-message-sender">{message.businessName}</div>
                    )}
                    <div>{message.content ?? message.text}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="phone-input-container">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setPhoneState((prev) => ({ ...prev, isInputFocused: true }))}
              onBlur={() => setPhoneState((prev) => ({ ...prev, isInputFocused: false }))}
              placeholder={PLACEHOLDER_TEXTS[placeholderIndex]}
              disabled={isInputDisabled}
              className="phone-input-field"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isInputDisabled || !phoneState.isAuthenticated}
              className="phone-send-button"
            >
              ↑
            </button>
          </div>
        </div>
      </div>

      {/* Status Indicator - Right of Phone */}
      <div className="ml-12 flex flex-col items-center">
        {phoneState.isAuthenticated ? (
          phoneState.isDemoActive ? (
            <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm font-medium">
              <div className="text-center">
                <div className="font-semibold">Simulation Active</div>
                <div className="text-xs opacity-75">Interactive demo running</div>
              </div>
            </div>
          ) : (
            <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm font-medium">
              <div className="text-center">
                <div className="font-semibold">Access Granted</div>
                <div className="text-xs opacity-75">Click message field to start</div>
              </div>
            </div>
          )
        ) : // Hidden: Click Message Field box and Why Phone Verification button
        // <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm font-medium">
        //   <div className="text-center">
        //     <div className="font-semibold">Click Message Field</div>
        //     <div className="text-xs opacity-75">to start the demo</div>
        //   </div>
        //   <button
        //     onClick={() =>
        //       setPhoneState((prev) => ({ ...prev, showInfo: true }))
        //     }
        //     className="mt-2 w-full px-2 py-1 bg-amber-100 border border-amber-300 rounded text-amber-800 text-xs font-medium hover:bg-amber-200 transition-colors duration-200"
        //   >
        //     Why phone verification?
        //   </button>
        // </div>
        null}
      </div>

      {/* SMS Authentication Modal */}
      <SMSAuthModal
        isOpen={phoneState.showSMSAuth}
        onClose={handleSMSAuthClose}
        onSuccess={handleSMSAuthSuccess}
      />

      {/* Info Modal */}
      {phoneState.showInfo &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
            }}
          >
            <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">About Phone Verification</h3>
                <button
                  onClick={() => setPhoneState((prev) => ({ ...prev, showInfo: false }))}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  ×
                </button>
              </div>
              <div className="text-sm text-gray-600 space-y-3">
                <p>
                  <strong>How to start the demo:</strong> Click on the message input field in the
                  phone above, or use the demo button. We'll verify your phone number to show you
                  our interactive SMS simulation.
                </p>
                <p>
                  <strong>Important:</strong> This is a simulation - no real SMS messages will be
                  sent to your phone or anyone else's phone during this demo.
                </p>
                <p>
                  <strong>Why we need your phone number:</strong> We're a business SMS platform, so
                  we need to verify you're real before showing our interactive demo.
                </p>
                <p>
                  <strong>What we do with it:</strong> We only use it to send you a one-time
                  verification code. We don't store it permanently or use it for marketing.
                </p>
                <p>
                  <strong>Privacy & Control:</strong> You can text "STOP" anytime to opt out. We
                  respect your privacy and follow strict data protection standards.
                </p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setPhoneState((prev) => ({ ...prev, showInfo: false }))}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
