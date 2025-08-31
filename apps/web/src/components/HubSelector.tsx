import React, { useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHub, HubType } from "@/contexts/HubContext";
import { cn } from "@/lib/utils";
import GnymbleLogo from "./GnymbleLogo";
import PercyTechLogo from "./PercyTechLogo";

const HubSelector: React.FC = () => {
  const { currentHub, hubConfig, switchHub } = useHub();
  const [isOpen, setIsOpen] = useState(false);

  const handleHubSwitch = (hub: HubType) => {
    switchHub(hub);
    setIsOpen(false);
  };

  const getHubIcon = () => {
    if (currentHub === "percytech")
      return <PercyTechLogo size="sm" variant="icon-logo" />;
    if (currentHub === "gnymble")
      return <GnymbleLogo size="sm" variant="icon" />;
    return <Globe className="w-6 h-6" />;
  };

  const getHubColors = (hub: HubType) => {
    switch (hub) {
      case "percytech":
        return {
          primary: "from-red-800 to-blue-600",
          border: "border-red-800/50",
          hover: "hover:from-red-900 hover:to-blue-700",
        };
      case "gnymble":
        return {
          primary: "from-orange-500 to-red-600",
          border: "border-orange-500/50",
          hover: "hover:from-orange-600 hover:to-red-700",
        };
      default:
        return {
          primary: "from-gray-600 to-gray-700",
          border: "border-gray-500/50",
          hover: "hover:from-gray-700 hover:to-gray-800",
        };
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center space-x-2 px-3 py-2 h-auto",
          "bg-black/50 text-white border border-white/20",
          "hover:bg-white/10 hover:border-white/30 transition-all duration-300",
          "backdrop-blur-sm"
        )}
      >
        <div className="flex items-center space-x-2">
          {getHubIcon()}
          <span className="text-sm font-medium">{hubConfig.name}</span>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-xl z-50">
          <div className="p-4">
            <div className="text-xs text-white/60 uppercase tracking-wider mb-3">
              Switch Hub
            </div>

            {/* PercyTech Option */}
            <button
              onClick={() => handleHubSwitch("percytech")}
              className={cn(
                "w-full p-3 rounded-lg text-left transition-all duration-200",
                "border border-transparent hover:border-red-800/30",
                currentHub === "percytech"
                  ? "bg-red-800/20 border-red-800/50"
                  : "hover:bg-white/5"
              )}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg bg-gradient-to-r from-red-800 to-blue-600",
                    "flex items-center justify-center"
                  )}
                >
                  <PercyTechLogo size="xs" variant="icon-logo" />
                </div>
                <div className="flex-1">
                  <div
                    className="font-medium text-white"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    PercyTech
                  </div>
                  <div className="text-xs text-white/60">
                    Enterprise Technology
                  </div>
                </div>
                {currentHub === "percytech" && (
                  <div className="w-2 h-2 bg-red-800 rounded-full"></div>
                )}
              </div>
            </button>

            {/* Gnymble Option */}
            <button
              onClick={() => handleHubSwitch("gnymble")}
              className={cn(
                "w-full p-3 rounded-lg text-left transition-all duration-200 mt-2",
                "border border-transparent hover:border-orange-500/30",
                currentHub === "gnymble"
                  ? "bg-orange-500/20 border-orange-500/50"
                  : "hover:bg-white/5"
              )}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-red-600",
                    "flex items-center justify-center"
                  )}
                >
                  <GnymbleLogo size="xs" variant="icon" />
                </div>
                <div className="flex-1">
                  <div
                    className="font-medium text-white"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Gnymble
                  </div>
                  <div className="text-xs text-white/60">SMS Platform</div>
                </div>
                {currentHub === "gnymble" && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                )}
              </div>
            </button>

            {/* Hub Demo Link */}
            <div className="mt-4 pt-3 border-t border-white/10">
              <button
                onClick={() => {
                  window.location.href = "/hub-demo";
                  setIsOpen(false);
                }}
                className="w-full p-3 rounded-lg text-left transition-all duration-200 hover:bg-white/5 border border-transparent hover:border-blue-500/30"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white">Hub Demo</div>
                    <div className="text-xs text-white/60">
                      Logo & Style Testing
                    </div>
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="text-xs text-white/40 text-center">
                Current: {hubConfig.displayName}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HubSelector;
