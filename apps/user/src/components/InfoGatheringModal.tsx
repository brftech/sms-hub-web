import { useState } from 'react'
import { useHub, Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@sms-hub/ui'
import { Input, Label, Alert, AlertDescription } from '@sms-hub/ui'
import { Building, User, AlertCircle } from 'lucide-react'
import styled from 'styled-components'
import { useCreateCompany, useUpdateProfile } from '@sms-hub/supabase'

const ModalContainer = styled.div`
  .dialog-overlay {
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
  }
`

const FormSection = styled.form`
  space-y: 4;
`

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`

const NameRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
`

const StyledLabel = styled(Label)`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
`

const StyledInput = styled(Input)`
  width: 100%;
  height: 40px;
  font-size: 0.875rem;
`

const IconWrapper = styled.div`
  display: inline-flex;
  padding: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  margin-bottom: 1rem;
  
  svg {
    width: 24px;
    height: 24px;
    color: white;
  }
`

const WelcomeText = styled.p`
  color: #6b7280;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`

interface InfoGatheringModalProps {
  isOpen: boolean
  onComplete: () => void
  userProfile: any
  signupType?: 'new_company' | 'invited_user' | 'individual'
}

export function InfoGatheringModal({ isOpen, onComplete, userProfile, signupType = 'new_company' }: InfoGatheringModalProps) {
  const { hubConfig } = useHub()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const createCompany = useCreateCompany()
  const updateProfile = useUpdateProfile()
  
  // For invited users and individuals, we only need name, not company
  const needsCompany = signupType === 'new_company' && !userProfile?.company_id
  
  const [formData, setFormData] = useState({
    company_name: '',
    first_name: userProfile?.first_name || '',
    last_name: userProfile?.last_name || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const namesMissing = !formData.first_name || !formData.last_name
    const companyMissing = needsCompany && !formData.company_name
    
    if (namesMissing || companyMissing) {
      setError('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      let companyId = userProfile.company_id
      
      // Only create company for new_company signups
      if (needsCompany) {
        const company = await createCompany.mutateAsync({
          hub_id: userProfile.hub_id,
          public_name: formData.company_name,
          billing_email: userProfile.email,
          created_by_profile_id: userProfile.id
        })
        companyId = company.id
      }

      // Update the user profile with name (and company_id if new)
      await updateProfile.mutateAsync({
        id: userProfile.id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        ...(companyId && !userProfile.company_id ? { company_id: companyId } : {}),
        updated_at: new Date().toISOString()
      })

      // Success! Close modal
      onComplete()
    } catch (err: any) {
      console.error('Info gathering error:', err)
      setError(err.message || 'Failed to save information')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ModalContainer>
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[425px]" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <div className="text-center">
              <IconWrapper>
                <Building />
              </IconWrapper>
              <DialogTitle className="text-xl">Complete Your Profile</DialogTitle>
              <DialogDescription className="text-sm mt-2">
                {needsCompany 
                  ? `Welcome to ${hubConfig.displayName}! Let's finish setting up your account.`
                  : `Welcome to the team! Just need your name to complete your profile.`
                }
              </DialogDescription>
            </div>
          </DialogHeader>
          
          <div className="mt-4">
            <WelcomeText>
              {needsCompany 
                ? "We just need a few more details to personalize your experience and set up your company account."
                : "Please provide your name to complete your profile and start using the platform."
              }
            </WelcomeText>
            
            <FormSection onSubmit={handleSubmit}>
              {needsCompany && (
                <FormGroup>
                  <StyledLabel htmlFor="company_name">
                    <Building className="w-4 h-4 inline mr-1" />
                    Company Name *
                  </StyledLabel>
                  <StyledInput
                    id="company_name"
                    type="text"
                    placeholder="Your company name"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    disabled={isSubmitting}
                    autoFocus={needsCompany}
                  />
                </FormGroup>
              )}

              <NameRow>
                <FormGroup>
                  <StyledLabel htmlFor="first_name">
                    <User className="w-4 h-4 inline mr-1" />
                    First Name *
                  </StyledLabel>
                  <StyledInput
                    id="first_name"
                    type="text"
                    placeholder="John"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    disabled={isSubmitting}
                    autoFocus={!needsCompany}
                  />
                </FormGroup>
                
                <FormGroup>
                  <StyledLabel htmlFor="last_name">
                    Last Name *
                  </StyledLabel>
                  <StyledInput
                    id="last_name"
                    type="text"
                    placeholder="Doe"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    disabled={isSubmitting}
                  />
                </FormGroup>
              </NameRow>
              
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Button 
                type="submit" 
                className="w-full hub-bg-primary hover:hub-bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Complete Setup'}
              </Button>
            </FormSection>
            
            <p className="text-xs text-center text-gray-500 mt-4">
              {signupType === 'individual' 
                ? "Your information is private and secure."
                : "This information will be used for your account and billing purposes."
              }
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </ModalContainer>
  )
}