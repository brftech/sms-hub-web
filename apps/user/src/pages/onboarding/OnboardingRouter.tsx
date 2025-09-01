import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useHub } from '@sms-hub/ui'
import { useCurrentUserCompany, useBrands, useCurrentUserCampaigns } from '@sms-hub/supabase/react'
import { BrandStep } from './steps/BrandStep'
import { PrivacyStep } from './steps/PrivacyStep'
import { CampaignStep } from './steps/CampaignStep'
import { PhoneStep } from './steps/PhoneStep'
import { PlatformAccessStep } from './steps/PlatformAccessStep'
import styled from 'styled-components'

const OnboardingContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`

const StepIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 0;
    right: 0;
    height: 2px;
    background: #e5e7eb;
    z-index: 0;
  }
`

const StepDot = styled.div<{ $active: boolean; $completed: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => 
    props.$completed ? '#10b981' : 
    props.$active ? '#667eea' : 
    '#ffffff'};
  border: 2px solid ${props => 
    props.$completed ? '#10b981' : 
    props.$active ? '#667eea' : 
    '#e5e7eb'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: ${props => 
    props.$completed || props.$active ? '#ffffff' : '#6b7280'};
  position: relative;
  z-index: 1;
`

const StepLabel = styled.div`
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  color: #6b7280;
  white-space: nowrap;
`

type OnboardingStep = 'brand' | 'privacy' | 'campaign' | 'phone' | 'platform'

const STEP_ORDER: OnboardingStep[] = ['brand', 'privacy', 'campaign', 'phone', 'platform']
const STEP_LABELS = {
  brand: 'Brand',
  privacy: 'Privacy',
  campaign: 'Campaign',
  phone: 'Phone',
  platform: 'Access'
}

export function OnboardingRouter() {
  const { step } = useParams<{ step: OnboardingStep }>()
  const navigate = useNavigate()
  const { hubConfig } = useHub()
  const { data: company } = useCurrentUserCompany()
  const { data: brands } = useBrands(company?.id || '')
  const { data: campaigns } = useCurrentUserCampaigns()
  
  const [completedSteps, setCompletedSteps] = useState<Set<OnboardingStep>>(new Set())
  
  const currentStep = step || 'brand'
  const currentStepIndex = STEP_ORDER.indexOf(currentStep)
  
  useEffect(() => {
    // Check which steps are already completed based on data
    const completed = new Set<OnboardingStep>()
    
    if (brands?.some(b => b.status === 'approved')) {
      completed.add('brand')
    }
    if (company?.privacy_policy_accepted_at) {
      completed.add('privacy')
    }
    if (campaigns?.some(c => c.status === 'approved')) {
      completed.add('campaign')
    }
    if (company?.phone_number_provisioned) {
      completed.add('phone')
    }
    if (company?.platform_access_granted) {
      completed.add('platform')
    }
    
    setCompletedSteps(completed)
  }, [company, brands, campaigns])
  
  const handleStepComplete = async (data: any) => {
    // Mark current step as completed
    setCompletedSteps(prev => new Set([...prev, currentStep]))
    
    // Navigate to next step
    const nextIndex = currentStepIndex + 1
    if (nextIndex < STEP_ORDER.length) {
      navigate(`/onboarding/${STEP_ORDER[nextIndex]}`)
    } else {
      // All steps completed, go to dashboard
      navigate('/dashboard')
    }
  }
  
  const renderStep = () => {
    const stepProps = {
      hubId: userProfile?.hub_id || 1,
      companyId: company?.id || '',
      userId: userProfile?.id || '',
      submission: onboardingSubmission || {} as any,
      onComplete: handleStepComplete
    }
    
    switch (currentStep) {
      case 'brand':
        return <BrandStep {...stepProps} />
      case 'privacy':
        return <PrivacyStep {...stepProps} />
      case 'campaign':
        return <CampaignStep {...stepProps} />
      case 'phone':
        return <PhoneStep {...stepProps} />
      case 'platform':
        return <PlatformAccessStep {...stepProps} />
      default:
        return <BrandStep {...stepProps} />
    }
  }
  
  return (
    <OnboardingContainer>
      <StepIndicator>
        {STEP_ORDER.map((step, index) => (
          <div key={step} style={{ position: 'relative' }}>
            <StepDot 
              $active={currentStepIndex === index}
              $completed={completedSteps.has(step)}
            >
              {completedSteps.has(step) ? '✓' : index + 1}
            </StepDot>
            <StepLabel>{STEP_LABELS[step]}</StepLabel>
          </div>
        ))}
      </StepIndicator>
      
      {renderStep()}
    </OnboardingContainer>
  )
}