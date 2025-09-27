import * as React from "react";
import { HubType } from "../types";
import { cn } from "@sms-hub/utils";

// Import all logo assets
import gnymbleTextLogo from "../assets/gnymble-text-logo.svg";
import gnymbleIconLogo from "../assets/gnymble-icon-logo.svg";
import gnymbleMainLogo from "../assets/gnymble-main-logo.png";
import percytechTextLogo from "../assets/percytech-text-logo.svg";
import percytechIconLogo from "../assets/percytech-icon-logo.svg";
import percymdTextLogo from "../assets/percymd-text-logo.svg";
import percymdIconLogo from "../assets/percymd-icon-logo.svg";
import percytextTextLogo from "../assets/percytext-text-logo.svg";
import percytextIconLogo from "../assets/percytext-icon-logo.svg";

interface HubLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  hubType: HubType;
  variant?: "icon" | "text" | "full" | "main";
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "h-6 w-auto max-w-[120px]",
  md: "h-8 w-auto max-w-[160px]",
  lg: "h-12 w-auto max-w-[240px]",
  xl: "h-16 w-auto max-w-[320px]",
};

const logoMap: Record<HubType, { text: string; icon: string; main?: string }> =
  {
    gnymble: {
      text: gnymbleTextLogo,
      icon: gnymbleIconLogo,
      main: gnymbleMainLogo,
    },
    percytech: { text: percytechTextLogo, icon: percytechIconLogo },
    percymd: { text: percymdTextLogo, icon: percymdIconLogo },
    percytext: { text: percytextTextLogo, icon: percytextIconLogo },
  };

export const HubLogo = React.forwardRef<HTMLDivElement, HubLogoProps>(
  ({ hubType, variant = "text", size = "md", className, ...props }, ref) => {
    console.log('HubLogo called with:', { hubType, variant, size });
    console.log('Available hubTypes:', Object.keys(logoMap));
    console.log('logoMap[hubType]:', logoMap[hubType]);
    
    const logos = logoMap[hubType];
    
    // Handle invalid hubType
    if (!logos) {
      console.warn(`Invalid hubType: ${hubType}. Available types: ${Object.keys(logoMap).join(', ')}`);
      return (
        <div
          ref={ref}
          className={cn("flex items-center justify-center text-red-500", className)}
          {...props}
        >
          <span className="text-sm">Invalid Hub</span>
        </div>
      );
    }
    
    const logoSrc =
      variant === "icon"
        ? logos.icon
        : variant === "main"
          ? logos.main || logos.text
          : logos.text;

    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-center", className)}
        {...props}
      >
        <img
          src={logoSrc}
          alt={`${hubType} Logo`}
          className={cn(sizeClasses[size], "object-contain object-center")}
        />
      </div>
    );
  }
);

HubLogo.displayName = "HubLogo";
