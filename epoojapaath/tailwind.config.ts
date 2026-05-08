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
        // Fixed brand colors (absolute — never flip with theme)
        saffron: "#D4820A",
        "deep-gold": "#B8860B",
        // Logo-accurate lotus palette (purple-blue-pink gradient in logo petals)
        "lotus-purple": "#9B7FD4",
        "lotus-pink": "#C285B5",
        "lotus-blue": "#7BA5D8",
        "lotus-red": "#C2567A",
        cream: "#FDF8F0",
        dark: "#0F0A05",

        // CSS-variable tokens — auto-flip in dark mode
        "card-bg": "var(--card-bg)",
        "surface": "var(--surface)",
        "muted-text": "var(--muted-color)",

        // Shadcn/radix tokens
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
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
        "spin-slow": "spin 120s linear infinite",
      },
      backgroundImage: {
        // Gold gradient from logo text/swirls
        "gold-gradient": "linear-gradient(135deg, #D4820A, #B8860B)",
        // Matches the logo lotus petal gradient: purple → blue → pink
        "lotus-gradient": "linear-gradient(135deg, #9B7FD4, #7BA5D8, #C285B5)",
        // Logo's top-to-bottom petal flow
        "logo-gradient": "linear-gradient(160deg, #9B7FD4 0%, #7BA5D8 50%, #C285B5 100%)",
        "cream-gradient": "linear-gradient(135deg, #FDF8F0, #FFF5E1)",
        "dark-mandala": "radial-gradient(ellipse at center, #1A0E02 0%, #0F0A05 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
