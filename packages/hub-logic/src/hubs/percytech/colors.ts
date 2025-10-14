/**
 * PercyTech Color Configuration
 */

import type { HubColors } from "../../types";

export const percytechColors: HubColors = {
  primary: "#DC2626", // red-600
  secondary: "#EF4444", // red-500
  accent: "#8B0000", // dark red
  tailwind: {
    text: "text-red-800",
    textHover: "hover:text-red-700",
    bg: "bg-red-800",
    bgHover: "hover:bg-red-700",
    bgLight: "bg-red-800/20",
    border: "border-red-800",
    borderLight: "border-red-800/30",
    gradient: "from-red-800 to-blue-600",
    shadow: "shadow-red-800/25",
    contactButton:
      "bg-red-800 hover:bg-red-700 text-white border border-red-800 hover:border-red-700",
  },
};
