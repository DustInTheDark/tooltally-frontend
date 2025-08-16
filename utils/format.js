// utils/format.js
export const formatGBP = (n) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(n ?? 0);
