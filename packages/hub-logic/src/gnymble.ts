import { HubType } from '@sms-hub/types'

export const GNYMBLE_FEATURES = {
  REGULATED_INDUSTRY: 'regulated_industry',
  CIGAR_COMPLIANCE: 'cigar_compliance',
  SPEAKEASY_SUPPORT: 'speakeasy_support',
  LUXURY_RETAIL: 'luxury_retail'
} as const

export const GNYMBLE_INDUSTRIES = [
  'Cigar Retailers',
  'Speakeasies',
  'Wine & Spirits',
  'Luxury Goods',
  'Premium Tobacco',
  'Adult Entertainment',
  'Gaming & Casinos',
  'Other Regulated'
] as const

export const getGnymbleOnboardingRequirements = () => {
  return {
    additionalVerification: true,
    complianceDocuments: [
      'Business License',
      'Tobacco License (if applicable)',
      'Age Verification Process',
      'Compliance Attestation'
    ],
    requiredTerms: [
      'Tobacco Marketing Compliance',
      'Age Verification Requirements',
      'State Regulation Adherence',
      'Industry-Specific Terms'
    ]
  }
}

export const validateGnymbleCompliance = (data: {
  industry: string
  hasBusinessLicense: boolean
  hasTobaccoLicense?: boolean
  hasAgeVerification: boolean
}) => {
  const errors: string[] = []

  if (!GNYMBLE_INDUSTRIES.includes(data.industry as any)) {
    errors.push('Invalid industry selection for Gnymble platform')
  }

  if (!data.hasBusinessLicense) {
    errors.push('Business license verification is required')
  }

  if (data.industry.toLowerCase().includes('cigar') || data.industry.toLowerCase().includes('tobacco')) {
    if (!data.hasTobaccoLicense) {
      errors.push('Tobacco license is required for tobacco-related businesses')
    }
  }

  if (!data.hasAgeVerification) {
    errors.push('Age verification process documentation is required')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}