// =============================================================================
// CHATBOT SERVICE - REFACTORED WITH PROPER ARCHITECTURE
// =============================================================================

import { supabase } from "@/integrations/supabase/client";
import { messageService } from "./messageService";
import {
  chatbotLogger,
  createPerformanceLogger,
  logError,
  logInfo,
} from "@/lib/logger";
import {
  createBusinessLogicError,
  createDatabaseError,
  ErrorCode,
} from "@/lib/errors";
import {
  validate,
  schemas,
  type ChatMessage,
  type ChatbotResponse,
  type ConversationContext,
  type ChatbotConfig,
} from "@/lib/validation";

class ChatbotService {
  private config: ChatbotConfig = {
    personality: "friendly",
    industry: "cigars",
    responseStyle: "conversational",
    maxResponseLength: 150,
  };

  /**
   * Process user message and generate AI response
   */
  async processMessage(
    userMessage: string,
    context: ConversationContext
  ): Promise<ChatbotResponse> {
    const perfLogger = createPerformanceLogger("Chatbot processMessage");

    try {
      // Validate inputs
      if (!userMessage.trim()) {
        throw createBusinessLogicError(
          ErrorCode.CHATBOT_PROCESSING_FAILED,
          "User message cannot be empty",
          { sessionId: context.sessionId, operation: "processMessage" }
        );
      }

      chatbotLogger.info("Processing user message", {
        sessionId: context.sessionId,
        messageLength: userMessage.length,
        messageCount: context.messageCount,
      });

      // Analyze user message for intent and topic
      const analysis = this.analyzeUserMessage(userMessage);

      // Generate appropriate response based on analysis
      const aiResponse = this.generateResponse(userMessage, analysis, context);

      // Create response message
      const responseMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        text: aiResponse.text,
        sender: "ai",
        timestamp: new Date().toISOString(),
        businessName: "Gnymble AI",
        metadata: {
          source: "chatbot",
          intent: analysis.intent,
          topic: analysis.topic,
          confidence: analysis.confidence,
          sessionId: context.sessionId,
        },
        sessionId: context.sessionId,
      };

      // Save conversation to database
      await this.saveConversation(userMessage, responseMessage, context);

      // Note: In a real implementation, we'd update the context in a mutable way
      // For now, we'll just log the updated values
      const updatedMessageCount = context.messageCount + 2; // User + AI message
      const updatedLastInteraction = new Date().toISOString();
      const updatedTopic = analysis.topic;

      chatbotLogger.info("Message processed successfully", {
        sessionId: context.sessionId,
        intent: analysis.intent,
        topic: analysis.topic,
        confidence: analysis.confidence,
      });

      perfLogger.finish({
        sessionId: context.sessionId,
        intent: analysis.intent,
        topic: analysis.topic,
      });

      return {
        success: true,
        message: responseMessage,
        suggestions: aiResponse.suggestions,
      };
    } catch (error) {
      perfLogger.finish({
        error: error instanceof Error ? error.message : "Unknown error",
        sessionId: context.sessionId,
      });

      logError("Chatbot service error", error, {
        sessionId: context.sessionId,
        operation: "processMessage",
        userMessage: userMessage.substring(0, 100), // Log first 100 chars for debugging
      });

      if (error instanceof Error) {
        throw error; // Re-throw our typed errors
      }

      // Wrap unknown errors
      throw createBusinessLogicError(
        ErrorCode.CHATBOT_PROCESSING_FAILED,
        "An unexpected error occurred while processing message",
        { sessionId: context.sessionId, operation: "processMessage" }
      );
    }
  }

  /**
   * Analyze user message for intent and topic
   */
  private analyzeUserMessage(message: string): {
    intent: string;
    topic: string;
    confidence: number;
    keywords: string[];
  } {
    const lowerMessage = message.toLowerCase();
    const keywords: string[] = [];

    // Intent detection
    let intent = "general";
    let topic = "general";
    let confidence = 0.5;

    // Cigar-related topics
    if (lowerMessage.includes("cigar") || lowerMessage.includes("smoke")) {
      topic = "cigars";
      confidence += 0.3;
      keywords.push("cigars", "smoking");
    }

    if (lowerMessage.includes("brand") || lowerMessage.includes("type")) {
      topic = "cigar-brands";
      confidence += 0.2;
      keywords.push("brands", "types");
    }

    if (lowerMessage.includes("event") || lowerMessage.includes("lounge")) {
      topic = "events";
      confidence += 0.3;
      keywords.push("events", "lounge");
    }

    if (lowerMessage.includes("price") || lowerMessage.includes("cost")) {
      topic = "pricing";
      confidence += 0.2;
      keywords.push("pricing", "cost");
    }

    // Intent detection
    if (
      lowerMessage.includes("what") ||
      lowerMessage.includes("how") ||
      lowerMessage.includes("?")
    ) {
      intent = "question";
      confidence += 0.2;
    }

    if (lowerMessage.includes("help") || lowerMessage.includes("assist")) {
      intent = "help";
      confidence += 0.3;
    }

    if (lowerMessage.includes("demo") || lowerMessage.includes("show")) {
      intent = "demo";
      confidence += 0.3;
    }

    // Cap confidence at 1.0
    confidence = Math.min(confidence, 1.0);

    return { intent, topic, confidence, keywords };
  }

  /**
   * Generate AI response based on user message and context
   */
  private generateResponse(
    userMessage: string,
    analysis: {
      intent: string;
      topic: string;
      confidence: number;
      keywords: string[];
    },
    context: ConversationContext
  ): { text: string; suggestions: string[] } {
    const { intent, topic, confidence } = analysis;
    const suggestions: string[] = [];

    // Generate contextual responses
    let response = "";

    if (topic === "cigars") {
      if (intent === "question") {
        response =
          "Great question about cigars! We offer premium hand-rolled cigars from renowned regions like Cuba, Dominican Republic, and Nicaragua. Each cigar is carefully selected for quality and flavor profile. What specific aspect would you like to know more about?";
        suggestions.push(
          "Tell me about your premium brands",
          "What makes a good cigar?",
          "Do you have beginner recommendations?"
        );
      } else {
        response =
          "Cigars are truly an art form! We specialize in premium, hand-rolled cigars that deliver exceptional flavor and craftsmanship. Our collection includes everything from mild Connecticut wrappers to full-bodied Maduros.";
        suggestions.push(
          "Show me your premium selection",
          "What's your most popular cigar?",
          "Tell me about cigar storage"
        );
      }
    } else if (topic === "events") {
      response =
        "We host exclusive cigar events and tastings in our premium lounge! From intimate gatherings to larger celebrations, we create memorable experiences for cigar enthusiasts. Our events often feature rare cigars and expert guidance.";
      suggestions.push(
        "When's your next event?",
        "What's included in a tasting?",
        "Can I book a private event?"
      );
    } else if (topic === "pricing") {
      response =
        "Our pricing reflects the premium quality and craftsmanship of our cigars. We offer various price points to accommodate different preferences, from accessible daily smokes to rare, collector-grade pieces. Quality is always our priority.";
      suggestions.push(
        "What's your price range?",
        "Do you have any special offers?",
        "Tell me about your premium collection"
      );
    } else {
      // General response
      response =
        "I'm here to help you discover the world of premium cigars! Whether you're a seasoned aficionado or just starting your journey, I can guide you through our selection, events, and expertise. What would you like to explore?";
      suggestions.push(
        "Tell me about your cigars",
        "What events do you host?",
        "How do I get started?"
      );
    }

    // Add personality based on config
    if (this.config.personality === "friendly") {
      response = response.replace(/\./g, "! 😊");
    } else if (this.config.personality === "professional") {
      response = response.replace(/!/g, ".");
    }

    // Ensure response length is within limits
    if (response.length > this.config.maxResponseLength) {
      response =
        response.substring(0, this.config.maxResponseLength - 3) + "...";
    }

    return { text: response, suggestions };
  }

  /**
   * Save conversation to database
   */
  private async saveConversation(
    userMessage: string,
    aiResponse: ChatMessage,
    context: ConversationContext
  ): Promise<void> {
    try {
      // Save user message
      await messageService.sendMessage({
        text: userMessage,
        sender: "user",
        businessName: "User",
        metadata: {
          source: "phone-ui",
          sessionId: context.sessionId,
          intent: "user-input",
        },
      });

      // Save AI response
      await messageService.sendMessage({
        text: aiResponse.text,
        sender: "business",
        businessName: "Gnymble AI",
        metadata: {
          source: "chatbot",
          sessionId: context.sessionId,
          intent: "ai-response",
        },
      });

      chatbotLogger.debug("Conversation saved to database", {
        sessionId: context.sessionId,
        userMessageLength: userMessage.length,
        aiResponseLength: aiResponse.text.length,
      });
    } catch (error) {
      logError("Failed to save conversation", error, {
        sessionId: context.sessionId,
        operation: "saveConversation",
      });
      // Don't fail the chatbot if saving fails
      // This is a business decision - chatbot functionality is more important than persistence
    }
  }

  /**
   * Get conversation history for a session
   */
  async getConversationHistory(sessionId: string): Promise<ChatMessage[]> {
    const perfLogger = createPerformanceLogger(
      "Chatbot getConversationHistory"
    );

    try {
      if (!sessionId.trim()) {
        throw createBusinessLogicError(
          ErrorCode.CHATBOT_PROCESSING_FAILED,
          "Session ID cannot be empty",
          { operation: "getConversationHistory" }
        );
      }

      chatbotLogger.debug("Fetching conversation history", { sessionId });

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });

      if (error) {
        logError("Database error fetching conversation history", error, {
          sessionId,
          operation: "getConversationHistory",
        });
        throw createDatabaseError(
          ErrorCode.DB_QUERY_ERROR,
          `Failed to fetch conversation history: ${error.message}`,
          { sessionId, operation: "getConversationHistory" }
        );
      }

      const messages =
        data?.map((msg) => ({
          id: msg.id,
          text: msg.text,
          sender: msg.sender,
          timestamp: msg.timestamp,
          businessName: msg.business_name,
          metadata: msg.metadata,
          sessionId: msg.session_id,
        })) || [];

      chatbotLogger.info("Conversation history retrieved", {
        sessionId,
        messageCount: messages.length,
      });

      perfLogger.finish({ sessionId, messageCount: messages.length });
      return messages;
    } catch (error) {
      perfLogger.finish({
        error: error instanceof Error ? error.message : "Unknown error",
        sessionId,
      });

      if (error instanceof Error) {
        throw error; // Re-throw our typed errors
      }

      // Wrap unknown errors
      throw createBusinessLogicError(
        ErrorCode.CHATBOT_PROCESSING_FAILED,
        "An unexpected error occurred while fetching conversation history",
        { sessionId, operation: "getConversationHistory" }
      );
    }
  }

  /**
   * Update chatbot configuration
   */
  updateConfig(newConfig: Partial<ChatbotConfig>): void {
    try {
      // Merge configs and validate the result
      const mergedConfig = {
        ...this.config,
        ...newConfig,
      };

      const validatedConfig = validate(schemas.chatbotConfig, mergedConfig);

      this.config = validatedConfig;

      chatbotLogger.info("Chatbot configuration updated", {
        newConfig: validatedConfig,
        operation: "updateConfig",
      });
    } catch (error) {
      logError("Failed to update chatbot configuration", error, {
        newConfig,
        operation: "updateConfig",
      });
      throw createBusinessLogicError(
        ErrorCode.CHATBOT_PROCESSING_FAILED,
        "Failed to update chatbot configuration",
        { newConfig, operation: "updateConfig" }
      );
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): ChatbotConfig {
    return { ...this.config };
  }

  /**
   * Reset conversation context
   */
  resetContext(sessionId: string): ConversationContext {
    if (!sessionId.trim()) {
      throw createBusinessLogicError(
        ErrorCode.CHATBOT_PROCESSING_FAILED,
        "Session ID cannot be empty",
        { operation: "resetContext" }
      );
    }

    const newContext: ConversationContext = {
      sessionId,
      messageCount: 0,
      lastInteraction: new Date().toISOString(),
      topic: "general",
    };

    chatbotLogger.info("Conversation context reset", {
      sessionId,
      operation: "resetContext",
    });

    return newContext;
  }
}

export const chatbotService = new ChatbotService();
export default chatbotService;
