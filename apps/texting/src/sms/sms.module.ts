import { Module } from '@nestjs/common'
import { SmsController } from './sms.controller'
import { SmsService } from './sms.service'
import { TcrService } from './tcr.service'
import { BandwidthService } from './bandwidth.service'

@Module({
  controllers: [SmsController],
  providers: [SmsService, TcrService, BandwidthService],
  exports: [SmsService, TcrService, BandwidthService],
})
export class SmsModule {}