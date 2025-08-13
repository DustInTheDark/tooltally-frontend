// app/products/[id]/page.js
import { headers } from "next/headers";
import { formatGBP } from "@/utils/format";

export default async function ProductDetailPage({ params }) {
  // Next.js 15: params may be a Promise; unwrap it.
  const { id } = await params;

  // Next.js 15: headers() should be awaited.
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  const origin = `${proto}://${host}`;

  const res = await fetch(`${origin}/api/products/${encodeURIComponent(id)}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-gray-900">Product not found</h1>
        <p className="mt-2 text-gray-600">The product could not be loaded (status {res.status}).</p>
      </div>
    );
  }

  const data = await res.json();
  const { name, category } = data || {};
  const vendors = Array.isArray(data?.vendors) ? data.vendors : [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-semibold text-gray-100">{name}</h1>
      <div className="mt-1 text-sm text-gray-300">{category}</div>

      <div className="mt-6 space-y-3">
        {vendors.map((v, idx) => (
          <div key={`${v.vendor}-${idx}-${v.price ?? "na"}`} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="text-gray-900">{v.vendor}</div>
              <div className="flex items-center gap-4">
                <div className="font-semibold">{formatGBP(v.price)}</div>
                {v.buy_url ? (
                  <a
                    href={v.buy_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-500"
                  >
                    Buy
                  </a>
                ) : (
                  <span className="text-sm text-gray-500">No link</span>
                )}
              </div>
            </div>
          </div>
        ))}

        {vendors.length === 0 && (
          <div className="rounded-2xl bg-white p-4 text-gray-600">No offers found.</div>
        )}
      </div>
    </div>
  );
}
