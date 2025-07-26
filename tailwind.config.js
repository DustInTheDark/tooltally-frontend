const plugin = require('tailwindcss/plugin');

/**
 * Tailwind config updated to refresh the brand colour palette.
 * The primary brand colour (brand‑blue) and accent (brand‑orange) have been
 * adjusted to create a more modern and appealing palette. Additional colour
 * tokens such as brand‑light and brand‑dark provide consistent backgrounds
 * and text colour across the site. Existing colour names are preserved so
 * the rest of the codebase does not need to change.
 */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand-blue': '#1E88E5',    // primary accent colour used for call‑to‑action buttons
        'brand-slate': '#263859',   // deep slate used for headers and footers
        'brand-light': '#F9FAFB',   // very light grey used for backgrounds
        'brand-orange': '#F57C00',  // secondary accent colour used sparingly
        'brand-dark': '#212121',    // dark grey for primary text colour
        'brand-green': '#20B07F',   // unchanged; reserved for success states
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      // retain the contrast variant from the original configuration
      addVariant('contrast', '.contrast &');
    }),
  ],
};
