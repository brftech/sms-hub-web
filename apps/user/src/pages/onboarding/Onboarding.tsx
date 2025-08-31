import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHub, HubLogo, Button, Card, CardDescription, CardHeader, CardTitle } from '@sms-hub/ui'
import { Progress } from '@sms-hub/ui'
import { useAuth, useOnboardingSubmission, useCreateOnboardingSubmission, useUpdateOnboardingSubmission, useCreateCompany } from '@sms-hub/supabase'
import { ONBOARDING_STEPS, OnboardingStepName } from '@sms-hub/types'
import { toast } from 'sonner'
import { ChevronLeft } from 'lucide-react'

// Import step components (to be created)
import { PaymentStep } from './steps/PaymentStep'
import { BrandStep } from './steps/BrandStep'
import { PrivacyTermsStep } from './steps/PrivacyTermsStep'
import { CampaignStep } from './steps/CampaignStep'
import { BandwidthStep } from './steps/BandwidthStep'
import { ActivationStep } from './steps/ActivationStep'

export function Onboarding() {
  const { hubConfig, currentHub } = useHub()
  const navigate = useNavigate()
  const { data: user, isLoading: userLoading } = useAuth()
  const [currentStep, setCurrentStep] = useState<OnboardingStepName>('payment')
  const [companyId, setCompanyId] = useState<string>('')
  
  const createCompany = useCreateCompany()
  const createSubmission = useCreateOnboardingSubmission()
  const updateSubmission = useUpdateOnboardingSubmission()
  
  const { data: submission, isLoading: submissionLoading } = useOnboardingSubmission(
    companyId, 
    hubConfig.hubNumber
  )

  // Redirect if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      navigate('/signup')
    }
  }, [user, userLoading, navigate])

  // Initialize company and submission
  useEffect(() => {
    if (user && !companyId) {
      initializeOnboarding()
    }
  }, [user, companyId])

  // Set current step from submission
  useEffect(() => {
    if (submission) {
      setCurrentStep(submission.current_step as OnboardingStepName)
    }
  }, [submission])

  const initializeOnboarding = async () => {
    if (!user) return

    try {
      // Create company
      const company = await createCompany.mutateAsync({
        hub_id: hubConfig.hubNumber,
        public_name: user.first_name ? `${user.first_name}'s Company` : 'New Company',
        billing_email: user.email || '',
        created_by_profile_id: user.id
      })

      setCompanyId(company.id)

      // Create onboarding submission
      await createSubmission.mutateAsync({
        company_id: company.id,
        hub_id: hubConfig.hubNumber,
        user_id: user.id,
        current_step: 'payment',
        step_data: {}
      })

    } catch (error) {
      console.error('Onboarding initialization error:', error)
      toast.error('Failed to initialize onboarding')
    }
  }

  const handleStepComplete = async (stepData: Record<string, any>) => {
    if (!submission) return

    try {
      const stepNames = Object.keys(ONBOARDING_STEPS) as OnboardingStepName[]
      const currentStepIndex = stepNames.indexOf(currentStep)
      const nextStep = stepNames[currentStepIndex + 1]

      await updateSubmission.mutateAsync({
        id: submission.id,
        current_step: nextStep || 'activation',
        step_data: {
          ...(submission.step_data as Record<string, any> || {}),
          [currentStep]: stepData
        }
      })

      if (nextStep) {
        setCurrentStep(nextStep)
      } else {
        // Onboarding complete
        toast.success('Onboarding complete! Welcome to the platform.')
        navigate('/dashboard')
      }

    } catch (error) {
      console.error('Step completion error:', error)
      toast.error('Failed to save progress')
    }
  }

  const handleStepBack = () => {
    const stepNames = Object.keys(ONBOARDING_STEPS) as OnboardingStepName[]
    const currentStepIndex = stepNames.indexOf(currentStep)
    const prevStep = stepNames[currentStepIndex - 1]
    
    if (prevStep) {
      setCurrentStep(prevStep)
    }
  }

  if (userLoading || submissionLoading || !user || !submission) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <HubLogo hubType={currentHub} variant="full" size="lg" />
          <p className="mt-4 text-muted-foreground">Loading onboarding...</p>
        </div>
      </div>
    )
  }

  const stepConfig = ONBOARDING_STEPS[currentStep]
  const stepNames = Object.keys(ONBOARDING_STEPS) as OnboardingStepName[]
  const currentStepIndex = stepNames.indexOf(currentStep)
  const progress = ((currentStepIndex + 1) / stepNames.length) * 100

  const renderStepComponent = () => {
    const stepProps = {
      hubId: hubConfig.hubNumber,
      companyId,
      userId: user.id,
      submission,
      onComplete: handleStepComplete,
      onBack: currentStepIndex > 0 ? handleStepBack : undefined
    }

    switch (currentStep) {
      case 'payment':
        return <PaymentStep {...stepProps} />
      case 'brand':
        return <BrandStep {...stepProps} />
      case 'privacy_terms':
        return <PrivacyTermsStep {...stepProps} />
      case 'campaign':
        return <CampaignStep {...stepProps} />
      case 'bandwidth':
        return <BandwidthStep {...stepProps} />
      case 'activation':
        return <ActivationStep {...stepProps} />
      default:
        return <div>Step not found</div>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <HubLogo hubType={currentHub} variant="full" size="lg" />
          <h1 className="mt-4 text-3xl font-bold hub-text-primary">
            {hubConfig.displayName} Setup
          </h1>
          <p className="text-muted-foreground">
            Complete these steps to activate your SMS platform
          </p>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{stepConfig.title}</CardTitle>
                <CardDescription>{stepConfig.description}</CardDescription>
              </div>
              <div className="text-sm text-muted-foreground">
                Step {currentStepIndex + 1} of {stepNames.length}
              </div>
            </div>
            <Progress value={progress} className="mt-4" />
          </CardHeader>
        </Card>

        {/* Step Content */}
        <div className="mb-8">
          {renderStepComponent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          {currentStepIndex > 0 ? (
            <Button variant="outline" onClick={handleStepBack}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          ) : (
            <div />
          )}
          
          <div className="text-sm text-muted-foreground">
            Need help? Contact support
          </div>
        </div>
      </div>
    </div>
  )
}