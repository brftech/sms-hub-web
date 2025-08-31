// Export services directly
export { contactService } from "./contactService";
export { leadsService } from "./leadsService";
export { messageService } from "./messageService";
export { chatbotService } from "./chatbotService";
export { zapierService } from "./zapierService";

export type {
  ContactData,
  Lead,
  LeadActivity,
  LeadFilters,
  LeadAnalytics,
} from "@/types";
export type {
  MessageData,
  MessageDestination,
  MessageAnalytics,
} from "./messageService";
export type {
  ChatMessage,
  ChatbotResponse,
  ConversationContext,
  ChatbotConfig,
} from "./chatbotService";
export type {
  ZapierSMSRequest,
  ZapierSMSResponse,
  ZapierOTPRequest,
  ZapierOTPResponse,
  ZapierChatRequest,
  ZapierChatResponse,
} from "./zapierService";
