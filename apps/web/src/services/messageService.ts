import { supabase } from "@/integrations/supabase/client";
import { logger, logError } from "@/lib/logger";

export interface MessageData {
  id?: string;
  text: string;
  sender: "user" | "business";
  timestamp: Date;
  businessName?: string;
  leadId?: string;
  sessionId?: string;
  metadata?: {
    source: "phone-ui" | "web-form" | "api";
    userAgent?: string;
    ipAddress?: string;
    location?: string;
  };
}

export interface MessageDestination {
  type: "lead" | "analytics" | "notification" | "external";
  config: {
    leadId?: string;
    webhookUrl?: string;
    email?: string;
    slackChannel?: string;
    notificationType?: "sms" | "email" | "push" | "slack";
  };
}

export interface MessageAnalytics {
  totalMessages: number;
  messagesBySender: Record<string, number>;
  messagesByHour: Record<number, number>;
  averageResponseTime: number;
  popularKeywords: Array<{ keyword: string; count: number }>;
  conversionRate: number;
}

class MessageService {
  /**
   * Send a message and route it to appropriate destinations
   */
  async sendMessage(
    message: Omit<MessageData, "id" | "timestamp">,
    destinations: MessageDestination[] = []
  ): Promise<MessageData> {
    const messageData: MessageData = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };

    try {
      // Store message in database
      const { data, error } = await supabase
        .from("messages")
        .insert([messageData])
        .select()
        .single();

      if (error) throw error;

      // Route message to destinations
      await this.routeMessage(messageData, destinations);

      // Update analytics
      await this.updateMessageAnalytics(messageData);

      return data;
    } catch (error) {
      logError("Error sending message", error, {
        operation: "sendMessage",
        messageData: {
          sender: message.sender,
          textLength: message.text.length,
          businessName: message.businessName,
        },
      });
      throw error;
    }
  }

  /**
   * Route message to various destinations
   */
  private async routeMessage(
    message: MessageData,
    destinations: MessageDestination[]
  ): Promise<void> {
    const promises = destinations.map(async (destination) => {
      try {
        switch (destination.type) {
          case "lead":
            await this.routeToLead(message, destination.config);
            break;
          case "analytics":
            await this.routeToAnalytics(message);
            break;
          case "notification":
            await this.routeToNotification(message, destination.config);
            break;
          case "external":
            await this.routeToExternal(message, destination.config);
            break;
        }
      } catch (error) {
        console.error(`Error routing to ${destination.type}:`, error);
      }
    });

    await Promise.allSettled(promises);
  }

  /**
   * Route message to lead management system
   */
  private async routeToLead(
    message: MessageData,
    config: MessageDestination["config"]
  ): Promise<void> {
    if (!config.leadId) {
      // Create new lead if none exists
      const { data: lead, error } = await supabase
        .from("leads")
        .insert([
          {
            first_name: "Phone User",
            email: `phone-${Date.now()}@gnymble.com`,
            source: "phone-ui",
            status: "new",
            notes: `Initial message: ${message.text}`,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Update message with lead ID
      await supabase
        .from("messages")
        .update({ leadId: lead.id })
        .eq("id", message.id);
    } else {
      // Update existing lead
      await supabase
        .from("leads")
        .update({
          notes: `New message: ${message.text}`,
          updated_at: new Date().toISOString(),
        })
        .eq("id", config.leadId);
    }
  }

  /**
   * Route message to analytics system
   */
  private async routeToAnalytics(message: MessageData): Promise<void> {
    // This could integrate with external analytics services
    // For now, we'll just log it
    console.log("Message analytics:", {
      sender: message.sender,
      timestamp: message.timestamp,
      text: message.text.substring(0, 100), // Truncate for logging
    });
  }

  /**
   * Route message to notification system
   */
  private async routeToNotification(
    message: MessageData,
    config: MessageDestination["config"]
  ): Promise<void> {
    const { notificationType, email, slackChannel } = config;

    switch (notificationType) {
      case "email":
        if (email) {
          await this.sendEmailNotification(message, email);
        }
        break;
      case "slack":
        if (slackChannel) {
          await this.sendSlackNotification(message, slackChannel);
        }
        break;
      case "sms":
        await this.sendSMSNotification(message);
        break;
      case "push":
        await this.sendPushNotification(message);
        break;
    }
  }

  /**
   * Route message to external services
   */
  private async routeToExternal(
    message: MessageData,
    config: MessageDestination["config"]
  ): Promise<void> {
    if (config.webhookUrl) {
      await fetch(config.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
    }
  }

  /**
   * Send email notification
   */
  private async sendEmailNotification(
    message: MessageData,
    email: string
  ): Promise<void> {
    // TODO: Integrate with email service (SendGrid, Mailgun, etc.)
    console.log("Sending email notification to:", email, message);
  }

  /**
   * Send Slack notification
   */
  private async sendSlackNotification(
    message: MessageData,
    channel: string
  ): Promise<void> {
    // TODO: Integrate with Slack webhook
    console.log("Sending Slack notification to:", channel, message);
  }

  /**
   * Send SMS notification
   */
  private async sendSMSNotification(message: MessageData): Promise<void> {
    // TODO: Integrate with SMS service (Twilio, etc.)
    console.log("Sending SMS notification:", message);
  }

  /**
   * Send push notification
   */
  private async sendPushNotification(message: MessageData): Promise<void> {
    // TODO: Integrate with push notification service
    console.log("Sending push notification:", message);
  }

  /**
   * Get message analytics
   */
  async getMessageAnalytics(): Promise<MessageAnalytics> {
    try {
      const { data: messages, error } = await supabase
        .from("messages")
        .select("*")
        .order("timestamp", { ascending: false });

      if (error) throw error;

      // Calculate analytics
      const totalMessages = messages.length;
      const messagesBySender = messages.reduce((acc, msg) => {
        acc[msg.sender] = (acc[msg.sender] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const messagesByHour = messages.reduce((acc, msg) => {
        const hour = new Date(msg.timestamp).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      // Calculate popular keywords
      const keywordCounts: Record<string, number> = {};
      messages.forEach((msg) => {
        const words = msg.text.toLowerCase().split(/\s+/);
        words.forEach((word) => {
          if (word.length > 3) {
            keywordCounts[word] = (keywordCounts[word] || 0) + 1;
          }
        });
      });

      const popularKeywords = Object.entries(keywordCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([keyword, count]) => ({ keyword, count }));

      return {
        totalMessages,
        messagesBySender,
        messagesByHour,
        averageResponseTime: 0, // TODO: Calculate from actual data
        popularKeywords,
        conversionRate: 0, // TODO: Calculate from lead conversion data
      };
    } catch (error) {
      console.error("Error getting message analytics:", error);
      throw error;
    }
  }

  /**
   * Get messages for a specific lead
   */
  async getLeadMessages(leadId: string): Promise<MessageData[]> {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("leadId", leadId)
        .order("timestamp", { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting lead messages:", error);
      throw error;
    }
  }

  /**
   * Update message analytics
   */
  private async updateMessageAnalytics(message: MessageData): Promise<void> {
    // This could update real-time analytics dashboards
    // For now, we'll just log the update
    console.log("Updating message analytics:", message.id);
  }
}

export const messageService = new MessageService();
