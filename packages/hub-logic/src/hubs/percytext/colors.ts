/**
 * PercyText Color Configuration
 */

import type { HubColors } from "../../types";

export const percytextColors: HubColors = {
  primary: "#7C3AED", // purple-600
  secondary: "#8B5CF6", // purple-500
  accent: "#6D28D9", // purple-700
  tailwind: {
    text: "text-purple-600",
    textHover: "hover:text-purple-500",
    bg: "bg-purple-600",
    bgHover: "hover:bg-purple-500",
    bgLight: "bg-purple-600/20",
    border: "border-purple-600",
    borderLight: "border-purple-600/30",
    gradient: "from-purple-600 to-purple-700",
    shadow: "shadow-purple-600/25",
    contactButton:
      "bg-purple-600 hover:bg-purple-500 text-white border border-purple-600 hover:border-purple-500",
  },
};
