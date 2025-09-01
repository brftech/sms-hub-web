import { useState } from 'react'
import { useHub, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sms-hub/ui'
import { Checkbox, Label, Alert, AlertDescription } from '@sms-hub/ui'
import { StepComponentProps } from '@sms-hub/types'
import { Shield, FileText, Lock, ChevronRight, ExternalLink } from 'lucide-react'
import styled from 'styled-components'

const PolicySection = styled.div`
  margin-bottom: 2rem;
`

const PolicyCard = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
`

const PolicyTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const PolicyContent = styled.div`
  max-height: 300px;
  overflow-y: auto;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1rem;
  margin: 1rem 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
`

const CheckboxSection = styled.div`
  background: #f0f9ff;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 2rem 0;
`

const CheckboxItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`

const StyledCheckbox = styled(Checkbox)`
  margin-top: 0.125rem;
`

const CheckboxLabel = styled(Label)`
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.5;
  cursor: pointer;
`

const ExternalLinkButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: #3b82f6;
  font-size: 0.875rem;
  text-decoration: none;
  margin-left: 0.25rem;
  
  &:hover {
    text-decoration: underline;
  }
`

export function PrivacyStep({ onComplete }: StepComponentProps) {
  const { hubConfig } = useHub()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [agreements, setAgreements] = useState({
    privacy_policy: false,
    terms_of_service: false,
    tcr_terms: false,
    data_processing: false
  })

  const allAgreed = Object.values(agreements).every(v => v === true)

  const handleSubmit = async () => {
    if (!allAgreed) return
    
    setIsSubmitting(true)
    
    try {
      // Record privacy policy acceptance
      await onComplete({
        privacy_policy_accepted: true,
        privacy_policy_version: '1.0',
        accepted_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Privacy policy error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const privacyPolicyContent = `
    ${hubConfig.displayName} Privacy Policy
    
    1. Information We Collect
    We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.
    
    2. How We Use Your Information
    We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.
    
    3. Information Sharing
    We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
    
    4. Data Security
    We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
    
    5. Your Rights
    You have the right to access, update, or delete your personal information. You may also opt-out of certain communications from us.
    
    6. SMS Compliance
    We comply with all applicable SMS regulations including TCPA, CAN-SPAM, and 10DLC requirements.
  `

  const termsContent = `
    ${hubConfig.displayName} Terms of Service
    
    1. Acceptance of Terms
    By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.
    
    2. Use of Service
    You may use our service only for lawful purposes and in accordance with these Terms. You agree not to use our service to send spam or unsolicited messages.
    
    3. Account Responsibilities
    You are responsible for maintaining the confidentiality of your account and password and for restricting access to your account.
    
    4. SMS Messaging Terms
    - You must obtain proper consent before sending SMS messages
    - You must provide clear opt-out instructions
    - You must comply with all applicable laws and regulations
    
    5. Limitation of Liability
    In no event shall ${hubConfig.displayName} be liable for any indirect, incidental, special, consequential, or punitive damages.
  `

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="w-5 h-5 mr-2 hub-text-primary" />
          Privacy & Terms Agreement
        </CardTitle>
        <CardDescription>
          Review and accept our policies to ensure compliance and protect your data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PolicySection>
          <PolicyCard>
            <PolicyTitle>
              <FileText className="w-5 h-5 text-blue-600" />
              Privacy Policy
            </PolicyTitle>
            <PolicyContent>
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                {privacyPolicyContent}
              </pre>
            </PolicyContent>
          </PolicyCard>

          <PolicyCard>
            <PolicyTitle>
              <Lock className="w-5 h-5 text-green-600" />
              Terms of Service
            </PolicyTitle>
            <PolicyContent>
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                {termsContent}
              </pre>
            </PolicyContent>
          </PolicyCard>
        </PolicySection>

        <CheckboxSection>
          <CheckboxItem>
            <StyledCheckbox
              id="privacy_policy"
              checked={agreements.privacy_policy}
              onCheckedChange={(checked) => 
                setAgreements(prev => ({ ...prev, privacy_policy: !!checked }))
              }
            />
            <CheckboxLabel htmlFor="privacy_policy">
              I have read and agree to the
              <ExternalLinkButton href="/privacy" target="_blank">
                Privacy Policy
                <ExternalLink className="w-3 h-3" />
              </ExternalLinkButton>
            </CheckboxLabel>
          </CheckboxItem>

          <CheckboxItem>
            <StyledCheckbox
              id="terms_of_service"
              checked={agreements.terms_of_service}
              onCheckedChange={(checked) => 
                setAgreements(prev => ({ ...prev, terms_of_service: !!checked }))
              }
            />
            <CheckboxLabel htmlFor="terms_of_service">
              I have read and agree to the
              <ExternalLinkButton href="/terms" target="_blank">
                Terms of Service
                <ExternalLink className="w-3 h-3" />
              </ExternalLinkButton>
            </CheckboxLabel>
          </CheckboxItem>

          <CheckboxItem>
            <StyledCheckbox
              id="tcr_terms"
              checked={agreements.tcr_terms}
              onCheckedChange={(checked) => 
                setAgreements(prev => ({ ...prev, tcr_terms: !!checked }))
              }
            />
            <CheckboxLabel htmlFor="tcr_terms">
              I understand and agree to comply with The Campaign Registry (TCR) requirements for A2P 10DLC messaging
            </CheckboxLabel>
          </CheckboxItem>

          <CheckboxItem>
            <StyledCheckbox
              id="data_processing"
              checked={agreements.data_processing}
              onCheckedChange={(checked) => 
                setAgreements(prev => ({ ...prev, data_processing: !!checked }))
              }
            />
            <CheckboxLabel htmlFor="data_processing">
              I consent to the processing of my data as described in the Privacy Policy and understand my rights under applicable data protection laws
            </CheckboxLabel>
          </CheckboxItem>
        </CheckboxSection>

        {!allAgreed && (
          <Alert>
            <AlertDescription>
              Please review and accept all agreements to continue
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSubmit}
            disabled={!allAgreed || isSubmitting}
            className="hub-bg-primary hover:hub-bg-primary/90"
          >
            {isSubmitting ? 'Processing...' : 'Accept & Continue'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}