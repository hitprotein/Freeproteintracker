import type { Config } from "tailwindcss";

// White/light-first by design decision — differentiates this site visually
// from hitprotein.com.au and proteintracker.com.au (both black-dominant),
// while keeping the same brand colors for family consistency.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "fpt-black": "#0B0D0C",
        "fpt-grey": "#E7E9E5",
        "fpt-white": "#FFFFFF",
        "fpt-offwhite": "#F7F8F6",
        "fpt-green": "#B4FF00",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        card: "14px",
      },
    },
  },
  plugins: [],
};

export default config;
