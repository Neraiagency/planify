/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-bg': '#000000',
        'dark-card': '#111111',
        'dark-border': '#333333',
        'dark-text': '#f8f8f8',
        'dark-text-secondary': '#a0a0a0',
        'accent-blue': '#ff7b00',      // Substituído por laranja
        'accent-purple': '#ff9a44',    // Substituído por laranja mais claro
        'accent-green': '#10b981',     // Mantido para receitas
        'accent-red': '#ef4444',       // Mantido para despesas
        'accent-yellow': '#ff7b00',    // Substituído por laranja
      },
      boxShadow: {
        'glass': '0 4px 20px 0 rgba(0, 0, 0, 0.3)',
        'glass-hover': '0 8px 25px 0 rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
};