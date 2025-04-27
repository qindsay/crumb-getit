/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#129575",
          200: "#0f8164",
          300: "#0d6d54",
          50: "#e6f3f0",
        },
      },
    },
  },
  plugins: [],
};
