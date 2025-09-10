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

// Only create client on server side, not in browser
// This should never run in browser environments
if (typeof process !== 'undefined' && process.env && typeof window === 'undefined' && typeof global !== 'undefined') {
  const url = process.env.SUPABASE_URL || ''
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
  
  if (url && key) {
    supabase = createSupabaseClient(url, key)
  }
}

// Don't create a default client in browser - let apps create their own
// This prevents the placeholder client issue

export { supabase }

export type SupabaseClient = ReturnType<typeof createSupabaseClient>