import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  envDir: ".", // Load .env from current directory
  server: {
    host: true, // Allow external connections
    port: 3000,
    open: false, // Don't auto-open browser
    cors: true,
    hmr: {
      overlay: true, // Show error overlay
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@sms-hub/ui/marketing": path.resolve(__dirname, "./packages/ui/src/index-marketing.ts"),
      "@sms-hub/ui": path.resolve(__dirname, "./packages/ui/src"),
    },
    dedupe: ["react", "react-dom"],
    preserveSymlinks: true,
  },
  build: {
    target: "esnext",
    // Use esbuild minifier for safer cross-chunk symbol handling
    minify: true,
    rollupOptions: {
      output: {
        // Optimized chunking strategy to reduce bundle sizes
        manualChunks(id) {
          // Core React dependencies
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
            return "react-core";
          }

          // Router
          if (id.includes("react-router")) {
            return "react-router";
          }

          // Only include actually used Radix components
          if (
            id.includes("@radix-ui/react-dialog") ||
            id.includes("@radix-ui/react-label") ||
            id.includes("@radix-ui/react-slot")
          ) {
            return "radix-essentials";
          }

          // All other Radix components (should be tree-shaken out)
          if (id.includes("@radix-ui/")) {
            return "radix-unused";
          }

          // Data layer
          if (id.includes("@supabase/") || id.includes("@tanstack/react-query")) {
            return "data-layer";
          }

          // Icons
          if (id.includes("lucide-react")) {
            return "icons";
          }

          // Utilities
          if (id.includes("@sms-hub/utils") || id.includes("@sms-hub/logger")) {
            return "utils";
          }

          // UI components - split by actual usage
          if (id.includes("@sms-hub/ui")) {
            // Check if it's a heavily used component
            if (
              id.includes("/components/button") ||
              id.includes("/components/card") ||
              id.includes("/components/layout") ||
              id.includes("/contexts/HubContext")
            ) {
              return "ui-core";
            }
            return "ui-extras";
          }

          // Vendor chunk for remaining node_modules
          if (id.includes("node_modules/")) {
            return "vendor";
          }
        },
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
      // Use default treeshake settings for stability
    },
    chunkSizeWarningLimit: 150, // Much stricter limit
    sourcemap: mode === "development",
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Reduce initial bundle size
    reportCompressedSize: true,
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react-router-dom",
      "@supabase/supabase-js",
      "@tanstack/react-query",
      "@sms-hub/ui",
      "@sms-hub/supabase",
      "@sms-hub/utils",
    ],
    dedupe: ["react", "react-dom"],
    // Exclude heavy dependencies from pre-bundling
    exclude: ["@radix-ui/react-accordion", "@radix-ui/react-dialog"],
  },
  // Performance optimizations
  esbuild: {
    target: "es2020",
    drop: mode === "production" ? ["console", "debugger"] : [],
  },
}));
