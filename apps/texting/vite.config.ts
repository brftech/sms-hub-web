import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@sms-hub/ui": path.resolve(__dirname, "../../packages/ui/src"),
      "@sms-hub/types": path.resolve(__dirname, "../../packages/types/src"),
      "@sms-hub/utils": path.resolve(__dirname, "../../packages/utils/src"),
      "@sms-hub/supabase": path.resolve(
        __dirname,
        "../../packages/supabase/src"
      ),
      "@sms-hub/hub-logic": path.resolve(
        __dirname,
        "../../packages/hub-logic/src"
      ),
    },
  },
  server: {
    port: 3002,
    host: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
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
          // Pages (lazy loaded)
          if (id.includes("/pages/")) {
            return "pages";
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
    chunkSizeWarningLimit: 650, // Set realistic limit for React vendor chunk
  },
  optimizeDeps: {
    include: ["@sms-hub/ui", "@sms-hub/utils", "@sms-hub/types"],
  },
});
