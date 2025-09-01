import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { CheckCircle2, ArrowRight, CreditCard, Building, Shield, Megaphone, Phone, Rocket, User, Briefcase, Settings, UserCheck, Zap, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@sms-hub/ui'
import { useCustomerByCompany } from '@sms-hub/supabase'

const TrackerContainer = styled.div`
  width: 100%;
`

const PhasesContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    flex-wrap: nowrap;
    -webkit-overflow-scrolling: touch;
  }
`

const PhaseCard = styled.div<{ $active: boolean; $completed: boolean }>`
  flex: 1;
  min-width: 200px;
  background: ${props => props.$active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : props.$completed ? '#f0fdf4' : '#ffffff'};
  border: 2px solid ${props => props.$active ? '#667eea' : props.$completed ? '#22c55e' : '#e5e7eb'};
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }
`

const PhaseHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`

const PhaseIcon = styled.div<{ $active: boolean; $completed: boolean }>`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: ${props => props.$active ? 'rgba(255,255,255,0.2)' : props.$completed ? '#dcfce7' : '#f3f4f6'};
  color: ${props => props.$active ? '#ffffff' : props.$completed ? '#22c55e' : '#6b7280'};
  
  svg {
    width: 24px;
    height: 24px;
  }
`

const PhaseTitle = styled.h3<{ $active: boolean; $completed: boolean }>`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.$active ? '#ffffff' : props.$completed ? '#059669' : '#1f2937'};
  margin-bottom: 0.25rem;
`

const PhaseSubtitle = styled.p<{ $active: boolean; $completed: boolean }>`
  font-size: 0.75rem;
  color: ${props => props.$active ? '#e0e7ff' : props.$completed ? '#22c55e' : '#6b7280'};
  margin-bottom: 0.75rem;
`

const PhaseSteps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const PhaseStep = styled.div<{ $completed: boolean; $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: ${props => props.$active ? '#ffffff' : props.$completed ? '#059669' : '#6b7280'};
  
  svg {
    width: 14px;
    height: 14px;
    color: ${props => props.$completed ? '#22c55e' : props.$active ? '#e0e7ff' : '#9ca3af'};
  }
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

interface OnboardingPhase {
  id: string
  title: string
  subtitle: string
  icon: React.ReactNode
  steps: OnboardingStep[]
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
  const { data: customer } = useCustomerByCompany(company?.id || null)
  
  // Check if profile is complete (has name and company)
  const isProfileComplete = !!(
    userProfile?.first_name &&
    userProfile?.last_name &&
    userProfile?.company_id
  )
  
  // Check if business info is complete (TCR required fields)
  const isBusinessInfoComplete = !!(
    company?.legal_name &&
    company?.legal_form &&
    company?.vertical_type &&
    company?.ein &&
    company?.address &&
    company?.city &&
    company?.state_region &&
    company?.postal_code
  )
  
  // Determine step completion status - all 10 steps
  const steps: OnboardingStep[] = [
    {
      id: 'auth',
      title: 'Auth',
      description: 'Create your account with email and phone verification.',
      icon: <UserCheck />,
      completed: !!userProfile?.id,
      route: '/login'
    },
    {
      id: 'payment',
      title: 'Payment',
      description: customer?.stripe_customer_id && !customer?.stripe_subscription_id 
        ? 'Complete your subscription payment to activate your account. Click here to try again.'
        : 'Set up your subscription and billing information.',
      icon: <CreditCard />,
      completed: !!customer?.stripe_subscription_id && customer?.subscription_status === 'active',
      route: '/onboarding'
    },
    {
      id: 'personal',
      title: 'Personal',
      description: 'Complete your personal information and create your company.',
      icon: <User />,
      completed: isProfileComplete,
      route: '/dashboard'
    },
    {
      id: 'business',
      title: 'Business',
      description: 'Provide business details required for TCR compliance.',
      icon: <Briefcase />,
      completed: isBusinessInfoComplete,
      route: '/onboarding/business'
    },
    {
      id: 'brand',
      title: 'Brand',
      description: 'Register your brand with The Campaign Registry.',
      icon: <Building />,
      completed: brands.length > 0 && brands.some(b => b.status === 'approved'),
      route: '/onboarding/brand'
    },
    {
      id: 'privacy',
      title: 'Privacy',
      description: 'Accept privacy policies and terms of service.',
      icon: <Shield />,
      completed: !!company?.privacy_policy_accepted_at,
      route: '/onboarding/privacy'
    },
    {
      id: 'campaign',
      title: 'Campaign',
      description: 'Create and submit your first SMS campaign.',
      icon: <Megaphone />,
      completed: campaigns.length > 0 && campaigns.some(c => c.status === 'approved'),
      route: '/onboarding/campaign'
    },
    {
      id: 'gphone',
      title: 'gPhone',
      description: 'Select and provision your dedicated phone number.',
      icon: <Phone />,
      completed: !!company?.phone_number_provisioned,
      route: '/onboarding/phone'
    },
    {
      id: 'setup',
      title: 'Setup',
      description: 'Configure your account settings and preferences.',
      icon: <Settings />,
      completed: !!company?.account_setup_completed_at,
      route: '/onboarding/setup'
    },
    {
      id: 'platform',
      title: 'Platform',
      description: 'Complete onboarding and access the platform.',
      icon: <Rocket />,
      completed: !!company?.platform_access_granted,
      route: '/onboarding/platform'
    }
  ]
  
  // Group steps into phases
  const phases: OnboardingPhase[] = [
    {
      id: 'account_setup',
      title: 'Account Setup',
      subtitle: 'Get started with your account',
      icon: <UserCheck />,
      steps: [
        steps.find(s => s.id === 'auth')!,
        steps.find(s => s.id === 'payment')!,
        steps.find(s => s.id === 'personal')!
      ],
      route: steps.find(s => s.id === 'auth' && !s.completed)?.route ||
             steps.find(s => s.id === 'payment' && !s.completed)?.route ||
             steps.find(s => s.id === 'personal' && !s.completed)?.route ||
             '/dashboard'
    },
    {
      id: 'business_verification',
      title: 'Business Verification',
      subtitle: 'Verify your business for compliance',
      icon: <FileText />,
      steps: [
        steps.find(s => s.id === 'business')!,
        steps.find(s => s.id === 'brand')!,
        steps.find(s => s.id === 'privacy')!
      ],
      route: steps.find(s => s.id === 'business' && !s.completed)?.route ||
             steps.find(s => s.id === 'brand' && !s.completed)?.route ||
             steps.find(s => s.id === 'privacy' && !s.completed)?.route ||
             '/onboarding/business'
    },
    {
      id: 'campaign_setup',
      title: 'Campaign Setup',
      subtitle: 'Configure your messaging campaign',
      icon: <Megaphone />,
      steps: [
        steps.find(s => s.id === 'campaign')!,
        steps.find(s => s.id === 'gphone')!
      ],
      route: steps.find(s => s.id === 'campaign' && !s.completed)?.route ||
             steps.find(s => s.id === 'gphone' && !s.completed)?.route ||
             '/onboarding/campaign'
    },
    {
      id: 'final_activation',
      title: 'Final Activation',
      subtitle: 'Complete setup and go live',
      icon: <Zap />,
      steps: [
        steps.find(s => s.id === 'setup')!,
        steps.find(s => s.id === 'platform')!
      ],
      route: steps.find(s => s.id === 'setup' && !s.completed)?.route ||
             steps.find(s => s.id === 'platform' && !s.completed)?.route ||
             '/onboarding/setup'
    }
  ]
  
  const completedSteps = steps.filter(s => s.completed).length
  const currentStepIndex = steps.findIndex(s => !s.completed)
  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null
  const progressPercentage = (completedSteps / steps.length) * 100
  
  // Find current phase
  const currentPhase = phases.find(phase => 
    phase.steps.some(step => !step.completed)
  ) || phases[phases.length - 1]
  
  // Check phase completion
  const getPhaseStatus = (phase: OnboardingPhase) => {
    const allCompleted = phase.steps.every(s => s.completed)
    const someCompleted = phase.steps.some(s => s.completed)
    const isActive = phase.id === currentPhase.id
    
    return { allCompleted, someCompleted, isActive }
  }
  
  const handlePhaseClick = (phase: OnboardingPhase) => {
    navigate(phase.route)
  }
  
  return (
    <TrackerContainer>
      <ProgressBar>
        <ProgressFill $progress={progressPercentage} />
      </ProgressBar>
      
      <PhasesContainer>
        {phases.map((phase) => {
          const { allCompleted, isActive } = getPhaseStatus(phase)
          
          return (
            <PhaseCard
              key={phase.id}
              $active={isActive}
              $completed={allCompleted}
              onClick={() => handlePhaseClick(phase)}
            >
              <PhaseHeader>
                <PhaseIcon $active={isActive} $completed={allCompleted}>
                  {allCompleted ? <CheckCircle2 /> : phase.icon}
                </PhaseIcon>
                <div style={{ flex: 1 }}>
                  <PhaseTitle $active={isActive} $completed={allCompleted}>
                    {phase.title}
                  </PhaseTitle>
                  <PhaseSubtitle $active={isActive} $completed={allCompleted}>
                    {allCompleted ? 'Completed' : isActive ? 'In Progress' : phase.subtitle}
                  </PhaseSubtitle>
                </div>
              </PhaseHeader>
              
              <PhaseSteps>
                {phase.steps.map(step => (
                  <PhaseStep 
                    key={step.id} 
                    $completed={step.completed}
                    $active={isActive}
                  >
                    {step.completed ? <CheckCircle2 /> : <div style={{ 
                      width: '14px', 
                      height: '14px', 
                      border: `2px solid ${isActive ? '#e0e7ff' : '#d1d5db'}`,
                      borderRadius: '50%' 
                    }} />}
                    {step.title}
                  </PhaseStep>
                ))}
              </PhaseSteps>
            </PhaseCard>
          )
        })}
      </PhasesContainer>
      
      {currentStep && (
        <CurrentStepDetail>
          <CardHeader>
            <DetailHeader>
              <DetailTitle>
                {currentStep.icon}
                Next: {currentStep.title}
              </DetailTitle>
              <span style={{ color: '#667eea', fontWeight: 600 }}>
                {completedSteps} of {steps.length} steps completed
              </span>
            </DetailHeader>
          </CardHeader>
          <CardContent>
            <DetailDescription>{currentStep.description}</DetailDescription>
            {currentStep.id === 'payment' && company?.stripe_customer_id && !company?.stripe_subscription_id && (
              <div style={{ 
                background: '#fef2f2', 
                border: '1px solid #fecaca', 
                borderRadius: '8px', 
                padding: '1rem', 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem'
              }}>
                <span style={{ color: '#dc2626', fontSize: '1.25rem' }}>⚠️</span>
                <div>
                  <p style={{ color: '#991b1b', fontWeight: 600, marginBottom: '0.25rem' }}>
                    Payment Required
                  </p>
                  <p style={{ color: '#7f1d1d', fontSize: '0.875rem' }}>
                    Your payment was not completed. Please click below to complete your subscription and activate your account.
                  </p>
                </div>
              </div>
            )}
            <ActionButton onClick={() => navigate(currentStep.route)}>
              {currentStep.id === 'payment' && company?.stripe_customer_id && !company?.stripe_subscription_id 
                ? 'Complete Payment' 
                : 'Continue Setup'}
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