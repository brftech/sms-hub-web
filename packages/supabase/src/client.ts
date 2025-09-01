import { createClient } from '@supabase/supabase-js'
import { Database } from '@sms-hub/types'

// For Vite apps, environment variables need to be injected at build time
// We'll export a function that creates the client with provided config
export const createSupabaseClient = (url: string, anonKey: string) => {
  if (!url || !anonKey) {
    console.error('Missing Supabase environment variables')
  }
  
  return createClient<Database>(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  })
}

// For server-side usage (Nest.js)
let supabase: ReturnType<typeof createSupabaseClient> | null = null

if (typeof process !== 'undefined' && process.env) {
  const url = process.env.SUPABASE_URL || ''
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
  
  if (url && key) {
    supabase = createSupabaseClient(url, key)
  }
}

// In browser environments, create a client with actual values if available
// This is a temporary fix - apps should ideally create their own client
if (typeof window !== 'undefined' && !supabase) {
  // Try to get values from Vite environment variables
  const url = (window as any).import?.meta?.env?.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
  const key = (window as any).import?.meta?.env?.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'
  
  supabase = createSupabaseClient(url, key)
}

export { supabase }

export type SupabaseClient = ReturnType<typeof createSupabaseClient>

// Singleton store for browser clients
let browserClient: ReturnType<typeof createSupabaseClient> | null = null

// Function to get or create a browser client
export const getSupabaseClient = (url: string, anonKey: string) => {
  if (typeof window === 'undefined') {
    // Server-side: always create a new client
    return createSupabaseClient(url, anonKey)
  }
  
  // Browser-side: use singleton pattern
  if (!browserClient) {
    browserClient = createSupabaseClient(url, anonKey)
  }
  return browserClient
}