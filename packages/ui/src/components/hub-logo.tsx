import * as React from "react";
import { HubType } from "@sms-hub/types";
import { cn } from "@sms-hub/utils";

// Import all logo assets
import gnymbleTextLogo from "../assets/gnymble-text-logo.svg";
import gnymbleIconLogo from "../assets/gnymble-icon-logo.svg";
import percytechTextLogo from "../assets/percytech-text-logo.svg";
import percytechIconLogo from "../assets/percytech-icon-logo.svg";
import percymdTextLogo from "../assets/percymd-text-logo.svg";
import percymdIconLogo from "../assets/percymd-icon-logo.svg";
import percytextTextLogo from "../assets/percytext-text-logo.svg";
import percytextIconLogo from "../assets/percytext-icon-logo.svg";

interface HubLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  hubType: HubType;
  variant?: "icon" | "text" | "full";
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "h-6 w-auto",
  md: "h-8 w-auto",
  lg: "h-12 w-auto",
  xl: "h-16 w-auto",
};

const logoMap: Record<HubType, { text: string; icon: string }> = {
  gnymble: { text: gnymbleTextLogo, icon: gnymbleIconLogo },
  percytech: { text: percytechTextLogo, icon: percytechIconLogo },
  percymd: { text: percymdTextLogo, icon: percymdIconLogo },
  percytext: { text: percytextTextLogo, icon: percytextIconLogo },
};

export const HubLogo = React.forwardRef<HTMLDivElement, HubLogoProps>(
  ({ hubType, variant = "text", size = "md", className, ...props }, ref) => {
    const logos = logoMap[hubType];
    const logoSrc = variant === "icon" ? logos.icon : logos.text;

    return (
      <div ref={ref} className={cn("flex items-center", className)} {...props}>
        <img
          src={logoSrc}
          alt={`${hubType} Logo`}
          className={cn(sizeClasses[size], "object-contain")}
        />
      </div>
    );
  }
);

HubLogo.displayName = "HubLogo";
