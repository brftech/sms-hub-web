import type { Database } from "./database";

// Simple Account = Customer approach
// Account is just an alias for Customer in the existing system

// Re-export existing types with Account naming
export type Account = Database["public"]["Tables"]["customers"]["Row"];
export type Company = Database["public"]["Tables"]["companies"]["Row"];

// Account types for better type safety
export type AccountType = 'company' | 'individual';
export type AccountStatus = 'active' | 'inactive' | 'suspended' | 'trial';
export type SubscriptionTier = 'free' | 'basic' | 'professional' | 'enterprise';

// Account creation data (maps to customer creation)
export interface CreateAccountData {
  company_id?: string; // For B2B accounts
  user_id?: string;    // For B2C accounts
  billing_email: string;
  customer_type: AccountType;
  hub_id: number;
  stripe_customer_id?: string;
  subscription_status?: string;
  subscription_tier?: SubscriptionTier;
  trial_ends_at?: string;
  is_active?: boolean;
}

// Account service interface (maps to customer service)
export interface AccountService {
  getAccount: (accountId: string) => Promise<Account>;
  createAccount: (data: CreateAccountData) => Promise<Account>;
  updateAccount: (accountId: string, data: Partial<Account>) => Promise<Account>;
  deleteAccount: (accountId: string) => Promise<void>;
  getAccountsByHub: (hubId: number) => Promise<Account[]>;
  getAccountByUserId: (userId: string) => Promise<Account | null>;
}

// Account context for React components
export interface AccountContextType {
  account: Account | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  updateAccount: (data: Partial<Account>) => Promise<void>;
  refreshAccount: () => Promise<void>;
}
