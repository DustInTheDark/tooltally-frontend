// app/api/products/route.js
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  const BACKEND = process.env.BACKEND_API_URL || "http://127.0.0.1:5000";
  const url = new URL("/products", BACKEND);
  if (search) url.searchParams.set("search", search);
  if (category) url.searchParams.set("category", category);

  // Fetch raw rows from Flask. Some setups return vendor-level rows (price, vendor_name),
  // others already return grouped rows (min_price). We normalize here.
  const upstream = await fetch(url.toString(), { cache: "no-store" });
  if (!upstream.ok) {
    return new Response(
      JSON.stringify({ error: `Upstream error ${upstream.status}` }),
      { status: 502, headers: { "content-type": "application/json" } }
    );
  }
  const raw = await upstream.json();

  // If already grouped (has min_price and no vendor_name), just return as-is.
  if (
    Array.isArray(raw) &&
    raw.length > 0 &&
    Object.prototype.hasOwnProperty.call(raw[0], "min_price") &&
    !Object.prototype.hasOwnProperty.call(raw[0], "vendor_name")
  ) {
    return Response.json(raw);
  }

  // Otherwise, raw looks vendor-specific (fields like price, vendor_name).
  // Group by name+category, compute min_price and vendors_count, pick a stable id.
  const byKey = new Map();
  for (const r of Array.isArray(raw) ? raw : []) {
    const name = r.name ?? "";
    const cat = r.category ?? "";
    const key = `${name.toLowerCase()}|${cat.toLowerCase()}`;

    const price = Number(
      r.min_price ?? r.price ?? (typeof r.price === "string" ? r.price.replace(/[^\d.]/g, "") : NaN)
    );
    const idVal = Number(r.id) || 0;

    if (!byKey.has(key)) {
      byKey.set(key, {
        id: idVal || 0,
        name,
        category: cat || null,
        min_price: Number.isFinite(price) ? price : 0,
        vendors_count: r.vendor_name ? 1 : 1, // default 1 if unknown
      });
    } else {
      const entry = byKey.get(key);
      if (Number.isFinite(price)) entry.min_price = Math.min(entry.min_price, price);
      entry.vendors_count += 1;
      if (idVal && (!entry.id || idVal < entry.id)) entry.id = idVal;
      byKey.set(key, entry);
    }
  }

  const products = Array.from(byKey.values()).sort((a, b) =>
    (a.name || "").localeCompare(b.name || "")
  );

  return Response.json(products);
}
