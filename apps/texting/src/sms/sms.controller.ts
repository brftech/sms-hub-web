import { Controller, Post, Body, Get, Param, HttpCode, HttpStatus } from '@nestjs/common'
import { SmsService } from './sms.service'
import { TcrService } from './tcr.service'
import { BandwidthService } from './bandwidth.service'

@Controller('sms')
export class SmsController {
  constructor(
    private smsService: SmsService,
    private tcrService: TcrService,
    private bandwidthService: BandwidthService,
  ) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  async sendSMS(@Body() body: {
    from: string
    to: string
    message: string
    metadata?: Record<string, any>
  }) {
    return this.smsService.sendSMS(body.from, body.to, body.message, body.metadata)
  }

  @Post('tcr/register-brand')
  @HttpCode(HttpStatus.CREATED)
  async registerBrand(@Body() body: {
    companyId: string
    brandData: any
  }) {
    return this.tcrService.registerBrand(body.companyId, body.brandData)
  }

  @Post('tcr/register-campaign')
  @HttpCode(HttpStatus.CREATED)
  async registerCampaign(@Body() body: {
    brandId: string
    campaignData: any
  }) {
    return this.tcrService.registerCampaign(body.brandId, body.campaignData)
  }

  @Get('tcr/brand/:brandId/status')
  async getBrandStatus(@Param('brandId') brandId: string) {
    return this.tcrService.getBrandStatus(brandId)
  }

  @Get('tcr/campaign/:campaignId/status')
  async getCampaignStatus(@Param('campaignId') campaignId: string) {
    return this.tcrService.getCampaignStatus(campaignId)
  }

  @Post('bandwidth/assign-phone')
  @HttpCode(HttpStatus.CREATED)
  async assignPhoneNumber(@Body() body: {
    companyId: string
    campaignId: string
  }) {
    return this.bandwidthService.assignPhoneNumber(body.companyId, body.campaignId)
  }

  @Get('bandwidth/available/:hubId')
  async getAvailablePhoneNumbers(@Param('hubId') hubId: string) {
    return this.bandwidthService.getAvailablePhoneNumbers(parseInt(hubId))
  }
}