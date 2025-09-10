import { createSupabaseClient } from '@sms-hub/supabase'
import { createContactService } from '@sms-hub/services'

// Create singleton instance
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)
export const contactService = createContactService(supabase)

// Re-export types for convenience
export type { ContactFormData } from '@sms-hub/services'