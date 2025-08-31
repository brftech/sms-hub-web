// =============================================================================
// LIVE MESSAGING CONTEXT - PROPERLY ARCHITECTED
// =============================================================================

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
// Lazy load services to prevent premature Supabase initialization
const getServices = async () => {
  const { messageService, chatbotService } = await import("@/services");
  return { messageService, chatbotService };
};
import {
  logger,
  createPerformanceLogger,
  logError,
  logInfo,
} from "@/lib/logger";
import { createBusinessLogicError, ErrorCode } from "@/lib/errors";
import {
  validate,
  schemas,
  type ChatMessage,
  type ConversationContext,
} from "@/lib/validation";

// =============================================================================
// STATE MACHINE DEFINITIONS
// =============================================================================

export enum MessagingState {
  IDLE = "IDLE",
  CONNECTING = "CONNECTING",
  CONNECTED = "CONNECTED",
  DISCONNECTED = "DISCONNECTED",
  PROCESSING = "PROCESSING",
  ERROR = "ERROR",
}

export enum MessageState {
  PENDING = "PENDING",
  SENT = "SENT",
  DELIVERED = "DELIVERED",
  FAILED = "FAILED",
}

// =============================================================================
// ACTION TYPES
// =============================================================================

export type MessagingAction =
  | { type: "CONNECT_START" }
  | { type: "CONNECT_SUCCESS" }
  | { type: "CONNECT_FAILURE"; error: string }
  | { type: "DISCONNECT" }
  | { type: "ADD_MESSAGE"; message: ChatMessage }
  | { type: "UPDATE_MESSAGE"; id: string; updates: Partial<ChatMessage> }
  | { type: "REMOVE_MESSAGE"; id: string }
  | { type: "CLEAR_MESSAGES" }
  | { type: "SET_SESSION"; sessionId: string }
  | { type: "CREATE_SESSION" }
  | { type: "SET_AI_PROCESSING"; isProcessing: boolean }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "RESET_STATE" };

// =============================================================================
// STATE INTERFACES
// =============================================================================

export interface MessagingStateData {
  // Connection state
  connectionState: MessagingState;
  isConnected: boolean;
  connectionError: string | null;

  // Session management
  sessionId: string;
  conversationContext: ConversationContext | null;

  // Message management
  messages: ChatMessage[];
  messageStates: Record<string, MessageState>;

  // AI processing
  isAIProcessing: boolean;
  aiProcessingQueue: string[];

  // Error handling
  error: string | null;
  lastError: string | null;
}

export interface LiveMessagingContextType {
  // State
  state: MessagingStateData;

  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
  createNewSession: () => void;

  // Message operations
  addMessage: (
    message: Omit<ChatMessage, "id" | "timestamp" | "sessionId">
  ) => Promise<void>;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;

  // AI operations
  sendToAI: (message: string) => Promise<string>;

  // Utility
  getMessageState: (id: string) => MessageState;
  getSessionMessages: (sessionId: string) => ChatMessage[];
}

// =============================================================================
// REDUCER
// =============================================================================

const initialState: MessagingStateData = {
  connectionState: MessagingState.IDLE,
  isConnected: false,
  connectionError: null,
  sessionId: "",
  conversationContext: null,
  messages: [],
  messageStates: {},
  isAIProcessing: false,
  aiProcessingQueue: [],
  error: null,
  lastError: null,
};

function messagingReducer(
  state: MessagingStateData,
  action: MessagingAction
): MessagingStateData {
  switch (action.type) {
    case "CONNECT_START":
      return {
        ...state,
        connectionState: MessagingState.CONNECTING,
        connectionError: null,
        error: null,
      };

    case "CONNECT_SUCCESS":
      return {
        ...state,
        connectionState: MessagingState.CONNECTED,
        isConnected: true,
        connectionError: null,
        error: null,
      };

    case "CONNECT_FAILURE":
      return {
        ...state,
        connectionState: MessagingState.ERROR,
        isConnected: false,
        connectionError: action.error,
        error: action.error,
        lastError: action.error,
      };

    case "DISCONNECT":
      return {
        ...state,
        connectionState: MessagingState.DISCONNECTED,
        isConnected: false,
        connectionError: null,
      };

    case "ADD_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.message],
        messageStates: {
          ...state.messageStates,
          [action.message.id]: MessageState.SENT,
        },
        error: null,
      };

    case "UPDATE_MESSAGE":
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg.id === action.id ? { ...msg, ...action.updates } : msg
        ),
        error: null,
      };

    case "REMOVE_MESSAGE":
      const { [action.id]: removed, ...remainingStates } = state.messageStates;
      return {
        ...state,
        messages: state.messages.filter((msg) => msg.id !== action.id),
        messageStates: remainingStates,
        error: null,
      };

    case "CLEAR_MESSAGES":
      return {
        ...state,
        messages: [],
        messageStates: {},
        error: null,
      };

    case "SET_SESSION":
      return {
        ...state,
        sessionId: action.sessionId,
        error: null,
      };

    case "CREATE_SESSION":
      const newSessionId = `session_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      return {
        ...state,
        sessionId: newSessionId,
        conversationContext: {
          sessionId: newSessionId,
          messageCount: 0,
          lastInteraction: new Date().toISOString(),
          topic: "general",
        },
        messages: [],
        messageStates: {},
        error: null,
      };

    case "SET_AI_PROCESSING":
      return {
        ...state,
        isAIProcessing: action.isProcessing,
        error: null,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.error,
        lastError: action.error,
      };

    case "RESET_STATE":
      return initialState;

    default:
      return state;
  }
}

// =============================================================================
// CONTEXT PROVIDER
// =============================================================================

const LiveMessagingContext = createContext<
  LiveMessagingContextType | undefined
>(undefined);

interface LiveMessagingProviderProps {
  children: ReactNode;
}

export const LiveMessagingProvider: React.FC<LiveMessagingProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(messagingReducer, initialState);

  // =============================================================================
  // SESSION MANAGEMENT
  // =============================================================================

  const createNewSession = useCallback(() => {
    logger.info("Creating new messaging session");

    // Clear any existing session data
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith("gnymble_messages_")) {
        localStorage.removeItem(key);
      }
    });

    dispatch({ type: "CREATE_SESSION" });

    // Store session ID in session storage
    if (state.sessionId) {
      sessionStorage.setItem("gnymble_session_id", state.sessionId);
    }
  }, [state.sessionId]);

  // =============================================================================
  // CONNECTION MANAGEMENT
  // =============================================================================

  const connect = useCallback(async (): Promise<void> => {
    const perfLogger = createPerformanceLogger("LiveMessaging connect");

    try {
      dispatch({ type: "CONNECT_START" });

      // Simulate connection process
      await new Promise((resolve) => setTimeout(resolve, 500));

      dispatch({ type: "CONNECT_SUCCESS" });

      logger.info("Live messaging service connected successfully");
      perfLogger.finish({ success: true });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Connection failed";

      logError("Failed to connect to live messaging service", error, {
        operation: "connect",
      });

      dispatch({ type: "CONNECT_FAILURE", error: errorMessage });
      perfLogger.finish({ success: false, error: errorMessage });
    }
  }, []);

  const disconnect = useCallback(() => {
    logger.info("Disconnecting from live messaging service");
    dispatch({ type: "DISCONNECT" });
  }, []);

  // =============================================================================
  // MESSAGE MANAGEMENT
  // =============================================================================

  const addMessage = useCallback(
    async (message: Omit<ChatMessage, "id" | "timestamp" | "sessionId">) => {
      const perfLogger = createPerformanceLogger("LiveMessaging addMessage");

      try {
        if (!state.sessionId) {
          throw createBusinessLogicError(
            ErrorCode.CHATBOT_PROCESSING_FAILED,
            "No active session for message",
            { operation: "addMessage" }
          );
        }

        // Validate message data
        const validatedMessage = validate(
          schemas.messageData,
          {
            text: message.text,
            sender: message.sender,
            businessName: message.businessName,
          },
          {
            operation: "addMessage",
            sessionId: state.sessionId,
          }
        );

        const newMessage: ChatMessage = {
          ...message,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          sessionId: state.sessionId,
        };

        // Add message to state
        dispatch({ type: "ADD_MESSAGE", message: newMessage });

        // Save to localStorage for persistence
        try {
          const stored =
            localStorage.getItem(`gnymble_messages_${state.sessionId}`) || "[]";
          const messages = JSON.parse(stored);
          messages.push(newMessage);
          localStorage.setItem(
            `gnymble_messages_${state.sessionId}`,
            JSON.stringify(messages)
          );
        } catch (storageError) {
          logError("Failed to save message to localStorage", storageError, {
            sessionId: state.sessionId,
            messageId: newMessage.id,
          });
        }

        // If it's a user message, process with AI
        if (message.sender === "user") {
          try {
            const aiResponse = await sendToAI(message.text);

            // Add AI response
            const aiMessage: ChatMessage = {
              id: crypto.randomUUID(),
              text: aiResponse,
              sender: "ai",
              timestamp: new Date().toISOString(),
              businessName: "Gnymble AI Assistant",
              sessionId: state.sessionId,
              metadata: {
                source: "chatbot",
                sessionId: state.sessionId,
                intent: "ai-response",
              },
            };

            dispatch({ type: "ADD_MESSAGE", message: aiMessage });

            // Save AI response to localStorage
            try {
              const stored =
                localStorage.getItem(`gnymble_messages_${state.sessionId}`) ||
                "[]";
              const messages = JSON.parse(stored);
              messages.push(aiMessage);
              localStorage.setItem(
                `gnymble_messages_${state.sessionId}`,
                JSON.stringify(messages)
              );
            } catch (storageError) {
              logError(
                "Failed to save AI message to localStorage",
                storageError,
                {
                  sessionId: state.sessionId,
                  messageId: aiMessage.id,
                }
              );
            }

            // Send to message service for analytics (lazy loaded)
            try {
              const { messageService: msgService } = await getServices();
              const service = await msgService();
              await service.sendMessage({
                text: message.text,
                sender: "user",
                businessName: "Phone User",
                metadata: {
                  source: "phone-ui",
                  userAgent: navigator.userAgent,
                },
              });
            } catch (serviceError) {
              // Silently fail if service is not available
              logError("Message service not available", serviceError);
            }
          } catch (aiError) {
            logError("Failed to get AI response", aiError, {
              sessionId: state.sessionId,
              userMessage: message.text,
            });

            // Add fallback response
            const fallbackMessage: ChatMessage = {
              id: crypto.randomUUID(),
              text: "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment.",
              sender: "ai",
              timestamp: new Date().toISOString(),
              businessName: "Gnymble Assistant",
              sessionId: state.sessionId,
              metadata: {
                source: "chatbot",
                sessionId: state.sessionId,
                intent: "fallback-response",
              },
            };

            dispatch({ type: "ADD_MESSAGE", message: fallbackMessage });
          }
        }

        logger.info("Message added successfully", {
          messageId: newMessage.id,
          sessionId: state.sessionId,
          sender: message.sender,
        });

        perfLogger.finish({
          messageId: newMessage.id,
          sessionId: state.sessionId,
          sender: message.sender,
        });
      } catch (error) {
        perfLogger.finish({
          error: error instanceof Error ? error.message : "Unknown error",
          sessionId: state.sessionId,
        });

        logError("Failed to add message", error, {
          sessionId: state.sessionId,
          operation: "addMessage",
        });

        dispatch({
          type: "SET_ERROR",
          error:
            error instanceof Error ? error.message : "Failed to add message",
        });

        if (error instanceof Error) {
          throw error;
        }

        throw createBusinessLogicError(
          ErrorCode.CHATBOT_PROCESSING_FAILED,
          "Failed to add message due to unexpected error",
          { sessionId: state.sessionId, operation: "addMessage" }
        );
      }
    },
    [state.sessionId]
  );

  const updateMessage = useCallback(
    (id: string, updates: Partial<ChatMessage>) => {
      dispatch({ type: "UPDATE_MESSAGE", id, updates });
    },
    []
  );

  const removeMessage = useCallback((id: string) => {
    dispatch({ type: "REMOVE_MESSAGE", id });
  }, []);

  const clearMessages = useCallback(() => {
    dispatch({ type: "CLEAR_MESSAGES" });

    // Clear from localStorage
    if (state.sessionId) {
      localStorage.removeItem(`gnymble_messages_${state.sessionId}`);
    }
  }, [state.sessionId]);

  // =============================================================================
  // AI PROCESSING
  // =============================================================================

  const sendToAI = useCallback(
    async (message: string): Promise<string> => {
      const perfLogger = createPerformanceLogger("LiveMessaging sendToAI");

      try {
        if (!state.sessionId) {
          throw createBusinessLogicError(
            ErrorCode.CHATBOT_PROCESSING_FAILED,
            "No active session for AI processing",
            { operation: "sendToAI" }
          );
        }

        dispatch({ type: "SET_AI_PROCESSING", isProcessing: true });

        logger.info("Processing message with AI", {
          sessionId: state.sessionId,
          messageLength: message.length,
        });

        // Create conversation context for AI
        const context: ConversationContext = {
          sessionId: state.sessionId,
          messageCount: state.messages.length,
          lastInteraction: new Date().toISOString(),
          topic: "general",
        };

        // Process with chatbot service (lazy loaded)
        const { chatbotService: chatService } = await getServices();
        const service = await chatService();
        const response = await service.processMessage(message, context);

        if (!response.success) {
          throw createBusinessLogicError(
            ErrorCode.CHATBOT_PROCESSING_FAILED,
            response.error || "AI processing failed",
            { sessionId: state.sessionId, operation: "sendToAI" }
          );
        }

        logger.info("AI response generated successfully", {
          sessionId: state.sessionId,
          responseLength: response.message.text.length,
          suggestions: response.suggestions?.length || 0,
        });

        perfLogger.finish({
          sessionId: state.sessionId,
          responseLength: response.message.text.length,
          success: true,
        });

        return response.message.text;
      } catch (error) {
        perfLogger.finish({
          error: error instanceof Error ? error.message : "Unknown error",
          sessionId: state.sessionId,
        });

        logError("AI processing failed", error, {
          sessionId: state.sessionId,
          operation: "sendToAI",
        });

        throw error;
      } finally {
        dispatch({ type: "SET_AI_PROCESSING", isProcessing: false });
      }
    },
    [state.sessionId, state.messages.length]
  );

  // =============================================================================
  // UTILITY FUNCTIONS
  // =============================================================================

  const getMessageState = useCallback(
    (id: string): MessageState => {
      return state.messageStates[id] || MessageState.PENDING;
    },
    [state.messageStates]
  );

  const getSessionMessages = useCallback(
    (sessionId: string): ChatMessage[] => {
      return state.messages.filter((msg) => msg.sessionId === sessionId);
    },
    [state.messages]
  );

  // =============================================================================
  // EFFECTS
  // =============================================================================

  // Initialize session on mount
  useEffect(() => {
    createNewSession();
  }, [createNewSession]);

  // Auto-connect on mount
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  // =============================================================================
  // CONTEXT VALUE
  // =============================================================================

  const contextValue = useMemo<LiveMessagingContextType>(
    () => ({
      state,
      connect,
      disconnect,
      createNewSession,
      addMessage,
      updateMessage,
      removeMessage,
      clearMessages,
      sendToAI,
      getMessageState,
      getSessionMessages,
    }),
    [
      state,
      connect,
      disconnect,
      createNewSession,
      addMessage,
      updateMessage,
      removeMessage,
      clearMessages,
      sendToAI,
      getMessageState,
      getSessionMessages,
    ]
  );

  return (
    <LiveMessagingContext.Provider value={contextValue}>
      {children}
    </LiveMessagingContext.Provider>
  );
};

// =============================================================================
// HOOK
// =============================================================================

export const useLiveMessaging = (): LiveMessagingContextType => {
  const context = useContext(LiveMessagingContext);
  if (context === undefined) {
    throw new Error(
      "useLiveMessaging must be used within a LiveMessagingProvider"
    );
  }
  return context;
};
