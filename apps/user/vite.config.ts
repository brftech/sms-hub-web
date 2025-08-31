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
    port: 3001,
    host: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          supabase: ["@supabase/supabase-js"],
          ui: ["@sms-hub/ui"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["@sms-hub/ui", "@sms-hub/utils", "@sms-hub/types"],
  },
});
