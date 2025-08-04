"use client";
import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <div className="rounded-lg border border-brand-slate bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-white product-name">
        <Link href={`/products/${product.id}`}>{product.name}</Link>
      </h3>
      <p className="product-price text-white font-bold">{product.price}</p>
      <p className="product-vendors text-sm text-white">{product.vendors} vendors</p>
    </div>
  );
}