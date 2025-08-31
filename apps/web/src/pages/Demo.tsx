import React from "react";
import { useNavigate } from "react-router-dom";
import { PhoneInteractive } from "@/components";
import { useHub } from "@/contexts/HubContext";
import { LiveMessagingProvider } from "@/contexts/LiveMessagingContext";

const Demo: React.FC = () => {
  const navigate = useNavigate();
  const { currentHub, hubConfig } = useHub();

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/")}
              className="text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
            >
              ← Back to Home
            </button>
            <div className="h-6 w-px bg-gray-600"></div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium">
                Demo Access
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-400">
              Hub:{" "}
              <span className="text-white font-medium">
                {hubConfig.name}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Interactive Phone Demo */}
      <div className="min-h-screen flex items-center justify-center py-20">
        <LiveMessagingProvider>
          <PhoneInteractive isInteractive={true} />
        </LiveMessagingProvider>
      </div>
    </div>
  );
};

export default Demo;
