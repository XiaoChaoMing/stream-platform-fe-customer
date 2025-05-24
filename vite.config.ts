import path from "path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import compression from "vite-plugin-compression";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),compression()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
});
