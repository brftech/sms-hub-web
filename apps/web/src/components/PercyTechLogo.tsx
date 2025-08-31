import React from "react";
import { cn } from "@/lib/utils";
import percytechTextLogo from "@/assets/percytech-text-logo.svg";
import percytechIconLogo from "@/assets/percytech-icon-logo.svg";

interface PercyTechLogoProps {
  size?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl";
  className?: string;
  variant?:
    | "default"
    | "white"
    | "gradient"
    | "text"
    | "text-logo"
    | "icon-logo";
  style?: React.CSSProperties;
}

const PercyTechLogo: React.FC<PercyTechLogoProps> = ({
  size = "md",
  className,
  variant = "default",
}) => {
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-4xl",
    "4xl": "text-6xl",
    "5xl": "text-7xl",
    "6xl": "text-8xl",
    "7xl": "text-9xl",
  };

  const variantClasses = {
    default: "text-white",
    white: "text-white",
    gradient:
      "bg-gradient-to-r from-red-800 to-blue-600 bg-clip-text text-transparent",
    text: "text-red-800",
    "text-logo": "",
    "icon-logo": "",
  };

  // If using text-logo variant, render the full "percytech" SVG
  if (variant === "text-logo") {
    return (
      <img
        src={percytechTextLogo}
        alt="PercyTech"
        className={cn("h-auto", className)}
        style={{
          backgroundColor: "transparent",
          width:
            size === "xs"
              ? "80px"
              : size === "sm"
              ? "100px"
              : size === "md"
              ? "120px"
              : size === "lg"
              ? "140px"
              : size === "xl"
              ? "160px"
              : size === "2xl"
              ? "180px"
              : size === "3xl"
              ? "200px"
              : size === "4xl"
              ? "220px"
              : size === "5xl"
              ? "300px"
              : size === "6xl"
              ? "400px"
              : "500px",
        }}
      />
    );
  }

  // If using icon-logo variant, render the "PT" icon SVG
  if (variant === "icon-logo") {
    return (
      <img
        src={percytechIconLogo}
        alt="PercyTech"
        className={cn("h-auto", className)}
        style={{
          backgroundColor: "transparent",
          width:
            size === "xs"
              ? "20px"
              : size === "sm"
              ? "24px"
              : size === "md"
              ? "32px"
              : size === "lg"
              ? "40px"
              : size === "xl"
              ? "48px"
              : size === "2xl"
              ? "56px"
              : size === "3xl"
              ? "64px"
              : size === "4xl"
              ? "72px"
              : size === "5xl"
              ? "100px"
              : size === "6xl"
              ? "140px"
              : "180px",
        }}
      />
    );
  }

  // Default: render the "PT" text with CSS styling
  return (
    <span
      className={cn(
        "font-bold tracking-wide",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      PT
    </span>
  );
};

export default PercyTechLogo;
