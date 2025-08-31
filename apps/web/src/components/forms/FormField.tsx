import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "password" | "tel" | "textarea";
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  error?: string;
  className?: string;
  disabled?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  autoComplete,
  value,
  onChange,
  error,
  className,
  disabled = false,
}) => {
  const inputId = `form-field-${name}`;

  return (
    <div className={cn("space-y-1", className)}>
      <Label htmlFor={inputId} className="text-sm font-medium text-white/90">
        {label}
        {required && <span className="text-orange-500 ml-1">*</span>}
      </Label>

      {type === "textarea" ? (
        <Textarea
          id={inputId}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          disabled={disabled}
          required={required}
          className={cn(
            "min-h-[100px] resize-none",
            error && "border-red-500 focus-visible:ring-red-500"
          )}
        />
      ) : (
        <Input
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          disabled={disabled}
          required={required}
          className={cn(error && "border-red-500 focus-visible:ring-red-500")}
        />
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
};

export default FormField;
