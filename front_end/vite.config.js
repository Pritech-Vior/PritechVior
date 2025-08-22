import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // This prevents process.env errors in development
    "process.env": {},
  },
  build: {
    // Ensure proper environment handling in production
    rollupOptions: {
      external: [],
    },
  },
});
