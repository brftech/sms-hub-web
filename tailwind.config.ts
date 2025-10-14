import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}", "./packages/ui/src/**/*.{ts,tsx}"],
  safelist: [
    // Hub-specific colors - ensure all hub colors are always generated
    // Gnymble (Orange)
    'text-orange-400', 'text-orange-500', 'text-orange-600',
    'bg-orange-400', 'bg-orange-500', 'bg-orange-600',
    'bg-orange-400/10', 'bg-orange-500/10', 'bg-orange-500/20',
    'border-orange-300', 'border-orange-400', 'border-orange-500',
    'border-orange-400/30', 'border-orange-500/30',
    'hover:bg-orange-300', 'hover:bg-orange-400', 'hover:bg-orange-500',
    'hover:border-orange-300', 'hover:border-orange-400',
    'from-orange-500', 'to-red-600',
    'shadow-orange-500/25',
    
    // PercyTech (Red)
    'text-red-600', 'text-red-700', 'text-red-800',
    'bg-red-600', 'bg-red-700', 'bg-red-800',
    'bg-red-800/10', 'bg-red-800/20',
    'border-red-700', 'border-red-800',
    'border-red-800/30',
    'hover:bg-red-700', 'hover:bg-red-800',
    'hover:border-red-700',
    'from-red-800', 'to-blue-600',
    'shadow-red-800/25',
    
    // PercyMD (Blue)
    'text-blue-500', 'text-blue-600', 'text-blue-700',
    'bg-blue-500', 'bg-blue-600', 'bg-blue-700',
    'bg-blue-600/10', 'bg-blue-600/20',
    'border-blue-500', 'border-blue-600',
    'border-blue-600/30',
    'hover:bg-blue-500', 'hover:bg-blue-600',
    'hover:border-blue-500',
    'from-blue-600', 'to-blue-700',
    'shadow-blue-600/25',
    
    // PercyText (Purple)
    'text-purple-500', 'text-purple-600', 'text-purple-700',
    'bg-purple-500', 'bg-purple-600', 'bg-purple-700',
    'bg-purple-600/10', 'bg-purple-600/20',
    'border-purple-500', 'border-purple-600',
    'border-purple-600/30',
    'hover:bg-purple-500', 'hover:bg-purple-600',
    'hover:border-purple-500',
    'from-purple-600', 'to-purple-700',
    'shadow-purple-600/25',
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
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Accessibility-compliant text colors
        text: {
          primary: "#ffffff", // Pure white for main text
          secondary: "#d1d5db", // Gray-300 equivalent (better contrast)
          muted: "#9ca3af", // Gray-400 equivalent (still accessible)
          disabled: "#6b7280", // Gray-500 equivalent (for disabled states only)
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        bronze: {
          DEFAULT: "hsl(var(--bronze))",
          foreground: "hsl(var(--bronze-foreground))",
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
      },
      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-hero": "var(--gradient-hero)",
        "gradient-card": "var(--gradient-card)",
      },
      boxShadow: {
        primary: "var(--shadow-primary)",
        glow: "var(--shadow-glow)",
        elegant: "var(--shadow-elegant)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
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
