import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), glsl(), tailwindcss()],
  resolve: {
    alias: {
      "@common": path.resolve(__dirname, "src/modules/common"),
    },
  },
});
