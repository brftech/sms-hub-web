'use client'

import { useState } from 'react'
import { useHub, HubLogo, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sms-hub/ui'
import { Input, Textarea, Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@sms-hub/ui'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Mail, Calendar, CheckCircle } from 'lucide-react'

interface DemoFormData {
  company_name: string
  contact_name: string
  email: string
  phone: string
  preferred_time: string
  specific_questions: string
}

export default function DemoPage() {
  const { hubConfig, currentHub } = useHub()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<DemoFormData>({
    defaultValues: {
      company_name: '',
      contact_name: '',
      email: '',
      phone: '',
      preferred_time: '',
      specific_questions: ''
    }
  })

  const onSubmit = async (data: DemoFormData) => {
    setIsSubmitting(true)
    
    try {
      // TODO: Implement demo request API endpoint
      console.log('Demo request submission:', data)
      
      toast.success('Demo request submitted! We\'ll contact you within 24 hours.')
      form.reset()
      
    } catch (error) {
      console.error('Demo request error:', error)
      toast.error('Failed to submit demo request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <HubLogo hubType={currentHub} variant="full" size="lg" />
          </div>
          <CardTitle className="hub-text-primary">Schedule a {hubConfig.displayName} Demo</CardTitle>
          <CardDescription>
            See how {hubConfig.displayName} can transform your SMS messaging strategy. Our experts will walk you through a personalized demo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="font-semibold mb-3">What you'll get:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>Live demo of {hubConfig.displayName} features</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>Custom pricing based on your needs</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>Integration guidance for your existing systems</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>Best practices for SMS compliance and delivery</span>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Company" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input type="email" placeholder="john@company.com" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="preferred_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Demo Time</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="e.g., Next Tuesday 2-4pm EST, or call me anytime" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specific_questions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specific Questions or Requirements</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What would you like to learn about? Any specific features, integrations, or compliance requirements?"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full hub-bg-primary hover:hub-bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Scheduling...' : 'Schedule Demo'}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <a 
              href="https://app.percytext.com/login" 
              className="hub-text-primary hover:underline"
              target="_blank" 
              rel="noopener noreferrer"
            >
              Sign in to your account
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}