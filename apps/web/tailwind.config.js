/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        zuno: {
          blue: '#2563EB',
          dark: '#0F172A',
          cyan: '#06B6D4',
          orange: '#F97316',
          magenta: '#D946EF',
          surface: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
        }
      }
    },
  },
  plugins: [],
}

