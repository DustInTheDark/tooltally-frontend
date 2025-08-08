"use client";

import Link from "next/link";

export default function ProductCard({ product }) {
  // product should come from /products API, so it has:
  // id, name, min_price, and optionally vendor count
  const vendorCount = product?.vendors_count || 1; // default to 1 if not passed
  const lowestPrice = product?.min_price ?? product?.price ?? 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className="block border border-gray-300 rounded-lg p-4 hover:shadow transition-shadow duration-150 bg-white"
    >
      <p className="text-lg font-medium mb-1">{product.name}</p>
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-gray-600">
          {vendorCount} {vendorCount === 1 ? "vendor" : "vendors"}
        </span>
        <span className="font-semibold text-gray-800">
          £{Number(lowestPrice).toFixed(2)}
        </span>
      </div>
    </Link>
  );
}