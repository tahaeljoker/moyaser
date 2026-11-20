/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        emerald: {
          50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0',
          300: '#6ee7b7', 400: '#34d399', 500: '#10b981',
          600: '#059669', 700: '#047857', 800: '#065f46',
          900: '#064e3b', 950: '#022c22',
        },
        sand: {
          50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a',
          500: '#f59e0b', 600: '#d97706', 700: '#b45309',
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', 'Alexandria', 'sans-serif'],
        arabic: ['"IBM Plex Sans Arabic"', 'Alexandria', 'sans-serif'],
        display: ['Alexandria', '"IBM Plex Sans Arabic"', 'sans-serif'],
        heading: ['Alexandria', '"IBM Plex Sans Arabic"', 'sans-serif'],
        lulo: ['"Lulo Clean"', 'sans-serif'],
        mono: ['"Lulo Clean"', 'monospace'],
      },
    },
  },
  plugins: [],
}
