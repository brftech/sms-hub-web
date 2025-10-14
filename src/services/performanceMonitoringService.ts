/**
 * Performance Monitoring Service
 * 
 * Tracks Core Web Vitals, custom metrics, and provides performance insights.
 * Integrates with Web Vitals API and provides real-time monitoring.
 */

import { onCLS, onFID, onLCP, onFCP, onTTFB, Metric } from 'web-vitals';

export type MetricName = 'CLS' | 'FID' | 'LCP' | 'FCP' | 'TTFB';
export type CustomMetricName = 
  | 'page-load'
  | 'api-call'
  | 'component-render'
  | 'hub-switch'
  | 'form-submission'
  | 'bundle-load'
  | 'image-load';

export interface PerformanceMetric {
  name: MetricName | CustomMetricName;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface APICallMetric {
  endpoint: string;
  method: string;
  duration: number;
  status?: number;
  success: boolean;
  timestamp: number;
}

export interface ComponentRenderMetric {
  component: string;
  duration: number;
  timestamp: number;
}

export interface BundleMetric {
  name: string;
  size: number;
  loadTime: number;
  timestamp: number;
}

class PerformanceMonitoringService {
  private metrics: PerformanceMetric[] = [];
  private apiCalls: APICallMetric[] = [];
  private componentRenders: ComponentRenderMetric[] = [];
  private bundles: BundleMetric[] = [];
  private maxHistorySize = 100;
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeCoreWebVitals();
      this.initializeResourceTiming();
    }
  }

  /**
   * Initialize Core Web Vitals tracking
   */
  private initializeCoreWebVitals(): void {
    if (this.isInitialized) return;

    try {
      onCLS((metric) => this.recordCoreWebVital(metric));
      onFID((metric) => this.recordCoreWebVital(metric));
      onLCP((metric) => this.recordCoreWebVital(metric));
      onFCP((metric) => this.recordCoreWebVital(metric));
      onTTFB((metric) => this.recordCoreWebVital(metric));

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Core Web Vitals:', error);
    }
  }

  /**
   * Initialize Resource Timing API tracking
   */
  private initializeResourceTiming(): void {
    if (typeof window === 'undefined' || !window.performance) return;

    // Track bundle loads
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;
          
          // Track JS bundles
          if (resourceEntry.name.includes('.js')) {
            this.trackBundleLoad(
              resourceEntry.name.split('/').pop() || 'unknown',
              resourceEntry.transferSize || 0,
              resourceEntry.duration
            );
          }
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['resource'] });
    } catch (error) {
      console.error('Failed to initialize Resource Timing:', error);
    }
  }

  /**
   * Record Core Web Vital metric
   */
  private recordCoreWebVital(metric: Metric): void {
    const performanceMetric: PerformanceMetric = {
      name: metric.name as MetricName,
      value: metric.value,
      rating: metric.rating,
      timestamp: Date.now(),
      metadata: {
        id: metric.id,
        delta: metric.delta,
        navigationType: (metric as any).navigationType,
      },
    };

    this.addMetric(performanceMetric);

    // Log in development
    if (import.meta.env.MODE === 'development') {
      console.log(`📊 ${metric.name}:`, {
        value: metric.value.toFixed(2),
        rating: metric.rating,
      });
    }
  }

  /**
   * Track page load time
   */
  trackPageLoad(route: string, duration: number): void {
    this.addMetric({
      name: 'page-load',
      value: duration,
      rating: this.getRating('page-load', duration),
      timestamp: Date.now(),
      metadata: { route },
    });
  }

  /**
   * Track API call performance
   */
  trackAPICall(
    endpoint: string,
    method: string,
    duration: number,
    success: boolean,
    status?: number
  ): void {
    const apiMetric: APICallMetric = {
      endpoint,
      method,
      duration,
      status,
      success,
      timestamp: Date.now(),
    };

    this.apiCalls.unshift(apiMetric);
    if (this.apiCalls.length > this.maxHistorySize) {
      this.apiCalls.pop();
    }

    this.addMetric({
      name: 'api-call',
      value: duration,
      rating: this.getRating('api-call', duration),
      timestamp: Date.now(),
      metadata: { endpoint, method, success, status },
    });
  }

  /**
   * Track component render time
   */
  trackComponentRender(component: string, duration: number): void {
    const renderMetric: ComponentRenderMetric = {
      component,
      duration,
      timestamp: Date.now(),
    };

    this.componentRenders.unshift(renderMetric);
    if (this.componentRenders.length > this.maxHistorySize) {
      this.componentRenders.pop();
    }

    this.addMetric({
      name: 'component-render',
      value: duration,
      rating: this.getRating('component-render', duration),
      timestamp: Date.now(),
      metadata: { component },
    });
  }

  /**
   * Track hub switch performance
   */
  trackHubSwitch(fromHub: string, toHub: string, duration: number): void {
    this.addMetric({
      name: 'hub-switch',
      value: duration,
      rating: this.getRating('hub-switch', duration),
      timestamp: Date.now(),
      metadata: { fromHub, toHub },
    });
  }

  /**
   * Track form submission performance
   */
  trackFormSubmission(formType: string, success: boolean, duration: number): void {
    this.addMetric({
      name: 'form-submission',
      value: duration,
      rating: this.getRating('form-submission', duration),
      timestamp: Date.now(),
      metadata: { formType, success },
    });
  }

  /**
   * Track bundle load
   */
  trackBundleLoad(name: string, size: number, loadTime: number): void {
    const bundleMetric: BundleMetric = {
      name,
      size,
      loadTime,
      timestamp: Date.now(),
    };

    this.bundles.unshift(bundleMetric);
    if (this.bundles.length > this.maxHistorySize) {
      this.bundles.pop();
    }

    this.addMetric({
      name: 'bundle-load',
      value: loadTime,
      rating: this.getRating('bundle-load', loadTime),
      timestamp: Date.now(),
      metadata: { name, size },
    });
  }

  /**
   * Track image load
   */
  trackImageLoad(url: string, size: number, duration: number): void {
    this.addMetric({
      name: 'image-load',
      value: duration,
      rating: this.getRating('image-load', duration),
      timestamp: Date.now(),
      metadata: { url, size },
    });
  }

  /**
   * Add metric to history
   */
  private addMetric(metric: PerformanceMetric): void {
    this.metrics.unshift(metric);
    if (this.metrics.length > this.maxHistorySize) {
      this.metrics.pop();
    }
  }

  /**
   * Get rating for custom metrics
   */
  private getRating(metricName: CustomMetricName, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds: Record<CustomMetricName, { good: number; poor: number }> = {
      'page-load': { good: 2000, poor: 4000 },
      'api-call': { good: 500, poor: 1000 },
      'component-render': { good: 16, poor: 50 }, // 16ms = 60fps
      'hub-switch': { good: 300, poor: 1000 },
      'form-submission': { good: 1000, poor: 3000 },
      'bundle-load': { good: 1000, poor: 3000 },
      'image-load': { good: 500, poor: 1500 },
    };

    const threshold = thresholds[metricName];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Get all metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get Core Web Vitals summary
   */
  getCoreWebVitals(): Record<MetricName, PerformanceMetric | null> {
    const vitals: Record<MetricName, PerformanceMetric | null> = {
      CLS: null,
      FID: null,
      LCP: null,
      FCP: null,
      TTFB: null,
    };

    // Get latest value for each vital
    for (const metric of this.metrics) {
      if (metric.name in vitals && !vitals[metric.name as MetricName]) {
        vitals[metric.name as MetricName] = metric;
      }
    }

    return vitals;
  }

  /**
   * Get API call statistics
   */
  getAPICallStats(): {
    total: number;
    successful: number;
    failed: number;
    averageDuration: number;
    byEndpoint: Record<string, { count: number; avgDuration: number }>;
  } {
    const total = this.apiCalls.length;
    const successful = this.apiCalls.filter((call) => call.success).length;
    const failed = total - successful;
    const averageDuration =
      total > 0
        ? this.apiCalls.reduce((sum, call) => sum + call.duration, 0) / total
        : 0;

    const byEndpoint: Record<string, { count: number; avgDuration: number }> = {};
    for (const call of this.apiCalls) {
      if (!byEndpoint[call.endpoint]) {
        byEndpoint[call.endpoint] = { count: 0, avgDuration: 0 };
      }
      byEndpoint[call.endpoint].count++;
    }

    // Calculate average duration per endpoint
    for (const endpoint in byEndpoint) {
      const calls = this.apiCalls.filter((c) => c.endpoint === endpoint);
      const sum = calls.reduce((acc, c) => acc + c.duration, 0);
      byEndpoint[endpoint].avgDuration = sum / calls.length;
    }

    return { total, successful, failed, averageDuration, byEndpoint };
  }

  /**
   * Get component render statistics
   */
  getComponentRenderStats(): Record<string, { count: number; avgDuration: number; maxDuration: number }> {
    const stats: Record<string, { count: number; avgDuration: number; maxDuration: number }> = {};

    for (const render of this.componentRenders) {
      if (!stats[render.component]) {
        stats[render.component] = { count: 0, avgDuration: 0, maxDuration: 0 };
      }
      stats[render.component].count++;
      stats[render.component].maxDuration = Math.max(
        stats[render.component].maxDuration,
        render.duration
      );
    }

    // Calculate average duration
    for (const component in stats) {
      const renders = this.componentRenders.filter((r) => r.component === component);
      const sum = renders.reduce((acc, r) => acc + r.duration, 0);
      stats[component].avgDuration = sum / renders.length;
    }

    return stats;
  }

  /**
   * Get bundle statistics
   */
  getBundleStats(): {
    totalSize: number;
    totalLoadTime: number;
    bundles: BundleMetric[];
  } {
    const totalSize = this.bundles.reduce((sum, b) => sum + b.size, 0);
    const totalLoadTime = this.bundles.reduce((sum, b) => sum + b.loadTime, 0);

    return {
      totalSize,
      totalLoadTime,
      bundles: [...this.bundles],
    };
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
    this.apiCalls = [];
    this.componentRenders = [];
    this.bundles = [];
  }

  /**
   * Export metrics as JSON
   */
  exportMetrics(): string {
    return JSON.stringify({
      coreWebVitals: this.getCoreWebVitals(),
      apiCalls: this.getAPICallStats(),
      componentRenders: this.getComponentRenderStats(),
      bundles: this.getBundleStats(),
      allMetrics: this.metrics,
    }, null, 2);
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitoringService();

// Convenience functions
export const trackPageLoad = (route: string, duration: number) =>
  performanceMonitor.trackPageLoad(route, duration);

export const trackAPICall = (
  endpoint: string,
  method: string,
  duration: number,
  success: boolean,
  status?: number
) => performanceMonitor.trackAPICall(endpoint, method, duration, success, status);

export const trackComponentRender = (component: string, duration: number) =>
  performanceMonitor.trackComponentRender(component, duration);

export const trackHubSwitch = (fromHub: string, toHub: string, duration: number) =>
  performanceMonitor.trackHubSwitch(fromHub, toHub, duration);

export const trackFormSubmission = (formType: string, success: boolean, duration: number) =>
  performanceMonitor.trackFormSubmission(formType, success, duration);

