# SMS Hub Web Performance Guide

**Last Updated**: October 3, 2025 at 12:30 PM ET

## 🎯 Overview

This guide covers performance optimization strategies, monitoring techniques, and best practices for SMS Hub Web marketing platform. Use this guide to ensure optimal performance across all marketing operations.

**Current Status**: ✅ **Optimized** - SMS-Hub-Web achieved 91KB gzipped main bundle with zero errors

## 📊 Performance Metrics

### **🎯 Target Performance Goals**

| Metric                  | Target          | Current (sms-hub-web) |
| ----------------------- | --------------- | --------------------- |
| **Page Load Time**      | < 2 seconds     | ✅ Achieved           |
| **Time to Interactive** | < 3 seconds     | ✅ Achieved           |
| **Bundle Size**         | < 100KB gzipped | ✅ 91KB achieved      |
| **Database Query Time** | < 100ms average | ✅ Achieved           |
| **Contact Form Submit** | < 500ms         | ✅ Achieved           |
| **Hub Detection**       | < 50ms          | ✅ Achieved           |

### **📈 Key Performance Indicators (KPIs)**

- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Bundle Performance**: 91KB gzipped main bundle (70% reduction)
- **Database Performance**: Query time, connection usage
- **Marketing Performance**: Lead capture, conversion rates
- **Application Performance**: Render time, memory usage

## 🚀 Frontend Optimization

### **1. Bundle Optimization**

#### **Code Splitting**

```javascript
// Lazy load components
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ContactForm = lazy(() => import("./components/ContactForm"));

// Use Suspense for loading states
<Suspense fallback={<PageLoader />}>
  <AdminDashboard />
</Suspense>;
```

#### **Bundle Analysis**

```bash
# Analyze bundle size
npm run build
npm run build:analyze

# Check for large dependencies
npx webpack-bundle-analyzer dist/assets/*.js

# Current SMS-Hub-Web performance:
# Main bundle: 91KB gzipped (down from 302KB)
# 27 optimized chunks with route-based code splitting
```

#### **Tree Shaking**

```javascript
// Import only what you need
import { Button, Card } from "@sms-hub/ui/marketing";

// Use optimized bundles for better performance
import { Button, Card } from "@sms-hub/ui/marketing"; // Marketing-optimized
import { Button } from "@sms-hub/ui/lean"; // Minimal imports

// Instead of
import * as UI from "@sms-hub/ui";
```

### **2. Image Optimization**

#### **Optimize Images**

```javascript
// Use optimized images
import OptimizedImage from "@sms-hub/ui/components/optimized-image";

<OptimizedImage src="/images/logo.png" alt="Logo" width={200} height={100} priority />;
```

#### **Lazy Loading**

```javascript
// Lazy load images
<img src="/images/hero.jpg" alt="Hero" loading="lazy" decoding="async" />
```

### **3. Caching Strategies**

#### **Browser Caching**

```javascript
// Cache static assets
// Vercel automatically handles this
// Ensure proper cache headers

// Cache API responses
const { data } = useQuery({
  queryKey: ["leads", hubId],
  queryFn: fetchLeads,
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
});
```

#### **Service Worker (Future)**

```javascript
// Implement service worker for offline support
// Cache critical resources
// Background sync for contact forms
```

### **4. React Optimization**

#### **Memoization**

```javascript
// Memoize expensive components
const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(() => {
    return processData(data);
  }, [data]);

  return <div>{processedData}</div>;
});

// Memoize callbacks
const handleSubmit = useCallback(
  (formData) => {
    onSubmit(formData);
  },
  [onSubmit]
);
```

#### **Virtual Scrolling**

```javascript
// For large lists
import { FixedSizeList as List } from "react-window";

const VirtualizedList = ({ items }) => (
  <List height={600} itemCount={items.length} itemSize={50} itemData={items}>
    {({ index, style, data }) => <div style={style}>{data[index].name}</div>}
  </List>
);
```

## 🗄️ Database Optimization

### **1. Query Optimization**

#### **Indexing Strategy**

```sql
-- Create indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_leads_hub_id ON leads(hub_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_hub_id ON contact_form_submissions(hub_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- Composite indexes for complex queries
CREATE INDEX IF NOT EXISTS idx_leads_hub_created
ON leads(hub_id, created_at DESC);
```

#### **Query Optimization**

```sql
-- Use EXPLAIN to analyze queries
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM leads
WHERE hub_id = $1
ORDER BY created_at DESC
LIMIT 50;

-- Optimize with proper WHERE clauses
-- Use LIMIT to reduce result sets
-- Use specific columns instead of SELECT *
```

#### **Connection Pooling**

```javascript
// Supabase handles connection pooling automatically
// Monitor connection usage
// Consider read replicas for heavy read workloads
```

### **2. Data Management**

#### **Pagination**

```javascript
// Implement proper pagination
const { data, isLoading } = useQuery({
  queryKey: ["leads", page, limit, hubId],
  queryFn: () => fetchLeads({ page, limit, hubId }),
  keepPreviousData: true,
});

// Use cursor-based pagination for large datasets
const { data } = useQuery({
  queryKey: ["leads", cursor, hubId],
  queryFn: () => fetchLeads({ cursor, hubId }),
});
```

#### **Data Archiving**

```sql
-- Archive old leads
CREATE TABLE leads_archive (LIKE leads);

-- Move old leads to archive
INSERT INTO leads_archive
SELECT * FROM leads
WHERE created_at < NOW() - INTERVAL '1 year';

-- Delete archived leads
DELETE FROM leads
WHERE created_at < NOW() - INTERVAL '1 year';
```

### **3. Database Monitoring**

#### **Query Performance**

```sql
-- Monitor slow queries
SELECT
  query,
  mean_time,
  calls,
  total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Check table sizes
SELECT
  tablename,
  pg_size_pretty(pg_total_relation_size(tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename) DESC;
```

#### **Connection Monitoring**

```sql
-- Monitor active connections
SELECT
  state,
  count(*) as connections
FROM pg_stat_activity
GROUP BY state;

-- Check connection limits
SHOW max_connections;
```

## 📱 Marketing Performance

### **1. Lead Capture Optimization**

#### **Form Performance**

```javascript
// Optimize contact form submission
const submitContactForm = async (formData) => {
  // Client-side validation
  const validation = validateForm(formData);
  if (!validation.isValid) return validation;

  // Submit to Edge Function
  const response = await fetch("/api/submit-contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  return response.json();
};
```

#### **Hub Detection Performance**

```javascript
// Optimize hub detection
const detectHub = useMemo(() => {
  const hostname = window.location.hostname.toLowerCase();

  if (hostname.includes("percytech")) return "percytech";
  if (hostname.includes("percymd")) return "percymd";
  if (hostname.includes("percytext")) return "percytext";

  return "gnymble"; // Default
}, []);
```

### **2. Sales Dashboard Performance**

#### **Data Loading**

```javascript
// Optimize dashboard data loading
const { data: leads, isLoading } = useQuery({
  queryKey: ["leads", hubId, filters],
  queryFn: () => fetchLeads({ hubId, ...filters }),
  staleTime: 2 * 60 * 1000, // 2 minutes
  cacheTime: 5 * 60 * 1000, // 5 minutes
});
```

#### **Real-time Updates**

```javascript
// Implement real-time updates for dashboard
useEffect(() => {
  const subscription = supabase
    .channel("leads")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "leads" }, (payload) => {
      queryClient.invalidateQueries(["leads", hubId]);
    })
    .subscribe();

  return () => subscription.unsubscribe();
}, [hubId]);
```

## 🔧 Backend Optimization

### **1. Edge Functions**

#### **Function Optimization**

```typescript
// Optimize Edge Functions
export default async function handler(req: Request) {
  // Use connection pooling
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Cache frequently accessed data
  const cache = new Map();

  // Optimize database queries
  const { data } = await supabase
    .from("leads")
    .select("id, email, first_name, hub_id")
    .eq("hub_id", hubId)
    .limit(50);

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
```

#### **Function Monitoring**

```bash
# Monitor function performance
npx supabase functions logs submit-contact --project-ref fwlivygerbqzowbzxesw

# Check function metrics
# Monitor execution time, memory usage, errors
```

### **2. API Optimization**

#### **Response Caching**

```javascript
// Cache API responses
const cache = new Map();

const getCachedData = async (key, fetcher) => {
  if (cache.has(key)) {
    return cache.get(key);
  }

  const data = await fetcher();
  cache.set(key, data);

  // Set expiration
  setTimeout(() => cache.delete(key), 5 * 60 * 1000);

  return data;
};
```

#### **Request Batching**

```javascript
// Batch multiple requests
const batchRequests = async (requests) => {
  const promises = requests.map((req) => fetch(req.url, req.options));
  const results = await Promise.allSettled(promises);

  return results.map((result, index) => ({
    id: requests[index].id,
    data: result.status === "fulfilled" ? result.value : null,
    error: result.status === "rejected" ? result.reason : null,
  }));
};
```

## 📊 Monitoring & Analytics

### **1. Performance Monitoring**

#### **Frontend Monitoring**

```javascript
// Monitor Core Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);

// Custom performance metrics
const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();

  console.log(`${name}: ${end - start}ms`);
  return result;
};
```

#### **Database Monitoring**

```sql
-- Monitor query performance
SELECT
  query,
  mean_time,
  calls,
  total_time,
  rows
FROM pg_stat_statements
WHERE mean_time > 1000
ORDER BY mean_time DESC;

-- Monitor table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### **2. Error Tracking**

#### **Frontend Error Tracking**

```javascript
// Track JavaScript errors
window.addEventListener("error", (event) => {
  console.error("JavaScript Error:", event.error);
  // Send to error tracking service
});

// Track unhandled promise rejections
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled Promise Rejection:", event.reason);
  // Send to error tracking service
});
```

#### **Backend Error Tracking**

```typescript
// Track Edge Function errors
export default async function handler(req: Request) {
  try {
    // Function logic
  } catch (error) {
    console.error("Edge Function Error:", error);
    // Send to error tracking service

    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
```

## 🎯 Performance Best Practices

### **1. Development Practices**

#### **Code Quality**

- Use TypeScript for type safety
- Implement proper error handling
- Write efficient algorithms
- Avoid memory leaks

#### **Testing**

- Write performance tests
- Monitor bundle size
- Test with large datasets
- Load test critical paths

### **2. Deployment Practices**

#### **Build Optimization**

```bash
# Optimize build process
npm run build -- --mode production

# Analyze bundle size
npm run analyze

# Check for unused dependencies
npx depcheck
```

#### **Environment Configuration**

```bash
# Use production environment variables
# Enable compression
# Configure CDN
# Set proper cache headers
```

### **3. Monitoring Practices**

#### **Regular Monitoring**

- Monitor performance metrics daily
- Set up alerts for performance degradation
- Review error logs weekly
- Analyze user feedback

#### **Performance Reviews**

- Monthly performance reviews
- Quarterly optimization planning
- Annual architecture reviews
- Continuous improvement

## 🚨 Performance Alerts

### **Critical Alerts**

- Page load time > 5 seconds
- Database query time > 1 second
- Contact form submit time > 2 seconds
- Error rate > 5%

### **Warning Alerts**

- Page load time > 3 seconds
- Database query time > 500ms
- Contact form submit time > 1 second
- Error rate > 2%

### **Alert Configuration**

```javascript
// Configure performance alerts
const performanceAlerts = {
  pageLoadTime: { threshold: 3000, severity: "warning" },
  databaseQueryTime: { threshold: 1000, severity: "critical" },
  contactFormSubmit: { threshold: 2000, severity: "critical" },
  errorRate: { threshold: 5, severity: "critical" },
};
```

## 🚀 Recent Performance Achievements (October 2025)

### **SMS-Hub-Web Optimizations**

- **Bundle Size**: Reduced from 302KB to 91KB gzipped (70% reduction)
- **Code Splitting**: 27 optimized chunks with route-based splitting
- **Logger Removal**: Eliminated @sms-hub/logger package (~1,000 lines)
- **Import Optimization**: Implemented marketing and lean bundle options
- **Zero Errors**: Clean build with zero TypeScript/ESLint errors
- **E2E Testing**: 48 tests across 6 browsers for performance validation

### **Key Performance Strategies**

- **Optimized Imports**: Use `@sms-hub/ui/marketing` for better bundle splitting
- **Code Simplification**: Removed unnecessary packages and dependencies
- **Bundle Analysis**: Regular monitoring with `npm run build:analyze`
- **Tree Shaking**: Strategic imports to eliminate unused code

---

**Last Updated**: October 3, 2025 at 12:30 PM ET  
**Status**: Performance guide complete and optimized
