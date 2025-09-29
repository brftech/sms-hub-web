import { SupabaseClient } from '@supabase/supabase-js'

export interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  message: string
  platform_interest?: string
  hub_id?: number
}

export class ContactService {
  constructor(private supabase: SupabaseClient) {}

  async submitContact(data: ContactFormData) {
    const { data: result, error } = await this.supabase.functions.invoke('submit-contact', {
      body: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        company: data.company,
        message: data.message,
        platform_interest: data.platform_interest || 'General inquiry',
        hub_id: data.hub_id || 2 // Default to Gnymble
      }
    })

    if (error) {
      // Error handled by caller
      throw new Error('Failed to submit contact form')
    }

    return result
  }
}

// Factory function for creating service instance
export const createContactService = (supabase: SupabaseClient) => {
  return new ContactService(supabase)
}