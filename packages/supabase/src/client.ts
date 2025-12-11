import { createClient } from "@supabase/supabase-js";
import { Database } from "./types";

// For Vite apps, environment variables need to be injected at build time
// We'll export a function that creates the client with provided config
export const createSupabaseClient = (url: string, anonKey: string) => {
  if (!url || !anonKey) {
    console.error("Missing Supabase environment variables");
  }

  // Check if we're on the marketing site (port 3005) - don't persist sessions there
  const isMarketingSite =
    typeof window !== "undefined" &&
    (window.location.port === "3005" || window.location.hostname.includes("www."));

  return createClient<Database>(url, anonKey, {
    auth: {
      persistSession: !isMarketingSite, // Don't persist on marketing site
      autoRefreshToken: !isMarketingSite,
      detectSessionInUrl: false, // Don't auto-detect sessions
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
      storageKey: "supabase.auth.token",
      flowType: "pkce",
    },
  });
};

// For server-side usage (Nest.js)
let supabase: ReturnType<typeof createSupabaseClient> | null = null;

// Only create client on server side, not in browser
// This should never run in browser environments
if (
  typeof process !== "undefined" &&
  process.env &&
  typeof window === "undefined" &&
  typeof global !== "undefined"
) {
  const url = process.env.SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";

  if (url && key) {
    supabase = createSupabaseClient(url, key);
  }
}

// Don't create a default client in browser - let apps create their own
// This prevents the placeholder client issue

export { supabase };

export type SupabaseClient = ReturnType<typeof createSupabaseClient>;
