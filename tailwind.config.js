/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#16211f",
        muted: "#5d6b68",
        paper: "#f2f5f4",
        surface: "#ffffff",
        line: "#dbe2e0",
        pine: { DEFAULT: "#0f3d3a", soft: "#1c5651" },
        saffron: "#e8a33d",
        good: "#1f7a4d",
        bad: "#b3372f",
      },
      fontFamily: { sans: ["var(--font-sans)", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};
