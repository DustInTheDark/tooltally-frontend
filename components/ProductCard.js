"use client";

import Link from "next/link";
import { formatGBP } from "@/utils/format";

export default function ProductCard({ product }) {
  if (!product) return null;

  const {
    id,
    name,
    category,
    min_price: minPrice,
    vendors_count: vendorsCount,
  } = product;

  return (
    <Link
      href={`/products/${encodeURIComponent(id)}`}
      className="block rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Title */}
      <h3 className="text-base sm:text-lg font-semibold leading-snug text-gray-900 line-clamp-2">
        {name || "Untitled product"}
      </h3>

      {/* Category (optional) */}
      {category ? (
        <p className="mt-1 text-sm text-gray-500">{category}</p>
      ) : null}

      {/* Meta row */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm text-gray-600">
          {typeof vendorsCount === "number"
            ? `${vendorsCount} vendor${vendorsCount === 1 ? "" : "s"}`
            : "—"}
        </span>
        <span className="text-base sm:text-lg font-semibold text-gray-900">
          {typeof minPrice === "number" ? formatGBP(minPrice) : "—"}
        </span>
      </div>
    </Link>
  );
}
