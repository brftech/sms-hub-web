import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHub, Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Label, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@sms-hub/ui'
import { Progress, Badge, Checkbox } from '@sms-hub/ui'
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'
import { useUserProfile, useOnboardingSubmission, useCreateOnboardingSubmission, useUpdateOnboardingSubmission } from '@sms-hub/supabase'
import { ONBOARDING_STEPS, type OnboardingStepName } from '@sms-hub/types'

export function Onboarding() {
  const { hubConfig } = useHub()
  const navigate = useNavigate()
  const { data: userProfile } = useUserProfile()
  const { data: onboardingSubmission } = useOnboardingSubmission(
    userProfile?.company_id || '',
    hubConfig.hubNumber
  )
  const createOnboarding = useCreateOnboardingSubmission()
  const updateOnboarding = useUpdateOnboardingSubmission()

  const [currentStep, setCurrentStep] = useState<OnboardingStepName>(
    (onboardingSubmission?.current_step as OnboardingStepName) || 'verification'
  )
  const [formData, setFormData] = useState((onboardingSubmission?.step_data as Record<string, any>) || {})
  const [isLoading, setIsLoading] = useState(false)

  const steps = Object.values(ONBOARDING_STEPS)
  const currentStepIndex = steps.findIndex(step => step.stepName === currentStep)
  const currentStepConfig = steps[currentStepIndex]

  const handleNext = async () => {
    setIsLoading(true)
    try {
      const nextStepIndex = currentStepIndex + 1
      const nextStep = nextStepIndex < steps.length ? steps[nextStepIndex].stepName : 'completed'

      if (onboardingSubmission) {
        await updateOnboarding.mutateAsync({
          id: onboardingSubmission.id,
          current_step: nextStep,
          step_data: formData
        })
      } else {
        await createOnboarding.mutateAsync({
          company_id: userProfile?.company_id || '',
          hub_id: hubConfig.hubNumber,
          user_id: userProfile?.id || '',
          current_step: nextStep,
          step_data: formData
        })
      }

      if (nextStep === 'completed') {
        navigate('/')
      } else {
        setCurrentStep(nextStep)
      }
    } catch (error) {
      console.error('Failed to update onboarding:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].stepName)
    }
  }

  const updateFormData = (key: string, value: any) => {
    setFormData((prev: Record<string, any>) => ({ ...prev, [key]: value }))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'verification':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 hub-text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Email Verified</h3>
              <p className="text-muted-foreground">
                Your email has been verified. Let's continue with your setup.
              </p>
            </div>
          </div>
        )

      case 'payment':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="billing-name">Billing Name</Label>
              <Input
                id="billing-name"
                value={formData.billingName || ''}
                onChange={(e) => updateFormData('billingName', e.target.value)}
                placeholder="Enter billing name"
              />
            </div>
            <div>
              <Label htmlFor="billing-address">Billing Address</Label>
              <Textarea
                id="billing-address"
                value={formData.billingAddress || ''}
                onChange={(e) => updateFormData('billingAddress', e.target.value)}
                placeholder="Enter billing address"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="billing-city">City</Label>
                <Input
                  id="billing-city"
                  value={formData.billingCity || ''}
                  onChange={(e) => updateFormData('billingCity', e.target.value)}
                  placeholder="City"
                />
              </div>
              <div>
                <Label htmlFor="billing-zip">ZIP Code</Label>
                <Input
                  id="billing-zip"
                  value={formData.billingZip || ''}
                  onChange={(e) => updateFormData('billingZip', e.target.value)}
                  placeholder="ZIP"
                />
              </div>
            </div>
          </div>
        )

      case 'brand':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="business-name">Business Name</Label>
              <Input
                id="business-name"
                value={formData.businessName || ''}
                onChange={(e) => updateFormData('businessName', e.target.value)}
                placeholder="Your business name"
              />
            </div>
            <div>
              <Label htmlFor="business-type">Business Type</Label>
              <Select
                value={formData.businessType || ''}
                onValueChange={(value) => updateFormData('businessType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="financial">Financial Services</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="business-description">Business Description</Label>
              <Textarea
                id="business-description"
                value={formData.businessDescription || ''}
                onChange={(e) => updateFormData('businessDescription', e.target.value)}
                placeholder="Describe your business and how you plan to use SMS"
                rows={4}
              />
            </div>
          </div>
        )

      case 'privacy_terms':
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={formData.acceptedTerms || false}
                  onCheckedChange={(checked) => updateFormData('acceptedTerms', checked)}
                />
                <Label htmlFor="terms" className="text-sm leading-relaxed">
                  I agree to the{' '}
                  <a href="#" className="hub-text-primary hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="hub-text-primary hover:underline">
                    Privacy Policy
                  </a>
                </Label>
              </div>
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="tcpa"
                  checked={formData.acceptedTCPA || false}
                  onCheckedChange={(checked) => updateFormData('acceptedTCPA', checked)}
                />
                <Label htmlFor="tcpa" className="text-sm leading-relaxed">
                  I understand and agree to TCPA compliance requirements for SMS marketing
                </Label>
              </div>
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="marketing"
                  checked={formData.acceptedMarketing || false}
                  onCheckedChange={(checked) => updateFormData('acceptedMarketing', checked)}
                />
                <Label htmlFor="marketing" className="text-sm leading-relaxed">
                  I agree to receive marketing communications (optional)
                </Label>
              </div>
            </div>
          </div>
        )

      case 'campaign':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="campaign-name">Campaign Name</Label>
              <Input
                id="campaign-name"
                value={formData.campaignName || ''}
                onChange={(e) => updateFormData('campaignName', e.target.value)}
                placeholder="My First Campaign"
              />
            </div>
            <div>
              <Label htmlFor="campaign-type">Campaign Type</Label>
              <Select
                value={formData.campaignType || ''}
                onValueChange={(value) => updateFormData('campaignType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select campaign type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="promotional">Promotional</SelectItem>
                  <SelectItem value="transactional">Transactional</SelectItem>
                  <SelectItem value="notification">Notification</SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="use-case">Primary Use Case</Label>
              <Textarea
                id="use-case"
                value={formData.useCase || ''}
                onChange={(e) => updateFormData('useCase', e.target.value)}
                placeholder="Describe how you plan to use SMS campaigns"
                rows={3}
              />
            </div>
          </div>
        )

      case 'bandwidth':
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Phone Number Setup</h3>
              <p className="text-muted-foreground">
                We'll help you acquire a phone number for sending SMS
              </p>
            </div>
            <div>
              <Label htmlFor="area-code">Preferred Area Code</Label>
              <Input
                id="area-code"
                value={formData.areaCode || ''}
                onChange={(e) => updateFormData('areaCode', e.target.value)}
                placeholder="e.g., 555"
                maxLength={3}
              />
            </div>
            <div>
              <Label htmlFor="phone-type">Phone Number Type</Label>
              <Select
                value={formData.phoneType || ''}
                onValueChange={(value) => updateFormData('phoneType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select phone number type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">Local Number</SelectItem>
                  <SelectItem value="toll-free">Toll-Free Number</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
              <p className="text-sm text-blue-800">
                We'll provision your phone number and register it with carriers for optimal delivery rates.
              </p>
            </div>
          </div>
        )

      case 'activation':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Setup Complete!</h3>
              <p className="text-muted-foreground">
                Your {hubConfig.displayName} account is ready to use
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 p-4 rounded-md space-y-2">
              <h4 className="font-medium text-green-800">What's next?</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Import your contacts</li>
                <li>• Create your first SMS campaign</li>
                <li>• Monitor delivery and engagement</li>
              </ul>
            </div>
          </div>
        )

      default:
        return <div>Unknown step</div>
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 'privacy_terms':
        return formData.acceptedTerms && formData.acceptedTCPA
      case 'payment':
        return formData.billingName && formData.billingAddress
      case 'brand':
        return formData.businessName && formData.businessType
      case 'campaign':
        return formData.campaignName && formData.campaignType
      case 'bandwidth':
        return formData.phoneType
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold hub-text-primary">
            Welcome to {hubConfig.displayName}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Let's get your SMS platform set up in just a few steps
          </p>
        </div>

        <div className="mb-8">
          <Progress value={((currentStepIndex + 1) / steps.length) * 100} className="w-full" />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Step {currentStepIndex + 1} of {steps.length}</span>
            <span>{Math.round(((currentStepIndex + 1) / steps.length) * 100)}% complete</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="secondary">
                Step {currentStepIndex + 1} of {steps.length}
              </Badge>
            </div>
            <CardTitle className="text-xl">{currentStepConfig.title}</CardTitle>
            <CardDescription>{currentStepConfig.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {renderStepContent()}

              <div className="flex justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStepIndex === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                <Button
                  onClick={currentStep === 'activation' ? () => navigate('/') : handleNext}
                  disabled={!canProceed() || isLoading}
                  className="hub-bg-primary"
                >
                  {isLoading ? 'Processing...' : (
                    currentStep === 'activation' ? 'Go to Dashboard' : (
                      <>
                        {currentStepIndex === steps.length - 1 ? 'Complete Setup' : 'Next'}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}