"use client";
import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <div className="rounded-lg border border-brand-slate bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-brand-dark product-name">
        <Link href={`/products/${product.id}`}>{product.name}</Link>
      </h3>
      <p className="product-price text-brand-blue font-bold">{product.price}</p>
      <p className="product-vendors text-sm text-gray-500">{product.vendors} vendors</p>
    </div>
  );
}