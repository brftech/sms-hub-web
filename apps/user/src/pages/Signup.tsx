import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHub, HubLogo, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sms-hub/ui'
import { Input, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, RadioGroup, RadioGroupItem } from '@sms-hub/ui'
import { useCreateTempSignup } from '@sms-hub/supabase'
import { SignupData } from '@sms-hub/types'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Phone, Mail } from 'lucide-react'

export function Signup() {
  const { hubConfig, currentHub } = useHub()
  const createTempSignup = useCreateTempSignup()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<SignupData>({
    defaultValues: {
      hub_id: hubConfig.hubNumber,
      company_name: '',
      first_name: '',
      last_name: '',
      mobile_phone_number: '',
      email: '',
      auth_method: 'sms'
    }
  })

  const onSubmit = async (data: SignupData) => {
    setIsSubmitting(true)
    
    try {
      const result = await createTempSignup.mutateAsync({
        ...data,
        hub_id: hubConfig.hubNumber
      })

      toast.success('Verification code sent! Check your phone.')
      
      // Navigate to verification page
      navigate(`/verify?id=${result.id}`)
      
    } catch (error: any) {
      console.error('Signup error:', error)
      toast.error('Failed to create account. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <HubLogo hubType={currentHub} variant="full" size="lg" />
          </div>
          <CardTitle className="hub-text-primary">Create Your Account</CardTitle>
          <CardDescription>
            Start your SMS journey with {hubConfig.displayName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Company" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mobile_phone_number"
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

              <FormField
                control={form.control}
                name="auth_method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Method</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                          <RadioGroupItem value="sms" id="sms" />
                          <label htmlFor="sms" className="flex items-center space-x-2 cursor-pointer flex-1">
                            <Phone className="h-4 w-4" />
                            <span>Send code via SMS</span>
                          </label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                          <RadioGroupItem value="email" id="email" />
                          <label htmlFor="email" className="flex items-center space-x-2 cursor-pointer flex-1">
                            <Mail className="h-4 w-4" />
                            <span>Send code via Email</span>
                          </label>
                        </div>
                      </RadioGroup>
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
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/login')}
              className="hub-text-primary hover:underline"
            >
              Sign in
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}