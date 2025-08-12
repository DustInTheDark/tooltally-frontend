import "server-only";

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://127.0.0.1:5000";

function safeNumber(n) {
  const x = Number(n);
  return Number.isFinite(x) ? x : null;
}

function formatKey(name, category) {
  return `${(name || "").trim()}|${(category || "").trim()}`.toLowerCase();
}

/**
 * Normalize backend data to grouped items:
 * { id, name, category, min_price, vendors_count }
 *
 * - If backend already returns grouped items with these fields, we pass through.
 * - If backend returns vendor-level rows, we group by name+category, compute min_price,
 *   count distinct vendors, and pick a stable id from the first row in each group.
 */
function normalizeProducts(input) {
  if (!Array.isArray(input)) return [];

  const looksGrouped =
    input.length > 0 &&
    "id" in input[0] &&
    "name" in input[0] &&
    "category" in input[0] &&
    "min_price" in input[0];

  if (looksGrouped) {
    // Ensure vendors_count exists if provided from backend; otherwise set null
    return input.map((it) => ({
      id: it.id,
      name: it.name,
      category: it.category ?? null,
      min_price: safeNumber(it.min_price),
      vendors_count:
        typeof it.vendors_count === "number"
          ? it.vendors_count
          : it.vendors
          ? new Set((it.vendors || []).map((v) => v.vendor)).size
          : null,
    }));
  }

  // Vendor-level -> group
  const groups = new Map();
  for (const row of input) {
    const key = formatKey(row.name, row.category);
    if (!groups.has(key)) {
      groups.set(key, {
        id: row.id, // choose first seen row's id as canonical (must be a real backend id)
        name: row.name,
        category: row.category ?? null,
        min_price: safeNumber(row.price),
        vendors: new Set(row.vendor ? [row.vendor] : []),
      });
    } else {
      const g = groups.get(key);
      // Prefer a stable smallest numeric id if available
      const rowIdNum = Number(row.id);
      const gIdNum = Number(g.id);
      if (Number.isFinite(rowIdNum) && Number.isFinite(gIdNum)) {
        if (rowIdNum < gIdNum) g.id = row.id;
      }
      if (!Number.isFinite(gIdNum) && row.id && typeof row.id === "string") {
        // keep original chosen id if not numeric
      }

      const price = safeNumber(row.price);
      if (Number.isFinite(price)) {
        if (!Number.isFinite(g.min_price) || price < g.min_price) {
          g.min_price = price;
        }
      }
      if (row.vendor) g.vendors.add(row.vendor);
    }
  }

  const out = [];
  for (const g of groups.values()) {
    out.push({
      id: g.id,
      name: g.name,
      category: g.category,
      min_price: g.min_price,
      vendors_count: g.vendors.size,
    });
  }
  return out;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const limitRaw = Number(searchParams.get("limit") || "0");
  const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? limitRaw : 0; // 0 means "no pagination"

  // Build backend URL (single fetch)
  const upstream = new URL("/products", BACKEND_API_URL);
  if (search) upstream.searchParams.set("search", search);
  if (category) upstream.searchParams.set("category", category);

  const res = await fetch(upstream.toString(), { cache: "no-store" });
  if (!res.ok) {
    return new Response(
      JSON.stringify({ error: `Backend error ${res.status}` }),
      { status: res.status, headers: { "content-type": "application/json" } }
    );
  }
  const raw = await res.json();
  const normalized = normalizeProducts(raw);

  if (limit > 0) {
    const total = normalized.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const items = start < total ? normalized.slice(start, end) : [];
    return new Response(
      JSON.stringify({ items, total, page, limit }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  }

  // No pagination requested -> return full array (legacy behavior)
  return new Response(JSON.stringify(normalized), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
