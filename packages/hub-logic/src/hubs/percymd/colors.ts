/**
 * PercyMD Color Configuration
 */

import type { HubColors } from "../../types";

export const percymdColors: HubColors = {
  primary: "#2563EB", // blue-600
  secondary: "#3B82F6", // blue-500
  accent: "#1D4ED8", // blue-700
  tailwind: {
    text: "text-blue-600",
    textHover: "hover:text-blue-500",
    bg: "bg-blue-600",
    bgHover: "hover:bg-blue-500",
    bgLight: "bg-blue-600/20",
    border: "border-blue-600",
    borderLight: "border-blue-600/30",
    gradient: "from-blue-600 to-blue-700",
    shadow: "shadow-blue-600/25",
    contactButton:
      "border-2 border-blue-600 hover:border-blue-500 text-white bg-transparent hover:bg-blue-600/10",
  },
};

