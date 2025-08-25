// app/api/products/[id]/route.js
// Proxies to Flask /product/:id (detail endpoint).

const BACKEND_BASE =
  process.env.BACKEND_BASE ||
  process.env.NEXT_PUBLIC_BACKEND_BASE ||
  "http://127.0.0.1:5000";

export async function GET(_req, context) {
  const { id } = await context.params; // Next 15 requires await
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });

  const url = `${BACKEND_BASE}/product/${encodeURIComponent(id)}`;
  const res = await fetch(url, { cache: "no-store" });
  const text = await res.text();

  if (!res.ok) {
    return new Response(text || `Backend ${res.status}`, {
      status: res.status,
      headers: { "content-type": "text/plain" },
    });
  }

  try {
    const data = JSON.parse(text);
    return Response.json(data, { status: 200 });
  } catch {
    return Response.json({ product_info: {}, offers: [] }, { status: 200 });
  }
}
