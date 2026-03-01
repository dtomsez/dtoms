/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
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
      },
    },
  },
  plugins: [],
}

