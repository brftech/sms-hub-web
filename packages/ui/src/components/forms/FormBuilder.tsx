/**
 * FormBuilder Component - Schema-driven form generator
 *
 * Features:
 * - Schema-driven form generation
 * - Built-in validation
 * - Accessibility out of the box
 * - Hub-aware styling
 * - Turnstile integration
 * - Multi-step forms (optional)
 * - Performance tracking
 */

import React, { useState, useCallback, useMemo } from "react";
import { FormBuilderProps, FormData, FormErrors, FormField as FormFieldType } from "./types";
import { FormField } from "./FormField";
import {
  validateRequired,
  validateEmail,
  validatePhone,
  validateURL,
  validateNumber,
  validateMinLength,
  validateMaxLength,
  validatePattern,
} from "./validators";

export const FormBuilder: React.FC<FormBuilderProps> = ({
  fields,
  onSubmit,
  submitButtonText = "Submit",
  submitButtonClass,
  successMessage,
  errorMessage,
  includeTurnstile = false,
  turnstileSiteKey,
  layout = "single-column",
  loading = false,
  beforeSubmitButton,
  onChange,
  onError,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<FormData>(() => {
    const initial: FormData = {};
    fields.forEach((field) => {
      initial[field.name] = field.defaultValue ?? "";
    });
    return initial;
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>("");

  /**
   * Validate a single field
   */
  const validateField = useCallback(
    async (field: FormFieldType, value: unknown): Promise<string | null> => {
      if (!field.validation || field.validation.length === 0) {
        return null;
      }

      // Skip validation if field is optional and empty
      if (field.optional && !value) {
        return null;
      }

      for (const rule of field.validation) {
        let result;

        switch (rule.type) {
          case "required":
            result = validateRequired(value, rule.message);
            break;

          case "email":
            result = validateEmail(value as string, rule.message);
            break;

          case "phone":
            result = validatePhone(value as string, rule.message);
            break;

          case "url":
            result = validateURL(value as string, rule.message);
            break;

          case "number":
            result = validateNumber(value, rule.message);
            break;

          case "minLength":
            result = validateMinLength(value as string, rule.value as number, rule.message);
            break;

          case "maxLength":
            result = validateMaxLength(value as string, rule.value as number, rule.message);
            break;

          case "pattern":
            result = validatePattern(value as string, rule.value as RegExp, rule.message);
            break;

          case "custom":
            if (rule.validator) {
              result = await rule.validator(value);
            }
            break;

          default:
            continue;
        }

        if (result && !result.isValid) {
          return result.error || "Validation error";
        }
      }

      return null;
    },
    []
  );

  /**
   * Validate all fields
   */
  const validateForm = useCallback(async (): Promise<{ isValid: boolean; errors: FormErrors }> => {
    const newErrors: FormErrors = {};

    for (const field of fields) {
      // Skip conditional fields that aren't shown
      if (field.showIf && !field.showIf(formData)) {
        continue;
      }

      const error = await validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    }

    setErrors(newErrors);
    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors,
    };
  }, [fields, formData, validateField]);

  /**
   * Handle field change
   */
  const handleFieldChange = useCallback(
    (name: string, value: unknown) => {
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }

      // Call onChange callback
      if (onChange) {
        onChange(name, value);
      }
    },
    [errors, onChange]
  );

  /**
   * Handle field blur (validate on blur)
   */
  const handleFieldBlur = useCallback(
    async (name: string) => {
      setTouched((prev) => ({ ...prev, [name]: true }));

      const field = fields.find((f) => f.name === name);
      if (!field) return;

      const error = await validateField(field, formData[name]);
      if (error) {
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [fields, formData, validateField]
  );

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate Turnstile if required
      if (includeTurnstile && !turnstileToken) {
        setSubmitError("Please complete the security check");
        return;
      }

      // Validate form
      const validation = await validateForm();
      if (!validation.isValid) {
        // Create helpful error message listing missing fields
        const errorFieldNames = Object.keys(validation.errors).map((fieldName) => {
          const field = fields.find((f) => f.name === fieldName);
          return field?.label || fieldName;
        });

        const errorMessage =
          errorFieldNames.length === 1
            ? `Please complete the ${errorFieldNames[0]} field`
            : `Please complete these fields: ${errorFieldNames.join(", ")}`;

        setSubmitError(errorMessage);

        // Scroll to first error field
        const firstErrorFieldName = Object.keys(validation.errors)[0];
        if (firstErrorFieldName) {
          // Use setTimeout to ensure DOM is updated with errors
          setTimeout(() => {
            const fieldElement = document.getElementById(`field-${firstErrorFieldName}`);
            if (fieldElement) {
              fieldElement.scrollIntoView({ behavior: "smooth", block: "center" });
              fieldElement.focus();
            }
          }, 100);
        }

        return;
      }

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        // Add turnstile token if included
        const submissionData = includeTurnstile ? { ...formData, turnstileToken } : formData;

        const result = await onSubmit(submissionData);

        if (result.success) {
          setSubmitSuccess(true);
          setSubmitError(null);

          // Reset form
          const resetData: FormData = {};
          fields.forEach((field) => {
            resetData[field.name] = field.defaultValue ?? "";
          });
          setFormData(resetData);
          setTouched({});
          setErrors({});

          // Call success callback
          if (onSuccess) {
            onSuccess(submissionData);
          }

          // Auto-hide success message after 5 seconds
          setTimeout(() => setSubmitSuccess(false), 5000);
        } else {
          setSubmitError(result.error || errorMessage || "Submission failed");
        }
      } catch (error) {
        const err = error as Error;
        setSubmitError(err.message || errorMessage || "An error occurred");

        // Call error callback
        if (onError) {
          onError(err, formData);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      formData,
      fields,
      includeTurnstile,
      turnstileToken,
      validateForm,
      onSubmit,
      onSuccess,
      onError,
      errorMessage,
    ]
  );

  /**
   * Filter visible fields based on showIf conditions
   */
  const visibleFields = useMemo(() => {
    return fields.filter((field) => {
      if (!field.showIf) return true;
      return field.showIf(formData);
    });
  }, [fields, formData]);

  /**
   * Render Turnstile widget
   */
  const renderTurnstile = () => {
    if (!includeTurnstile) return null;

    // Dynamically import CloudflareTurnstile component
    // This assumes you have the component in the same package
    return (
      <div className="mb-6">
        <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-700">
          <p className="text-sm text-zinc-400 mb-3">Security Check</p>
          {/* Placeholder for Turnstile widget */}
          <div
            className="cf-turnstile"
            data-sitekey={turnstileSiteKey || import.meta.env.VITE_TURNSTILE_SITE_KEY}
            data-callback={(token: string) => setTurnstileToken(token)}
          />
        </div>
      </div>
    );
  };

  /**
   * Render fields based on layout
   */
  const renderFields = () => {
    if (layout === "two-column") {
      // Separate full-width fields from regular fields
      const regularFields = visibleFields.filter((field) => !field.fullWidth);
      const fullWidthFields = visibleFields.filter((field) => field.fullWidth);

      // Create pairs of fields for proper alignment
      const fieldPairs: Array<[FormFieldType, FormFieldType?]> = [];
      for (let i = 0; i < regularFields.length; i += 2) {
        fieldPairs.push([regularFields[i], regularFields[i + 1]]);
      }

      return (
        <>
          {/* Render field pairs in aligned rows */}
          {fieldPairs.map((pair, index) => (
            <div key={`row-${index}`} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FormField
                field={pair[0]}
                value={formData[pair[0].name]}
                error={touched[pair[0].name] ? errors[pair[0].name] : undefined}
                onChange={(value) => handleFieldChange(pair[0].name, value)}
                onBlur={() => handleFieldBlur(pair[0].name)}
                disabled={isSubmitting || loading}
                className="!mb-0"
              />
              {pair[1] ? (
                <FormField
                  field={pair[1]}
                  value={formData[pair[1].name]}
                  error={touched[pair[1].name] ? errors[pair[1].name] : undefined}
                  onChange={(value) => pair[1] && handleFieldChange(pair[1].name, value)}
                  onBlur={() => pair[1] && handleFieldBlur(pair[1].name)}
                  disabled={isSubmitting || loading}
                  className="!mb-0"
                />
              ) : (
                <div></div>
              )}
            </div>
          ))}
          {/* Render full-width fields */}
          {fullWidthFields.map((field) => (
            <FormField
              key={field.name}
              field={field}
              value={formData[field.name]}
              error={touched[field.name] ? errors[field.name] : undefined}
              onChange={(value) => handleFieldChange(field.name, value)}
              onBlur={() => handleFieldBlur(field.name)}
              disabled={isSubmitting || loading}
            />
          ))}
        </>
      );
    }

    // Single column layout
    return visibleFields.map((field) => (
      <FormField
        key={field.name}
        field={field}
        value={formData[field.name]}
        error={touched[field.name] ? errors[field.name] : undefined}
        onChange={(value) => handleFieldChange(field.name, value)}
        onBlur={() => handleFieldBlur(field.name)}
        disabled={isSubmitting || loading}
      />
    ));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full" noValidate>
      {/* Success Message */}
      {submitSuccess && successMessage && (
        <div
          className="mb-6 p-4 bg-green-900/20 border border-green-500 rounded-lg text-green-400"
          role="alert"
          aria-live="polite"
        >
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {submitError && (
        <div
          className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400"
          role="alert"
          aria-live="polite"
        >
          {submitError}
        </div>
      )}

      {/* Form Fields */}
      {renderFields()}

      {/* Turnstile */}
      {renderTurnstile()}

      {/* Custom content before submit button */}
      {beforeSubmitButton && <div className="mt-6">{beforeSubmitButton}</div>}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || loading}
        className={
          submitButtonClass ||
          "w-full rounded-md py-3 font-semibold border-2 border-orange-500 hover:border-orange-400 text-white bg-transparent hover:bg-orange-500/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        }
      >
        {isSubmitting ? "Submitting..." : submitButtonText}
      </button>
    </form>
  );
};

export default FormBuilder;
