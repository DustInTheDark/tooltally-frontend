// components/ProductCard.js
"use client";

import Link from "next/link";

function gbp(x) {
  const n = Number(x);
  return Number.isFinite(n) ? `£${n.toFixed(2)}` : "£0.00";
}

export default function ProductCard(props) {
  // Accept either a single 'product' prop or individual props.
  const p = props.product ?? props;

  // Guard against undefined to avoid runtime crashes
  if (!p || (!p.id && !p.name)) {
    return null;
  }

  const id = p.id;
  const name = p.name ?? "Unnamed product";
  const category = p.category ?? "";
  const minPrice = p.min_price ?? p.price ?? 0;
  const vendorsCount = typeof p.vendors_count === "number" ? p.vendors_count : undefined;

  // If we somehow still don't have an id, render a non-link fallback
  const CardInner = (
    <div className="block border border-gray-300 rounded-lg p-4 hover:shadow transition-shadow bg-white">
      <p className="text-lg font-medium mb-1">{name}</p>
      {category && <p className="text-xs text-gray-500 mb-2">{category}</p>}
      <div className="flex items-baseline justify-between">
        {typeof vendorsCount === "number" ? (
          <span className="text-sm text-gray-600">
            {vendorsCount} {vendorsCount === 1 ? "vendor" : "vendors"}
          </span>
        ) : (
          <span className="text-sm text-gray-600">&nbsp;</span>
        )}
        <span className="font-semibold text-gray-800">{gbp(minPrice)}</span>
      </div>
    </div>
  );

  return id ? (
    <Link href={`/products/${id}`} className="block">
      {CardInner}
    </Link>
  ) : (
    CardInner
  );
}
