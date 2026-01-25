import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        domain: {
          business: "hsl(var(--domain-business))",
          data: "hsl(var(--domain-data))",
          application: "hsl(var(--domain-application))",
          technology: "hsl(var(--domain-technology))",
          ai: "hsl(var(--domain-ai))",
          cloud: "hsl(var(--domain-cloud))",
        },
        role: {
          enterprise: "hsl(var(--role-enterprise))",
          solution: "hsl(var(--role-solution))",
          application: "hsl(var(--role-application))",
          data: "hsl(var(--role-data))",
          business: "hsl(var(--role-business))",
          ai: "hsl(var(--role-ai))",
          cloud: "hsl(var(--role-cloud))",
        },
        phase: {
          preliminary: "hsl(var(--phase-preliminary))",
          a: "hsl(var(--phase-a))",
          b: "hsl(var(--phase-b))",
          "c-data": "hsl(var(--phase-c-data))",
          "c-app": "hsl(var(--phase-c-app))",
          d: "hsl(var(--phase-d))",
          e: "hsl(var(--phase-e))",
          f: "hsl(var(--phase-f))",
          g: "hsl(var(--phase-g))",
          h: "hsl(var(--phase-h))",
          req: "hsl(var(--phase-req))",
        },
        zachman: {
          planner: "hsl(var(--zachman-planner))",
          owner: "hsl(var(--zachman-owner))",
          designer: "hsl(var(--zachman-designer))",
          builder: "hsl(var(--zachman-builder))",
          subcontractor: "hsl(var(--zachman-subcontractor))",
          worker: "hsl(var(--zachman-worker))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'soft': 'var(--shadow-sm)',
        'medium': 'var(--shadow-md)',
        'elevated': 'var(--shadow-lg)',
        'floating': 'var(--shadow-xl)',
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
