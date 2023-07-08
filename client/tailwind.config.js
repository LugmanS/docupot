/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-light": "",
        "primary-dark": "",
        "primary-text-light": "#18181b",
        "primary-text-dark": "#f5f5f5",
        "secondary-text-light": "#52525b",
        "secondary-text-dark": "",
      }
    },
  },
  plugins: [],
};