import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Building, MapPin, Phone, Globe, Hash, FileText, AlertCircle } from 'lucide-react'
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Alert, AlertDescription, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@sms-hub/ui'
import { useCurrentUserCompany, useUpdateCompany } from '@sms-hub/supabase'

const StepContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
`

const FormSection = styled.form`
  space-y: 6;
`

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`

const StyledLabel = styled(Label)`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const StyledInput = styled(Input)`
  width: 100%;
  height: 40px;
  font-size: 0.875rem;
`

const InfoText = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
`

const RequiredBadge = styled.span`
  color: #dc2626;
  font-weight: 500;
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

const legalFormOptions = [
  { value: 'PRIVATE_PROFIT', label: 'Private For-Profit' },
  { value: 'PUBLIC_PROFIT', label: 'Public For-Profit' },
  { value: 'PRIVATE_NON_PROFIT', label: 'Private Non-Profit' },
  { value: 'PUBLIC_NON_PROFIT', label: 'Public Non-Profit' },
  { value: 'GOVERNMENT', label: 'Government Entity' },
  { value: 'SOLE_PROPRIETOR', label: 'Sole Proprietorship' },
]

const verticalOptions = [
  { value: 'PROFESSIONAL', label: 'Professional Services' },
  { value: 'REAL_ESTATE', label: 'Real Estate' },
  { value: 'HEALTHCARE', label: 'Healthcare' },
  { value: 'TECHNOLOGY', label: 'Technology' },
  { value: 'FINANCE', label: 'Finance' },
  { value: 'INSURANCE', label: 'Insurance' },
  { value: 'CONSTRUCTION', label: 'Construction' },
  { value: 'TRANSPORTATION', label: 'Transportation' },
  { value: 'RETAIL', label: 'Retail' },
  { value: 'TELECOM', label: 'Telecommunications' },
  { value: 'TRAVEL', label: 'Travel' },
  { value: 'RESTAURANT', label: 'Restaurant' },
  { value: 'OTHER', label: 'Other' },
]

export function BusinessInfoStep() {
  const navigate = useNavigate()
  const { data: company, refetch } = useCurrentUserCompany()
  const updateCompany = useUpdateCompany()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    legal_name: company?.legal_name || company?.public_name || '',
    legal_form: company?.legal_form || '',
    vertical_type: company?.vertical_type || '',
    ein: company?.ein || '',
    website: company?.website || '',
    company_phone_number: company?.company_phone_number || '',
    address: company?.address || '',
    city: company?.city || '',
    state_region: company?.state_region || '',
    postal_code: company?.postal_code || '',
    country_of_registration: company?.country_of_registration || 'US',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.legal_name || !formData.legal_form || !formData.vertical_type || 
        !formData.ein || !formData.address || !formData.city || 
        !formData.state_region || !formData.postal_code) {
      setError('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await updateCompany.mutateAsync({
        id: company!.id,
        ...formData,
        updated_at: new Date().toISOString()
      })

      // Refetch company data
      await refetch()
      
      // Navigate to next step (Brand)
      navigate('/onboarding/brand')
    } catch (err: any) {
      console.error('Business info update error:', err)
      setError(err.message || 'Failed to update business information')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!company) {
    return (
      <StepContainer>
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600">Loading company information...</p>
          </CardContent>
        </Card>
      </StepContainer>
    )
  }

  return (
    <StepContainer>
      <Card>
        <CardHeader>
          <div className="text-center">
            <IconWrapper>
              <Building />
            </IconWrapper>
            <CardTitle className="text-xl">Business Information</CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Provide your business details for TCR (The Campaign Registry) compliance
            </p>
          </div>
        </CardHeader>
        
        <CardContent>
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This information is required for SMS compliance and will be submitted to The Campaign Registry.
              Please ensure all details are accurate and match your official business records.
            </AlertDescription>
          </Alert>
          
          <FormSection onSubmit={handleSubmit}>
            <FormGroup>
              <StyledLabel htmlFor="legal_name">
                <Building className="w-4 h-4" />
                Legal Business Name <RequiredBadge>*</RequiredBadge>
              </StyledLabel>
              <StyledInput
                id="legal_name"
                type="text"
                placeholder="ABC Corporation Inc."
                value={formData.legal_name}
                onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })}
                disabled={isSubmitting}
              />
              <InfoText>Official legal name as registered with the government</InfoText>
            </FormGroup>

            <FormRow>
              <FormGroup>
                <StyledLabel htmlFor="legal_form">
                  <FileText className="w-4 h-4" />
                  Legal Form <RequiredBadge>*</RequiredBadge>
                </StyledLabel>
                <Select
                  value={formData.legal_form}
                  onValueChange={(value) => setFormData({ ...formData, legal_form: value })}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select legal form" />
                  </SelectTrigger>
                  <SelectContent>
                    {legalFormOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <StyledLabel htmlFor="vertical_type">
                  <Building className="w-4 h-4" />
                  Industry Vertical <RequiredBadge>*</RequiredBadge>
                </StyledLabel>
                <Select
                  value={formData.vertical_type}
                  onValueChange={(value) => setFormData({ ...formData, vertical_type: value })}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {verticalOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <StyledLabel htmlFor="ein">
                  <Hash className="w-4 h-4" />
                  EIN/Tax ID <RequiredBadge>*</RequiredBadge>
                </StyledLabel>
                <StyledInput
                  id="ein"
                  type="text"
                  placeholder="12-3456789"
                  value={formData.ein}
                  onChange={(e) => setFormData({ ...formData, ein: e.target.value })}
                  disabled={isSubmitting}
                />
                <InfoText>Employer Identification Number</InfoText>
              </FormGroup>
              
              <FormGroup>
                <StyledLabel htmlFor="company_phone_number">
                  <Phone className="w-4 h-4" />
                  Business Phone
                </StyledLabel>
                <StyledInput
                  id="company_phone_number"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.company_phone_number}
                  onChange={(e) => setFormData({ ...formData, company_phone_number: e.target.value })}
                  disabled={isSubmitting}
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <StyledLabel htmlFor="website">
                <Globe className="w-4 h-4" />
                Website
              </StyledLabel>
              <StyledInput
                id="website"
                type="url"
                placeholder="https://www.example.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                disabled={isSubmitting}
              />
            </FormGroup>

            <FormGroup>
              <StyledLabel htmlFor="address">
                <MapPin className="w-4 h-4" />
                Business Address <RequiredBadge>*</RequiredBadge>
              </StyledLabel>
              <StyledInput
                id="address"
                type="text"
                placeholder="123 Main Street, Suite 100"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={isSubmitting}
              />
            </FormGroup>

            <FormRow>
              <FormGroup>
                <StyledLabel htmlFor="city">
                  City <RequiredBadge>*</RequiredBadge>
                </StyledLabel>
                <StyledInput
                  id="city"
                  type="text"
                  placeholder="New York"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  disabled={isSubmitting}
                />
              </FormGroup>
              
              <FormGroup>
                <StyledLabel htmlFor="state_region">
                  State/Region <RequiredBadge>*</RequiredBadge>
                </StyledLabel>
                <StyledInput
                  id="state_region"
                  type="text"
                  placeholder="NY"
                  value={formData.state_region}
                  onChange={(e) => setFormData({ ...formData, state_region: e.target.value })}
                  disabled={isSubmitting}
                  maxLength={2}
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <StyledLabel htmlFor="postal_code">
                  ZIP/Postal Code <RequiredBadge>*</RequiredBadge>
                </StyledLabel>
                <StyledInput
                  id="postal_code"
                  type="text"
                  placeholder="10001"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  disabled={isSubmitting}
                />
              </FormGroup>
              
              <FormGroup>
                <StyledLabel htmlFor="country_of_registration">
                  Country <RequiredBadge>*</RequiredBadge>
                </StyledLabel>
                <StyledInput
                  id="country_of_registration"
                  type="text"
                  value="United States"
                  disabled
                />
              </FormGroup>
            </FormRow>
            
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
              {isSubmitting ? 'Saving...' : 'Continue to Brand Registration'}
            </Button>
          </FormSection>
        </CardContent>
      </Card>
    </StepContainer>
  )
}