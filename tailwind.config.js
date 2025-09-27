/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
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
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        action: {
          DEFAULT: "hsl(var(--accent-cyan))",
          foreground: "hsl(var(--accent-cyan-foreground))",
        },
        accentCyan: {
          DEFAULT: "hsl(var(--accent-cyan))",
          foreground: "hsl(var(--accent-cyan-foreground))",
        },
        accentMagenta: {
          DEFAULT: "hsl(var(--accent-magenta))",
          foreground: "hsl(var(--accent-magenta-foreground))",
        },
        accentEmerald: {
          DEFAULT: "hsl(var(--accent-emerald))",
          foreground: "hsl(var(--accent-emerald-foreground))",
        },
        accentAmber: {
          DEFAULT: "hsl(var(--accent-amber))",
          foreground: "hsl(var(--accent-amber-foreground))",
        },
        surface: {
          divider: "var(--surface-divider)",
        },
        variable: {
          DEFAULT: "hsl(var(--accent-cyan))",
          highlight: "hsl(var(--variable-highlight))",
          "highlight-border": "hsl(var(--variable-highlight-border))",
        },
        array: {
          DEFAULT: "hsl(var(--accent-magenta))",
          highlight: "hsla(282, 82%, 62%, 0.12)",
          border: "hsl(var(--accent-magenta))",
        },
        console: {
          DEFAULT: "#12141C",
          text: "hsl(220, 15%, 74%)",
        }
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
        "variable-highlight": {
          "0%": { backgroundColor: "hsl(var(--variable-highlight))" },
          "100%": { backgroundColor: "transparent" },
        },
        "variable-highlight-border-anim": {
          "0%, 100%": { "border-color": "hsl(var(--border))" },
          "50%": { "border-color": "hsl(var(--variable-highlight-border))" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "variable-highlight": "variable-highlight 0.5s ease-out",
        "variable-highlight-border": "variable-highlight-border-anim 0.8s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}