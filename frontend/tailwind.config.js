/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // Include if it exists at the root
    "./src/**/*.{js,ts,jsx,tsx}", // Scans all relevant files in src
  ],
  theme: {
    extend: {
      // You can add custom theme extensions here if needed
      // e.g., custom colors, fonts, etc.
    },
  },
  plugins: [
     // Add any Tailwind plugins here, like @tailwindcss/forms
     // require('@tailwindcss/forms'),
  ],
}