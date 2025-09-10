import { useState } from 'react'
import { useHub, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sms-hub/ui'
import { Alert, AlertDescription } from '@sms-hub/ui'
import { StepComponentProps } from '@sms-hub/types'
import { Rocket, CheckCircle, Key, Shield, Zap, MessageSquare, Users, BarChart3, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const CompletionContainer = styled.div`
  text-align: center;
  padding: 2rem 0;
`

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
    }
    70% {
      box-shadow: 0 0 0 20px rgba(16, 185, 129, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
    }
  }
`

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`

const FeatureCard = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    border-color: #667eea;
  }
`

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  margin: 0 auto 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`

const FeatureTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
`

const FeatureDescription = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.4;
`

const AccessDetails = styled.div`
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border: 2px solid #667eea;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 2rem 0;
`

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;
  
  &:last-child {
    border-bottom: none;
  }
`

const DetailLabel = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const DetailValue = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
`

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`

export function PlatformAccessStep({ onComplete }: StepComponentProps) {
  const { hubConfig } = useHub()
  const navigate = useNavigate()
  const [isActivating, setIsActivating] = useState(false)
  const [isActivated, setIsActivated] = useState(false)

  const handleActivate = async () => {
    setIsActivating(true)
    
    try {
      // Simulate platform activation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mark platform access as granted
      await onComplete({
        platform_access_granted: true,
        activated_at: new Date().toISOString(),
        api_key_generated: true
      })
      
      setIsActivated(true)
    } catch (error) {
      console.error('Platform activation error:', error)
    } finally {
      setIsActivating(false)
    }
  }

  const features = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'SMS Campaigns',
      description: 'Send targeted messages to your audience'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Contact Management',
      description: 'Import and organize your contacts'
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Analytics',
      description: 'Track delivery and engagement metrics'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Automation',
      description: 'Set up automated message workflows'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Compliance',
      description: 'Built-in TCPA and 10DLC compliance'
    },
    {
      icon: <Key className="w-6 h-6" />,
      title: 'API Access',
      description: 'Integrate with your existing systems'
    }
  ]

  if (isActivated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-center">
            <Rocket className="w-6 h-6 mr-2 text-green-600" />
            Platform Activated!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CompletionContainer>
            <SuccessIcon>
              <CheckCircle className="w-10 h-10 text-white" />
            </SuccessIcon>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to {hubConfig.displayName}!
            </h2>
            <p className="text-gray-600 mb-6">
              Your account is fully activated and ready to send messages.
            </p>

            <AccessDetails>
              <DetailRow>
                <DetailLabel>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Payment Method
                </DetailLabel>
                <DetailValue>Active</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Brand Registration
                </DetailLabel>
                <DetailValue>Approved</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Campaign Status
                </DetailLabel>
                <DetailValue>Approved</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Phone Number
                </DetailLabel>
                <DetailValue>Provisioned</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  API Access
                </DetailLabel>
                <DetailValue>Enabled</DetailValue>
              </DetailRow>
            </AccessDetails>

            <Alert className="mb-4 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Your first 100 messages are on us! Start sending messages now to see the platform in action.
              </AlertDescription>
            </Alert>

            <ActionButtons>
              <Button 
                onClick={() => navigate('/campaigns')}
                className="hub-bg-primary hover:hub-bg-primary/90"
              >
                Create First Campaign
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                onClick={() => navigate('/dashboard')}
                variant="outline"
              >
                Go to Dashboard
              </Button>
            </ActionButtons>
          </CompletionContainer>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Rocket className="w-5 h-5 mr-2 hub-text-primary" />
          Platform Access
        </CardTitle>
        <CardDescription>
          Complete your setup and activate full platform access
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CompletionContainer>
          <h3 className="text-lg font-semibold mb-2">
            You're Almost There!
          </h3>
          <p className="text-gray-600 mb-6">
            You've successfully completed all onboarding requirements. 
            Activate your account to start sending messages.
          </p>

          <FeatureGrid>
            {features.map((feature, index) => (
              <FeatureCard key={index}>
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeatureGrid>

          <AccessDetails>
            <h4 className="font-semibold mb-3">What's Included:</h4>
            <DetailRow>
              <DetailLabel>Monthly Message Limit</DetailLabel>
              <DetailValue>10,000 messages</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Phone Numbers</DetailLabel>
              <DetailValue>1 dedicated number</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Campaigns</DetailLabel>
              <DetailValue>Unlimited</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Contacts</DetailLabel>
              <DetailValue>Unlimited</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>API Access</DetailLabel>
              <DetailValue>Full REST API</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Support</DetailLabel>
              <DetailValue>Email & Chat</DetailValue>
            </DetailRow>
          </AccessDetails>

          <Button 
            onClick={handleActivate}
            disabled={isActivating}
            className="hub-bg-primary hover:hub-bg-primary/90 w-full md:w-auto"
            size="lg"
          >
            {isActivating ? (
              <>
                Activating Platform...
              </>
            ) : (
              <>
                Activate Platform Access
                <Rocket className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </CompletionContainer>
      </CardContent>
    </Card>
  )
}