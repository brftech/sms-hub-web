export * from './gnymble'
export * from './percymd'
export * from './percytech'
export * from './percytext'

import { HubType } from '@sms-hub/types'
import { getGnymbleOnboardingRequirements } from './gnymble'
import { getPercyMDOnboardingRequirements } from './percymd'
import { getPercyTechCapabilities } from './percytech'
import { getPercyTextAdvancedFeatures } from './percytext'

export const getHubSpecificRequirements = (hubType: HubType) => {
  switch (hubType) {
    case 'gnymble':
      return getGnymbleOnboardingRequirements()
    case 'percymd':
      return getPercyMDOnboardingRequirements()
    case 'percytech':
      return getPercyTechCapabilities()
    case 'percytext':
      return getPercyTextAdvancedFeatures()
    default:
      return {}
  }
}

export const getHubSpecificValidation = (hubType: HubType) => {
  // Return hub-specific validation rules
  const baseRules = {
    email: true,
    phone: true,
    companyName: true
  }

  switch (hubType) {
    case 'gnymble':
      return {
        ...baseRules,
        businessLicense: true,
        ageVerification: true,
        industryCompliance: true
      }
    case 'percymd':
      return {
        ...baseRules,
        medicalLicense: true,
        hipaaCompliance: true,
        professionalInsurance: true
      }
    case 'percytext':
      return {
        ...baseRules,
        technicalRequirements: true,
        apiAccess: true
      }
    default:
      return baseRules
  }
}