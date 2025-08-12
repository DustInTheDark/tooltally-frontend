// components/ProductCard.js
import Link from "next/link";
import { formatGBP } from "@/utils/format";

export default function ProductCard({ product }) {
  const { id, name, category, min_price, vendors_count } = product || {};
  const vendorsLabel =
    vendors_count === 1 ? "1 vendor" : `${vendors_count ?? 0} vendors`;

  return (
    <Link href={`/products/${id}`} className="block">
      <div className="h-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow">
        <div className="mb-2 text-xs text-gray-500">{category || "—"}</div>
        <div className="line-clamp-2 min-h-[3rem] text-base font-medium text-gray-900">
          {name}
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div className="text-lg font-semibold">
            {formatGBP(min_price)}
          </div>
          <div className="text-xs text-gray-600">{vendorsLabel}</div>
        </div>
      </div>
    </Link>
  );
}
