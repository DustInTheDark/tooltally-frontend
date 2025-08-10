// tooltally-frontend/components/ProductCard.js
"use client";

import Link from "next/link";

function formatGBP(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return "£0.00";
  return `£${n.toFixed(2)}`;
}

export default function ProductCard({ product }) {
  // Expecting: { id, name, category, min_price }
  const price = product?.min_price;

  return (
    <Link
      href={`/products/${product.id}`}
      className="block border border-gray-300 rounded-lg p-4 hover:shadow transition-shadow duration-150 bg-white"
    >
      <p className="text-lg font-medium mb-1">{product.name}</p>
      {product?.category && (
        <p className="text-xs text-gray-500 mb-2">{product.category}</p>
      )}
      <div className="flex items-baseline justify-between">
        {/* vendors_count is optional; omit if not present */}
        {typeof product?.vendors_count === "number" ? (
          <span className="text-sm text-gray-600">
            {product.vendors_count} {product.vendors_count === 1 ? "vendor" : "vendors"}
          </span>
        ) : (
          <span className="text-sm text-gray-600"> </span>
        )}
        <span className="font-semibold text-gray-800">
          {formatGBP(price)}
        </span>
      </div>
    </Link>
  );
}
