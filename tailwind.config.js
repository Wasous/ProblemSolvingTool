/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A', // Azul principal
        secondary: '#2563EB', // Azul más claro
        accent: '#9333EA', // Morado
        background: '#F3F4F6', // Fondo gris claro
        textPrimary: '#111827', // Texto principal
        textSecondary: '#6B7280',
        textClear: '#6B7280',
        textWhite: '#ffffff', // Texto gris
      },
    },
  },
  plugins: [],
};
