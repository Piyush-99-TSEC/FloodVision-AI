// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{ts,tsx}"],
//   theme: {
//     extend: {
//       fontFamily: {
//         display: ["'Space Grotesk'", "sans-serif"],
//         body: ["'Inter'", "sans-serif"],
//         mono: ["'JetBrains Mono'", "monospace"],
//       },
//       colors: {
//         ink: {
//           950: "#05080F",
//           900: "#0A0F1C",
//           850: "#0D1424",
//           800: "#101A2E",
//           700: "#16213A",
//           600: "#233150",
//           500: "#374764",
//         },
//         slate: {
//           100: "#E7ECF3",
//           300: "#B4BFD1",
//           400: "#8B96AB",
//           500: "#6B7690",
//         },
//         flood: {
//           300: "#7EEAF2",
//           400: "#3DD6E3",
//           500: "#17B6C4",
//           600: "#0F8E9B",
//         },
//         amber: {
//           400: "#F7B84B",
//           500: "#F5A524",
//         },
//         crimson: {
//           400: "#F5677B",
//           500: "#F0465A",
//           600: "#D42E42",
//         },
//         verdant: {
//           400: "#4FDB9F",
//           500: "#2BC48A",
//         },
//       },
//       boxShadow: {
//         panel: "0 1px 2px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.02)",
//         glow: "0 0 0 1px rgba(61,214,227,0.25), 0 0 24px rgba(61,214,227,0.12)",
//       },
//       backgroundImage: {
//         grid: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
//       },
//       backgroundSize: {
//         grid: "28px 28px",
//       },
//     },
//   },
//   plugins: [],
// };
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        ink: { 950: "#05080F", 900: "#0A0F1C", 850: "#0D1424", 800: "#101A2E", 700: "#16213A", 600: "#233150", 500: "#374764" },
        slate: { 100: "#E7ECF3", 300: "#B4BFD1", 400: "#8B96AB", 500: "#6B7690" },
        flood: { 300: "#7EEAF2", 400: "#3DD6E3", 500: "#17B6C4", 600: "#0F8E9B" },
        amber: { 400: "#F7B84B", 500: "#F5A524" },
        crimson: { 400: "#F5677B", 500: "#F0465A", 600: "#D42E42" },
        verdant: { 400: "#4FDB9F", 500: "#2BC48A" },
      },
      boxShadow: {
        panel: "0 1px 2px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.02)",
        glow: "0 0 0 1px rgba(61,214,227,0.25), 0 0 24px rgba(61,214,227,0.12)",
      },
      backgroundImage: { grid: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)" },
      backgroundSize: { grid: "28px 28px" },
    },
  },
  plugins: [],
};