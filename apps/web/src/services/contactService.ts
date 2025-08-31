import { createSupabaseClient } from '@sms-hub/supabase'

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

class ContactService {
  private supabase: ReturnType<typeof createSupabaseClient>

  constructor() {
    // Get environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables')
    }
    
    this.supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)
  }

  async submitContact(data: ContactFormData) {
    const { data: result, error } = await this.supabase.functions.invoke('submit-contact', {
      body: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        company: data.company,
        message: data.message,
        platform_interest: data.platform_interest || 'General inquiry',
        hub_id: data.hub_id || 2 // Default to Gnymble (hub_id: 2) based on HUB_CONFIGS
      }
    })

    if (error) {
      console.error('Contact submission error:', error)
      throw new Error('Failed to submit contact form')
    }

    return result
  }
}

export const contactService = new ContactService()