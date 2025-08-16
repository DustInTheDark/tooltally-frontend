// app/products/page.js
"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";

export default function ProductsPage({ searchParams }) {
  const term = searchParams?.search || "";
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 24;
  const [loading, setLoading] = useState(false);

  async function fetchProducts(p) {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/products?search=${encodeURIComponent(term)}&page=${p}&limit=${limit}`,
        { cache: "no-store" }
      );
      const data = await res.json();

      if (data?.items) {
        setItems((prev) => (p === 1 ? data.items : [...prev, ...data.items]));
        setTotal(Number(data.total ?? data.items.length ?? 0));
      } else if (Array.isArray(data)) {
        setItems((prev) => (p === 1 ? data : [...prev, ...data]));
        setTotal(data.length);
      }
    } catch (e) {
      console.error("Failed to fetch products", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setItems([]);
    setPage(1);
    fetchProducts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  const shown = items.length;
  const canLoadMore = shown < total;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">
        Search results for “{term || "all"}”
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        {total > 0
          ? `Showing ${shown} of ${total} results`
          : loading
          ? "Loading…"
          : "No results."}
      </p>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {canLoadMore && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => {
              const next = page + 1;
              setPage(next);
              fetchProducts(next);
            }}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
