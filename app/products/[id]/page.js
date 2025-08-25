// app/products/[id]/page.js
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { formatGBP } from "@/utils/format";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`, { cache: "no-store" });
        if (res.ok) {
          setProduct(await res.json());
        } else {
          setProduct(null);
        }
      } catch (e) {
        console.error(e);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  const offers = useMemo(() => {
    const raw = product?.offers ?? product?.vendors ?? [];
    // Normalize to a single shape and sort by price asc
    const mapped = raw
      .map((v) => ({
        vendor_name: v.vendor_name ?? v.vendor ?? v.name ?? "Vendor",
        price: v.price ?? v.min_price ?? null,
        url: v.url ?? v.buy_url ?? null,
        vendor_sku: v.vendor_sku ?? v.sku ?? null,
      }))
      .filter((o) => o.price != null)
      .sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    return mapped;
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-[60vh] p-6 bg-slate-900 text-white">
        Loading…
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] p-6 bg-slate-900 text-white">
        Not found.
      </div>
    );
  }

  return (
    <div className="min-h-[100vh] p-6 bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="mt-1 text-slate-300">{product.category}</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Available from</h2>

        {offers.length === 0 ? (
          <p className="text-slate-300">No offers found.</p>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((o, i) => (
              <div
                key={`${o.vendor_name}-${o.url ?? i}`}
                className="rounded-xl border border-slate-700 bg-slate-800/60 p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{o.vendor_name}</h3>
                    <span className="text-xl font-bold text-green-400">
                      {formatGBP(o.price)}
                    </span>
                  </div>
                  {o.vendor_sku ? (
                    <p className="mt-1 text-xs text-slate-400">
                      SKU: {o.vendor_sku}
                    </p>
                  ) : null}
                </div>

                <div className="mt-4">
                  {o.url ? (
                    <a
                      href={o.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 font-medium text-white"
                    >
                      Buy
                    </a>
                  ) : (
                    <span className="text-slate-400 text-sm">No link</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
