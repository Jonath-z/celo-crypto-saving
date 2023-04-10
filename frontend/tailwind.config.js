/* eslint-disable prettier/prettier */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Noto", "sans-serif"],
        Blinker: ["Blinker", "sans-serif"],
      },
    },
  },
  plugins: [],
};
