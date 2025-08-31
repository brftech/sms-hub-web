import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Twilio from 'twilio'

@Injectable()
export class SmsService {
  private twilioClient: Twilio.Twilio

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID')
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN')

    if (accountSid && authToken) {
      this.twilioClient = Twilio(accountSid, authToken)
    }
  }

  async sendVerificationSMS(phoneNumber: string, verificationCode: string): Promise<void> {
    if (!this.twilioClient) {
      // In development/test mode, just log the code
      console.log(`SMS Verification Code for ${phoneNumber}: ${verificationCode}`)
      return
    }

    try {
      await this.twilioClient.messages.create({
        body: `Your verification code is: ${verificationCode}`,
        from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
        to: phoneNumber,
      })
    } catch (error) {
      console.error('Failed to send SMS:', error)
      // In development, don't fail - just log
      if (process.env.NODE_ENV === 'development') {
        console.log(`SMS Verification Code for ${phoneNumber}: ${verificationCode}`)
      } else {
        throw error
      }
    }
  }

  async sendSMS(
    from: string,
    to: string,
    message: string,
    metadata?: Record<string, any>
  ): Promise<{
    messageId: string
    status: string
  }> {
    if (!this.twilioClient) {
      // Mock response for development
      return {
        messageId: `mock_${Date.now()}`,
        status: 'sent'
      }
    }

    try {
      const result = await this.twilioClient.messages.create({
        body: message,
        from,
        to,
      })

      return {
        messageId: result.sid,
        status: result.status
      }
    } catch (error) {
      console.error('Failed to send SMS:', error)
      throw error
    }
  }
}