/**
 * Admin Performance Dashboard
 * 
 * Dev-only dashboard for monitoring performance metrics in real-time.
 * Accessible at /admin/performance (development only).
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { performanceMonitor } from '../services/performanceMonitoringService';
import { PageLayout, useHub, SEO } from '@sms-hub/ui/marketing';
import { getHubColors } from '@sms-hub/hub-logic';
import { ADMIN_PATH } from '../utils/routes';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

interface MetricCardProps {
  title: string;
  value: string | number;
  rating?: 'good' | 'needs-improvement' | 'poor';
  subtitle?: string;
  unit?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, rating, subtitle, unit }) => {
  const getRatingColor = (rating?: string) => {
    switch (rating) {
      case 'good':
        return 'text-green-500 border-green-500 bg-green-500/10';
      case 'needs-improvement':
        return 'text-yellow-500 border-yellow-500 bg-yellow-500/10';
      case 'poor':
        return 'text-red-500 border-red-500 bg-red-500/10';
      default:
        return 'text-zinc-400 border-zinc-700 bg-zinc-800';
    }
  };

  return (
    <div className={`rounded-lg border p-6 ${getRatingColor(rating)}`}>
      <div className="text-sm font-medium opacity-80 mb-2">{title}</div>
      <div className="text-3xl font-bold mb-1">
        {typeof value === 'number' ? value.toFixed(2) : value}
        {unit && <span className="text-lg ml-1">{unit}</span>}
      </div>
      {subtitle && <div className="text-xs opacity-60">{subtitle}</div>}
    </div>
  );
};

const AdminPerformanceDashboard: React.FC = () => {
  const { currentHub } = useHub();
  const colors = getHubColors(currentHub);
  const [refreshKey, setRefreshKey] = useState(0);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const coreWebVitals = performanceMonitor.getCoreWebVitals();
  const apiStats = performanceMonitor.getAPICallStats();
  const componentStats = performanceMonitor.getComponentRenderStats();
  const bundleStats = performanceMonitor.getBundleStats();

  const handleExportMetrics = () => {
    const data = performanceMonitor.exportMetrics();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-metrics-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearMetrics = () => {
    if (confirm('Clear all performance metrics?')) {
      performanceMonitor.clear();
      setRefreshKey((prev) => prev + 1);
    }
  };

  return (
    <PageLayout
      showNavigation={true}
      showFooter={true}
      navigation={<Navigation />}
      footer={<Footer />}
    >
      <SEO
        title="Performance Dashboard - SMS Hub Admin"
        description="Real-time performance monitoring dashboard"
        keywords="performance, metrics, monitoring, admin"
      />
      
      <div className="min-h-screen bg-black text-white pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">Performance Dashboard</h1>
                <p className="text-zinc-400">Real-time performance monitoring (Dev Mode)</p>
              </div>
              <Link to={ADMIN_PATH}>
                <button className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Admin
                </button>
              </Link>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setRefreshKey((prev) => prev + 1)}
                className={`px-4 py-2 ${colors.tailwind.bg} text-white rounded-lg hover:opacity-90 transition-opacity`}
              >
                Refresh Now
              </button>
              <button
                onClick={handleExportMetrics}
                className="px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
              >
                Export Metrics
              </button>
              <button
                onClick={handleClearMetrics}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Clear Metrics
              </button>
            </div>
          </div>

          {/* Core Web Vitals */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className={colors.tailwind.text}>Core Web Vitals</span>
              <span className="text-xs px-2 py-1 bg-zinc-800 rounded-full text-zinc-400">
                Auto-refresh: 5s
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <MetricCard
                title="LCP (Largest Contentful Paint)"
                value={coreWebVitals.LCP?.value ?? 'N/A'}
                rating={coreWebVitals.LCP?.rating}
                unit="ms"
                subtitle="< 2.5s is good"
              />
              <MetricCard
                title="FID (First Input Delay)"
                value={coreWebVitals.FID?.value ?? 'N/A'}
                rating={coreWebVitals.FID?.rating}
                unit="ms"
                subtitle="< 100ms is good"
              />
              <MetricCard
                title="CLS (Cumulative Layout Shift)"
                value={coreWebVitals.CLS?.value ?? 'N/A'}
                rating={coreWebVitals.CLS?.rating}
                subtitle="< 0.1 is good"
              />
              <MetricCard
                title="FCP (First Contentful Paint)"
                value={coreWebVitals.FCP?.value ?? 'N/A'}
                rating={coreWebVitals.FCP?.rating}
                unit="ms"
                subtitle="< 1.8s is good"
              />
              <MetricCard
                title="TTFB (Time to First Byte)"
                value={coreWebVitals.TTFB?.value ?? 'N/A'}
                rating={coreWebVitals.TTFB?.rating}
                unit="ms"
                subtitle="< 800ms is good"
              />
            </div>
          </section>

          {/* API Call Statistics */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">API Call Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <MetricCard title="Total API Calls" value={apiStats.total} />
              <MetricCard title="Successful" value={apiStats.successful} rating="good" />
              <MetricCard title="Failed" value={apiStats.failed} rating={apiStats.failed > 0 ? 'poor' : 'good'} />
              <MetricCard
                title="Avg Duration"
                value={apiStats.averageDuration}
                unit="ms"
                rating={apiStats.averageDuration < 500 ? 'good' : apiStats.averageDuration < 1000 ? 'needs-improvement' : 'poor'}
              />
            </div>

            {/* By Endpoint */}
            {Object.keys(apiStats.byEndpoint).length > 0 && (
              <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
                <h3 className="text-lg font-semibold mb-4">By Endpoint</h3>
                <div className="space-y-2">
                  {Object.entries(apiStats.byEndpoint).map(([endpoint, stats]) => (
                    <div key={endpoint} className="flex items-center justify-between p-3 bg-zinc-800 rounded">
                      <span className="font-mono text-sm text-zinc-300">{endpoint}</span>
                      <div className="flex gap-4 text-sm">
                        <span className="text-zinc-400">{stats.count} calls</span>
                        <span className={stats.avgDuration < 500 ? 'text-green-500' : 'text-yellow-500'}>
                          {stats.avgDuration.toFixed(2)}ms avg
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Component Render Performance */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Component Render Performance</h2>
            {Object.keys(componentStats).length > 0 ? (
              <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
                <div className="space-y-2">
                  {Object.entries(componentStats)
                    .sort((a, b) => b[1].maxDuration - a[1].maxDuration)
                    .slice(0, 10)
                    .map(([component, stats]) => (
                      <div key={component} className="flex items-center justify-between p-3 bg-zinc-800 rounded">
                        <span className="font-mono text-sm text-zinc-300">{component}</span>
                        <div className="flex gap-4 text-sm">
                          <span className="text-zinc-400">{stats.count} renders</span>
                          <span className={stats.avgDuration < 16 ? 'text-green-500' : 'text-yellow-500'}>
                            {stats.avgDuration.toFixed(2)}ms avg
                          </span>
                          <span className={stats.maxDuration < 50 ? 'text-green-500' : 'text-red-500'}>
                            {stats.maxDuration.toFixed(2)}ms max
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 text-center text-zinc-400">
                No component render data yet. Component tracking will appear as you navigate.
              </div>
            )}
          </section>

          {/* Bundle Statistics */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Bundle Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <MetricCard
                title="Total Bundle Size"
                value={(bundleStats.totalSize / 1024).toFixed(2)}
                unit="KB"
              />
              <MetricCard
                title="Total Load Time"
                value={bundleStats.totalLoadTime.toFixed(2)}
                unit="ms"
              />
            </div>
            {bundleStats.bundles.length > 0 && (
              <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
                <h3 className="text-lg font-semibold mb-4">Loaded Bundles</h3>
                <div className="space-y-2">
                  {bundleStats.bundles.slice(0, 20).map((bundle, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-zinc-800 rounded">
                      <span className="font-mono text-sm text-zinc-300 truncate max-w-md">{bundle.name}</span>
                      <div className="flex gap-4 text-sm">
                        <span className="text-zinc-400">{(bundle.size / 1024).toFixed(2)} KB</span>
                        <span className={bundle.loadTime < 1000 ? 'text-green-500' : 'text-yellow-500'}>
                          {bundle.loadTime.toFixed(2)}ms
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Footer */}
          <div className="text-center text-sm text-zinc-500">
            Last refreshed: {new Date().toLocaleTimeString()} • Key: {refreshKey}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminPerformanceDashboard;

