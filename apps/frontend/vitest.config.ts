import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";

export default defineConfig({
  plugins: [react(), glsl()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/__tests__/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: {
      types: path.resolve(__dirname, "../../shared/types/index.ts"),
      "@common": path.resolve(__dirname, "./src/modules/common"),
      "@assets": path.resolve(__dirname, "./src/assets"),
    },
  },
});
