import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        saffron: "#D4820A",
        "deep-gold": "#B8860B",
        "lotus-purple": "#8B6DB5",
        "lotus-pink": "#C2567A",
        "lotus-blue": "#5B8DD9",
        cream: "#FDF8F0",
        dark: "#0F0A05",
        "card-bg": "#FFFAF3",
        muted: "#7A6652",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#D4820A",
          foreground: "#FFFAF3",
        },
        secondary: {
          DEFAULT: "#8B6DB5",
          foreground: "#FFFAF3",
        },
        destructive: {
          DEFAULT: "#C2567A",
          foreground: "#FFFAF3",
        },
        accent: {
          DEFAULT: "#B8860B",
          foreground: "#0F0A05",
        },
        popover: {
          DEFAULT: "#FFFAF3",
          foreground: "#0F0A05",
        },
        card: {
          DEFAULT: "#FFFAF3",
          foreground: "#0F0A05",
        },
      },
      fontFamily: {
        heading: ["Yatra One", "serif"],
        body: ["Hind", "sans-serif"],
        sanskrit: ["Tiro Devanagari Sanskrit", "serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 10px #D4820A40" },
          "50%": { boxShadow: "0 0 25px #D4820A80" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 3s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
        shimmer: "shimmer 1.5s infinite",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #D4820A, #B8860B)",
        "lotus-gradient": "linear-gradient(135deg, #8B6DB5, #C2567A, #5B8DD9)",
        "cream-gradient": "linear-gradient(135deg, #FDF8F0, #FFF5E1)",
        "dark-mandala": "radial-gradient(ellipse at center, #1A0E02 0%, #0F0A05 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
