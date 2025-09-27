import { HubType } from "./types";

export const getHubColorClasses = (currentHub: HubType) => {
  switch (currentHub) {
    case "percytech":
      return {
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
      };
    case "percymd":
      return {
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
          "bg-blue-600 hover:bg-blue-500 text-white border border-blue-600 hover:border-blue-500",
      };
    case "percytext":
      return {
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
      };
    case "gnymble":
    default:
      return {
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
          "bg-orange-400 hover:bg-orange-300 text-white border border-orange-400 hover:border-orange-300",
      };
  }
};

// Note: The useHubColors hook cannot be moved here as it depends on React context
// It should remain in the web app or be refactored to accept hub as a parameter
