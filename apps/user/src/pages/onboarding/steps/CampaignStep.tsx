import { useState } from 'react'
import { useHub, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sms-hub/ui'
import { Input, Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@sms-hub/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@sms-hub/ui'
import { Textarea } from '@sms-hub/ui'
import { StepComponentProps } from '@sms-hub/types'
import { useForm } from 'react-hook-form'
import { Megaphone, ChevronRight } from 'lucide-react'

interface CampaignFormData {
  campaign_name: string
  description: string
  message_category: string
  use_case: string
  message_samples: string[]
}

export function CampaignStep({ onComplete }: StepComponentProps) {
  const { } = useHub()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CampaignFormData>({
    defaultValues: {
      campaign_name: '',
      description: '',
      message_category: '',
      use_case: '',
      message_samples: ['']
    }
  })

  const onSubmit = async (data: CampaignFormData) => {
    setIsSubmitting(true)
    
    try {
      // TODO: Submit campaign registration to TCR
      await onComplete(data)
    } catch (error) {
      console.error('Campaign registration error:', error)
    } finally {
      setIsSubmitting(false)
    }
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
                name="message_category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="transactional">Transactional</SelectItem>
                        <SelectItem value="promotional">Promotional</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        <SelectItem value="customer_notifications">Customer Notifications</SelectItem>
                        <SelectItem value="appointment_reminders">Appointment Reminders</SelectItem>
                        <SelectItem value="order_updates">Order Updates</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="two_factor_auth">Two-Factor Authentication</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                className="hub-bg-primary hover:hub-bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Continue to Phone Number Setup'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}