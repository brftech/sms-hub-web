import { Injectable } from '@nestjs/common'
import { SupabaseService } from '../supabase/supabase.service'

@Injectable()
export class WebhooksService {
  constructor(private supabaseService: SupabaseService) {}

  async handleStripeWebhook(event: any) {
    switch (event.type) {
      case 'checkout.session.completed':
        return this.handlePaymentSuccess(event.data.object)
      case 'invoice.payment_failed':
        return this.handlePaymentFailed(event.data.object)
      default:
        console.log(`Unhandled Stripe event type: ${event.type}`)
    }
  }

  async handleTwilioWebhook(body: any) {
    const { MessageSid, MessageStatus, To, From } = body

    // Update message status in database
    // TODO: Implement message tracking table
    console.log(`Twilio webhook - Message ${MessageSid} status: ${MessageStatus}`)
  }

  private async handlePaymentSuccess(session: any) {
    // Find user by Stripe session ID
    const { data: profile, error } = await this.supabaseService.client
      .from('user_profiles')
      .update({
        payment_status: 'completed',
        payment_date: new Date().toISOString(),
        stripe_session_id: session.id
      })
      .eq('stripe_session_id', session.id)
      .select()
      .single()

    if (error) {
      console.error('Failed to update payment status:', error)
      return
    }

    // Create payment history record
    await this.supabaseService.client
      .from('payment_history')
      .insert([{
        hub_id: profile.hub_id,
        user_profile_id: profile.id,
        stripe_payment_intent_id: session.payment_intent,
        amount: session.amount_total,
        currency: session.currency,
        status: 'succeeded',
        payment_method: session.payment_method_types?.[0]
      }])

    console.log(`Payment completed for user ${profile.id}`)
  }

  private async handlePaymentFailed(invoice: any) {
    console.log(`Payment failed for customer ${invoice.customer}`)
    // TODO: Implement payment failure handling
  }
}