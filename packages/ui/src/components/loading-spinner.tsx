import React from "react";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: string;
  fullScreen?: boolean;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className = "",
  size = "md",
  color = "border-orange-500",
  fullScreen = true,
  message = "Loading..."
}) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-12 w-12", 
    lg: "h-16 w-16"
  };

  const spinner = (
    <div className="text-center">
      <div className={`animate-spin rounded-full border-b-2 ${color} mx-auto mb-4 ${sizeClasses[size]} ${className}`}></div>
      {message && <p className="text-gray-400 text-sm">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
