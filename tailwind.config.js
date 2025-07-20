const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: { extend: {} },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('contrast', '.contrast &');
    }),
  ],
}