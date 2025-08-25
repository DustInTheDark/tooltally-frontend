// app/api/products/route.js
// Proxies the frontend to the local Flask backend.
// Maps `/api/products?search=Makita DHP484` → `http://127.0.0.1:5000/search?query=Makita%20DHP484`

const BACKEND_BASE =
  process.env.BACKEND_BASE ||
  process.env.NEXT_PUBLIC_BACKEND_BASE ||
  "http://127.0.0.1:5000";

export async function GET(req) {
  try {
    const urlIn = new URL(req.url);
    const search = (urlIn.searchParams.get("search") || "").trim();

    if (!search) {
      return Response.json(
        { product_info: {}, offers: [] },
        { status: 200 }
      );
    }

    const backendUrl = `${BACKEND_BASE}/search?query=${encodeURIComponent(
      search
    )}`;

    const res = await fetch(backendUrl, { cache: "no-store" });
    const text = await res.text(); // read as text first to handle non-JSON errors

    if (!res.ok) {
      // Bubble up backend message for easier debugging in the browser
      return new Response(text || `Backend ${res.status}`, {
        status: res.status,
        headers: { "content-type": "text/plain" },
      });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return Response.json(
        {
          error: "Invalid JSON from backend",
          hint: "Is Flask running on 127.0.0.1:5000 and returning JSON?",
          sample: text.slice(0, 200),
        },
        { status: 502 }
      );
    }

    // Pass-through: frontend expects { product_info, offers }
    return Response.json(data, { status: 200 });
  } catch (err) {
    return Response.json(
      { error: String(err || "Unknown error in /api/products route") },
      { status: 500 }
    );
  }
}
