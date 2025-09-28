import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  envDir: ".", // Load .env from current directory
  server: {
    host: "localhost",
    port: 3000,
  },
  plugins: [react({
    jsxRuntime: 'automatic',
    jsxImportSource: 'react'
  })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@sms-hub/ui": path.resolve(__dirname, "./packages/ui/src"),
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
    },
  },
  build: {
    target: "esnext",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: mode === "production",
        drop_debugger: mode === "production",
        pure_funcs: mode === "production" ? ["console.log", "console.info"] : [],
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // More aggressive chunk splitting for better caching
          if (id.includes('node_modules')) {
            // Core React ecosystem
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-core';
            }
            // UI components and styling
            if (id.includes('@radix-ui') || id.includes('lucide-react') || id.includes('styled-components')) {
              return 'ui-components';
            }
            // Data fetching and state
            if (id.includes('@tanstack/react-query') || id.includes('@supabase/supabase-js')) {
              return 'data-layer';
            }
            // Form handling
            if (id.includes('react-hook-form') || id.includes('zod')) {
              return 'forms';
            }
            // Charts and visualization
            if (id.includes('recharts') || id.includes('@tanstack/react-table')) {
              return 'charts';
            }
            // Everything else
            return 'vendor';
          }
          // Split our own packages
          if (id.includes('@sms-hub/ui')) {
            return 'sms-ui';
          }
          if (id.includes('@sms-hub/supabase') || id.includes('@sms-hub/hub-logic')) {
            return 'sms-hub-core';
          }
          // Split large pages
          if (id.includes('/pages/Pricing.tsx')) {
            return 'pricing-page';
          }
          if (id.includes('/pages/FAQ.tsx')) {
            return 'faq-page';
          }
        },
        // Optimize chunk names
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 300, // Stricter limit for better performance
    sourcemap: mode === "development",
    // Enable CSS code splitting
    cssCodeSplit: true,
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@supabase/supabase-js",
      "@tanstack/react-query",
      "@sms-hub/ui",
      "@sms-hub/supabase",
      "@sms-hub/utils",
    ],
    // Exclude heavy dependencies from pre-bundling
    exclude: ["@radix-ui/react-accordion", "@radix-ui/react-dialog"],
  },
  // Performance optimizations
  esbuild: {
    target: 'es2020',
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
}));
