import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHub, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sms-hub/ui'
import { Progress } from '@sms-hub/ui'
import { StepComponentProps } from '@sms-hub/types'
import { CheckCircle, Zap, ArrowRight } from 'lucide-react'

export function ActivationStep({ onComplete }: StepComponentProps) {
  const { hubConfig } = useHub()
  const navigate = useNavigate()
  const [activationProgress, setActivationProgress] = useState(0)
  const [isActivating, setIsActivating] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const activationSteps = [
    'Verifying brand registration',
    'Configuring campaign settings', 
    'Activating phone number',
    'Setting up message routing',
    'Finalizing platform access'
  ]

  const handleActivation = async () => {
    setIsActivating(true)
    
    // Simulate activation process
    for (let i = 0; i <= activationSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setActivationProgress((i / activationSteps.length) * 100)
    }
    
    setIsComplete(true)
    setIsActivating(false)
    
    // Complete the onboarding
    await onComplete({
      platform_activated: true,
      activation_completed_at: new Date().toISOString()
    })
  }

  const handleContinue = () => {
    navigate('/dashboard')
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center">
          <Zap className="w-5 h-5 mr-2 hub-text-primary" />
          Platform Activation
        </CardTitle>
        <CardDescription>
          {isComplete 
            ? 'Your SMS platform is now active and ready to use!'
            : 'Activating your SMS platform with all configured settings'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isComplete && !isActivating && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-hub-primary/10 rounded-full flex items-center justify-center">
              <Zap className="w-8 h-8 hub-text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Ready to Activate</h3>
              <p className="text-muted-foreground">
                All your information has been collected. Click below to activate your platform.
              </p>
            </div>
            <Button 
              onClick={handleActivation}
              className="hub-bg-primary hover:hub-bg-primary/90"
              size="lg"
            >
              Activate Platform
              <Zap className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {isActivating && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-hub-primary/10 rounded-full flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 hub-text-primary animate-pulse" />
              </div>
              <h3 className="font-semibold text-lg">Activating Platform</h3>
              <p className="text-muted-foreground">Please wait while we set everything up...</p>
            </div>
            
            <Progress value={activationProgress} className="w-full" />
            
            <div className="space-y-2">
              {activationSteps.map((step, index) => {
                const isCompleted = activationProgress > (index / activationSteps.length) * 100
                const isCurrent = Math.floor(activationProgress / (100 / activationSteps.length)) === index
                
                return (
                  <div 
                    key={index}
                    className={`flex items-center space-x-2 text-sm ${
                      isCompleted ? 'text-green-600' : isCurrent ? 'hub-text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        isCurrent ? 'border-hub-primary' : 'border-muted-foreground/30'
                      }`} />
                    )}
                    <span>{step}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {isComplete && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-green-600">Platform Activated!</h3>
              <p className="text-muted-foreground">
                Your {hubConfig.displayName} SMS platform is now ready to use.
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg text-left">
              <h4 className="font-medium text-green-800 mb-2">What's activated:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>✓ Brand registered with TCR</li>
                <li>✓ Campaign approved and active</li>
                <li>✓ Dedicated phone number assigned</li>
                <li>✓ Message routing configured</li>
                <li>✓ Platform access enabled</li>
              </ul>
            </div>

            <Button 
              onClick={handleContinue}
              className="hub-bg-primary hover:hub-bg-primary/90"
              size="lg"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}