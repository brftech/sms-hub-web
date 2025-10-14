/**
 * Enhanced Error Boundary Component
 * 
 * Features:
 * - Granular isolation levels (page, section, component)
 * - Recovery actions (reset, retry, navigate)
 * - Error classification and reporting
 * - Hub-aware error messages
 * - Development mode debugging
 */

import { Component, ErrorInfo, ReactNode } from 'react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: ErrorInfo, reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  isolationLevel?: 'page' | 'section' | 'component';
  resetKeys?: unknown[]; // Reset boundary when these change
  context?: {
    hubId?: number;
    hubType?: string;
    component?: string;
    route?: string;
  };
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { onError, context } = this.props;

    // Increment error count
    this.setState((prevState) => ({
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }

    // Report error with context
    this.reportError(error, errorInfo);

    // Log to console in development
    if (import.meta.env.MODE === 'development') {
      console.group('🔴 Error Boundary Caught Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.log('Context:', context);
      console.log('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    const { resetKeys } = this.props;
    const { hasError } = this.state;

    // Auto-reset when resetKeys change
    if (hasError && resetKeys && prevProps.resetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (key, index) => key !== prevProps.resetKeys?.[index]
      );
      if (hasResetKeyChanged) {
        this.reset();
      }
    }
  }

  private reportError(error: Error, errorInfo: ErrorInfo): void {
    const { context } = this.props;

    // Log error details for reporting
    // In production, this would integrate with error reporting service
    if (typeof window !== 'undefined' && (window as any).errorReporter) {
      try {
        (window as any).errorReporter.report(error, {
          hubId: context?.hubId,
          hubType: context?.hubType,
          component: context?.component,
          route: context?.route,
          metadata: {
            componentStack: errorInfo.componentStack,
            isolationLevel: this.props.isolationLevel || 'page',
            errorCount: this.state.errorCount,
          },
        });
      } catch (err) {
        console.error('Failed to report error:', err);
      }
    }
  }

  private reset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback, isolationLevel = 'page' } = this.props;

    if (hasError && error && errorInfo) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback(error, errorInfo, this.reset);
      }

      // Default fallback UI based on isolation level
      return this.renderDefaultFallback(error, isolationLevel);
    }

    return children;
  }

  private renderDefaultFallback(error: Error, isolationLevel: string): ReactNode {
    const isDevelopment = import.meta.env.MODE === 'development';

    // Component-level: Minimal inline error
    if (isolationLevel === 'component') {
      return (
        <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
          <span className="font-semibold">Error: </span>
          {isDevelopment ? error.message : 'Component failed to load'}
        </div>
      );
    }

    // Section-level: Contained error block
    if (isolationLevel === 'section') {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Section Unavailable
          </h3>
          <p className="text-red-700 mb-4">
            {isDevelopment ? error.message : 'This section encountered an error'}
          </p>
          <button
            onClick={this.reset}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    // Page-level: Full page error (will be replaced by hub-aware ErrorFallback)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
              {isDevelopment
                ? error.message
                : 'We encountered an unexpected error. Please try again.'}
            </p>
            <div className="space-y-3">
              <button
                onClick={this.reset}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Go Home
              </button>
            </div>
            {isDevelopment && this.state.errorInfo && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                  Show Error Details
                </summary>
                <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      </div>
    );
  }
}

// Export for backward compatibility
export default ErrorBoundary;
