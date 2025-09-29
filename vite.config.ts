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
        // Advanced chunking strategy for better caching
        manualChunks: {
          'react-core': ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          'ui-components': ['@sms-hub/ui'],
          'data-layer': ['@supabase/supabase-js', '@tanstack/react-query'],
          'utils': ['@sms-hub/utils', '@sms-hub/logger'],
          'icons': ['lucide-react'],
          'styling': ['styled-components', 'tailwindcss-animate'],
        },
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
