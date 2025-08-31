// =============================================================================
// PHONE INTERACTIVE COMPONENT - PROPERLY ARCHITECTED
// =============================================================================

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLiveMessaging } from "../contexts/LiveMessagingContext";
import SMSAuthModal from "./SMSAuthModal";
import { logger, logError } from "@sms-hub/utils";
import { ChatMessage } from "@sms-hub/types";

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
    title: "Event Announcement",
    messages: [
      {
        id: "scenario-1-1",
        text: "🔥 EXCLUSIVE: Drew Estate Masterclass this Saturday 7PM! Master blender Jonathan Drew will be here. Only 15 spots left. Age 21+ required. Call to RSVP!",
        sender: "business",
        timestamp: new Date().toISOString(),
        businessName: "Premium Cigars & Co",
        metadata: { source: "demo-scenario" },
      },
      {
        id: "scenario-1-2",
        text: "Absolutely! Can't wait to meet Jonathan Drew. Count me in!",
        sender: "user",
        timestamp: new Date().toISOString(),
        metadata: { source: "demo-scenario" },
      },
    ],
  },
  {
    id: 2,
    title: "New Arrivals",
    messages: [
      {
        id: "scenario-2-1",
        text: "🚨 JUST ARRIVED: Limited Edition Arturo Fuente Opus X 25th Anniversary! Only 2 boxes available. These won't last long. First come, first served!",
        sender: "business",
        timestamp: new Date().toISOString(),
        businessName: "Elite Tobacco Lounge",
        metadata: { source: "demo-scenario" },
      },
      {
        id: "scenario-2-2",
        text: "Hold one for me! I'll be there in 30 minutes.",
        sender: "user",
        timestamp: new Date().toISOString(),
        businessName: "User",
        metadata: { source: "demo-scenario" },
      },
    ],
  },
  {
    id: 3,
    title: "Industry News",
    messages: [
      {
        id: "scenario-3-1",
        text: "🎉 BIG NEWS: We're now the exclusive regional dealer for Davidoff's new Master Selection series! Follow our Instagram @premiumcigarsco for the launch party details tomorrow!",
        sender: "business",
        timestamp: new Date().toISOString(),
        businessName: "Premium Cigars & Co",
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
  "Hey there! 👋 I'm Smokey, your SMS Hub AI assistant. Want to see what I can do? Ask me anything about premium cigars, events, or our exclusive lounge experience! 🚬✨";

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
          currentScenarioIndex:
            (prev.currentScenarioIndex + 1) % DEMO_SCENARIOS.length,
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
      logger.info("User sending message from phone interface", {
        messageLength: inputValue.length,
        sessionId: messagingState.sessionId,
      });

      // Add message to live messaging context
      await addMessage({
        text: inputValue.trim(),
        sender: "user",
        businessName: "Phone User",
      });

      // Clear input
      setInputValue("");

      logger.info("Message sent successfully", {
        sessionId: messagingState.sessionId,
        messageLength: inputValue.trim().length,
      });
    } catch (error) {
      logError("Failed to send message from phone interface", error, {
        sessionId: messagingState.sessionId,
        operation: "handleSendMessage",
      });

      // Show user-friendly error
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        text: "Sorry, I'm having trouble sending your message. Please try again.",
        sender: "business",
        timestamp: new Date().toISOString(),
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

  const handleDemoButtonClick = useCallback(() => {
    if (!phoneState.isAuthenticated) {
      setPhoneState((prev) => ({ ...prev, showSMSAuth: true }));
      return;
    }

    startDemo();
  }, [phoneState.isAuthenticated]);

  const startDemo = useCallback(() => {
    try {
      logger.info("Starting interactive demo", {
        sessionId: messagingState.sessionId,
        isAuthenticated: phoneState.isAuthenticated,
      });

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
        text: DEMO_STARTER_MESSAGE,
        sender: "business",
        timestamp: new Date().toISOString(),
        businessName: "SMS Hub AI",
        metadata: { source: "demo-starter" },
      };

      setCurrentMessages([demoMessage]);

      // Send to live messaging system for processing
      addMessage({
        text: DEMO_STARTER_MESSAGE,
        sender: "business",
        businessName: "SMS Hub AI",
      });
    } catch (error) {
      logError("Failed to start demo", error, {
        sessionId: messagingState.sessionId,
        operation: "startDemo",
      });
    }
  }, [phoneState.isAuthenticated, messagingState.sessionId, addMessage]);

  const handleSMSAuthSuccess = useCallback(
    (phoneNumber: string) => {
      try {
        logger.info("SMS authentication successful", {
          phoneNumber,
          sessionId: messagingState.sessionId,
        });

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
        logError("Failed to handle SMS auth success", error, {
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
  const displayMessages = phoneState.isDemoActive
    ? currentMessages
    : currentScenario.messages;
  const isInputDisabled =
    !phoneState.isAuthenticated || messagingState.isAIProcessing;

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div className="flex justify-center items-center my-8 mx-4">
      {/* Phone Interface */}
      <div
        className="relative phone-3d"
        onMouseEnter={handlePhoneMouseEnter}
        onMouseLeave={handlePhoneMouseLeave}
        style={{
          width: "280px",
          height: "560px",
        }}
      >
        {/* Inner screen */}
        <div className="phone-screen">
          {/* Status bar */}
          <div className="phone-status-bar">
            <span className="text-transparent bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text font-black tracking-tight">
              sms-hub
            </span>
            <span>12:21</span>
            <div className="flex items-center gap-1">
              <span className="text-xs">●●●</span>
              <span className="text-xs">100%</span>
            </div>
          </div>

          {/* Messages area */}
          <div className="phone-messages-area">
            <div
              className={`phone-messages ${
                phoneState.isTransitioning ? "opacity-0" : "opacity-100"
              }`}
            >
              {displayMessages.map((message) => (
                <div key={message.id}>
                  <div
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    } mb-1`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-[18px] text-sm leading-relaxed ${
                        message.sender === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      {message.businessName &&
                        message.sender === "business" && (
                          <div className="text-[10px] opacity-80 mb-1 font-semibold">
                            {message.businessName}
                          </div>
                        )}
                      {message.text}
                    </div>
                  </div>
                  <div
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    } ${message.sender === "user" ? "pr-3" : "pl-3"}`}
                  >
                    <span className="text-[10px] text-gray-500">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Interactive text input area */}
          <div className="phone-input-area">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() =>
                setPhoneState((prev) => ({ ...prev, isInputFocused: true }))
              }
              onBlur={() =>
                setPhoneState((prev) => ({ ...prev, isInputFocused: false }))
              }
              placeholder={PLACEHOLDER_TEXTS[placeholderIndex]}
              disabled={isInputDisabled}
              className="phone-input-field"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isInputDisabled}
              className="phone-send-button"
            >
              ↑
            </button>
          </div>
        </div>

        {/* Scenario indicator */}
        <div className="phone-scenario-indicator">{currentScenario.title}</div>
      </div>

      {/* Demo Button - Right of Phone */}
      <div className="ml-8 flex flex-col items-center">
        <button
          onClick={handleDemoButtonClick}
          className="group relative px-6 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium text-base rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 border border-orange-400/30 backdrop-blur-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-500/20 rounded-lg blur-sm group-hover:blur-md transition-all duration-300"></div>
          <div className="relative z-10 flex items-center space-x-3">
            <div className="text-center">
              <div className="font-medium tracking-wide">
                {phoneState.isAuthenticated
                  ? "Start Live Demo Now"
                  : "Get Instant Demo Access"}
              </div>
              <div className="text-sm font-normal opacity-90">
                {phoneState.isAuthenticated
                  ? "Interactive showcase ready"
                  : "Quick phone verification"}
              </div>
            </div>
          </div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-orange-400 to-red-500 rotate-45 border-b border-r border-orange-300/40"></div>
        </button>

        {/* Demo Status Indicator */}
        {phoneState.isAuthenticated ? (
          phoneState.isDemoActive ? (
            <div className="mt-4 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-700 text-xs font-medium">
              Demo Session Active
            </div>
          ) : (
            <div className="mt-4 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-700 text-xs font-medium">
              Access Granted
            </div>
          )
        ) : (
          <button
            onClick={() =>
              setPhoneState((prev) => ({ ...prev, showInfo: true }))
            }
            className="mt-4 px-3 py-2 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-xs font-medium hover:bg-amber-100 hover:border-amber-300 transition-colors duration-200 cursor-pointer"
          >
            Why Phone Verification?
          </button>
        )}
      </div>

      {/* SMS Authentication Modal */}
      <SMSAuthModal
        isOpen={phoneState.showSMSAuth}
        onClose={handleSMSAuthClose}
        onSuccess={handleSMSAuthSuccess}
      />

      {/* Info Modal */}
      {phoneState.showInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                About Phone Verification
              </h3>
              <button
                onClick={() =>
                  setPhoneState((prev) => ({ ...prev, showInfo: false }))
                }
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="text-sm text-gray-600 space-y-3">
              <p>
                <strong>Why we need your phone number:</strong> We're a business
                SMS platform, so we need to verify you're real before showing
                our demo.
              </p>
              <p>
                <strong>What we do with it:</strong> We only use it to send you
                a one-time verification code. We don't store it permanently or
                use it for marketing.
              </p>
              <p>
                <strong>Privacy & Control:</strong> You can text "STOP" anytime
                to opt out. We respect your privacy and follow strict data
                protection standards.
              </p>
              <p>
                <strong>Security:</strong> Your information is encrypted and
                protected. We're committed to keeping your data safe and secure.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() =>
                  setPhoneState((prev) => ({ ...prev, showInfo: false }))
                }
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
