// app/api/products/route.js
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";
  const page = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const limit = Number.parseInt(searchParams.get("limit") ?? "24", 10);

  const backend = process.env.BACKEND_API_URL || "http://127.0.0.1:5000";
  const url = new URL("/products", backend);
  if (search) url.searchParams.set("search", search);
  if (category) url.searchParams.set("category", category);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));

  try {
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Backend responded ${res.status}` },
        { status: res.status }
      );
    }
    const data = await res.json();

    // Normalize to { items, total, page, limit }
    let items = [];
    let total = 0;
    let outPage = page;
    let outLimit = limit;

    if (Array.isArray(data)) {
      // Fallback if backend ever returned a flat array
      items = data;
      total = data.length;
    } else if (data && typeof data === "object") {
      items = Array.isArray(data.items) ? data.items : [];
      total = Number.isFinite(data.total) ? data.total : items.length;
      outPage = Number.isFinite(data.page) ? data.page : page;
      outLimit = Number.isFinite(data.limit) ? data.limit : limit;
    }

    // Ensure each item has expected keys (id, name, category, min_price, vendors_count)
    items = items.map((it) => ({
      id: it.id,
      name: it.name,
      category: it.category ?? "",
      min_price: typeof it.min_price === "number" ? it.min_price : Number(it.min_price),
      vendors_count: typeof it.vendors_count === "number" ? it.vendors_count : Number(it.vendors_count),
    }));

    return NextResponse.json({
      items,
      total,
      page: outPage,
      limit: outLimit,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to reach backend", details: String(err) },
      { status: 502 }
    );
  }
}
