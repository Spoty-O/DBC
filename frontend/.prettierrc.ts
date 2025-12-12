import { type Config } from "prettier";

const config: Config = {
  printWidth: 80,
  tabWidth: 2,
  semi: true,
  plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
