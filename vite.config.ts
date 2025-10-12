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
      "@sms-hub/hub-logic": path.resolve(__dirname, "./packages/hub-logic/src/index.ts"),
      "@sms-hub/supabase": path.resolve(__dirname, "./packages/supabase/src/index.ts"),
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
