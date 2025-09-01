import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHub, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sms-hub/ui'
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react'
import { useUserProfile, useCurrentUserCompany } from '@sms-hub/supabase/react'
import styled from 'styled-components'
import confetti from 'canvas-confetti'

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`

const SuccessCard = styled(Card)`
  max-width: 500px;
  width: 100%;
  text-align: center;
`

const IconWrapper = styled.div`
  margin: 0 auto 1.5rem;
  width: 80px;
  height: 80px;
  background: #10b981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: scaleIn 0.5s ease-out;
  
  @keyframes scaleIn {
    from {
      transform: scale(0);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.5rem;
`

const NextSteps = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
  text-align: left;
`

const StepItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
  
  .step-number {
    width: 28px;
    height: 28px;
    background: #eff6ff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: #3b82f6;
    flex-shrink: 0;
  }
  
  .step-content {
    flex: 1;
    
    h3 {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    
    p {
      font-size: 0.875rem;
      color: #6b7280;
    }
  }
`

export function PaymentSuccess() {
  const { hubConfig } = useHub()
  const navigate = useNavigate()
  const { data: userProfile } = useUserProfile()
  const { data: company } = useCurrentUserCompany()
  const [countdown, setCountdown] = useState(10)
  
  useEffect(() => {
    // Fire confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
    
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          navigate('/')
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [navigate])
  
  const nextSteps = [
    {
      title: 'Set up your first campaign',
      description: 'Create and launch your first SMS marketing campaign'
    },
    {
      title: 'Import your contacts',
      description: 'Upload your contact list to start messaging'
    },
    {
      title: 'Register your brand',
      description: 'Complete A2P 10DLC registration for compliance'
    },
    {
      title: 'Get a phone number',
      description: 'Choose a dedicated number for your campaigns'
    }
  ]
  
  return (
    <Container>
      <SuccessCard>
        <CardHeader>
          <IconWrapper>
            <CheckCircle className="w-12 h-12 text-white" />
          </IconWrapper>
          <Title>Payment Successful!</Title>
          <CardDescription className="text-base">
            Welcome to {hubConfig.displayName} Pro
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <Sparkles className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="font-semibold text-green-900">Your account is now active</p>
            <p className="text-sm text-green-700 mt-1">
              You have full access to all features
            </p>
          </div>
          
          {userProfile && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Account Details</p>
              <p className="font-medium">{userProfile.first_name} {userProfile.last_name}</p>
              <p className="text-sm text-gray-500">{userProfile.email}</p>
              {company && (
                <p className="text-sm text-gray-500 mt-1">
                  {company.public_name} • {company.company_account_number}
                </p>
              )}
            </div>
          )}
          
          <NextSteps>
            <h2 className="font-semibold mb-4">Next Steps</h2>
            {nextSteps.map((step, index) => (
              <StepItem key={index}>
                <div className="step-number">{index + 1}</div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </StepItem>
            ))}
          </NextSteps>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Redirecting to dashboard in {countdown} seconds...
            </p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </CardContent>
      </SuccessCard>
    </Container>
  )
}