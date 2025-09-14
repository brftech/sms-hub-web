import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./button";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log the error to console in development
    const isDevelopment = (typeof import.meta !== 'undefined' && import.meta.env?.MODE !== "production") ||
                         (typeof process !== 'undefined' && process.env?.NODE_ENV === "development");
    if (isDevelopment) {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  handleReportBug = () => {
    const errorDetails = {
      error: this.state.error?.toString(),
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };

    // Create a mailto link with error details
    const subject = encodeURIComponent("Bug Report - SMS Hub Application");
    const body = encodeURIComponent(
      `Error Details:\n\n${JSON.stringify(errorDetails, null, 2)}`
    );
    const mailtoLink = `mailto:support@percytech.com?subject=${subject}&body=${body}`;

    window.open(mailtoLink);
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isDevelopment = (typeof import.meta !== 'undefined' && import.meta.env?.MODE !== "production") ||
                           (typeof process !== 'undefined' && process.env?.NODE_ENV === "development");

      // Default error UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-600 text-center mb-6">
              We're sorry, but something unexpected happened. Our team has been
              notified and is working to fix this issue.
            </p>

            <div className="space-y-3">
              <Button
                onClick={this.handleRefresh}
                className="w-full"
                variant="outline"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>

              <Button
                onClick={this.handleGoHome}
                className="w-full"
                variant="outline"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>

              <Button
                onClick={this.handleReportBug}
                className="w-full"
                variant="outline"
              >
                <Bug className="w-4 h-4 mr-2" />
                Report Bug
              </Button>
            </div>

            {isDevelopment && this.state.error && (
              <details className="mt-6 p-4 bg-gray-100 rounded-lg">
                <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                  Error Details (Development)
                </summary>
                <pre className="text-xs text-gray-600 overflow-auto">
                  {this.state.error.toString()}
                  {"\n\n"}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Convenience function for functional components
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback} onError={onError}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name || "Component"})`;

  return WrappedComponent;
};

// Global error handler for unhandled promise rejections
if (typeof window !== "undefined") {
  window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled promise rejection:", event.reason);
  });

  // Global error handler for uncaught errors
  window.addEventListener("error", (event) => {
    console.error("Uncaught error:", event.error);
  });
}
