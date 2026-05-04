const path = require("node:path");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    path.join(__dirname, "index.html"),
    path.join(__dirname, "src/**/*.{js,ts,jsx,tsx}"),
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      colors: {
        matrix: {
          glow: "#39ff14",
          dim: "#0d3d0d",
          panel: "rgba(2, 12, 4, 0.72)",
          border: "rgba(57, 255, 20, 0.35)",
        },
      },
      boxShadow: {
        matrix:
          "0 0 24px rgba(57, 255, 20, 0.12), inset 0 0 0 1px rgba(57, 255, 20, 0.08)",
        "matrix-strong": "0 0 32px rgba(57, 255, 20, 0.2)",
      },
      backdropBlur: {
        panel: "14px",
      },
    },
  },
  plugins: [],
};
