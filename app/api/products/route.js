// app/api/products/route.js
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  const BACKEND = process.env.BACKEND_API_URL || "http://127.0.0.1:5000";
  const url = new URL("/products", BACKEND);
  if (search) url.searchParams.set("search", search);
  if (category) url.searchParams.set("category", category);

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    return new Response(
      JSON.stringify({ error: `Upstream error ${res.status}` }),
      { status: 502, headers: { "content-type": "application/json" } }
    );
  }
  const data = await res.json();
  return Response.json(data);
}
