import type { Database } from './database-generated'

export type Brand = Database['public']['Tables']['brands']['Row']
export type Campaign = Database['public']['Tables']['campaigns']['Row']  
export type PhoneNumber = Database['public']['Tables']['phone_numbers']['Row']

export type CampaignPhoneAssignment = Database['public']['Tables']['campaign_phone_assignments']['Row']
export type TCRIntegration = Database['public']['Tables']['tcr_integrations']['Row']
export type BandwidthAccount = Database['public']['Tables']['bandwidth_accounts']['Row']

// SMS Message interface (not yet in database schema)
export interface SMSMessage {
  id: string
  campaign_id: string
  phone_number_id: string
  to_number: string
  from_number: string
  message_body: string
  status: 'pending' | 'sent' | 'delivered' | 'failed'
  external_id?: string | null
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

// Alias for Message type
export type Message = SMSMessage

export interface TCRBrandRegistration {
  companyName: string
  legalName: string
  ein: string
  website: string
  address: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  industry: string
  verticalType: string
  legalForm: string
  contactInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
}

export interface TCRCampaignRegistration {
  brandId: string
  campaignName: string
  description: string
  messageFlow: string
  messageCategory: string
  useCase: string
  subUseCases: string[]
  messagingSamples: string[]
}