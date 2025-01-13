/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#000000", // Deep black background
        secondary: "#1C1F26", // Slightly lighter black for cards
        accent: "#7C3AED", // Purple accent
        pinkishGlow: "#F472B6", // Pinkish accent for gradient end
        textLight: "#EDEDED", // Off-white text
      },
      fontFamily: {
        custom: ["Lexend", "sans-serif"],
      },
      boxShadow: {
        glow:
          "0 0 40px rgba(124, 58, 237, 0.7), 0 0 50px rgba(244, 114, 182, 0.7)", // Stronger purple and pink glow
      },
      animation: {
        glowPulse: "pulseGlow 3s infinite ease-in-out", // Slow pulse animation
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 30px rgba(124, 58, 237, 0.5), 0 0 40px rgba(244, 114, 182, 0.5)" },
          "50%": { boxShadow: "0 0 50px rgba(124, 58, 237, 0.8), 0 0 60px rgba(244, 114, 182, 0.8)" },
        },
      },
    },
  },
  plugins: [],
};
