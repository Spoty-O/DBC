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
      "@assets": path.resolve(__dirname, "src/assets"),
      "@navigation": path.resolve(__dirname, "src/navigation"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@services": path.resolve(__dirname, "src/services"),
      "@store": path.resolve(__dirname, "src/store"),
    },
  },
});
