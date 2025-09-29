import React from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import styled from "styled-components";

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: "default" | "info" | "view" | "edit" | "delete" | "warning";
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const ModalHeaderWrapper = styled.div<{ $variant: string }>`
  background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
  padding: 1.5rem 1.75rem;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.05));
    pointer-events: none;
  }
`;

const variantStyles = {
  default: {
    icon: "bg-white/10 backdrop-blur-sm border border-white/20",
  },
  info: {
    icon: "bg-white/10 backdrop-blur-sm border border-white/20",
  },
  view: {
    icon: "bg-white/10 backdrop-blur-sm border border-white/20",
  },
  edit: {
    icon: "bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30",
  },
  delete: {
    icon: "bg-red-500/20 backdrop-blur-sm border border-red-500/30",
  },
  warning: {
    icon: "bg-amber-500/20 backdrop-blur-sm border border-amber-500/30",
  },
};

const sizeStyles = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-3xl",
  xl: "max-w-4xl",
};

export const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  variant = "default",
  size = "md",
  children,
  footer,
  className,
}) => {
  if (!isOpen) return null;

  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className={cn(
          "relative w-full bg-white rounded-xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300",
          "shadow-2xl flex flex-col",
          size === 'sm' ? "max-h-[400px]" : "h-[600px]",
          sizeStyle,
          className
        )}
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
        }}
      >
        {/* Header */}
        <ModalHeaderWrapper $variant={variant} className="text-white">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-4">
              {icon && (
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shadow-lg", variantStyle.icon)}>
                  {icon}
                </div>
              )}
              <div>
                <h3 className="text-xl font-semibold text-white">{title}</h3>
                {subtitle && (
                  <p className="text-white/70 text-sm mt-1">{subtitle}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-all p-2.5 hover:bg-white/10 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </ModalHeaderWrapper>

        {/* Content */}
        <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="bg-white px-6 py-4 border-t border-gray-200 mt-auto">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// Modal Section Components
export const ModalSection: React.FC<{
  title?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className }) => (
  <div className={cn("space-y-4", className)}>
    {title && (
      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">
        {title}
      </h4>
    )}
    {children}
  </div>
);

export const ModalFormLayout: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn("grid grid-cols-2 gap-6", className)}>
    {children}
  </div>
);

export const ModalFormColumn: React.FC<{
  children: React.ReactNode;
  span?: 1 | 2;
  className?: string;
}> = ({ children, span = 1, className }) => (
  <div className={cn(span === 2 ? "col-span-2" : "col-span-1", "space-y-4", className)}>
    {children}
  </div>
);

export const ModalStepIndicator: React.FC<{
  currentStep: number;
  totalSteps: number;
  className?: string;
}> = ({ currentStep, totalSteps, className }) => (
  <div className={cn("flex items-center justify-center space-x-2 mb-6", className)}>
    {Array.from({ length: totalSteps }, (_, i) => (
      <div
        key={i}
        className={cn(
          "h-2 rounded-full transition-all duration-300",
          i === currentStep
            ? "w-8 bg-gray-900"
            : i < currentStep
            ? "w-2 bg-gray-600"
            : "w-2 bg-gray-300"
        )}
      />
    ))}
  </div>
);

export const ModalField: React.FC<{
  label: string;
  value?: string | React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}> = ({ label, value, children, className }) => (
  <div className={cn("space-y-1.5", className)}>
    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
      {label}
    </label>
    {children || (
      <p className="text-sm text-gray-900 font-mono bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-2.5 rounded-lg border border-gray-200">
        {value || "—"}
      </p>
    )}
  </div>
);

export const ModalButtonGroup: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn("flex justify-end space-x-3", className)}>
    {children}
  </div>
);

const StyledModalButton = styled.button<{ $variant: string; $disabled: boolean }>`
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  border: 1px solid transparent;
  
  ${({ $variant }) => {
    switch ($variant) {
      case "primary":
        return `
          background: #1a1a1a;
          color: white;
          border-color: #333;
          
          &:hover:not(:disabled) {
            background: #2d2d2d;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          }
        `;
      case "secondary":
        return `
          background: white;
          color: #1a1a1a;
          border-color: #e5e7eb;
          
          &:hover:not(:disabled) {
            background: #f9fafb;
            border-color: #d1d5db;
          }
        `;
      case "danger":
        return `
          background: #dc2626;
          color: white;
          border-color: #b91c1c;
          
          &:hover:not(:disabled) {
            background: #b91c1c;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
          }
        `;
      case "warning":
        return `
          background: #d97706;
          color: white;
          border-color: #b45309;
          
          &:hover:not(:disabled) {
            background: #b45309;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
          }
        `;
      default:
        return "";
    }
  }}
`;

export const ModalButton: React.FC<{
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger" | "warning";
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
}> = ({ 
  onClick, 
  variant = "primary", 
  disabled = false, 
  loading = false, 
  children, 
  className 
}) => {
  return (
    <StyledModalButton
      onClick={onClick}
      disabled={disabled || loading}
      $variant={variant}
      $disabled={disabled || loading}
      className={className}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </StyledModalButton>
  );
};
