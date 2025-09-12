import type { 
  Account, 
  CreateAccountData, 
  AccountService as IAccountService 
} from '@sms-hub/types';
import { createSupabaseClient } from '@sms-hub/supabase';

export class AccountService implements IAccountService {
  private supabase: ReturnType<typeof createSupabaseClient>;

  constructor(supabaseUrl: string, supabaseAnonKey: string) {
    this.supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);
  }

  /**
   * Get account by ID (maps to customer)
   */
  async getAccount(accountId: string): Promise<Account> {
    const { data, error } = await this.supabase
      .from('customers')
      .select('*')
      .eq('id', accountId)
      .single();

    if (error) {
      throw new Error(`Failed to get account: ${error.message}`);
    }

    return data as Account;
  }

  /**
   * Create a new account (maps to customer)
   */
  async createAccount(data: CreateAccountData): Promise<Account> {
    const { data: account, error } = await this.supabase
      .from('customers')
      .insert({
        company_id: data.company_id,
        user_id: data.user_id,
        billing_email: data.billing_email,
        customer_type: data.customer_type,
        hub_id: data.hub_id,
        stripe_customer_id: data.stripe_customer_id,
        subscription_status: data.subscription_status || 'inactive',
        subscription_tier: data.subscription_tier,
        trial_ends_at: data.trial_ends_at,
        is_active: data.is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create account: ${error.message}`);
    }

    return account as Account;
  }

  /**
   * Update account (maps to customer)
   */
  async updateAccount(accountId: string, data: Partial<Account>): Promise<Account> {
    const { data: account, error } = await this.supabase
      .from('customers')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', accountId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update account: ${error.message}`);
    }

    return account as Account;
  }

  /**
   * Delete account (maps to customer)
   */
  async deleteAccount(accountId: string): Promise<void> {
    const { error } = await this.supabase
      .from('customers')
      .delete()
      .eq('id', accountId);

    if (error) {
      throw new Error(`Failed to delete account: ${error.message}`);
    }
  }

  /**
   * Get accounts by hub ID (maps to customers)
   */
  async getAccountsByHub(hubId: number): Promise<Account[]> {
    const { data, error } = await this.supabase
      .from('customers')
      .select('*')
      .eq('hub_id', hubId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get accounts by hub: ${error.message}`);
    }

    return data as Account[];
  }

  /**
   * Get account by user ID (maps to customer by user_id)
   */
  async getAccountByUserId(userId: string): Promise<Account | null> {
    const { data, error } = await this.supabase
      .from('customers')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No account found
      }
      throw new Error(`Failed to get account by user ID: ${error.message}`);
    }

    return data as Account;
  }
}

// Factory function to create account service
export function createAccountService(supabaseUrl: string, supabaseAnonKey: string): AccountService {
  return new AccountService(supabaseUrl, supabaseAnonKey);
}
