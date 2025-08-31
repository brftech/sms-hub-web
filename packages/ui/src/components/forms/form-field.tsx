import React from "react";
import { Input } from "../input";
import { Label } from "../label";
import { Textarea } from "../textarea";
import { cn } from "../../lib/utils";

interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "tel" | "password" | "textarea" | "number";
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  rows?: number;
  min?: number;
  max?: number;
}

export const FormFieldComponent: React.FC<FormFieldProps> = ({
  label,
  name,
  type = "text",
  placeholder,
  value = "",
  onChange,
  error,
  required = false,
  disabled = false,
  className,
  rows = 3,
  min,
  max,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const fieldId = `field-${name}`;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={fieldId} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {type === "textarea" ? (
        <Textarea
          id={fieldId}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          required={required}
          disabled={disabled}
          rows={rows}
          className={cn(
            error && "border-red-500 focus:border-red-500 focus:ring-red-500"
          )}
        />
      ) : (
        <Input
          id={fieldId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          className={cn(
            error && "border-red-500 focus:border-red-500 focus:ring-red-500"
          )}
        />
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
