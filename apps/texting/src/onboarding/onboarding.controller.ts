import { Controller, Get, Post, Put, Body, Param, HttpCode, HttpStatus } from '@nestjs/common'
import { OnboardingService } from './onboarding.service'

@Controller('onboarding')
export class OnboardingController {
  constructor(private onboardingService: OnboardingService) {}

  @Get(':companyId/:hubId')
  async getOnboardingSubmission(
    @Param('companyId') companyId: string,
    @Param('hubId') hubId: string
  ) {
    return this.onboardingService.getOnboardingSubmission(companyId, parseInt(hubId))
  }

  @Put(':submissionId/step')
  @HttpCode(HttpStatus.OK)
  async updateOnboardingStep(
    @Param('submissionId') submissionId: string,
    @Body() body: {
      stepName: string
      stepData: Record<string, any>
    }
  ) {
    return this.onboardingService.updateOnboardingStep(
      submissionId,
      body.stepName as any,
      body.stepData
    )
  }

  @Post(':submissionId/payment')
  @HttpCode(HttpStatus.OK)
  async processPayment(
    @Param('submissionId') submissionId: string,
    @Body('stripeSessionId') stripeSessionId: string
  ) {
    return this.onboardingService.processPaymentStep(submissionId, stripeSessionId)
  }

  @Post(':submissionId/brand')
  @HttpCode(HttpStatus.OK)
  async processBrand(
    @Param('submissionId') submissionId: string,
    @Body('brandData') brandData: any
  ) {
    return this.onboardingService.processBrandStep(submissionId, brandData)
  }

  @Post(':submissionId/campaign')
  @HttpCode(HttpStatus.OK)
  async processCampaign(
    @Param('submissionId') submissionId: string,
    @Body('campaignData') campaignData: any
  ) {
    return this.onboardingService.processCampaignStep(submissionId, campaignData)
  }

  @Post(':submissionId/bandwidth')
  @HttpCode(HttpStatus.OK)
  async processBandwidth(@Param('submissionId') submissionId: string) {
    return this.onboardingService.processBandwidthStep(submissionId)
  }

  @Post(':submissionId/complete')
  @HttpCode(HttpStatus.OK)
  async completeOnboarding(@Param('submissionId') submissionId: string) {
    return this.onboardingService.completeOnboarding(submissionId)
  }
}