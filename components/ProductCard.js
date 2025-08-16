// components/ProductCard.js
import Link from "next/link";
import { formatGBP } from "@/utils/format";

export default function ProductCard({ product }) {
  const vendorsCount = product.vendors_count ?? product.vendor_count ?? 0;
  return (
    <div className="border rounded-xl p-4 shadow hover:shadow-lg transition bg-white flex flex-col justify-between">
      <Link href={`/products/${product.id}`} className="block">
        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.category}</p>
        <p className="mt-2 text-xl font-bold text-green-600">
          {formatGBP(product.min_price)}
        </p>
        <p className="text-xs text-gray-400">
          {vendorsCount} {vendorsCount === 1 ? "vendor" : "vendors"}
        </p>
      </Link>
    </div>
  );
}
