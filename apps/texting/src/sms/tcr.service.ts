import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SupabaseService } from '../supabase/supabase.service'

@Injectable()
export class TcrService {
  constructor(
    private configService: ConfigService,
    private supabaseService: SupabaseService,
  ) {}

  async registerBrand(companyId: string, brandData: {
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
  }) {
    // In development mode, return mock data
    if (process.env.NODE_ENV === 'development') {
      const mockBrandId = `mock_brand_${Date.now()}`
      
      // Store in database
      const { data, error } = await this.supabaseService.client
        .from('brands')
        .insert([{
          company_id: companyId,
          hub_id: 1, // Default to Gnymble for now
          name: brandData.companyName,
          dba_brand_name: brandData.legalName,
          tcr_brand_id: mockBrandId,
          status: 'approved'
        }])
        .select()
        .single()

      if (error) throw error
      return { brandId: mockBrandId, status: 'approved', data }
    }

    // TODO: Implement actual TCR API integration
    throw new Error('TCR integration not implemented yet')
  }

  async registerCampaign(brandId: string, campaignData: {
    campaignName: string
    description: string
    messageFlow: string
    messageCategory: string
    useCase: string
    subUseCases: string[]
    messagingSamples: string[]
  }) {
    // In development mode, return mock data
    if (process.env.NODE_ENV === 'development') {
      const mockCampaignId = `mock_campaign_${Date.now()}`
      
      // Get brand to find company_id and hub_id
      const { data: brand, error: brandError } = await this.supabaseService.client
        .from('brands')
        .select('*')
        .eq('tcr_brand_id', brandId)
        .single()

      if (brandError || !brand) {
        throw new Error('Brand not found')
      }

      // Store in database
      const { data, error } = await this.supabaseService.client
        .from('campaigns')
        .insert([{
          hub_id: brand.hub_id,
          brand_id: brand.id,
          name: campaignData.campaignName,
          tcr_campaign_id: mockCampaignId,
          status: 'approved'
        }])
        .select()
        .single()

      if (error) throw error
      return { campaignId: mockCampaignId, status: 'approved', data }
    }

    // TODO: Implement actual TCR API integration
    throw new Error('TCR integration not implemented yet')
  }

  async getBrandStatus(tcrBrandId: string) {
    // Check database first
    const { data, error } = await this.supabaseService.client
      .from('brands')
      .select('*')
      .eq('tcr_brand_id', tcrBrandId)
      .single()

    if (error) throw error
    return { status: data.status }
  }

  async getCampaignStatus(tcrCampaignId: string) {
    // Check database first
    const { data, error } = await this.supabaseService.client
      .from('campaigns')
      .select('*')
      .eq('tcr_campaign_id', tcrCampaignId)
      .single()

    if (error) throw error
    return { status: data.status }
  }
}