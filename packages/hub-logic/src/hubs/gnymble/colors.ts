/**
 * Gnymble Color Configuration
 */

import type { HubColors } from "../../types";

export const gnymbleColors: HubColors = {
  primary: "#F97316", // orange-500
  secondary: "#DC2626", // red-600
  accent: "#EA580C", // orange-600
  tailwind: {
    text: "text-orange-400",
    textHover: "hover:text-orange-300",
    bg: "bg-orange-400",
    bgHover: "hover:bg-orange-300",
    bgLight: "bg-orange-500/20",
    border: "border-orange-400",
    borderLight: "border-orange-500/30",
    gradient: "from-orange-500 to-red-600",
    shadow: "shadow-orange-500/25",
    contactButton:
      "border-2 border-orange-500 hover:border-orange-400 text-white bg-transparent hover:bg-orange-500/10",
  },
};

