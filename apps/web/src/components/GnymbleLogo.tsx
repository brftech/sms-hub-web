import React from "react";
import { cn } from "@/lib/utils";
import gnymbleTextLogo from "@/assets/gnymble-text-logo.svg";
import gnymbleIconOnly from "@/assets/gnymble-icon-logo.svg";

interface GnymbleLogoProps {
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
  variant?: "default" | "white" | "gradient" | "icon" | "text-icon";
  style?: React.CSSProperties;
}

const GnymbleLogo: React.FC<GnymbleLogoProps> = ({
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
      "bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent",
    icon: "",
    "text-icon": "",
  };

  // If using icon variant, render the 'gn' icon SVG
  if (variant === "icon") {
    return (
      <img
        src={gnymbleIconOnly}
        alt="Gnymble"
        className={cn("h-auto", className)}
        style={{
          backgroundColor: "transparent",
          width:
            size === "xs"
              ? "16px"
              : size === "sm"
              ? "20px"
              : size === "md"
              ? "24px"
              : size === "lg"
              ? "32px"
              : size === "xl"
              ? "40px"
              : size === "2xl"
              ? "48px"
              : size === "3xl"
              ? "64px"
              : "80px",
        }}
      />
    );
  }

  // If using text-icon variant, render the 'gn' text-icon SVG
  if (variant === "text-icon") {
    return (
      <img
        src={gnymbleTextLogo}
        alt="Gnymble"
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

  // Default: render the full text logo SVG
  return (
    <img
      src={gnymbleTextLogo}
      alt="Gnymble"
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
};

export default GnymbleLogo;
