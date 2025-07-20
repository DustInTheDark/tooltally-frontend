const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand-blue': '#0074E4',
        'brand-slate': '#2E3A59',
        'brand-light': '#F8F9FA',
        'brand-orange': '#FF6600',
        'brand-dark': '#333333',
        'brand-green': '#20B07F',
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('contrast', '.contrast &');
    }),
  ],
}