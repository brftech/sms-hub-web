/**
 * React Hook for Performance Tracking
 * 
 * Provides easy-to-use hooks for tracking component performance,
 * API calls, and user interactions.
 */

import { useEffect, useRef, useCallback } from 'react';
import { performanceMonitor } from './services/performanceMonitoringService';

/**
 * Track component mount/unmount and render time
 */
export function usePerformanceTracking(componentName: string, enabled = true) {
  const mountTime = useRef<number>(0);
  const renderCount = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return undefined;

    // Track mount time
    mountTime.current = performance.now();
    renderCount.current++;

    // Track render duration
    const renderStart = performance.now();
    
    return () => {
      const renderEnd = performance.now();
      const renderDuration = renderEnd - renderStart;
      
      if (renderDuration > 0) {
        performanceMonitor.trackComponentRender(componentName, renderDuration);
      }
    };
  }, [componentName, enabled]);

  return {
    renderCount: renderCount.current,
    getMountDuration: () => performance.now() - mountTime.current,
  };
}

/**
 * Track API calls with automatic timing
 */
export function useAPITracking() {
  const trackAPICall = useCallback(async <T,>(
    endpoint: string,
    method: string,
    apiCall: () => Promise<T>
  ): Promise<T> => {
    const start = performance.now();
    let success = false;
    let status: number | undefined;

    try {
      const result = await apiCall();
      success = true;
      status = 200; // Assume success
      return result;
    } catch (error) {
      success = false;
      status = (error as { status?: number })?.status || 500;
      throw error;
    } finally {
      const duration = performance.now() - start;
      performanceMonitor.trackAPICall(endpoint, method, duration, success, status);
    }
  }, []);

  return { trackAPICall };
}

/**
 * Track page navigation performance
 */
export function usePageTracking(routeName: string) {
  useEffect(() => {
    const navigationStart = performance.now();

    // Track when page is fully loaded
    if (document.readyState === 'complete') {
      const loadDuration = performance.now() - navigationStart;
      performanceMonitor.trackPageLoad(routeName, loadDuration);
      return undefined;
    } else {
      const handleLoad = () => {
        const loadDuration = performance.now() - navigationStart;
        performanceMonitor.trackPageLoad(routeName, loadDuration);
      };
      
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, [routeName]);
}

/**
 * Track form submission performance
 */
export function useFormTracking(formName: string) {
  const trackSubmission = useCallback(
    async <T,>(submitFn: () => Promise<T>): Promise<T> => {
      const start = performance.now();
      let success = false;

      try {
        const result = await submitFn();
        success = true;
        return result;
      } catch (error) {
        success = false;
        throw error;
      } finally {
        const duration = performance.now() - start;
        performanceMonitor.trackFormSubmission(formName, success, duration);
      }
    },
    [formName]
  );

  return { trackSubmission };
}

/**
 * Track hub switching performance
 */
export function useHubSwitchTracking() {
  const trackSwitch = useCallback((fromHub: string, toHub: string) => {
    const start = performance.now();

    // Use setTimeout to measure after React re-render
    setTimeout(() => {
      const duration = performance.now() - start;
      performanceMonitor.trackHubSwitch(fromHub, toHub, duration);
    }, 0);
  }, []);

  return { trackSwitch };
}

/**
 * Get performance metrics in real-time
 * NOTE: This is a read-only snapshot. For reactive updates, implement with useState.
 */
export function usePerformanceMetrics(refreshInterval = 5000) {
  const metricsRef = useRef({
    coreWebVitals: performanceMonitor.getCoreWebVitals(),
    apiCalls: performanceMonitor.getAPICallStats(),
    componentRenders: performanceMonitor.getComponentRenderStats(),
    bundles: performanceMonitor.getBundleStats(),
  });

  useEffect(() => {
    const updateMetrics = () => {
      metricsRef.current = {
        coreWebVitals: performanceMonitor.getCoreWebVitals(),
        apiCalls: performanceMonitor.getAPICallStats(),
        componentRenders: performanceMonitor.getComponentRenderStats(),
        bundles: performanceMonitor.getBundleStats(),
      };
    };

    const interval = setInterval(updateMetrics, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return metricsRef.current;
}

/**
 * Measure a specific operation
 */
export function useMeasure() {
  const measure = useCallback(async <T,>(
    operationName: string,
    operation: () => Promise<T> | T
  ): Promise<T> => {
    const start = performance.now();
    
    try {
      const result = await operation();
      const duration = performance.now() - start;
      
      console.log(`⏱️ ${operationName}: ${duration.toFixed(2)}ms`);
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`⏱️ ${operationName} failed after ${duration.toFixed(2)}ms`);
      throw error;
    }
  }, []);

  return { measure };
}

/**
 * Direct function to track form submission (for use outside React components)
 */
export function trackFormSubmission(formName: string, success: boolean, duration: number) {
  performanceMonitor.trackFormSubmission(formName, success, duration);
}
