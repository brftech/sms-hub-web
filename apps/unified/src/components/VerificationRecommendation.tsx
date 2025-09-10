import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Shield, X, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent, Button } from '@sms-hub/ui'
import { createSupabaseClient } from '@sms-hub/supabase'

const RecommendationCard = styled(Card)`
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid #f59e0b;
  margin-bottom: 1.5rem;
  position: relative;
`

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: #92400e;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(146, 64, 14, 0.1);
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`

const IconWrapper = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  svg {
    width: 24px;
    height: 24px;
    color: #f59e0b;
  }
`

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #92400e;
  margin: 0;
`

const Description = styled.p`
  color: #92400e;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`

const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
`

const BenefitItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #92400e;
  font-size: 0.875rem;
  
  svg {
    width: 16px;
    height: 16px;
    color: #22c55e;
    flex-shrink: 0;
  }
`

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`

interface VerificationRecommendationProps {
  userProfile: any
  onDismiss?: () => void
}

export function VerificationRecommendation({ userProfile, onDismiss }: VerificationRecommendationProps) {
  const navigate = useNavigate()
  const [isDismissing, setIsDismissing] = useState(false)
  
  // Don't show if user has already completed verification setup
  if (userProfile?.verification_setup_completed) {
    return null
  }
  
  // Don't show if recommendation was already shown recently (within 7 days)
  if (userProfile?.verification_recommendation_shown_at) {
    const lastShown = new Date(userProfile.verification_recommendation_shown_at)
    const daysSinceShown = (Date.now() - lastShown.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceShown < 7) {
      return null
    }
  }
  
  const handleDismiss = async () => {
    setIsDismissing(true)
    
    try {
      // Track that recommendation was shown
      const supabase = createSupabaseClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      )
      
      if (supabase) {
        await supabase
          .from('user_profiles')
          .update({
            verification_recommendation_shown: true,
            verification_recommendation_shown_at: new Date().toISOString()
          })
          .eq('id', userProfile.id)
      }
      
      onDismiss?.()
    } catch (error) {
      console.error('Error dismissing recommendation:', error)
    } finally {
      setIsDismissing(false)
    }
  }
  
  const handleSetupVerification = () => {
    navigate('/settings/security')
  }
  
  return (
    <RecommendationCard>
      <CloseButton 
        onClick={handleDismiss}
        disabled={isDismissing}
        title="Dismiss for 7 days"
      >
        <X className="w-5 h-5" />
      </CloseButton>
      
      <CardContent>
        <Header>
          <IconWrapper>
            <Shield />
          </IconWrapper>
          <div>
            <Title>Enhance Your Account Security</Title>
            <p className="text-sm text-amber-700 mt-0.5">
              Set up verification for faster, more secure login
            </p>
          </div>
        </Header>
        
        <Description>
          You're currently using password login. Upgrade to SMS or email verification for enhanced security and a smoother login experience.
        </Description>
        
        <BenefitsList>
          <BenefitItem>
            <CheckCircle />
            <span>No more forgotten passwords</span>
          </BenefitItem>
          <BenefitItem>
            <CheckCircle />
            <span>Enhanced account security</span>
          </BenefitItem>
          <BenefitItem>
            <CheckCircle />
            <span>Faster login process</span>
          </BenefitItem>
          <BenefitItem>
            <CheckCircle />
            <span>Industry-standard authentication</span>
          </BenefitItem>
        </BenefitsList>
        
        <ActionButtons>
          <Button
            onClick={handleSetupVerification}
            className="hub-bg-primary hover:hub-bg-primary/90"
          >
            Set Up Verification
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            variant="outline"
            onClick={handleDismiss}
            disabled={isDismissing}
          >
            Maybe Later
          </Button>
        </ActionButtons>
      </CardContent>
    </RecommendationCard>
  )
}

// Compact version for users who dismissed the full recommendation
export function VerificationRecommendationCompact({ userProfile }: { userProfile: any }) {
  const navigate = useNavigate()
  
  // Don't show if user has already completed verification setup
  if (userProfile?.verification_setup_completed) {
    return null
  }
  
  // Only show compact version if full version was dismissed
  if (!userProfile?.verification_recommendation_shown) {
    return null
  }
  
  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-amber-400 mr-3" />
          <p className="text-sm text-amber-700">
            <strong>Security Tip:</strong> Enable verification login for better security.
            <button
              onClick={() => navigate('/settings/security')}
              className="ml-2 font-medium text-amber-900 hover:text-amber-800 underline"
            >
              Set up now
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}