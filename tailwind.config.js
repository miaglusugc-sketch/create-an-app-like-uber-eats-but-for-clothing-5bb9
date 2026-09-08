/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Clash Display"', '"Plus Jakarta Sans"', 'ui-sans-serif', 'sans-serif'],
      },
      colors: {
        ink: {
          DEFAULT: '#171412',
          soft: '#3b3733',
          muted: '#8a827a',
        },
        cream: '#faf6f1',
        brand: {
          50: '#fff1ed',
          100: '#ffe0d6',
          200: '#ffc2ad',
          300: '#ff9b78',
          400: '#ff6f41',
          500: '#ff4d16',
          600: '#f03500',
          700: '#c62a02',
          800: '#9d2408',
          900: '#7f210b',
        },
      },
      boxShadow: {
        soft: '0 12px 40px -12px rgba(23, 20, 18, 0.18)',
        card: '0 2px 8px -2px rgba(23, 20, 18, 0.08), 0 10px 30px -12px rgba(23, 20, 18, 0.12)',
        pop: '0 20px 60px -18px rgba(240, 53, 0, 0.4)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'bob': {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'shimmer': {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'scale-in': 'scale-in 0.25s ease-out both',
        'slide-in': 'slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
        'bob': 'bob 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
