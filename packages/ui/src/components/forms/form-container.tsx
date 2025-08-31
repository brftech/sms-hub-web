import React from "react";
import { Button } from "../button";
import { cn } from "../../lib/utils";

interface FormContainerProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  submitText?: string;
  submitLoading?: boolean;
  submitDisabled?: boolean;
  className?: string;
  buttonClassName?: string;
  showSubmitButton?: boolean;
}

export const FormContainerComponent: React.FC<FormContainerProps> = ({
  children,
  onSubmit,
  submitText = "Submit",
  submitLoading = false,
  submitDisabled = false,
  className,
  buttonClassName,
  showSubmitButton = true,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit && !submitLoading && !submitDisabled) {
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      {children}

      {showSubmitButton && (
        <Button
          type="submit"
          disabled={submitDisabled || submitLoading}
          className={cn("w-full", buttonClassName)}
        >
          {submitLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Processing...
            </>
          ) : (
            submitText
          )}
        </Button>
      )}
    </form>
  );
};
