import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  envDir: "../../", // Load .env from monorepo root
  server: {
    host: "localhost",
    port: 3000,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@sms-hub/ui": path.resolve(__dirname, "../../packages/ui/src"),
    },
  },
  build: {
    target: "esnext",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: mode === "production",
        drop_debugger: mode === "production",
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React and React ecosystem
          if (
            id.includes("react") ||
            id.includes("react-dom") ||
            id.includes("react-router")
          ) {
            return "react-vendor";
          }

          // UI libraries and components
          if (
            id.includes("@sms-hub/ui") ||
            id.includes("lucide-react") ||
            id.includes("radix-ui")
          ) {
            return "ui-vendor";
          }

          // Supabase and database related
          if (id.includes("@supabase") || id.includes("@sms-hub/supabase")) {
            return "supabase-vendor";
          }

          // Query and state management
          if (id.includes("@tanstack") || id.includes("@sms-hub/utils")) {
            return "query-vendor";
          }

          // Client pages (lazy loaded)
          if (id.includes("/pages/clients/")) {
            return "client-pages";
          }

          // Main pages
          if (id.includes("/pages/") && !id.includes("/pages/clients/")) {
            return "main-pages";
          }

          // Large images and assets
          if (
            id.includes(".png") ||
            id.includes(".jpg") ||
            id.includes(".jpeg") ||
            id.includes(".svg")
          ) {
            return "assets";
          }
        },
      },
    },
    chunkSizeWarningLimit: 500, // Reduce warning limit to 500KB
    sourcemap: mode === "development",
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
  },
}));
