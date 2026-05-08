/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#F4F8F4',
          100: '#E5EFE7',
          200: '#CDDFD2',
          300: '#A9C7B1',
          400: '#8FB59B',
          500: '#6F9A7E',
          600: '#557F65',
          700: '#436551',
          800: '#374F42',
          900: '#2E4138',
        },
        cream: {
          50: '#FBF8EF',
          100: '#F5F0E1',
          200: '#EDE4CB',
          300: '#E0D2A8',
        },
        ink: {
          900: '#1A2120',
          700: '#2E3A38',
          500: '#5A6967',
          300: '#A9B4B2',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl2': '1.25rem',
        'card': '1.5rem',
      },
      boxShadow: {
        soft: '0 6px 24px -8px rgba(46, 65, 56, 0.18)',
        lift: '0 14px 40px -12px rgba(46, 65, 56, 0.24)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
