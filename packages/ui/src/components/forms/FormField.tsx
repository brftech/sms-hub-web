/**
 * FormField Component - Accessible form field with label, input, error, and help text
 */

import React from 'react';
import { FormFieldProps } from './types';
import { Input } from '../input';
import { Label } from '../label';
import { Textarea } from '../textarea';

export const FormField: React.FC<FormFieldProps> = ({
  field,
  value,
  error,
  onChange,
  onBlur,
  disabled,
  className = '',
}) => {
  const fieldId = `field-${field.name}`;
  const errorId = `${fieldId}-error`;
  const helpId = `${fieldId}-help`;
  const hasError = !!error;
  const isRequired = !field.optional && field.validation?.some(v => v.type === 'required');

  // Generate aria-describedby
  const ariaDescribedBy = [
    hasError ? errorId : null,
    field.helpText ? helpId : null,
  ].filter(Boolean).join(' ') || undefined;

  const commonProps = {
    id: fieldId,
    name: field.name,
    disabled: disabled || field.disabled,
    readOnly: field.readOnly,
    'aria-invalid': hasError,
    'aria-describedby': ariaDescribedBy,
    'aria-required': isRequired,
    autoComplete: field.autoComplete,
    className: `${hasError ? 'border-red-500 focus:border-red-500' : ''} ${field.className || ''}`,
  };

  const renderInput = () => {
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            value={value as string || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={field.placeholder}
            rows={field.rows || 4}
          />
        );

      case 'select':
        return (
          <select
            {...commonProps}
            value={value as string || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            className={`w-full px-4 py-3 bg-zinc-900 border ${
              hasError ? 'border-red-500' : 'border-zinc-700'
            } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              field.className || ''
            }`}
          >
            <option value="">{field.placeholder || 'Select an option'}</option>
            {field.options?.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              {...commonProps}
              type="checkbox"
              checked={value as boolean || false}
              onChange={(e) => onChange(e.target.checked)}
              onBlur={onBlur}
              className={`w-4 h-4 text-orange-500 bg-zinc-900 border-zinc-700 rounded focus:ring-2 focus:ring-orange-500 ${
                field.className || ''
              }`}
            />
            <Label htmlFor={fieldId} className="ml-2 text-white">
              {field.label}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  id={`${fieldId}-${option.value}`}
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(e.target.value)}
                  onBlur={onBlur}
                  disabled={disabled || field.disabled || option.disabled}
                  aria-invalid={hasError}
                  aria-describedby={ariaDescribedBy}
                  className="w-4 h-4 text-orange-500 bg-zinc-900 border-zinc-700 focus:ring-2 focus:ring-orange-500"
                />
                <label
                  htmlFor={`${fieldId}-${option.value}`}
                  className="ml-2 text-white"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      case 'phone':
        return (
          <Input
            {...commonProps}
            type="tel"
            value={value as string || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={field.placeholder || '(555) 123-4567'}
          />
        );

      case 'number':
        return (
          <Input
            {...commonProps}
            type="number"
            value={value as string || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={field.step}
          />
        );

      case 'date':
      case 'time':
      case 'datetime-local':
        return (
          <Input
            {...commonProps}
            type={field.type}
            value={value as string || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            min={field.min !== undefined ? String(field.min) : undefined}
            max={field.max !== undefined ? String(field.max) : undefined}
          />
        );

      default:
        // text, email, password, url
        return (
          <Input
            {...commonProps}
            type={field.type}
            value={value as string || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={field.placeholder}
          />
        );
    }
  };

  // For checkbox, label is rendered inline
  if (field.type === 'checkbox') {
    return (
      <div className={`mb-6 ${className}`}>
        {renderInput()}
        {field.helpText && (
          <p id={helpId} className="text-sm text-zinc-400 mt-2 ml-6">
            {field.helpText}
          </p>
        )}
        {hasError && (
          <p
            id={errorId}
            className="text-sm text-red-500 mt-2 ml-6"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
      </div>
    );
  }

  // Standard field layout
  return (
    <div className={`mb-6 ${className}`}>
      {/* Label */}
      {field.type !== 'radio' && (
        <Label htmlFor={fieldId} className="block text-white mb-2">
          {field.label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
          {field.optional && (
            <span className="text-zinc-500 text-sm ml-2">(optional)</span>
          )}
        </Label>
      )}

      {/* Radio group label */}
      {field.type === 'radio' && (
        <div className="mb-2">
          <span className="text-white font-medium">
            {field.label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </span>
        </div>
      )}

      {/* Input */}
      {renderInput()}

      {/* Help Text */}
      {field.helpText && (
        <p id={helpId} className="text-sm text-zinc-400 mt-2">
          {field.helpText}
        </p>
      )}

      {/* Error Message */}
      {hasError && (
        <p
          id={errorId}
          className="text-sm text-red-500 mt-2"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;

