/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fdf8f0',
          100: '#faefd9',
          200: '#f5ddb2',
          300: '#edc47f',
          400: '#e3a54b',
          500: '#d68d2a',
          600: '#c07320',
          700: '#a05a1c',
          800: '#81481d',
          900: '#6b3c1b',
        },
        night: {
          50:  '#f4f2f8',
          100: '#e8e4f0',
          200: '#c9c2d8',
          300: '#9a90b3',
          400: '#6f6590',
          500: '#4d4468',
          600: '#3a3050',
          700: '#2a2438',
          800: '#1e1929',
          900: '#17121f',
          950: '#0d0a16',
        },
      },
    },
  },
  plugins: [],
}
