import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";

const appRoot = fileURLToPath(new URL(".", import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  root: appRoot,
  plugins: [react(), glsl()],
  resolve: {
    alias: {
      types: path.resolve(__dirname, "../../shared/types/index.ts"),
      "@common": path.resolve(appRoot, "src/modules/common"),
      "@assets": path.resolve(appRoot, "src/assets"),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": {
        target: process.env.VITE_PROXY_TARGET ?? "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
