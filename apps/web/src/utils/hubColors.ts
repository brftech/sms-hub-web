import { useHub } from "@/contexts/HubContext";

export const getHubColorClasses = (currentHub: string) => {
  if (currentHub === "percytech") {
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
    };
  } else {
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
    };
  }
};

export const useHubColors = () => {
  const { currentHub } = useHub();
  return getHubColorClasses(currentHub);
};
