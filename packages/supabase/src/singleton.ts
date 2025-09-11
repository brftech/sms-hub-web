import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(
  supabaseUrl?: string,
  supabaseAnonKey?: string
): SupabaseClient {
  // If instance already exists, return it
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Get from environment if not provided
  const url =
    supabaseUrl ||
    (typeof import.meta !== "undefined" &&
      (import.meta as { env?: { VITE_SUPABASE_URL?: string } }).env
        ?.VITE_SUPABASE_URL) ||
    (typeof process !== "undefined" && process.env?.SUPABASE_URL) ||
    "";

  const key =
    supabaseAnonKey ||
    (typeof import.meta !== "undefined" &&
      (import.meta as { env?: { VITE_SUPABASE_ANON_KEY?: string } }).env
        ?.VITE_SUPABASE_ANON_KEY) ||
    (typeof process !== "undefined" && process.env?.SUPABASE_ANON_KEY) ||
    "";

  if (!url || !key) {
    throw new Error("Supabase URL and Anon Key are required");
  }

  // Create and cache the instance
  supabaseInstance = createClient(url, key, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });

  return supabaseInstance;
}

// Export a function to clear the singleton (useful for testing)
export function clearSupabaseInstance() {
  supabaseInstance = null;
}
