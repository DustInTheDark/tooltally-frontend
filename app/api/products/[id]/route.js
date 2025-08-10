// app/api/products/[id]/route.js
export async function GET(_req, { params }) {
  const BACKEND = process.env.BACKEND_API_URL || "http://127.0.0.1:5000";
  const res = await fetch(`${BACKEND}/products/${params.id}`, { cache: "no-store" });
  if (!res.ok) {
    return new Response(
      JSON.stringify({ error: `Upstream error ${res.status}` }),
      { status: res.status, headers: { "content-type": "application/json" } }
    );
  }
  const data = await res.json();
  return Response.json(data);
}
