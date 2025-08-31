import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FormContainerProps {
  title: React.ReactNode;
  subtitle?: string;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  submitText: string;
  isSubmitting?: boolean;
  className?: string;
}

const FormContainer: React.FC<FormContainerProps> = ({
  title,
  subtitle,
  onSubmit,
  children,
  submitText,
  isSubmitting = false,
  className,
}) => {
  return (
    <div className={cn("max-w-md mx-auto", className)}>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
        {subtitle && <p className="text-white/70 text-lg">{subtitle}</p>}
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {children}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            submitText
          )}
        </Button>
      </form>
    </div>
  );
};

export default FormContainer;
