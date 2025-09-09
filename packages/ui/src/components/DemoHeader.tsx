import React from "react";
import { Button } from "./button";
import { HubLogo } from "./hub-logo";
import { useHub } from "../contexts/HubContext";
import { getHubColorClasses } from "@sms-hub/utils";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";

interface DemoHeaderProps {
  title: string;
  description: string;
  showBackButton?: boolean;
  backUrl?: string;
  externalLinks?: Array<{
    label: string;
    url: string;
    icon?: React.ReactNode;
  }>;
  onNavigate?: (url: string) => void;
}

export default function DemoHeader({
  title,
  description,
  showBackButton = false,
  backUrl = "/",
  externalLinks = [],
  onNavigate,
}: DemoHeaderProps) {
  const { currentHub } = useHub();
  const hubColors = getHubColorClasses(currentHub);

  const handleNavigate = (url: string) => {
    if (onNavigate) {
      onNavigate(url);
    } else {
      // Fallback to window.location if no navigation function provided
      window.location.href = url;
    }
  };

  return (
    <div className="bg-black/90 backdrop-blur-sm border-b border-orange-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-4">
            <HubLogo hubType={currentHub} variant="icon" size="lg" />
            <div className="text-white/70 text-sm">SMS Hub Platform Demo</div>
          </div>

          <div className="flex items-center space-x-3">
            {externalLinks.map((link, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white hover:bg-white/10"
                onClick={() => window.open(link.url, "_blank")}
              >
                {link.icon || <ExternalLink className="h-4 w-4" />}
                <span className="ml-2">{link.label}</span>
              </Button>
            ))}

            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={() =>
                window.open(
                  "https://github.com/brftech/sms-hub-monorepo",
                  "_blank"
                )
              }
            >
              <Github className="h-4 w-4" />
              <span className="ml-2">GitHub</span>
            </Button>
          </div>
        </div>

        {/* Main Header */}
        <div className="py-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {showBackButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white mb-4"
                  onClick={() => handleNavigate(backUrl)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to {backUrl === "/" ? "Home" : "Previous"}
                </Button>
              )}

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {title}
              </h1>

              <p className="text-xl text-gray-300 max-w-3xl">{description}</p>
            </div>

            {/* Demo Status */}
            <div className="hidden lg:flex flex-col items-end space-y-3">
              <div className="flex items-center space-x-2 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">
                  Demo Active
                </span>
              </div>

              <div className="text-right">
                <div className="text-white/70 text-sm">Current Hub</div>
                <div className={`text-lg font-semibold ${hubColors.text}`}>
                  {currentHub.charAt(0).toUpperCase() + currentHub.slice(1)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
