import { createContactService } from '@sms-hub/services'
import { getSupabaseClient } from '../lib/supabaseSingleton'

// Use singleton instance
const supabase = getSupabaseClient()
export const contactService = createContactService(supabase)

// Re-export types for convenience
export type { ContactFormData } from '@sms-hub/services'