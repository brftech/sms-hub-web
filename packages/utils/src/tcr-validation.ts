/**
 * TCR (The Campaign Registry) validation utilities
 * Ensures compliance with TCR requirements for brand and campaign registration
 */

/**
 * Validates EIN format (XX-XXXXXXX)
 */
export function validateEIN(ein: string): boolean {
  const einRegex = /^\d{2}-?\d{7}$/
  return einRegex.test(ein.replace(/\s/g, ''))
}

/**
 * Formats EIN to XX-XXXXXXX format
 */
export function formatEIN(ein: string): string {
  const cleaned = ein.replace(/[^\d]/g, '')
  if (cleaned.length !== 9) return ein
  return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`
}

/**
 * Validates website URL
 */
export function validateWebsite(url: string): boolean {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Validates US phone number for TCR compliance
 */
export function validateTCRPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/[^\d]/g, '')
  return cleaned.length === 10 || (cleaned.length === 11 && cleaned[0] === '1')
}

/**
 * Formats US phone number to E.164 format
 */
export function formatPhoneToE164(phone: string): string {
  const cleaned = phone.replace(/[^\d]/g, '')
  if (cleaned.length === 10) {
    return `+1${cleaned}`
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+${cleaned}`
  }
  return phone
}

/**
 * Validates ZIP code (5 digits or ZIP+4)
 */
export function validateZipCode(zip: string): boolean {
  const zipRegex = /^\d{5}(-\d{4})?$/
  return zipRegex.test(zip)
}

/**
 * Validates call-to-action meets TCR requirements
 */
export function validateCallToAction(text: string): { valid: boolean; error?: string } {
  if (!text || text.trim().length === 0) {
    return { valid: false, error: 'Call to action is required' }
  }
  
  if (text.trim().length < 40) {
    return { 
      valid: false, 
      error: `Call to action must be at least 40 characters (currently ${text.trim().length})` 
    }
  }
  
  return { valid: true }
}

/**
 * Validates brand data for TCR submission
 */
export interface TCRBrandValidationResult {
  valid: boolean
  errors: Record<string, string>
}

export function validateTCRBrandData(data: any): TCRBrandValidationResult {
  const errors: Record<string, string> = {}
  
  // Required fields
  if (!data.company_legal_name?.trim()) {
    errors.company_legal_name = 'Legal company name is required'
  }
  
  if (!data.ein?.trim()) {
    errors.ein = 'EIN is required'
  } else if (!validateEIN(data.ein)) {
    errors.ein = 'EIN must be in format XX-XXXXXXX'
  }
  
  if (!data.company_website?.trim()) {
    errors.company_website = 'Company website is required'
  } else if (!validateWebsite(data.company_website)) {
    errors.company_website = 'Please enter a valid website URL'
  }
  
  if (!data.address_street?.trim()) {
    errors.address_street = 'Street address is required'
  }
  
  if (!data.address_city?.trim()) {
    errors.address_city = 'City is required'
  }
  
  if (!data.address_state?.trim()) {
    errors.address_state = 'State is required'
  } else if (data.address_state.length !== 2) {
    errors.address_state = 'State must be 2-letter code (e.g., CA)'
  }
  
  if (!data.address_postal_code?.trim()) {
    errors.address_postal_code = 'ZIP code is required'
  } else if (!validateZipCode(data.address_postal_code)) {
    errors.address_postal_code = 'Please enter a valid ZIP code'
  }
  
  if (!data.industry?.trim()) {
    errors.industry = 'Industry is required'
  }
  
  if (!data.vertical_type?.trim()) {
    errors.vertical_type = 'Vertical type is required'
  }
  
  if (!data.legal_form?.trim()) {
    errors.legal_form = 'Legal form is required'
  }
  
  // Contact information
  if (!data.contact_first_name?.trim()) {
    errors.contact_first_name = 'Contact first name is required'
  }
  
  if (!data.contact_last_name?.trim()) {
    errors.contact_last_name = 'Contact last name is required'
  }
  
  if (!data.contact_email?.trim()) {
    errors.contact_email = 'Contact email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact_email)) {
    errors.contact_email = 'Please enter a valid email address'
  }
  
  if (!data.contact_phone?.trim()) {
    errors.contact_phone = 'Contact phone is required'
  } else if (!validateTCRPhoneNumber(data.contact_phone)) {
    errors.contact_phone = 'Please enter a valid US phone number'
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Validates campaign data for TCR submission
 */
export interface TCRCampaignValidationResult {
  valid: boolean
  errors: Record<string, string>
  warnings: string[]
}

export function validateTCRCampaignData(data: any): TCRCampaignValidationResult {
  const errors: Record<string, string> = {}
  const warnings: string[] = []
  
  // Required fields
  if (!data.campaign_name?.trim()) {
    errors.campaign_name = 'Campaign name is required'
  }
  
  if (!data.description?.trim()) {
    errors.description = 'Campaign description is required'
  } else if (data.description.trim().length < 40) {
    errors.description = 'Description must be at least 40 characters'
  }
  
  if (!data.message_flow?.trim()) {
    errors.message_flow = 'Message flow description is required'
  }
  
  if (!data.use_case?.trim()) {
    errors.use_case = 'Use case is required'
  }
  
  if (!data.call_to_action?.trim()) {
    errors.call_to_action = 'Call to action is required'
  } else {
    const ctaValidation = validateCallToAction(data.call_to_action)
    if (!ctaValidation.valid) {
      errors.call_to_action = ctaValidation.error!
    }
  }
  
  // Sample messages
  const validSamples = data.sample_messages?.filter((msg: string) => msg?.trim())
  if (!validSamples || validSamples.length === 0) {
    errors.sample_messages = 'At least one sample message is required'
  } else if (validSamples.length > 5) {
    errors.sample_messages = 'Maximum 5 sample messages allowed'
  }
  
  // Compliance messages
  if (!data.opt_in_message?.trim()) {
    errors.opt_in_message = 'Opt-in message is required'
  }
  
  if (!data.opt_out_message?.trim()) {
    errors.opt_out_message = 'Opt-out message is required'
  }
  
  if (!data.help_message?.trim()) {
    errors.help_message = 'Help message is required'
  }
  
  // Warnings for special use cases
  if (data.direct_lending) {
    warnings.push('Direct lending campaigns require additional compliance review')
  }
  
  if (data.age_gated) {
    warnings.push('Age-gated content requires age verification process')
  }
  
  if (data.affiliate_marketing) {
    warnings.push('Affiliate marketing campaigns have stricter approval requirements')
  }
  
  if (data.monthly_volume > 100000) {
    warnings.push('High-volume campaigns may require additional vetting')
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors,
    warnings
  }
}

/**
 * Check if all required TCR fields are present for API submission
 */
export function hasAllTCRFields(brandData: any, campaignData: any): boolean {
  const brandValidation = validateTCRBrandData(brandData)
  const campaignValidation = validateTCRCampaignData(campaignData)
  
  return brandValidation.valid && campaignValidation.valid
}