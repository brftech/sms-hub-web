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
      // No start time found
      return 0;
    }

    const duration = performance.now() - startTime;
    this.metrics.delete(label);

    // Log slow operations
    if (duration > 100) {
      // Slow operation detected
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
  if (typeof window !== "undefined") {
    // Core Web Vitals
    import("web-vitals").then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS((_metric: WebVitalsMetric) => {
        // CLS metric recorded
        // Send to analytics service
      });

      onINP((_metric: WebVitalsMetric) => {
        // INP metric recorded
        // Send to analytics service
      });

      onFCP((_metric: WebVitalsMetric) => {
        // FCP metric recorded
        // Send to analytics service
      });

      onLCP((_metric: WebVitalsMetric) => {
        // LCP metric recorded
        // Send to analytics service
      });

      onTTFB((_metric: WebVitalsMetric) => {
        // TTFB metric recorded
        // Send to analytics service
      });
    });
  }
}

// Bundle size monitoring
export function reportBundleSize(): void {
  if (typeof window !== "undefined" && import.meta.env.DEV) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === "resource") {
          const resource = entry as PerformanceResourceTiming;
          if (resource.name.includes(".js") || resource.name.includes(".css")) {
            // Resource size logged
          }
        }
      });
    });

    observer.observe({ entryTypes: ["resource"] });
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();
