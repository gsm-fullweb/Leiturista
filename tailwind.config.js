/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: {
          background: "#121212",
          surface: "#1E1E1E",
          primary: "#BB86FC",
          secondary: "#03DAC6",
          text: "#E1E1E1",
          border: "#2C2C2C",
        },
      },
    },
  },
  plugins: [],
};
