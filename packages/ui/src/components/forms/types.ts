/**
 * Form Builder Type Definitions
 */

import { CustomValidator } from './validators';

export type FieldType = 
  | 'text' 
  | 'email' 
  | 'password' 
  | 'tel' 
  | 'url' 
  | 'number' 
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'textarea' 
  | 'select' 
  | 'checkbox' 
  | 'radio'
  | 'phone';

export interface ValidationRule {
  type: 'required' | 'email' | 'phone' | 'url' | 'number' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  message?: string;
  value?: string | number | RegExp;
  validator?: CustomValidator;
}

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface FormField {
  name: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  defaultValue?: unknown;
  validation?: ValidationRule[];
  optional?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  helpText?: string;
  className?: string;
  
  // Select/Radio specific
  options?: SelectOption[];
  
  // Textarea specific
  rows?: number;
  
  // Number specific
  min?: number;
  max?: number;
  step?: number;
  
  // Conditional rendering
  showIf?: (formData: Record<string, unknown>) => boolean;
  
  // Hub-specific
  hubAware?: boolean;
}

export interface FormBuilderProps {
  fields: FormField[];
  onSubmit: (data: Record<string, unknown>) => Promise<{ success: boolean; error?: string }>;
  submitButtonText?: string;
  submitButtonClass?: string;
  successMessage?: string;
  errorMessage?: string;
  includeTurnstile?: boolean;
  turnstileSiteKey?: string;
  layout?: 'single-column' | 'two-column';
  hubId?: number;
  loading?: boolean;
  
  // Multi-step forms
  steps?: FormField[][];
  showProgressBar?: boolean;
  
  // Callbacks
  onChange?: (name: string, value: unknown) => void;
  onError?: (error: Error, formData: Record<string, unknown>) => void;
  onSuccess?: (data: Record<string, unknown>) => void;
}

export interface FormFieldProps {
  field: FormField;
  value: unknown;
  error?: string;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  disabled?: boolean;
  className?: string;
}

export interface FormData {
  [key: string]: unknown;
}

export interface FormErrors {
  [key: string]: string;
}

export interface FormState {
  data: FormData;
  errors: FormErrors;
  isSubmitting: boolean;
  isValid: boolean;
  touched: Record<string, boolean>;
}

