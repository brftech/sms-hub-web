import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SupabaseService } from '../supabase/supabase.service'

@Injectable()
export class BandwidthService {
  constructor(
    private configService: ConfigService,
    private supabaseService: SupabaseService,
  ) {}

  async assignPhoneNumber(companyId: string, campaignId: string) {
    // In development mode, return mock phone number
    if (process.env.NODE_ENV === 'development') {
      const mockPhoneNumber = `+1555${Math.floor(Math.random() * 9000000) + 1000000}`
      
      // Get campaign to find hub_id
      const { data: campaign, error: campaignError } = await this.supabaseService.client
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .single()

      if (campaignError || !campaign) {
        throw new Error('Campaign not found')
      }

      // Store phone number in database
      const { data: phoneNumber, error: phoneError } = await this.supabaseService.client
        .from('phone_numbers')
        .insert([{
          hub_id: campaign.hub_id,
          phone_number: mockPhoneNumber,
          bandwidth_account_id: `mock_account_${Date.now()}`,
          is_active: true,
          assigned_to_campaign: campaignId
        }])
        .select()
        .single()

      if (phoneError) throw phoneError

      // Create assignment record
      await this.supabaseService.client
        .from('campaign_phone_assignments')
        .insert([{
          campaign_id: campaignId,
          phone_number_id: phoneNumber.id
        }])

      return { 
        phoneNumber: mockPhoneNumber, 
        accountId: phoneNumber.bandwidth_account_id,
        data: phoneNumber 
      }
    }

    // TODO: Implement actual Bandwidth API integration
    throw new Error('Bandwidth integration not implemented yet')
  }

  async getAvailablePhoneNumbers(hubId: number) {
    const { data, error } = await this.supabaseService.client
      .from('phone_numbers')
      .select('*')
      .eq('hub_id', hubId)
      .eq('is_active', true)
      .is('assigned_to_campaign', null)

    if (error) throw error
    return data
  }

  async releasePhoneNumber(phoneNumberId: string) {
    const { data, error } = await this.supabaseService.client
      .from('phone_numbers')
      .update({ 
        assigned_to_campaign: null,
        is_active: false 
      })
      .eq('id', phoneNumberId)
      .select()
      .single()

    if (error) throw error
    return data
  }
}