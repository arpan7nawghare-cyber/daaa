/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        eco: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        night: {
          950: '#070f0b',
          900: '#0b1f17',
          850: '#0e2820',
          800: '#0f2a1e',
          750: '#133327',
          700: '#1a4030',
          650: '#214d3a',
          600: '#2a5a45',
        },
      },
    },
  },
  plugins: [],
};
