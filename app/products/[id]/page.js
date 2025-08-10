// app/products/[id]/page.js
"use client";

import { useEffect, useState } from "react";

function gbp(x) {
  const n = Number(x);
  return Number.isFinite(n) ? `£${n.toFixed(2)}` : "£0.00";
}

export default function ProductDetailPage({ params }) {
  const { id } = params;
  const [product, setProduct] = useState(null);  // { id, name, category, vendors: [{vendor, price, buy_url}] }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setError("");
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`, { cache: "no-store" });
        if (!res.ok) {
          if (res.status === 404) {
            if (!cancelled) setError("Product not found.");
            return;
          }
          throw new Error(`API ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        if (!cancelled) setProduct(data);
      } catch (e) {
        console.error(e);
        if (!cancelled) setError("Failed to load product details. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [id]);

  return (
    <main className="container mx-auto px-4 py-8">
      {loading && <p className="text-gray-600">Loading product details…</p>}
      {!loading && error && <p className="text-red-600">{error}</p>}

      {!loading && !error && product && (
        <>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          {product.category && (
            <p className="mb-6 text-sm text-gray-600">{product.category}</p>
          )}

          {Array.isArray(product.vendors) && product.vendors.length > 0 ? (
            <ul className="space-y-4">
              {product.vendors.map((v, i) => (
                <li
                  key={`${v.vendor}-${i}`}
                  className="flex items-center justify-between border border-gray-300 rounded-lg p-4 bg-white"
                >
                  <div className="font-medium text-gray-800">{v.vendor}</div>
                  <div className="flex items-center gap-4">
                    <div className="font-semibold text-gray-900">{gbp(v.price)}</div>
                    <a
                      href={v.buy_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white text-sm font-medium px-3 py-2 rounded hover:opacity-95"
                    >
                      Buy
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No vendors available for this product.</p>
          )}
        </>
      )}
    </main>
  );
}
