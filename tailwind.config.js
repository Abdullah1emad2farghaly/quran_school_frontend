/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        latin: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        arabic: ["'Cairo'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
         // Body / UI text — matches the rest of the system
        cairo: ["Cairo", "system-ui", "sans-serif"],
        // Display / brand title — traditional Naskh-style for an authentic feel
        amiri: ["Aref Ruqaa", "serif"],
      },
      colors: {
        ink: "#1c2521",
        "ink-soft": "#4a544f",
        "ink-faint": "#7c857f",
        paper: "#faf8f3",
        paperr: {
          50: "#fefdfb",
          100: "#faf6ec",
          200: "#f2ead4",
        },
        "paper-raised": "#ffffff",
        line: "#e7e3d8",
        "line-soft": "#f0ede4",
        primary: {
          DEFAULT: "#0d6e5e",
          dark: "#0a5448",
          darker: "#073b32",
          light: "#15876f",
          soft: "#e3f1ec",
        },
        // Primary brand palette — deep forest green, evokes the cover of a mushaf
        forest: {
          50:  '#f0f7f0',
          100: '#d9edd9',
          200: '#b3dab3',
          300: '#7fbf7f',
          400: '#4da64d',
          500: '#2d8c2d',
          600: '#1a6b1a',
          700: '#145214',
          800: '#0f3d0f',
          900: '#0a2a0a',
          950: '#061806',
        },
        // Accent — illuminated gold leaf, used sparingly
        gold: {
          DEFAULT: "#b8923f",
          dark: "#96732d",
          soft: "#f6eed9",
          50:  '#fefbe8',
          100: '#fef6c3',
          200: '#fded89',
          300: '#fbde45',
          400: '#f7ca13',
          500: '#e7b008',
          600: '#c78904',
          700: '#9f6207',
          800: '#834d0e',
          900: '#6f3f11',
          950: '#412006',
        },
        rose: {
          DEFAULT: "#b5483f",
          soft: "#fbe9e7",
        },
        amber: {
          DEFAULT: "#a86b16",
          soft: "#fbeed9",
        },
        sky: {
          DEFAULT: "#2a5d8f",
          soft: "#e6eef7",
        },
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(28,37,33,0.04), 0 1px 8px -2px rgba(28,37,33,0.06)",
        raised: "0 4px 16px -4px rgba(28,37,33,0.10), 0 2px 6px -2px rgba(28,37,33,0.06)",
        modal: "0 20px 60px -12px rgba(15,20,18,0.35)",
      },
      borderRadius: {
        xl2: "1rem",
      },
      
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        fadeIn: {
          from: { opacity: 0, transform: "translateY(4px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        slideUp: {
          from: { opacity: 0, transform: "translateY(12px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        popIn: {
          from: { opacity: 0, transform: "scale(0.96)" },
          to: { opacity: 1, transform: "scale(1)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.4s linear infinite",
        fadeIn: "fadeIn 0.25s ease-out",
        slideUp: "slideUp 0.3s ease-out",
        popIn: "popIn 0.18s ease-out",
      },
      backgroundImage: {
        "star-pattern": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%23c9962a' stroke-width='0.6' opacity='0.35'%3E%3Cpath d='M40 4 L48 24 L70 24 L52 38 L60 60 L40 46 L20 60 L28 38 L10 24 L32 24 Z'/%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
