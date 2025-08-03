"use client";
import Link from "next/link";

export default function CategoryCard({ title, slug }) {
  return (
    <Link
      href={`/category/${slug}`}
      className="block rounded-lg border border-brand-slate bg-white p-6 text-center shadow-sm hover:shadow-md"
    >
      <div className="flex items-center justify-center">
        <h2 className="text-lg font-semibold text-brand-dark">{title}</h2>
      </div>
    </Link>
  );
}