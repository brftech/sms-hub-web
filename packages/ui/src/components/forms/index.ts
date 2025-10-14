/**
 * Form Components - Reusable form system
 * 
 * Export all form-related components, types, and utilities
 */

// Components
export { FormBuilder } from './FormBuilder';
export { FormField } from './FormField';

// Types
export type {
  FieldType,
  ValidationRule,
  SelectOption,
  FormField as FormFieldType,
  FormBuilderProps,
  FormFieldProps,
  FormData,
  FormErrors,
  FormState,
} from './types';

// Validators
export {
  validateRequired,
  validateEmail,
  validatePhone,
  validateURL,
  validateNumber,
  validateMinLength,
  validateMaxLength,
  validatePattern,
  validateDate,
  validateDateRange,
  validateNumberRange,
  validateCheckboxGroup,
  validatePasswordStrength,
  validatePasswordMatch,
  validateMedicalLicense,
  validateBusinessLicense,
  validateCompanyName,
  composeValidators,
  type ValidationResult,
  type CustomValidator,
} from './validators';
