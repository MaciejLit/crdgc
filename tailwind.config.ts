import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"], // Sprawdzamy wszystkie pliki TypeScript i TSX
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
