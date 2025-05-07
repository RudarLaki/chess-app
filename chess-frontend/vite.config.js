import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // 🔥 Required for public access
    port: 5173, // ✅ Keep this as-is
  },
});
