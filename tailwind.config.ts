import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"], // Sprawdzamy wszystkie pliki TypeScript i TSX
  theme: {
    extend: {
      // Kolory ze styleguide'u
      colors: {
        brand: {
          green: "#379390",
          sky: "#D2EDF7",
          cream: "#F7FCF1",
          ink: "#0F2524",
          line: "#E3EBDC",
        },
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
