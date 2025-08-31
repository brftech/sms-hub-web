import { useState } from 'react'
import { useHub, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sms-hub/ui'
import { Input, Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@sms-hub/ui'
import { StepComponentProps } from '@sms-hub/types'
import { useForm } from 'react-hook-form'
import { CreditCard, Shield, CheckCircle, ChevronRight } from 'lucide-react'

interface PaymentFormData {
  payment_method: 'stripe'
  billing_name: string
  billing_email: string
  billing_address: string
  billing_city: string
  billing_state: string
  billing_zip: string
  plan_tier: 'starter' | 'professional' | 'enterprise'
}

export function PaymentStep({ submission, onComplete }: StepComponentProps) {
  const { } = useHub()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PaymentFormData>({
    defaultValues: {
      payment_method: 'stripe',
      billing_name: '',
      billing_email: '',
      billing_address: '',
      billing_city: '',
      billing_state: '',
      billing_zip: '',
      plan_tier: 'starter',
      ...((submission.step_data as any)?.payment || {})
    },
    mode: 'onChange'
  })

  const onSubmit = async (data: PaymentFormData) => {
    setIsSubmitting(true)
    
    try {
      // TODO: Integrate with Stripe payment processing
      // For now, we'll just save the form data
      await onComplete(data)
    } catch (error) {
      console.error('Payment step error:', error)
      // Show user-friendly error instead of just logging
    } finally {
      setIsSubmitting(false)
    }
  }

  const pricingPlans = {
    starter: {
      name: 'Starter',
      price: '$49/month',
      features: ['1,000 messages/month', 'Basic support', 'Standard compliance']
    },
    professional: {
      name: 'Professional', 
      price: '$149/month',
      features: ['10,000 messages/month', 'Priority support', 'Advanced analytics', 'Custom branding']
    },
    enterprise: {
      name: 'Enterprise',
      price: 'Custom pricing',
      features: ['Unlimited messages', 'Dedicated support', 'Custom integrations', 'SLA guarantees']
    }
  }

  return (
    <div className="space-y-6">
      {/* Plan Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2 hub-text-primary" />
            Choose Your Plan
          </CardTitle>
          <CardDescription>
            Select the plan that best fits your messaging needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(pricingPlans).map(([key, plan]) => (
              <div
                key={key}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  form.watch('plan_tier') === key 
                    ? 'border-hub-primary bg-hub-primary/5' 
                    : 'border-border hover:border-hub-primary/50'
                }`}
                onClick={() => form.setValue('plan_tier', key as any)}
              >
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{plan.name}</h3>
                  <div className="text-2xl font-bold hub-text-primary mt-2">{plan.price}</div>
                  <ul className="mt-4 space-y-2 text-sm">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Billing Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2 hub-text-primary" />
            Billing Information
          </CardTitle>
          <CardDescription>
            Enter your billing details for payment processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="billing_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="billing_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="billing@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="billing_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="billing_city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="New York" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="billing_state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="NY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="billing_zip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP Code</FormLabel>
                    <FormControl>
                      <Input placeholder="10001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  className="hub-bg-primary hover:hub-bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Continue to Brand Registration'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}