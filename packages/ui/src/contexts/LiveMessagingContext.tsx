// =============================================================================
// LIVE MESSAGING CONTEXT - PROPERLY ARCHITECTED
// =============================================================================

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
// Removed logger import - using console for debugging
import { ChatMessage, ConversationContext } from "../types";

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
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => Promise<void>;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
  connect: () => Promise<void>;
  disconnect: () => void;
  resetState: () => void;
}

// =============================================================================
// REDUCER
// =============================================================================

function messagingReducer(state: MessagingStateData, action: MessagingAction): MessagingStateData {
  switch (action.type) {
    case "CONNECT_START":
      return {
        ...state,
        connectionState: MessagingState.CONNECTING,
        connectionError: null,
      };

    case "CONNECT_SUCCESS":
      return {
        ...state,
        connectionState: MessagingState.CONNECTED,
        isConnected: true,
        connectionError: null,
      };

    case "CONNECT_FAILURE":
      return {
        ...state,
        connectionState: MessagingState.ERROR,
        isConnected: false,
        connectionError: action.error,
      };

    case "DISCONNECT":
      return {
        ...state,
        connectionState: MessagingState.DISCONNECTED,
        isConnected: false,
      };

    case "ADD_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.message],
        messageStates: {
          ...state.messageStates,
          [action.message.id]: MessageState.PENDING,
        },
      };

    case "UPDATE_MESSAGE":
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg.id === action.id ? { ...msg, ...action.updates } : msg
        ),
        messageStates: {
          ...state.messageStates,
          [action.id]: MessageState.SENT,
        },
      };

    case "REMOVE_MESSAGE": {
      const remainingMessageStates = { ...state.messageStates };
      delete remainingMessageStates[action.id];
      return {
        ...state,
        messages: state.messages.filter((msg) => msg.id !== action.id),
        messageStates: remainingMessageStates,
      };
    }

    case "CLEAR_MESSAGES":
      return {
        ...state,
        messages: [],
        messageStates: {},
      };

    case "SET_SESSION":
      return {
        ...state,
        sessionId: action.sessionId,
      };

    case "CREATE_SESSION":
      return {
        ...state,
        sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

    case "SET_AI_PROCESSING":
      return {
        ...state,
        isAIProcessing: action.isProcessing,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.error,
        lastError: action.error,
      };

    case "RESET_STATE":
      return {
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

    default:
      return state;
  }
}

// =============================================================================
// CONTEXT CREATION
// =============================================================================

const LiveMessagingContext = createContext<LiveMessagingContextType | undefined>(undefined);

// =============================================================================
// PROVIDER COMPONENT
// =============================================================================

interface LiveMessagingProviderProps {
  children: ReactNode;
}

export function LiveMessagingProvider({ children }: LiveMessagingProviderProps) {
  const [state, dispatch] = useReducer(messagingReducer, {
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
  });

  // =============================================================================
  // ACTIONS
  // =============================================================================

  const addMessage = useCallback(
    async (messageData: Omit<ChatMessage, "id" | "timestamp">) => {
      try {
        const message: ChatMessage = {
          ...messageData,
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
        };

        dispatch({ type: "ADD_MESSAGE", message });

        // Simulate AI processing for business messages
        if (messageData.sender === "business") {
          dispatch({ type: "SET_AI_PROCESSING", isProcessing: true });

          // Simulate processing delay
          setTimeout(
            () => {
              dispatch({ type: "SET_AI_PROCESSING", isProcessing: false });
            },
            1000 + Math.random() * 2000
          );
        }

        if (import.meta.env.DEV) {
          console.log("Message added successfully", {
            messageId: message.id,
            sessionId: state.sessionId,
            sender: message.sender,
          });
        }
      } catch (error) {
        console.error("Failed to add message", error, {
          sessionId: state.sessionId,
          operation: "addMessage",
        });
        dispatch({ type: "SET_ERROR", error: "Failed to add message" });
      }
    },
    [state.sessionId]
  );

  const updateMessage = useCallback((id: string, updates: Partial<ChatMessage>) => {
    dispatch({ type: "UPDATE_MESSAGE", id, updates });
  }, []);

  const removeMessage = useCallback((id: string) => {
    dispatch({ type: "REMOVE_MESSAGE", id });
  }, []);

  const clearMessages = useCallback(() => {
    dispatch({ type: "CLEAR_MESSAGES" });
  }, []);

  const connect = useCallback(async () => {
    try {
      dispatch({ type: "CONNECT_START" });

      // Simulate connection delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      dispatch({ type: "CONNECT_SUCCESS" });

      if (import.meta.env.DEV) {
        console.log("Connected to messaging service", {
          sessionId: state.sessionId,
        });
      }
    } catch (error) {
      console.error("Failed to connect to messaging service", error, {
        sessionId: state.sessionId,
        operation: "connect",
      });
      dispatch({ type: "CONNECT_FAILURE", error: "Connection failed" });
    }
  }, [state.sessionId]);

  const disconnect = useCallback(() => {
    dispatch({ type: "DISCONNECT" });
    if (import.meta.env.DEV) {
      console.log("Disconnected from messaging service", {
        sessionId: state.sessionId,
      });
    }
  }, [state.sessionId]);

  const resetState = useCallback(() => {
    dispatch({ type: "RESET_STATE" });
  }, []);

  // =============================================================================
  // EFFECTS
  // =============================================================================

  // Create session on mount
  useEffect(() => {
    dispatch({ type: "CREATE_SESSION" });
  }, []);

  // =============================================================================
  // CONTEXT VALUE
  // =============================================================================

  const contextValue = useMemo<LiveMessagingContextType>(
    () => ({
      state,
      addMessage,
      updateMessage,
      removeMessage,
      clearMessages,
      connect,
      disconnect,
      resetState,
    }),
    [
      state,
      addMessage,
      updateMessage,
      removeMessage,
      clearMessages,
      connect,
      disconnect,
      resetState,
    ]
  );

  return (
    <LiveMessagingContext.Provider value={contextValue}>{children}</LiveMessagingContext.Provider>
  );
}

// =============================================================================
// HOOK
// =============================================================================

export function useLiveMessaging(): LiveMessagingContextType {
  const context = useContext(LiveMessagingContext);
  if (context === undefined) {
    throw new Error("useLiveMessaging must be used within a LiveMessagingProvider");
  }
  return context;
}
