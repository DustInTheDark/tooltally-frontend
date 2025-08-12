export function formatGBP(value) {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) return "—";
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value));
  } catch {
    return `£${Number(value).toFixed(2)}`;
  }
}

export function formatInt(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return String(n ?? "");
  return new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(x);
}
