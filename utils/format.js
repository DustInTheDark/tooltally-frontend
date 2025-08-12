// utils/format.js

/**
 * Format a number into GBP currency string.
 * @param {number|string} value - The price value to format.
 * @returns {string} - The formatted price in GBP, or "£—" if invalid.
 */
export function formatGBP(value) {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return "£—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 2,
  }).format(num);
}
