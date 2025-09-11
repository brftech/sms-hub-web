import { createSupabaseClient } from "@sms-hub/supabase";
import type { SupabaseClient } from "@sms-hub/supabase";

let supabaseInstance: SupabaseClient | null = null;
let supabaseAdminInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseInstance) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables");
    }

    // Create the singleton instance
    supabaseInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey);

    // Also set it on window for backwards compatibility
    if (typeof window !== "undefined") {
      (window as any).__supabaseClient = supabaseInstance;
    }
  }

  return supabaseInstance;
};

export const getSupabaseAdminClient = (): SupabaseClient => {
  if (!supabaseAdminInstance) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseServiceRoleKey = import.meta.env
      .VITE_SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error("Missing Supabase service role environment variables");
    }

    // Create the admin instance with service role key
    supabaseAdminInstance = createSupabaseClient(
      supabaseUrl,
      supabaseServiceRoleKey
    );
  }

  return supabaseAdminInstance;
};

// Reset function for testing purposes
export const resetSupabaseClient = () => {
  supabaseInstance = null;
  if (typeof window !== "undefined") {
    delete (window as any).__supabaseClient;
  }
};
