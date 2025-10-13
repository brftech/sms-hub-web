/**
 * Service for managing email and SMS subscribers
 * Centralizes subscriber operations to reduce code duplication
 */

import { SupabaseClient } from "@supabase/supabase-js";
import { parseFullName } from "../utils/nameUtils";

export interface AddEmailSubscriberParams {
  email: string;
  listId: string;
  fullName: string | null;
  hubId: number;
  phone?: string | null;
  company?: string | null;
}

export interface AddSmsSubscriberParams {
  phoneNumber: string;
  listId: string;
  fullName: string | null;
  hubId: number;
  email?: string | null;
  company?: string | null;
}

export interface SubscriberOperationResult {
  success: boolean;
  error?: string;
  data?: unknown;
}

export class SubscriberService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Get the default marketing list ID for a hub
   * @param hubId - Hub ID
   * @param listType - 'email' or 'sms'
   * @returns The list ID or null if not found
   */
  async getDefaultListId(hubId: number, listType: "email" | "sms"): Promise<string | null> {
    const table = listType === "email" ? "email_lists" : "sms_lists";

    try {
      const { data, error } = await this.supabase
        .from(table)
        .select("id")
        .eq("hub_id", hubId)
        .eq("list_type", "marketing")
        .limit(1);

      if (error) {
        console.error(`Error fetching ${listType} list:`, error);
        return null;
      }

      if (!data || data.length === 0) {
        console.warn(`No ${listType} list found for hub ${hubId}`);
        return null;
      }

      return (data[0] as { id: string }).id;
    } catch (err) {
      console.error(`Exception fetching ${listType} list:`, err);
      return null;
    }
  }

  /**
   * Add an email subscriber
   * @param params - Subscriber parameters
   * @returns Operation result
   */
  async addEmailSubscriber(params: AddEmailSubscriberParams): Promise<SubscriberOperationResult> {
    try {
      const { firstName, lastName } = parseFullName(params.fullName);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this.supabase as any)
        .from("email_subscribers")
        .insert({
          email: params.email,
          email_list_id: params.listId,
          first_name: firstName,
          last_name: lastName,
          hub_id: params.hubId,
          phone: params.phone || null,
          company_name: params.company || null,
          source: "website",
          status: "active",
        })
        .select();

      if (error) {
        console.error("Error adding email subscriber:", error);
        return {
          success: false,
          error: (error as { message?: string }).message || "Failed to add email subscriber",
        };
      }

      return { success: true, data };
    } catch (err) {
      console.error("Exception adding email subscriber:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  }

  /**
   * Add an SMS subscriber
   * @param params - Subscriber parameters
   * @returns Operation result
   */
  async addSmsSubscriber(params: AddSmsSubscriberParams): Promise<SubscriberOperationResult> {
    try {
      const { firstName, lastName } = parseFullName(params.fullName);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this.supabase as any)
        .from("sms_subscribers")
        .insert({
          phone_number: params.phoneNumber,
          sms_list_id: params.listId,
          first_name: firstName,
          last_name: lastName,
          hub_id: params.hubId,
          email: params.email || null,
          company_name: params.company || null,
          source: "website",
          status: "active",
        })
        .select();

      if (error) {
        console.error("Error adding SMS subscriber:", error);
        return {
          success: false,
          error: (error as { message?: string }).message || "Failed to add SMS subscriber",
        };
      }

      return { success: true, data };
    } catch (err) {
      console.error("Exception adding SMS subscriber:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  }

  /**
   * Check if an email is already subscribed
   * @param email - Email to check
   * @param hubId - Hub ID
   * @returns true if subscribed, false otherwise
   */
  async isEmailSubscribed(email: string, hubId: number): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from("email_subscribers")
        .select("id")
        .eq("email", email)
        .eq("hub_id", hubId)
        .limit(1);

      if (error) {
        console.error("Error checking email subscription:", error);
        return false;
      }

      return !!(data && data.length > 0);
    } catch (err) {
      console.error("Exception checking email subscription:", err);
      return false;
    }
  }

  /**
   * Check if a phone number is already subscribed
   * @param phoneNumber - Phone number to check
   * @param hubId - Hub ID
   * @returns true if subscribed, false otherwise
   */
  async isSmsSubscribed(phoneNumber: string, hubId: number): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from("sms_subscribers")
        .select("id")
        .eq("phone_number", phoneNumber)
        .eq("hub_id", hubId)
        .limit(1);

      if (error) {
        console.error("Error checking SMS subscription:", error);
        return false;
      }

      return !!(data && data.length > 0);
    } catch (err) {
      console.error("Exception checking SMS subscription:", err);
      return false;
    }
  }

  /**
   * Add a lead to email list (convenience method)
   * Gets the default list and adds the subscriber in one call
   */
  async addLeadToEmailList(lead: {
    email: string;
    name: string | null;
    hubId: number;
    phone?: string | null;
    company?: string | null;
  }): Promise<SubscriberOperationResult> {
    const listId = await this.getDefaultListId(lead.hubId, "email");

    if (!listId) {
      return {
        success: false,
        error: `No email list found for hub ${lead.hubId}`,
      };
    }

    return this.addEmailSubscriber({
      email: lead.email,
      listId,
      fullName: lead.name,
      hubId: lead.hubId,
      phone: lead.phone,
      company: lead.company,
    });
  }

  /**
   * Add a lead to SMS list (convenience method)
   * Gets the default list and adds the subscriber in one call
   */
  async addLeadToSmsList(lead: {
    phoneNumber: string;
    name: string | null;
    hubId: number;
    email?: string | null;
    company?: string | null;
  }): Promise<SubscriberOperationResult> {
    const listId = await this.getDefaultListId(lead.hubId, "sms");

    if (!listId) {
      return {
        success: false,
        error: `No SMS list found for hub ${lead.hubId}`,
      };
    }

    return this.addSmsSubscriber({
      phoneNumber: lead.phoneNumber,
      listId,
      fullName: lead.name,
      hubId: lead.hubId,
      email: lead.email,
      company: lead.company,
    });
  }
}

/**
 * Factory function for creating service instance
 * @param supabase - Supabase client instance
 * @returns SubscriberService instance
 */
export function createSubscriberService(supabase: SupabaseClient): SubscriberService {
  return new SubscriberService(supabase);
}
