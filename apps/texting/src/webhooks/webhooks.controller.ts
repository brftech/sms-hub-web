import { Controller, Post, Body, Headers, HttpCode, HttpStatus } from '@nestjs/common'
import { WebhooksService } from './webhooks.service'

@Controller('webhooks')
export class WebhooksController {
  constructor(private webhooksService: WebhooksService) {}

  @Post('stripe')
  @HttpCode(HttpStatus.OK)
  async handleStripeWebhook(
    @Body() body: any,
    @Headers('stripe-signature') signature: string
  ) {
    // TODO: Verify Stripe signature
    return this.webhooksService.handleStripeWebhook(body)
  }

  @Post('twilio')
  @HttpCode(HttpStatus.OK)
  async handleTwilioWebhook(@Body() body: any) {
    return this.webhooksService.handleTwilioWebhook(body)
  }
}