/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f6f5fb',
          100: '#ecebf5',
          200: '#d6d3e8',
          300: '#b3aed2',
          400: '#8a83b6',
          500: '#6a629b',
          600: '#544d80',
          700: '#464069',
          800: '#3b3757',
          900: '#252238',
          950: '#0f0d1a',
        },
        brand: {
          50: '#fff1f2',
          100: '#ffe1e5',
          200: '#ffc8cf',
          300: '#ff9daa',
          400: '#ff6479',
          500: '#ff2d55',
          600: '#ed0f3f',
          700: '#c80732',
          800: '#a70a30',
          900: '#8b0d2f',
          950: '#4d0116',
        },
        mint: {
          400: '#34e0a1',
          500: '#12c98a',
          600: '#0aa974',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['"Clash Display"', '"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(15, 13, 26, 0.08), 0 8px 30px -12px rgba(15, 13, 26, 0.12)',
        lift: '0 10px 40px -12px rgba(15, 13, 26, 0.25)',
        glow: '0 8px 30px -6px rgba(255, 45, 85, 0.45)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.7' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
        'scale-in': 'scale-in 0.25s ease-out both',
        'slide-up': 'slide-up 0.35s cubic-bezier(0.16,1,0.3,1) both',
        'slide-in-right': 'slide-in-right 0.35s cubic-bezier(0.16,1,0.3,1) both',
        float: 'float 4s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.2,0.6,0.4,1) infinite',
      },
    },
  },
  plugins: [],
}
