// app/api/products/[id]/route.js
import { NextResponse } from "next/server";

export async function GET(_request, context) {
  // In Next.js 15, context.params may be a Promise in route handlers.
  const maybePromise = context?.params;
  const p = typeof maybePromise?.then === "function" ? await maybePromise : maybePromise;
  const { id } = p || {};

  if (!id) {
    return NextResponse.json({ error: "Missing product id" }, { status: 400 });
  }

  const backend = process.env.BACKEND_API_URL || "http://127.0.0.1:5000";
  const url = `${backend.replace(/\/$/, "")}/products/${encodeURIComponent(id)}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Backend responded ${res.status}` },
        { status: res.status }
      );
    }
    const data = await res.json();

    // Ensure vendors sorted by ascending price
    if (data && Array.isArray(data.vendors)) {
      data.vendors = data.vendors
        .map((v) => ({
          vendor: v.vendor,
          price: typeof v.price === "number" ? v.price : Number(v.price),
          buy_url: v.buy_url || v.url || v.buyUrl,
        }))
        .sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to reach backend", details: String(err) },
      { status: 502 }
    );
  }
}
