/**
 * Shared subscriber management helpers for Edge Functions
 * This provides Deno-compatible utilities for adding subscribers
 */

import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.52.0";
import { parseFullName } from "./nameUtils.ts";

export interface AddSubscriberParams {
  email?: string | null;
  phoneNumber?: string | null;
  name?: string | null;
  hubId: number;
  company?: string | null;
}

export interface SubscriberOperationResult {
  success: boolean;
  error?: string;
  data?: unknown;
}

/**
 * Get the default marketing list ID for a given hub and list type
 */
export async function getDefaultListId(
  supabase: SupabaseClient,
  hubId: number,
  listType: "email" | "sms"
): Promise<string | null> {
  const table = listType === "email" ? "email_lists" : "sms_lists";

  const { data, error } = await supabase
    .from(table)
    .select("id")
    .eq("hub_id", hubId)
    .eq("list_type", "marketing")
    .eq("is_default", true)
    .limit(1);

  if (error) {
    console.error(`Error fetching default ${listType} list:`, error);
    return null;
  }

  return data?.[0]?.id || null;
}

/**
 * Add an email subscriber to the default marketing list
 */
export async function addEmailSubscriber(
  supabase: SupabaseClient,
  params: AddSubscriberParams
): Promise<SubscriberOperationResult> {
  if (!params.email) {
    return { success: false, error: "Email is required" };
  }

  try {
    const emailListId = await getDefaultListId(supabase, params.hubId, "email");
    if (!emailListId) {
      return {
        success: false,
        error: `No default email list found for hub ${params.hubId}`,
      };
    }

    const { firstName, lastName } = parseFullName(params.name);

    const { data, error } = await supabase
      .from("email_subscribers")
      .insert({
        email: params.email,
        email_list_id: emailListId,
        first_name: firstName,
        last_name: lastName,
        hub_id: params.hubId,
        company_name: params.company || null,
        source: "website",
        status: "active",
      })
      .select();

    if (error) {
      console.error("Error adding email subscriber:", error);
      return {
        success: false,
        error: error.message || "Failed to add email subscriber",
      };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Exception adding email subscriber:", err);
    return {
      success: false,
      error: (err as Error).message || "An unexpected error occurred",
    };
  }
}

/**
 * Add an SMS subscriber to the default marketing list
 */
export async function addSmsSubscriber(
  supabase: SupabaseClient,
  params: AddSubscriberParams
): Promise<SubscriberOperationResult> {
  if (!params.phoneNumber) {
    return { success: false, error: "Phone number is required" };
  }

  try {
    const smsListId = await getDefaultListId(supabase, params.hubId, "sms");
    if (!smsListId) {
      return {
        success: false,
        error: `No default SMS list found for hub ${params.hubId}`,
      };
    }

    const { firstName, lastName } = parseFullName(params.name);

    const { data, error } = await supabase
      .from("sms_subscribers")
      .insert({
        phone_number: params.phoneNumber,
        sms_list_id: smsListId,
        first_name: firstName,
        last_name: lastName,
        hub_id: params.hubId,
        email: params.email || null,
        source: "website",
        status: "active",
      })
      .select();

    if (error) {
      console.error("Error adding SMS subscriber:", error);
      return {
        success: false,
        error: error.message || "Failed to add SMS subscriber",
      };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Exception adding SMS subscriber:", err);
    return {
      success: false,
      error: (err as Error).message || "An unexpected error occurred",
    };
  }
}
