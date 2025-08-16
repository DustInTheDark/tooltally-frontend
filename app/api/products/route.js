// app/api/products/route.js
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "24";

  const backend = process.env.BACKEND_API_URL;
  const url = `${backend}/products?search=${encodeURIComponent(
    search
  )}&category=${encodeURIComponent(category)}&page=${page}&limit=${limit}`;

  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();

  // Normalize to { items, total, page, limit } if backend ever returns a bare array
  if (Array.isArray(data)) {
    return Response.json({
      items: data,
      total: data.length,
      page: Number(page),
      limit: Number(limit),
    });
  }

  // Otherwise pass through (backend already returns { items, total, page, limit })
  return Response.json({
    items: data.items ?? [],
    total: data.total ?? (data.items ? data.items.length : 0),
    page: Number(data.page ?? page),
    limit: Number(data.limit ?? limit),
  });
}
