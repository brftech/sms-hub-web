export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '')
  
  // Add country code if missing
  if (digits.length === 10) {
    const formatted = `+1${digits}`
    return formatted.replace(/(\+1)(\d{3})(\d{3})(\d{4})/, '$1 ($2) $3-$4')
  }
  
  if (digits.length === 11 && digits.startsWith('1')) {
    const formatted = `+${digits}`
    return formatted.replace(/(\+1)(\d{3})(\d{3})(\d{4})/, '$1 ($2) $3-$4')
  }
  
  return phone // Return as-is if can't format
}

export const validatePhoneNumber = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, '')
  return digits.length === 10 || (digits.length === 11 && digits.startsWith('1'))
}

export const normalizePhoneNumber = (phone: string): string => {
  const digits = phone.replace(/\D/g, '')
  
  if (digits.length === 10) {
    return `+1${digits}`
  }
  
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`
  }
  
  return phone
}

export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const maskPhoneNumber = (phone: string): string => {
  const formatted = formatPhoneNumber(phone)
  if (formatted.includes('(') && formatted.includes(')')) {
    return formatted.replace(/\d(?=\d{4})/g, '*')
  }
  return phone.replace(/\d(?=\d{4})/g, '*')
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '')
}

export const generateAccountNumber = (hubName: string, isCompany: boolean = false): string => {
  const prefix = isCompany ? `c${getHubPrefix(hubName)}` : getHubPrefix(hubName)
  const randomNumber = Math.floor(Math.random() * 999999) + 1
  return `${prefix}_${randomNumber.toString().padStart(6, '0')}`
}

const getHubPrefix = (hubName: string): string => {
  switch (hubName.toLowerCase()) {
    case 'percytech': return 'PT'
    case 'gnymble': return 'GN'
    case 'percymd': return 'PM'
    case 'percytext': return 'PX'
    default: return 'UN'
  }
}