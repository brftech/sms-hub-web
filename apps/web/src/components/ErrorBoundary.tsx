// =============================================================================
// ERROR BOUNDARY COMPONENT - PROPERLY ARCHITECTED
// =============================================================================

import React, { Component, ErrorInfo, ReactNode } from "react";
import { logger, logError } from "@/lib/logger";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: "",
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Generate unique error ID for tracking
    const errorId = `error_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error with structured logging
    logError("React error boundary caught error", error, {
      errorId: this.state.errorId,
      componentStack: errorInfo.componentStack,
      operation: "componentDidCatch",
    });

    // Update state with error info
    this.setState({
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      try {
        this.props.onError(error, errorInfo);
      } catch (handlerError) {
        logError("Error in custom error handler", handlerError, {
          errorId: this.state.errorId,
          originalError: error.message,
        });
      }
    }

    // Send error to monitoring service in production
    if (import.meta.env.PROD) {
      this.sendErrorToMonitoring(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: Props) {
    // Reset error state if props changed and resetOnPropsChange is true
    if (
      this.state.hasError &&
      this.props.resetOnPropsChange &&
      prevProps.children !== this.props.children
    ) {
      this.resetError();
    }
  }

  private sendErrorToMonitoring = (error: Error, errorInfo: ErrorInfo) => {
    try {
      // In production, send to your error monitoring service
      // Example: Sentry, LogRocket, Bugsnag, etc.
      if (
        typeof window !== "undefined" &&
        (window as { gtag?: unknown }).gtag
      ) {
        const gtag = (
          window as {
            gtag: (
              command: string,
              action: string,
              params: Record<string, unknown>
            ) => void;
          }
        ).gtag;
        gtag("event", "exception", {
          description: error.message,
          fatal: true,
          error_id: this.state.errorId,
        });
      }
    } catch (monitoringError) {
      logError("Failed to send error to monitoring service", monitoringError, {
        errorId: this.state.errorId,
        originalError: error.message,
      });
    }
  };

  private resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: "",
      retryCount: this.state.retryCount + 1,
    });
  };

  private handleRetry = () => {
    logger.info("User retrying after error", {
      errorId: this.state.errorId,
      retryCount: this.state.retryCount + 1,
    });
    this.resetError();
  };

  private handleGoHome = () => {
    try {
      window.location.href = "/";
    } catch (navigationError) {
      logError("Failed to navigate home", navigationError, {
        errorId: this.state.errorId,
      });
      // Fallback to hard refresh
      window.location.reload();
    }
  };

  private handleReportBug = () => {
    try {
      const errorDetails = {
        errorId: this.state.errorId,
        message: this.state.error?.message,
        stack: this.state.error?.stack,
        componentStack: this.state.errorInfo?.componentStack,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      };

      // In production, this would open a bug report form or send to your support system
      const mailtoLink = `mailto:support@gnymble.com?subject=Bug Report - ${
        this.state.errorId
      }&body=${encodeURIComponent(JSON.stringify(errorDetails, null, 2))}`;

      window.open(mailtoLink);
    } catch (reportError) {
      logError("Failed to report bug", reportError, {
        errorId: this.state.errorId,
      });
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            {/* Error Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-xl font-semibold text-gray-900 text-center mb-2">
              Oops! Something went wrong
            </h1>

            {/* Error Message */}
            <p className="text-gray-600 text-center mb-6">
              We encountered an unexpected error. Don't worry, our team has been
              notified.
            </p>

            {/* Error Details (Development Only) */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mb-6 p-3 bg-gray-100 rounded text-sm">
                <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                  Error Details (Development)
                </summary>
                <div className="space-y-2">
                  <p className="text-red-600 font-mono">
                    {this.state.error.message}
                  </p>
                  {this.state.errorInfo?.componentStack && (
                    <pre className="text-xs text-gray-600 overflow-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            {/* Error ID */}
            <div className="text-center mb-6">
              <p className="text-xs text-gray-500">
                Error ID:{" "}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  {this.state.errorId}
                </code>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={this.handleRetry}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>

              <Button
                onClick={this.handleGoHome}
                variant="outline"
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>

              <Button
                onClick={this.handleReportBug}
                variant="ghost"
                className="w-full text-gray-600 hover:text-gray-800"
              >
                <Bug className="w-4 h-4 mr-2" />
                Report Bug
              </Button>
            </div>

            {/* Retry Count */}
            {this.state.retryCount > 0 && (
              <p className="text-xs text-gray-500 text-center mt-4">
                Retry attempt: {this.state.retryCount}
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// =============================================================================
// HOOK FOR FUNCTIONAL COMPONENTS
// =============================================================================

export const useErrorBoundary = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const throwError = React.useCallback((error: Error) => {
    setError(error);
    throw error;
  }, []);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  return { error, throwError, resetError };
};

// =============================================================================
// HIGHER-ORDER COMPONENT
// =============================================================================

export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, "children">
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
};
