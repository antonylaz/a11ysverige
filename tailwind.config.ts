import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#f5f1e8",
        "cream-2": "#ebe5d4",
        paper: "#faf7ef",
        ink: "#1a1f1a",
        "ink-soft": "#4a544a",
        "ink-mute": "#8a8f86",
        line: "#d8d2c0",
        forest: "#1f3a2e",
        terracotta: "#c5552d",
        "green-leaf": "#6b8e5a",
        gold: "#d4a056",
        "red-warn": "#b04545",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        "tracking-uppercase": "0.1em",
      },
    },
  },
  plugins: [],
};

export default config;
