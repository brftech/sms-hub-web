import { createContactService, ContactFormData } from "./contactServiceDirect";
import { getSupabaseClient } from "./supabaseSingleton";

// Use singleton instance
const supabase = getSupabaseClient();
export const contactService = createContactService(supabase);

// Re-export types for convenience
export type { ContactFormData };
