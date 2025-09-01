import { useState } from 'react'
import { useHub, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sms-hub/ui'
import { Input, Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@sms-hub/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@sms-hub/ui'
import { Textarea } from '@sms-hub/ui'
import { StepComponentProps } from '@sms-hub/types'
import { useForm } from 'react-hook-form'
import { Megaphone, ChevronRight, Info, Plus, X } from 'lucide-react'
import styled from 'styled-components'

const InfoBox = styled.div`
  background: #eff6ff;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  gap: 0.75rem;
`

const InfoIcon = styled.div`
  color: #3b82f6;
  flex-shrink: 0;
`

const InfoText = styled.div`
  font-size: 0.875rem;
  color: #1e40af;
  line-height: 1.5;
`

const SampleMessageContainer = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`

const SampleMessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`

const RemoveButton = styled.button`
  color: #ef4444;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  
  &:hover {
    color: #dc2626;
  }
`

const AddButton = styled(Button)`
  margin-top: 0.5rem;
`

interface CampaignFormData {
  campaign_name: string
  description: string
  message_flow: string
  use_case: string
  sample_messages: string[]
  content_type: string
  call_to_action: string
  subscriber_optin: string
  subscriber_optout: string
  subscriber_help: string
  opt_in_message: string
  opt_out_message: string
  help_message: string
  age_gated: boolean
  direct_lending: boolean
  embedded_link: boolean
  embedded_phone: boolean
  affiliate_marketing: boolean
  monthly_volume: number
}

const USE_CASES = [
  { value: 'marketing', label: 'Marketing & Promotional' },
  { value: 'notifications', label: 'Transactional Notifications' },
  { value: 'alerts', label: 'Account Alerts' },
  { value: 'customer_care', label: 'Customer Care' },
  { value: 'delivery', label: 'Delivery Updates' },
  { value: 'appointment', label: 'Appointment Reminders' },
  { value: '2fa', label: 'Two-Factor Authentication' },
  { value: 'surveys', label: 'Surveys & Voting' },
  { value: 'mixed', label: 'Mixed Use' }
]

export function CampaignStep({ onComplete }: StepComponentProps) {
  const { hubConfig } = useHub()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sampleMessages, setSampleMessages] = useState<string[]>([''])

  const form = useForm<CampaignFormData>({
    defaultValues: {
      campaign_name: '',
      description: '',
      message_flow: '',
      use_case: '',
      sample_messages: [],
      content_type: 'promotional',
      call_to_action: '',
      subscriber_optin: 'WEB_FORM',
      subscriber_optout: 'STOP',
      subscriber_help: 'HELP',
      opt_in_message: 'Reply YES to receive messages from ' + hubConfig.displayName + '. Msg & data rates may apply. Reply STOP to unsubscribe.',
      opt_out_message: 'You have been unsubscribed from ' + hubConfig.displayName + '. Reply START to resubscribe.',
      help_message: 'For help with ' + hubConfig.displayName + ' SMS, visit ' + hubConfig.domain + '/help or call support.',
      age_gated: false,
      direct_lending: false,
      embedded_link: false,
      embedded_phone: false,
      affiliate_marketing: false,
      monthly_volume: 10000
    },
    mode: 'onChange'
  })

  const onSubmit = async (data: CampaignFormData) => {
    setIsSubmitting(true)
    
    try {
      // Prepare campaign data for TCR registration
      const campaignData = {
        ...data,
        sample_messages: sampleMessages.filter(msg => msg.trim() !== ''),
        hub_id: hubConfig.hubNumber
      }
      
      // Call TCR campaign registration Edge Function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tcr-register-campaign`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            company_id: localStorage.getItem('company_id'), // Get from auth context
            brand_id: localStorage.getItem('brand_id'), // Get from previous step
            campaign_data: campaignData
          })
        }
      )
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Campaign registration failed')
      }
      
      // Store campaign ID for next steps
      if (result.campaignId) {
        localStorage.setItem('tcr_campaign_id', result.campaignId)
        localStorage.setItem('campaign_id', result.campaign?.id)
      }
      
      // Continue to next step
      await onComplete({
        ...campaignData,
        tcr_campaign_id: result.campaignId,
        campaign_id: result.campaign?.id
      })
    } catch (error) {
      console.error('Campaign registration error:', error)
      // In development, continue anyway
      if (import.meta.env.DEV) {
        await onComplete(data)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const addSampleMessage = () => {
    setSampleMessages([...sampleMessages, ''])
  }

  const removeSampleMessage = (index: number) => {
    setSampleMessages(sampleMessages.filter((_, i) => i !== index))
  }

  const updateSampleMessage = (index: number, value: string) => {
    const updated = [...sampleMessages]
    updated[index] = value
    setSampleMessages(updated)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Megaphone className="w-5 h-5 mr-2 hub-text-primary" />
          Campaign Setup
        </CardTitle>
        <CardDescription>
          Configure your SMS campaign for The Campaign Registry
        </CardDescription>
      </CardHeader>
      <CardContent>
        <InfoBox>
          <InfoIcon>
            <Info className="w-5 h-5" />
          </InfoIcon>
          <InfoText>
            Campaign registration is required for A2P 10DLC messaging. Your campaign will be reviewed by carriers
            to ensure compliance with messaging guidelines. Approval typically takes 1-3 business days.
          </InfoText>
        </InfoBox>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="campaign_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Customer Notifications" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the purpose and content of your SMS campaign"
                      className="min-h-20"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="use_case"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Use Case</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select use case" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {USE_CASES.map(useCase => (
                          <SelectItem key={useCase.value} value={useCase.value}>
                            {useCase.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="promotional">Promotional</SelectItem>
                        <SelectItem value="transactional">Transactional</SelectItem>
                        <SelectItem value="conversational">Conversational</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="message_flow"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Flow Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe how customers will opt-in, what triggers messages, and the frequency of messages..."
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="call_to_action"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Call to Action (Min. 40 characters)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe in detail how subscribers will opt-in to receive messages. Example: Customers opt-in by visiting our website and entering their phone number in the SMS updates form..."
                      rows={2}
                      {...field} 
                    />
                  </FormControl>
                  <p className="text-xs text-gray-500 mt-1">
                    TCR requires a detailed description of your opt-in process (minimum 40 characters)
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="subscriber_optin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subscriber Opt-In Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select opt-in method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="WEB_FORM">Web Form</SelectItem>
                        <SelectItem value="VIA_SMS">Via SMS/Keyword</SelectItem>
                        <SelectItem value="MOBILE_QR_CODE">QR Code</SelectItem>
                        <SelectItem value="VERBAL">Verbal/Phone</SelectItem>
                        <SelectItem value="PAPER">Paper Form</SelectItem>
                        <SelectItem value="KEYWORD">SMS Keyword</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="monthly_volume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Monthly Volume</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="10000" 
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel>Sample Messages</FormLabel>
              <p className="text-sm text-gray-500 mb-2">
                Provide 1-5 examples of actual messages you'll send
              </p>
              {sampleMessages.map((message, index) => (
                <SampleMessageContainer key={index}>
                  <SampleMessageHeader>
                    <span className="text-sm font-medium text-gray-700">
                      Sample Message {index + 1}
                    </span>
                    {sampleMessages.length > 1 && (
                      <RemoveButton onClick={() => removeSampleMessage(index)}>
                        <X className="w-4 h-4" />
                      </RemoveButton>
                    )}
                  </SampleMessageHeader>
                  <Textarea
                    value={message}
                    onChange={(e) => updateSampleMessage(index, e.target.value)}
                    placeholder="Enter a sample message..."
                    rows={2}
                  />
                </SampleMessageContainer>
              ))}
              {sampleMessages.length < 5 && (
                <AddButton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSampleMessage}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Sample Message
                </AddButton>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                className="hub-bg-primary hover:hub-bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Register Campaign'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}