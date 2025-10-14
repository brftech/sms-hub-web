/**
 * Hub-Aware Error Fallback Component
 * 
 * Provides branded error pages that match the current hub's design system.
 * Used with ErrorBoundary for user-friendly error recovery.
 */

import React, { ErrorInfo } from 'react';
import { useHub, HubLogo } from '@sms-hub/ui/marketing';
import { getHubColors, getHubDisplayName } from '@sms-hub/hub-logic';

export interface ErrorFallbackProps {
  error: Error;
  errorInfo?: ErrorInfo;
  reset?: () => void;
  showDetails?: boolean;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorInfo,
  reset,
  showDetails = false,
}) => {
  const { currentHub } = useHub();
  const colors = getHubColors(currentHub);
  const hubName = getHubDisplayName(currentHub);
  const isDevelopment = import.meta.env.MODE === 'development';

  const handleReset = () => {
    if (reset) {
      reset();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleContactSupport = () => {
    window.location.href = '/contact';
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <HubLogo hubType={currentHub} className="h-12" />
        </div>

        {/* Error Card */}
        <div className="bg-zinc-900 rounded-lg shadow-2xl p-8 md:p-12 border border-zinc-800">
          {/* Icon */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-800 mb-4">
              <svg
                className={`w-10 h-10 ${colors.tailwind.text}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Oops! Something went wrong
            </h1>
            <p className="text-lg text-zinc-400">
              We're sorry for the inconvenience
            </p>
          </div>

          {/* Error Message */}
          <div className="bg-zinc-800 rounded-lg p-4 mb-6 border border-zinc-700">
            <p className="text-zinc-300 text-center">
              {isDevelopment
                ? error.message
                : 'An unexpected error occurred. Our team has been notified and is working on a fix.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <button
              onClick={handleReset}
              className={`px-6 py-3 ${colors.tailwind.bg} text-white rounded-lg font-semibold hover:opacity-90 transition-all duration-200 shadow-lg`}
            >
              Try Again
            </button>
            <button
              onClick={handleGoHome}
              className="px-6 py-3 bg-zinc-700 text-white rounded-lg font-semibold hover:bg-zinc-600 transition-all duration-200"
            >
              Go Home
            </button>
            <button
              onClick={handleContactSupport}
              className="px-6 py-3 bg-zinc-700 text-white rounded-lg font-semibold hover:bg-zinc-600 transition-all duration-200"
            >
              Contact Support
            </button>
          </div>

          {/* Helpful Tips */}
          <div className="border-t border-zinc-800 pt-6">
            <h3 className="text-white font-semibold mb-3">What you can do:</h3>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-zinc-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Refresh the page or try again in a few moments</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-zinc-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Clear your browser cache and cookies</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-zinc-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Contact our support team if the problem persists</span>
              </li>
            </ul>
          </div>

          {/* Development Details */}
          {(isDevelopment || showDetails) && errorInfo && (
            <details className="mt-6 border-t border-zinc-800 pt-6">
              <summary className="cursor-pointer text-sm text-zinc-400 hover:text-zinc-300 font-semibold mb-3">
                🔧 Developer Information
              </summary>
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-semibold mb-2 text-sm">Error Message:</h4>
                  <pre className="p-3 bg-zinc-950 rounded text-xs text-red-400 overflow-auto border border-zinc-800">
                    {error.message}
                  </pre>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2 text-sm">Stack Trace:</h4>
                  <pre className="p-3 bg-zinc-950 rounded text-xs text-zinc-400 overflow-auto border border-zinc-800 max-h-64">
                    {error.stack}
                  </pre>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2 text-sm">Component Stack:</h4>
                  <pre className="p-3 bg-zinc-950 rounded text-xs text-zinc-400 overflow-auto border border-zinc-800 max-h-64">
                    {errorInfo.componentStack}
                  </pre>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2 text-sm">Context:</h4>
                  <pre className="p-3 bg-zinc-950 rounded text-xs text-zinc-400 overflow-auto border border-zinc-800">
                    {JSON.stringify({ hub: currentHub, hubName }, null, 2)}
                  </pre>
                </div>
              </div>
            </details>
          )}

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-zinc-500">
            <p>
              {hubName} • {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;

