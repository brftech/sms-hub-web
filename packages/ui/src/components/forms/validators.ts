/**
 * Form Validation Utilities
 * 
 * Reusable validation functions for form fields.
 * Can be used standalone or with react-hook-form.
 */

export type ValidationResult = {
  isValid: boolean;
  error?: string;
};

/**
 * Required field validator
 */
export function validateRequired(value: unknown, message = 'This field is required'): ValidationResult {
  if (value === null || value === undefined) {
    return { isValid: false, error: message };
  }

  if (typeof value === 'string' && value.trim().length === 0) {
    return { isValid: false, error: message };
  }

  if (Array.isArray(value) && value.length === 0) {
    return { isValid: false, error: message };
  }

  return { isValid: true };
}

/**
 * Email validator
 */
export function validateEmail(email: string, message = 'Please enter a valid email address'): ValidationResult {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: message };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: message };
  }

  return { isValid: true };
}

/**
 * Phone number validator (US format)
 */
export function validatePhone(phone: string, message = 'Please enter a valid phone number'): ValidationResult {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, error: message };
  }

  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');

  // Check if it's a valid US phone number (10 or 11 digits)
  if (digitsOnly.length < 10 || digitsOnly.length > 11) {
    return { isValid: false, error: message };
  }

  // If 11 digits, first digit should be 1
  if (digitsOnly.length === 11 && digitsOnly[0] !== '1') {
    return { isValid: false, error: message };
  }

  return { isValid: true };
}

/**
 * Minimum length validator
 */
export function validateMinLength(
  value: string,
  minLength: number,
  message?: string
): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { isValid: false, error: message || `Minimum length is ${minLength} characters` };
  }

  if (value.trim().length < minLength) {
    return {
      isValid: false,
      error: message || `Minimum length is ${minLength} characters`,
    };
  }

  return { isValid: true };
}

/**
 * Maximum length validator
 */
export function validateMaxLength(
  value: string,
  maxLength: number,
  message?: string
): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { isValid: true }; // Not an error if empty (use validateRequired separately)
  }

  if (value.length > maxLength) {
    return {
      isValid: false,
      error: message || `Maximum length is ${maxLength} characters`,
    };
  }

  return { isValid: true };
}

/**
 * Pattern (regex) validator
 */
export function validatePattern(
  value: string,
  pattern: RegExp,
  message = 'Invalid format'
): ValidationResult {
  if (!value || typeof value !== 'string') {
    return { isValid: false, error: message };
  }

  if (!pattern.test(value)) {
    return { isValid: false, error: message };
  }

  return { isValid: true };
}

/**
 * URL validator
 */
export function validateURL(url: string, message = 'Please enter a valid URL'): ValidationResult {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: message };
  }

  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, error: message };
  }
}

/**
 * Number validator
 */
export function validateNumber(
  value: unknown,
  message = 'Please enter a valid number'
): ValidationResult {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: message };
  }

  const num = Number(value);
  
  if (isNaN(num)) {
    return { isValid: false, error: message };
  }

  return { isValid: true };
}

/**
 * Number range validator
 */
export function validateNumberRange(
  value: number,
  min: number,
  max: number,
  message?: string
): ValidationResult {
  const numberResult = validateNumber(value);
  if (!numberResult.isValid) {
    return numberResult;
  }

  const num = Number(value);

  if (num < min || num > max) {
    return {
      isValid: false,
      error: message || `Value must be between ${min} and ${max}`,
    };
  }

  return { isValid: true };
}

/**
 * Date validator
 */
export function validateDate(date: unknown, message = 'Please enter a valid date'): ValidationResult {
  if (!date) {
    return { isValid: false, error: message };
  }

  const dateObj = new Date(date as string);
  
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: message };
  }

  return { isValid: true };
}

/**
 * Date range validator
 */
export function validateDateRange(
  date: string,
  minDate: Date,
  maxDate: Date,
  message?: string
): ValidationResult {
  const dateResult = validateDate(date);
  if (!dateResult.isValid) {
    return dateResult;
  }

  const dateObj = new Date(date);

  if (dateObj < minDate || dateObj > maxDate) {
    return {
      isValid: false,
      error:
        message ||
        `Date must be between ${minDate.toLocaleDateString()} and ${maxDate.toLocaleDateString()}`,
    };
  }

  return { isValid: true };
}

/**
 * Checkbox validator (at least one must be checked)
 */
export function validateCheckboxGroup(
  values: unknown[],
  message = 'Please select at least one option'
): ValidationResult {
  if (!Array.isArray(values) || values.length === 0) {
    return { isValid: false, error: message };
  }

  const checked = values.filter((v) => v === true || v === 'true');
  
  if (checked.length === 0) {
    return { isValid: false, error: message };
  }

  return { isValid: true };
}

/**
 * Password strength validator
 */
export function validatePasswordStrength(
  password: string,
  requirements = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecial: false,
  }
): ValidationResult {
  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < requirements.minLength) {
    return {
      isValid: false,
      error: `Password must be at least ${requirements.minLength} characters`,
    };
  }

  if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one uppercase letter',
    };
  }

  if (requirements.requireLowercase && !/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one lowercase letter',
    };
  }

  if (requirements.requireNumber && !/\d/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one number',
    };
  }

  if (requirements.requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one special character',
    };
  }

  return { isValid: true };
}

/**
 * Password confirmation validator
 */
export function validatePasswordMatch(
  password: string,
  confirmation: string,
  message = 'Passwords do not match'
): ValidationResult {
  if (password !== confirmation) {
    return { isValid: false, error: message };
  }

  return { isValid: true };
}

/**
 * Custom validator function type
 */
export type CustomValidator = (value: unknown) => ValidationResult | Promise<ValidationResult>;

/**
 * Compose multiple validators
 */
export async function composeValidators(
  value: unknown,
  validators: CustomValidator[]
): Promise<ValidationResult> {
  for (const validator of validators) {
    const result = await validator(value);
    if (!result.isValid) {
      return result;
    }
  }

  return { isValid: true };
}

/**
 * Hub-specific validators
 */

/**
 * PercyMD-specific validation (medical license, NPI number, etc.)
 */
export function validateMedicalLicense(
  license: string,
  message = 'Please enter a valid medical license number'
): ValidationResult {
  if (!license || typeof license !== 'string') {
    return { isValid: false, error: message };
  }

  // Basic validation - at least 6 alphanumeric characters
  if (!/^[A-Z0-9]{6,}$/i.test(license.replace(/[-\s]/g, ''))) {
    return { isValid: false, error: message };
  }

  return { isValid: true };
}

/**
 * Gnymble-specific validation (business license for age-restricted products)
 */
export function validateBusinessLicense(
  license: string,
  message = 'Please enter a valid business license number'
): ValidationResult {
  if (!license || typeof license !== 'string') {
    return { isValid: false, error: message };
  }

  // Basic validation - alphanumeric with optional dashes
  if (!/^[A-Z0-9-]{5,}$/i.test(license)) {
    return { isValid: false, error: message };
  }

  return { isValid: true };
}

/**
 * Company name validator (general)
 */
export function validateCompanyName(
  name: string,
  message = 'Please enter a valid company name'
): ValidationResult {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: message };
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: 'Company name must be at least 2 characters' };
  }

  return { isValid: true };
}

