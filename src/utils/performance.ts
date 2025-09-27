// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTiming(label: string): void {
    this.metrics.set(label, performance.now());
  }

  endTiming(label: string): number {
    const startTime = this.metrics.get(label);
    if (!startTime) {
      console.warn(`No start time found for label: ${label}`);
      return 0;
    }
    
    const duration = performance.now() - startTime;
    this.metrics.delete(label);
    
    // Log slow operations
    if (duration > 100) {
      console.warn(`Slow operation detected: ${label} took ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }

  measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.startTiming(label);
    return fn().finally(() => {
      this.endTiming(label);
    });
  }

  measureSync<T>(label: string, fn: () => T): T {
    this.startTiming(label);
    try {
      return fn();
    } finally {
      this.endTiming(label);
    }
  }
}

// Web Vitals metric interface
interface WebVitalsMetric {
  name: string;
  value: number;
  id: string;
  delta: number;
  entries: PerformanceEntry[];
}

// Web Vitals monitoring
export function initWebVitals(): void {
  if (typeof window !== 'undefined') {
    // Core Web Vitals
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      onCLS((metric: WebVitalsMetric) => {
        console.log('CLS:', metric);
        // Send to analytics service
      });
      
      onFID((metric: WebVitalsMetric) => {
        console.log('FID:', metric);
        // Send to analytics service
      });
      
      onFCP((metric: WebVitalsMetric) => {
        console.log('FCP:', metric);
        // Send to analytics service
      });
      
      onLCP((metric: WebVitalsMetric) => {
        console.log('LCP:', metric);
        // Send to analytics service
      });
      
      onTTFB((metric: WebVitalsMetric) => {
        console.log('TTFB:', metric);
        // Send to analytics service
      });
    });
  }
}

// Bundle size monitoring
export function reportBundleSize(): void {
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          const resource = entry as PerformanceResourceTiming;
          if (resource.name.includes('.js') || resource.name.includes('.css')) {
            console.log(`Resource: ${resource.name}, Size: ${resource.transferSize} bytes`);
          }
        }
      });
    });
    
    observer.observe({ entryTypes: ['resource'] });
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();
