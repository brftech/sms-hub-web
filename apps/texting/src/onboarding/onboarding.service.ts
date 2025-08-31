import { Injectable, BadRequestException } from '@nestjs/common'
import { SupabaseService } from '../supabase/supabase.service'
import { TcrService } from '../sms/tcr.service'
import { BandwidthService } from '../sms/bandwidth.service'
import { OnboardingStepName } from '@sms-hub/types'

@Injectable()
export class OnboardingService {
  constructor(
    private supabaseService: SupabaseService,
    private tcrService: TcrService,
    private bandwidthService: BandwidthService,
  ) {}

  async getOnboardingSubmission(companyId: string, hubId: number) {
    const { data, error } = await this.supabaseService.client
      .from('onboarding_submissions')
      .select('*')
      .eq('company_id', companyId)
      .eq('hub_id', hubId)
      .single()

    if (error) throw error
    return data
  }

  async updateOnboardingStep(
    submissionId: string,
    stepName: OnboardingStepName,
    stepData: Record<string, any>
  ) {
    const { data, error } = await this.supabaseService.client
      .from('onboarding_submissions')
      .update({
        current_step: stepName,
        step_data: stepData,
        updated_at: new Date().toISOString()
      })
      .eq('id', submissionId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async processPaymentStep(submissionId: string, stripeSessionId: string) {
    // Update submission with Stripe session
    const { data, error } = await this.supabaseService.client
      .from('onboarding_submissions')
      .update({
        stripe_status: 'completed',
        current_step: 'brand',
        step_data: { stripe_session_id: stripeSessionId },
        updated_at: new Date().toISOString()
      })
      .eq('id', submissionId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async processBrandStep(submissionId: string, brandData: any) {
    // Get submission details
    const { data: submission, error: submissionError } = await this.supabaseService.client
      .from('onboarding_submissions')
      .select('*')
      .eq('id', submissionId)
      .single()

    if (submissionError || !submission) {
      throw new BadRequestException('Onboarding submission not found')
    }

    // Register brand with TCR
    const brandResult = await this.tcrService.registerBrand(submission.company_id, brandData)

    // Update submission
    const { data, error } = await this.supabaseService.client
      .from('onboarding_submissions')
      .update({
        tcr_brand_id: brandResult.brandId,
        current_step: 'privacy_terms',
        step_data: { ...(submission.step_data as Record<string, any> || {}), brand: brandData },
        updated_at: new Date().toISOString()
      })
      .eq('id', submissionId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async processCampaignStep(submissionId: string, campaignData: any) {
    // Get submission details
    const { data: submission, error: submissionError } = await this.supabaseService.client
      .from('onboarding_submissions')
      .select('*')
      .eq('id', submissionId)
      .single()

    if (submissionError || !submission || !submission.tcr_brand_id) {
      throw new BadRequestException('Brand registration required before campaign setup')
    }

    // Register campaign with TCR
    const campaignResult = await this.tcrService.registerCampaign(submission.tcr_brand_id, campaignData)

    // Update submission
    const { data, error } = await this.supabaseService.client
      .from('onboarding_submissions')
      .update({
        tcr_campaign_id: campaignResult.campaignId,
        current_step: 'bandwidth',
        step_data: { ...(submission.step_data as Record<string, any> || {}), campaign: campaignData },
        updated_at: new Date().toISOString()
      })
      .eq('id', submissionId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async processBandwidthStep(submissionId: string) {
    // Get submission details
    const { data: submission, error: submissionError } = await this.supabaseService.client
      .from('onboarding_submissions')
      .select('*')
      .eq('id', submissionId)
      .single()

    if (submissionError || !submission || !submission.tcr_campaign_id) {
      throw new BadRequestException('Campaign registration required before phone number assignment')
    }

    // Get campaign ID from TCR campaign ID
    const { data: campaign, error: campaignError } = await this.supabaseService.client
      .from('campaigns')
      .select('id')
      .eq('tcr_campaign_id', submission.tcr_campaign_id)
      .single()

    if (campaignError || !campaign) {
      throw new BadRequestException('Campaign not found')
    }

    // Assign phone number
    const phoneResult = await this.bandwidthService.assignPhoneNumber(submission.company_id, campaign.id)

    // Update submission
    const { data, error } = await this.supabaseService.client
      .from('onboarding_submissions')
      .update({
        assigned_phone_number: phoneResult.phoneNumber,
        current_step: 'activation',
        step_data: { ...(submission.step_data as Record<string, any> || {}), bandwidth: phoneResult },
        updated_at: new Date().toISOString()
      })
      .eq('id', submissionId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async completeOnboarding(submissionId: string) {
    // Update submission to completed
    const { data, error } = await this.supabaseService.client
      .from('onboarding_submissions')
      .update({
        current_step: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', submissionId)
      .select()
      .single()

    if (error) throw error

    // Update user profile onboarding status
    await this.supabaseService.client
      .from('user_profiles')
      .update({
        onboarding_step: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', data.user_id)

    return data
  }
}