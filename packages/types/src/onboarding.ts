import type { Database } from './database'

export type OnboardingStep = Database['public']['Tables']['onboarding_steps']['Row']
export type OnboardingSubmission = Database['public']['Tables']['onboarding_submissions']['Row']

export type OnboardingStepName = 
  | 'verification'
  | 'payment'
  | 'brand'
  | 'privacy_terms'
  | 'campaign'
  | 'bandwidth'
  | 'activation'

export interface OnboardingStepConfig {
  stepNumber: number
  stepName: OnboardingStepName
  title: string
  description: string
  isRequired: boolean
  component: string
}

export const ONBOARDING_STEPS: Record<OnboardingStepName, OnboardingStepConfig> = {
  verification: {
    stepNumber: 0,
    stepName: 'verification',
    title: 'Phone/Email Verification',
    description: 'Verify your phone number and email address',
    isRequired: true,
    component: 'VerificationStep'
  },
  payment: {
    stepNumber: 1,
    stepName: 'payment',
    title: 'Payment Setup',
    description: 'Complete Stripe payment processing',
    isRequired: true,
    component: 'PaymentStep'
  },
  brand: {
    stepNumber: 2,
    stepName: 'brand',
    title: 'Brand Registration',
    description: 'Register your brand with The Campaign Registry',
    isRequired: true,
    component: 'BrandStep'
  },
  privacy_terms: {
    stepNumber: 3,
    stepName: 'privacy_terms',
    title: 'Privacy & Terms',
    description: 'Accept privacy policy and terms of service',
    isRequired: true,
    component: 'PrivacyTermsStep'
  },
  campaign: {
    stepNumber: 4,
    stepName: 'campaign',
    title: 'Campaign Setup',
    description: 'Create your SMS campaign with The Campaign Registry',
    isRequired: true,
    component: 'CampaignStep'
  },
  bandwidth: {
    stepNumber: 5,
    stepName: 'bandwidth',
    title: 'Phone Number Assignment',
    description: 'Get your dedicated Bandwidth phone number',
    isRequired: true,
    component: 'BandwidthStep'
  },
  activation: {
    stepNumber: 6,
    stepName: 'activation',
    title: 'Platform Activation',
    description: 'Activate your SMS platform',
    isRequired: true,
    component: 'ActivationStep'
  }
}

export interface StepComponentProps {
  hubId: number
  companyId: string
  userId: string
  submission: OnboardingSubmission
  onComplete: (stepData: Record<string, any>) => Promise<void>
  onBack?: () => void
}