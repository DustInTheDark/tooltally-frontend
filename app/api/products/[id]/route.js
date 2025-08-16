// app/api/products/[id]/route.js
export async function GET(_req, ctx) {
  // Next.js 15 requires awaiting params in dynamic API routes
  const { id } = await ctx.params;

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing product id" }), {
      status: 400,
    });
  }

  const backend = process.env.BACKEND_API_URL;
  const url = `${backend}/products/${id}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: res.status,
    });
  }

  const data = await res.json();

  // Normalize detail payload so the UI can rely on product.offers[]
  // Backend shape (per brief): { id, name, category, vendors: [{ vendor, price, buy_url }] }
  const offers =
    data.offers ??
    data.vendors?.map((v) => ({
      vendor_name: v.vendor ?? v.name ?? "Vendor",
      price: v.price,
      url: v.buy_url ?? v.url,
      vendor_sku: v.vendor_sku ?? v.sku ?? null,
    })) ??
    [];

  return Response.json({
    id: data.id,
    name: data.name,
    category: data.category,
    offers,
  });
}
