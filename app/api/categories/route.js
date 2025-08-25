// app/api/categories/route.js
const BACKEND_BASE =
  process.env.BACKEND_BASE ||
  process.env.NEXT_PUBLIC_BACKEND_BASE ||
  "http://127.0.0.1:5000";

export async function GET() {
  const res = await fetch(`${BACKEND_BASE}/categories`, { cache: "no-store" });
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
      { items: Array.isArray(data.items) ? data.items : [] },
      { status: 200 }
    );
  } catch {
    return Response.json({ items: [] }, { status: 200 });
  }
}
