/**
 * PageBadge - Shared badge component for page headers
 * 
 * Displays a small, pill-shaped badge with hub-specific colors.
 * Used consistently across all pages (FAQ, About, Pricing, Demo, Contact).
 */

import { useHub } from "@sms-hub/ui/marketing";
import { getHubColors } from "@sms-hub/hub-logic";
import type { LucideIcon } from "lucide-react";

interface PageBadgeProps {
  text: string;
  icon?: LucideIcon;
  className?: string;
}

export const PageBadge = ({ text, icon: Icon, className = "" }: PageBadgeProps) => {
  const { currentHub } = useHub();
  const hubColors = getHubColors(currentHub).tailwind;

  return (
    <div
      className={`inline-flex items-center px-4 py-2 rounded-full border ${hubColors.bgLight} ${hubColors.borderLight} ${className}`}
    >
      {Icon && <Icon className={`w-4 h-4 ${hubColors.text} mr-2`} />}
      <span className={`text-sm font-medium ${hubColors.text}`}>{text}</span>
    </div>
  );
};

