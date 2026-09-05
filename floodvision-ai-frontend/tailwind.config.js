/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Inter'", "'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        // Clean neutral background and surface palette mapped to existing utility classes
        ink: {
          950: "#0f172a", // Dark slate for header/sidebar accents if needed
          900: "#f8fafc", // Clean light page background
          850: "#f1f5f9", // Muted container background
          800: "#ffffff", // Pure white card surfaces
          700: "#e2e8f0", // Subtle border dividers
          600: "#cbd5e1", // Secondary borders
          500: "#64748b", // Muted text/subtitles
        },
        // Standard clean slate color scale
        slate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
        // Professional hydro blue primary brand palette
        flood: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0284c7",
          600: "#0369a1",
          700: "#075985",
          800: "#075985",
          900: "#0c4a6e",
        },
        // Alert Amber
        amber: {
          50: "#fffbeb",
          100: "#fef3c7",
          400: "#f59e0b",
          500: "#d97706",
          600: "#b45309",
          700: "#b45309",
        },
        // Emergency Red
        crimson: {
          50: "#fef2f2",
          100: "#fee2e2",
          400: "#f87171",
          500: "#dc2626",
          600: "#b91c1c",
          700: "#991b1b",
        },
        // Success Emerald
        verdant: {
          50: "#f0fdf4",
          100: "#dcfce7",
          400: "#4ade80",
          500: "#16a34a",
          600: "#15803d",
          700: "#15803d",
        },
      },
      boxShadow: {
        panel: "0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
        card: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        glow: "0 1px 2px 0 rgba(2, 132, 199, 0.15)",
      },
    },
  },
  plugins: [],
};