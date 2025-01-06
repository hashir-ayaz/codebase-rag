import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  define:{
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  },
  server:{
    host:'0.0.0.0',
    port:5173
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
