// app/api/products/route.js
const BACKEND_BASE =
  process.env.BACKEND_BASE ||
  process.env.NEXT_PUBLIC_BACKEND_BASE ||
  "http://127.0.0.1:5000";

export async function GET(req) {
  const urlIn = new URL(req.url);
  const search   = (urlIn.searchParams.get("search") || "").trim();
  const category = (urlIn.searchParams.get("category") || "").trim();
  const page     = urlIn.searchParams.get("page")  || "1";
  const limit    = urlIn.searchParams.get("limit") || "24";

  const backendUrl = `${BACKEND_BASE}/products?search=${encodeURIComponent(
    search
  )}&category=${encodeURIComponent(category)}&page=${encodeURIComponent(
    page
  )}&limit=${encodeURIComponent(limit)}`;

  const res = await fetch(backendUrl, { cache: "no-store" });
  const text = await res.text();

  if (!res.ok) {
    return new Response(text || `Backend ${res.status}`, {
      status: res.status,
      headers: { "content-type": "text/plain" },
    });
  }

  try {
    const data = JSON.parse(text);
    return Response.json(
      {
        items: Array.isArray(data.items) ? data.items : [],
        total: Number(data.total || 0),
        page: Number(data.page || 1),
        limit: Number(data.limit || 24),
      },
      { status: 200 }
    );
  } catch {
    return Response.json({ items: [], total: 0, page: 1, limit: 24 }, { status: 200 });
  }
}
