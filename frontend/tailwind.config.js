/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nature: {
          dark: '#0f291e', // deep forest green
          primary: '#1b4332',
          DEFAULT: '#2d6a4f',
          light: '#40916c',
          sage: '#b7e4c7', // soft sage background
          glass: 'rgba(255, 255, 255, 0.1)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
