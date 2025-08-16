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
    const arr = product?.offers ?? product?.vendors ?? [];
    // Support either shape:
    // normalized offers: { vendor_name, price, url, vendor_sku }
    // backend vendors:  { vendor, price, buy_url }
    const mapped = arr.map((v) => ({
      vendor_name: v.vendor_name ?? v.vendor ?? v.name ?? "Vendor",
      price: v.price,
      url: v.url ?? v.buy_url,
      vendor_sku: v.vendor_sku ?? v.sku ?? null,
    }));
    return mapped.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
  }, [product]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (!product) return <div className="p-6">Not found</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
      <p className="text-gray-500">{product.category}</p>

      <h2 className="text-xl font-semibold mt-6 mb-3">Available from</h2>
      {offers.length === 0 ? (
        <p className="text-sm text-gray-500">No offers found.</p>
      ) : (
        <ul className="divide-y">
          {offers.map((o, i) => (
            <li key={i} className="py-3 flex justify-between items-center">
              <div>
                <span className="font-medium">{o.vendor_name}</span>
                {o.vendor_sku ? (
                  <span className="text-sm text-gray-400 ml-2">{o.vendor_sku}</span>
                ) : null}
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-green-600">
                  {formatGBP(o.price)}
                </span>
                {o.url ? (
                  <a
                    href={o.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Buy
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
