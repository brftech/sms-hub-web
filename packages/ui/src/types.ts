// Minimal types needed for UI components
export type HubType = 'gnymble' | 'percytech' | 'percymd' | 'percytext';

export interface ChatMessage {
  id: string;
  content: string;
  text?: string; // Alternative content field
  sender: 'user' | 'bot' | 'business';
  timestamp: Date;
  businessName?: string; // For business messages
  metadata?: {
    [key: string]: any;
  };
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
  type?: string;
  user_count?: number;
  status?: string;
  payment_type?: string;
  payment_status?: string;
  has_texting?: boolean;
  has_other_services?: boolean;
  customer?: {
    id?: string;
    name?: string;
    email?: string;
    stripe_customer_id?: string;
  };
  company?: {
    name?: string;
    id?: string;
    primary_contact_email?: string;
    primary_contact_phone?: string;
    legal_name?: string;
    ein?: string;
    company_account_number?: string;
  };
}

export interface HubConfig {
  id: number;
  name: string;
  hubNumber: number;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export const HUB_CONFIGS = {
  gnymble: {
    id: 1,
    name: 'Gnymble',
    hubNumber: 1,
    primaryColor: '#FF6B35',
    secondaryColor: '#4ECDC4',
    accentColor: '#FFA500'
  },
  percytech: {
    id: 0,
    name: 'PercyTech',
    hubNumber: 0,
    primaryColor: '#007AFF',
    secondaryColor: '#5AC8FA',
    accentColor: '#FF3B30'
  },
  percymd: {
    id: 2,
    name: 'PercyMD',
    hubNumber: 2,
    primaryColor: '#5856D6',
    secondaryColor: '#AF52DE',
    accentColor: '#32ADE6'
  },
  percytext: {
    id: 3,
    name: 'PercyText',
    hubNumber: 3,
    primaryColor: '#FF9500',
    secondaryColor: '#FFCC00',
    accentColor: '#FF3B30'
  }
} as const;

export function getHubConfig(hubType: HubType): HubConfig {
  return HUB_CONFIGS[hubType];
}