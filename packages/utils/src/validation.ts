export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export const validateSignupData = (data: {
  company_name: string
  first_name: string
  last_name: string
  mobile_phone_number: string
  email: string
}): ValidationResult => {
  const errors: string[] = []

  // Company name validation
  if (!data.company_name || data.company_name.trim().length < 2) {
    errors.push('Company name must be at least 2 characters long')
  }

  // First name validation
  if (!data.first_name || data.first_name.trim().length < 2) {
    errors.push('First name must be at least 2 characters long')
  }

  // Last name validation
  if (!data.last_name || data.last_name.trim().length < 2) {
    errors.push('Last name must be at least 2 characters long')
  }

  // Phone validation
  const phoneDigits = data.mobile_phone_number.replace(/\D/g, '')
  if (phoneDigits.length !== 10 && !(phoneDigits.length === 11 && phoneDigits.startsWith('1'))) {
    errors.push('Phone number must be a valid US phone number')
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(data.email)) {
    errors.push('Email must be a valid email address')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateBrandData = (data: {
  name: string
  legal_name?: string
  ein?: string
  website?: string
}): ValidationResult => {
  const errors: string[] = []

  if (!data.name || data.name.trim().length < 2) {
    errors.push('Brand name is required')
  }

  if (data.ein && !/^\d{2}-\d{7}$/.test(data.ein)) {
    errors.push('EIN must be in format XX-XXXXXXX')
  }

  if (data.website && !/^https?:\/\/.+\..+/.test(data.website)) {
    errors.push('Website must be a valid URL')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateCampaignData = (data: {
  name: string
  description?: string
}): ValidationResult => {
  const errors: string[] = []

  if (!data.name || data.name.trim().length < 2) {
    errors.push('Campaign name is required')
  }

  if (data.description && data.description.length > 500) {
    errors.push('Campaign description must be less than 500 characters')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}