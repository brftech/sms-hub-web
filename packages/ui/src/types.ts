// Minimal types needed for UI components
export type HubType = 'gnymble' | 'percytech' | 'percymd' | 'percytext';

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ConversationContext {
  id: string;
  participants: string[];
  messages: ChatMessage[];
}

export interface UnifiedAccount {
  id: string;
  email: string;
  name?: string;
  hub_id: number;
  created_at?: string;
}

export const HUB_CONFIGS = {
  gnymble: { id: 1, name: 'Gnymble', hubNumber: 1 },
  percytech: { id: 0, name: 'PercyTech', hubNumber: 0 },
  percymd: { id: 2, name: 'PercyMD', hubNumber: 2 },
  percytext: { id: 3, name: 'PercyText', hubNumber: 3 }
} as const;

export function getHubConfig(hubType: HubType) {
  return HUB_CONFIGS[hubType];
}