"use client";
import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <div className="rounded-lg border border-brand-slate bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-white product-name">
        <Link href={`/products/${product.id}`}>{product.name}</Link>
      </h3>
      {product.category && (
        <p className="product-category text-sm text-white">{product.category}</p>
      )}
      {typeof product.min_price !== "undefined" && (
        <p className="product-price text-white font-bold">
          {`From $${Number(product.min_price).toFixed(2)}`}
        </p>
      )}
    </div>
  );
}