/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yellow: {
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        logo: ['Alex Brush', 'cursive'],
      }
    },
  },
  plugins: [],
}
