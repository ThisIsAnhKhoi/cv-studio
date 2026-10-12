/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        cubano: ["'iCiel Cubano'", 'sans-serif'],
        optima: ["'SVN-Optima'", 'serif'],
        gilroy: ['Gilroy', 'sans-serif'],
        vietnam: ['"Be Vietnam Pro"', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        display: ['Gilroy', '"Be Vietnam Pro"', 'sans-serif'],
        body: ['"Be Vietnam Pro"', 'sans-serif'],
      },
      colors: {
        brand: {
          teal: {
            DEFAULT: '#0E7C6B',
            light: '#E6F5F1',
            dark: '#095C50',
          },
          tangerine: {
            DEFAULT: '#F97316',
            light: '#FFF7ED',
            mid: '#FDBA74',
          },
          coral: '#E86C50',
          sand: '#FDF8F3',
          ink: '#1E293B',
          slate: '#475569',
        },
      },
      boxShadow: {
        'paper': '0 10px 40px -10px rgba(0, 0, 0, 0.12), 0 2px 10px -2px rgba(0, 0, 0, 0.05)',
        'paper-dark': '0 10px 40px -10px rgba(0, 0, 0, 0.5), 0 2px 10px -2px rgba(0, 0, 0, 0.3)',
      },
      screens: {
        'print': {'raw': 'print'},
      },
    },
  },
  plugins: [],
}
