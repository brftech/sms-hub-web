import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Bug } from 'lucide-react';

interface EnvironmentDebugProps {
  show?: boolean;
}

export const EnvironmentDebug: React.FC<EnvironmentDebugProps> = ({ show = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!show && import.meta.env.MODE !== 'development') {
    return null;
  }

  const envVars = {
    MODE: String(import.meta.env.MODE || 'unknown'),
    DEV: String(import.meta.env.DEV || 'false'),
    PROD: String(import.meta.env.PROD || 'false'),
    VITE_STRIPE_PAYMENT_LINK: import.meta.env.VITE_STRIPE_PAYMENT_LINK ? '✅ Set' : '❌ Missing',
    VITE_STRIPE_PAYMENT_LINK_STARTER: import.meta.env.VITE_STRIPE_PAYMENT_LINK_STARTER ? '✅ Set' : '❌ Missing',
    VITE_STRIPE_PAYMENT_LINK_CORE: import.meta.env.VITE_STRIPE_PAYMENT_LINK_CORE ? '✅ Set' : '❌ Missing',
    VITE_STRIPE_PAYMENT_LINK_ELITE: import.meta.env.VITE_STRIPE_PAYMENT_LINK_ELITE ? '✅ Set' : '❌ Missing',
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing',
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
  };

  return (
    <div className="fixed bottom-4 left-4 bg-black/90 text-white rounded-lg text-xs font-mono max-w-sm z-40 border border-gray-700/50">
      {/* Header with toggle button */}
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-800/50 transition-colors rounded-t-lg"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <Bug className="w-4 h-4 text-orange-400" />
          <span className="font-bold">Debug</span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        )}
      </div>

      {/* Collapsible content */}
      {isExpanded && (
        <div className="px-3 pb-3 border-t border-gray-700/50">
          <div className="pt-2 space-y-1">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-gray-400 text-xs">{key}:</span> 
                <span className={`text-xs ${value.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-gray-700/30 text-gray-400 text-xs">
            Hostname: {typeof window !== 'undefined' ? window.location.hostname : 'unknown'}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnvironmentDebug;
