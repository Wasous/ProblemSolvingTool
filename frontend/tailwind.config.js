/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A', // Main blue
        secondary: '#2563EB', // Lighter blue
        accent: '#9333EA', // Purple
        background: '#F3F4F6', // Light gray background
        accentBg: '#669bbc',
        textPrimary: '#111827', // Main text
        textSecondary: '#6B7280',
        textClear: '#6B7280',
        textWhite: '#ffffff', // White text
        greyBackground: '#c2dfe3',
        greenText: '#588157',
        greenTextHover: '#3a5a40',
        yellowDark: '#e9c46a',
        yellowDarkHover: '#E2B33C'
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out'
      }
    },
  },
  plugins: [],
};