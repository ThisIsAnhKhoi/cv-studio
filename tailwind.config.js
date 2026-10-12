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
        display: ['Outfit', 'system-ui', 'sans-serif'],
        body: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        script: ['Pacifico', 'cursive'],
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
        'paper': '0 4px 30px rgba(0, 0, 0, 0.10)',
        'paper-dark': '0 4px 30px rgba(0, 0, 0, 0.40)',
      },
      screens: {
        'print': {'raw': 'print'},
      },
    },
  },
  plugins: [],
}
