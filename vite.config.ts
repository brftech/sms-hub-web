import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  envDir: ".", // Load .env from current directory
  server: {
    host: true, // Allow external connections
    port: 3005,
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
      "@sms-hub/hub-logic": path.resolve(__dirname, "./packages/hub-logic/src/index.ts"),
      "@sms-hub/supabase": path.resolve(__dirname, "./packages/supabase/src/index.ts"),
      "@sms-hub/clients": path.resolve(__dirname, "./packages/clients/src/index.ts"),
      "@sms-hub/utils": path.resolve(__dirname, "./packages/utils/src/index.ts"),
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
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
        // Ensure proper chunk loading order
        manualChunks: (id) => {
          // React ecosystem - must load first (includes JSX runtime)
          // Match all React-related modules including JSX runtime
          if (
            id.includes("node_modules/react") ||
            id.includes("/react/jsx-runtime") ||
            id.includes("/react/jsx-dev-runtime") ||
            id.includes("react/jsx-runtime") ||
            id.includes("react/jsx-dev-runtime")
          ) {
            return "react-vendor";
          }
          // Data fetching & state
          if (id.includes("node_modules/@tanstack/react-query")) {
            return "query-vendor";
          }
          // Supabase
          if (id.includes("node_modules/@supabase/supabase-js")) {
            return "supabase-vendor";
          }
          // Icons - large library
          if (id.includes("node_modules/lucide-react")) {
            return "icons";
          }
          // UI framework components
          if (id.includes("packages/ui/src")) {
            return "ui-framework";
          }
          // Hub logic and clients - these contain JSX so need React available
          if (id.includes("packages/hub-logic/src") || id.includes("packages/clients/src")) {
            return "hub-logic";
          }
          // Let Vite handle remaining node_modules automatically to avoid circular dependencies
          // Don't force everything else into a single vendor chunk
        },
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
      "@sms-hub/clients",
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
