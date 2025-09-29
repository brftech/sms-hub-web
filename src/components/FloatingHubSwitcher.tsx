import { useState, useEffect, useRef } from "react";
import { useHub, HubLogo } from "@sms-hub/ui";
import { webEnvironment } from "../config/webEnvironment";

// Hub configurations
const HUB_CONFIGS = {
  gnymble: {
    id: 1,
    name: 'Gnymble',
    hubNumber: 1,
    primaryColor: '#FF6B35',
    secondaryColor: '#4ECDC4',
    accentColor: '#FFA500'
  },
  percytech: {
    id: 0,
    name: 'PercyTech',
    hubNumber: 0,
    primaryColor: '#007AFF',
    secondaryColor: '#5AC8FA',
    accentColor: '#FF3B30'
  },
  percymd: {
    id: 2,
    name: 'PercyMD',
    hubNumber: 2,
    primaryColor: '#5856D6',
    secondaryColor: '#AF52DE',
    accentColor: '#32ADE6'
  },
  percytext: {
    id: 3,
    name: 'PercyText',
    hubNumber: 3,
    primaryColor: '#FF9500',
    secondaryColor: '#FFCC00',
    accentColor: '#FF3B30'
  }
} as const;

type HubType = keyof typeof HUB_CONFIGS;

const FloatingHubSwitcher = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentHub, switchHub } = useHub();

  // Only show in development
  if (import.meta.env.MODE !== 'development' && window.location.hostname !== 'localhost') {
    return null;
  }

  const hubs = Object.entries(HUB_CONFIGS).map(([hubType, config]) => ({
    hubType: hubType as HubType,
    id: config.id,
    name: config.name,
    hubNumber: config.hubNumber,
    primaryColor: config.primaryColor,
    secondaryColor: config.secondaryColor,
    accentColor: config.accentColor
  }));

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        setShowDropdown(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
    return undefined;
  }, [isExpanded]);

  // Only show if hub switcher is enabled
  if (!webEnvironment.features.hubSwitcher()) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50" ref={containerRef}>
      <div className="relative">
        {/* Floating Hub Switcher */}
        <div
          className={`absolute bottom-16 right-0 transition-all duration-300 ease-in-out ${
            isExpanded 
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" 
              : "opacity-0 scale-95 translate-y-2 pointer-events-none"
          }`}
        >
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-5 w-80">
            <div className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Switch Hub
            </div>
            
            {/* Custom Hub Selector */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-orange-200 rounded-lg hover:border-orange-300 hover:from-orange-50 hover:to-orange-100 transition-all duration-200"
              >
                <div className="flex items-center">
                  <HubLogo hubType={currentHub} variant="icon" size="sm" />
                  <span className="ml-3 text-base font-semibold text-gray-800">
                    {HUB_CONFIGS[currentHub]?.name || currentHub}
                  </span>
                </div>
                <svg
                  className={`w-5 h-5 text-orange-500 transition-transform duration-200 ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border-2 border-orange-200 rounded-xl shadow-2xl z-20 overflow-hidden max-h-80 overflow-y-auto">
                  {hubs.map((hub) => (
                    <button
                      key={hub.id}
                      onClick={() => {
                        switchHub(hub.hubType);
                        setShowDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between p-4 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 transition-all duration-200 ${
                        currentHub === hub.hubType ? "bg-gradient-to-r from-orange-100 to-orange-200" : ""
                      }`}
                    >
                      <div className="flex items-center">
                        <HubLogo hubType={hub.hubType} variant="icon" size="sm" />
                        <span className="ml-3 text-base font-semibold text-gray-800">
                          {hub.name}
                        </span>
                      </div>
                      {currentHub === hub.hubType && (
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group transform hover:scale-105"
          aria-label={isExpanded ? "Close hub switcher" : "Open hub switcher"}
        >
          {isExpanded ? (
            <svg
              className="w-6 h-6 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default FloatingHubSwitcher;
