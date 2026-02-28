/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#22223B",
        secondary: "#9A8C98",
        accent: "#C9ADA7",
        light: "#F2E9E4",
        white: "#ffffff",
      },
    },
  },
  plugins: [],
};