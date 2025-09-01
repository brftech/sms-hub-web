import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { CheckCircle2, Circle, ArrowRight, CreditCard, Building, Shield, Megaphone, Phone, Rocket } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@sms-hub/ui'

const TrackerContainer = styled.div`
  width: 100%;
`

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const StepCard = styled.div<{ $completed: boolean; $current: boolean; $clickable: boolean }>`
  background: ${props => props.$current ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : props.$completed ? '#f0fdf4' : '#ffffff'};
  border: 2px solid ${props => props.$current ? '#667eea' : props.$completed ? '#22c55e' : '#e5e7eb'};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    transform: ${props => props.$clickable ? 'translateY(-2px)' : 'none'};
    box-shadow: ${props => props.$clickable ? '0 10px 20px rgba(0,0,0,0.1)' : 'none'};
  }
`

const StepIcon = styled.div<{ $completed: boolean; $current: boolean }>`
  width: 48px;
  height: 48px;
  margin: 0 auto 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$current ? '#ffffff' : props.$completed ? '#22c55e' : '#9ca3af'};
  
  svg {
    width: 28px;
    height: 28px;
  }
`

const StepNumber = styled.div<{ $completed: boolean; $current: boolean }>`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.$current ? '#ffffff' : props.$completed ? '#22c55e' : '#e5e7eb'};
  color: ${props => props.$current ? '#667eea' : props.$completed ? '#ffffff' : '#6b7280'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
`

const StepTitle = styled.h4<{ $completed: boolean; $current: boolean }>`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.$current ? '#ffffff' : props.$completed ? '#059669' : '#374151'};
  margin-bottom: 0.25rem;
`

const StepStatus = styled.p<{ $completed: boolean; $current: boolean }>`
  font-size: 0.75rem;
  color: ${props => props.$current ? '#e0e7ff' : props.$completed ? '#22c55e' : '#9ca3af'};
  font-weight: 500;
`

const CurrentStepDetail = styled(Card)`
  margin-top: 2rem;
  border: 2px solid #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
`

const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`

const DetailTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const DetailDescription = styled.p`
  color: #6b7280;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`

const ActionButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    background: #e5e7eb;
    color: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }
`

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  margin-bottom: 2rem;
  overflow: hidden;
`

const ProgressFill = styled.div<{ $progress: number }>`
  width: ${props => props.$progress}%;
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  transition: width 0.5s ease;
`

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  completed: boolean
  route: string
}

interface OnboardingTrackerProps {
  userProfile?: any
  company?: any
  campaigns?: any[]
  brands?: any[]
}

export function OnboardingTracker({ userProfile, company, campaigns = [], brands = [] }: OnboardingTrackerProps) {
  const navigate = useNavigate()
  
  // Determine step completion status
  const steps: OnboardingStep[] = [
    {
      id: 'payment',
      title: 'Payment',
      description: 'Set up your subscription and billing information to activate your account.',
      icon: <CreditCard />,
      completed: !!company?.stripe_subscription_id,
      route: '/payment'
    },
    {
      id: 'brand',
      title: 'Brand',
      description: 'Register your brand with The Campaign Registry for compliance.',
      icon: <Building />,
      completed: brands.length > 0 && brands.some(b => b.status === 'approved'),
      route: '/onboarding/brand'
    },
    {
      id: 'privacy',
      title: 'Privacy',
      description: 'Review and accept privacy policies and terms of service.',
      icon: <Shield />,
      completed: !!company?.privacy_policy_accepted_at,
      route: '/onboarding/privacy'
    },
    {
      id: 'campaign',
      title: 'Campaign',
      description: 'Create your first SMS campaign and get it approved.',
      icon: <Megaphone />,
      completed: campaigns.length > 0 && campaigns.some(c => c.status === 'approved'),
      route: '/onboarding/campaign'
    },
    {
      id: 'phone',
      title: 'Phone',
      description: 'Provision your dedicated phone number for SMS messaging.',
      icon: <Phone />,
      completed: !!company?.phone_number_provisioned,
      route: '/onboarding/phone'
    },
    {
      id: 'platform',
      title: 'Platform',
      description: 'Complete setup and get access to the full platform.',
      icon: <Rocket />,
      completed: !!company?.platform_access_granted,
      route: '/onboarding/platform'
    }
  ]
  
  const completedSteps = steps.filter(s => s.completed).length
  const currentStepIndex = steps.findIndex(s => !s.completed)
  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null
  const progressPercentage = (completedSteps / steps.length) * 100
  
  const handleStepClick = (step: OnboardingStep) => {
    // Only allow clicking on completed steps or the current step
    const stepIndex = steps.findIndex(s => s.id === step.id)
    if (step.completed || stepIndex <= currentStepIndex) {
      navigate(step.route)
    }
  }
  
  return (
    <TrackerContainer>
      <ProgressBar>
        <ProgressFill $progress={progressPercentage} />
      </ProgressBar>
      
      <StepsGrid>
        {steps.map((step, index) => {
          const isCurrent = currentStep?.id === step.id
          const isClickable = step.completed || index <= currentStepIndex
          
          return (
            <StepCard
              key={step.id}
              $completed={step.completed}
              $current={isCurrent}
              $clickable={isClickable}
              onClick={() => handleStepClick(step)}
            >
              <StepNumber $completed={step.completed} $current={isCurrent}>
                {step.completed ? '✓' : index + 1}
              </StepNumber>
              <StepIcon $completed={step.completed} $current={isCurrent}>
                {step.icon}
              </StepIcon>
              <StepTitle $completed={step.completed} $current={isCurrent}>
                {step.title}
              </StepTitle>
              <StepStatus $completed={step.completed} $current={isCurrent}>
                {step.completed ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
              </StepStatus>
            </StepCard>
          )
        })}
      </StepsGrid>
      
      {currentStep && (
        <CurrentStepDetail>
          <CardHeader>
            <DetailHeader>
              <DetailTitle>
                {currentStep.icon}
                Next: {currentStep.title}
              </DetailTitle>
              <span style={{ color: '#667eea', fontWeight: 600 }}>
                Step {currentStepIndex + 1} of {steps.length}
              </span>
            </DetailHeader>
          </CardHeader>
          <CardContent>
            <DetailDescription>{currentStep.description}</DetailDescription>
            <ActionButton onClick={() => navigate(currentStep.route)}>
              Continue Setup
              <ArrowRight />
            </ActionButton>
          </CardContent>
        </CurrentStepDetail>
      )}
      
      {completedSteps === steps.length && (
        <CurrentStepDetail>
          <CardHeader>
            <DetailTitle>
              <CheckCircle2 style={{ color: '#22c55e' }} />
              Onboarding Complete!
            </DetailTitle>
          </CardHeader>
          <CardContent>
            <DetailDescription>
              Congratulations! You've completed all onboarding steps and have full access to the platform.
            </DetailDescription>
            <ActionButton onClick={() => navigate('/campaigns')}>
              Go to Campaigns
              <ArrowRight />
            </ActionButton>
          </CardContent>
        </CurrentStepDetail>
      )}
    </TrackerContainer>
  )
}