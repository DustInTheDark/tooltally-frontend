// app/products/page.js
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";

const PAGE_SIZE = 24;

export default function ProductsPage() {
  const sp = useSearchParams();
  const term = (sp.get("search") || "").trim();
  const category = (sp.get("category") || "").trim();

  const heading = useMemo(() => {
    if (term && category) return `Search results for ‘${term}’ in ${category}`;
    if (term) return `Search results for ‘${term}’`;
    if (category) return `Category: ${category}`;
    return "All products";
  }, [term, category]);

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Prevent double initial fetch in React Strict Mode (dev)
  const hasFetchedRef = useRef(false);

  // Reset list when query changes
  useEffect(() => {
    setItems([]);
    setTotal(0);
    setPage(1);
    setErrorMsg("");
    hasFetchedRef.current = false; // allow a fresh initial fetch
  }, [term, category]);

  const fetchPage = async (p) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (term) qs.set("search", term);
      if (category) qs.set("category", category);
      qs.set("page", String(p));
      qs.set("limit", String(PAGE_SIZE));

      const res = await fetch(`/api/products?${qs.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`API ${res.status}`);

      const data = await res.json();
      const pageItems = Array.isArray(data.items) ? data.items : [];

      // Merge safely and set total correctly even if backend omitted it
      setItems((prev) => {
        const merged = [...prev, ...pageItems];
        setTotal(Number.isFinite(data.total) ? data.total : merged.length);
        return merged;
      });

      setPage(Number.isFinite(data.page) ? data.page : p);
    } catch (e) {
      setErrorMsg("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Initial load (guarded against double-run)
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term, category]);

  const canLoadMore = items.length < total;
  const showingStart = items.length > 0 ? 1 : 0;
  const showingEnd = items.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">{heading}</h1>
        <p className="mt-1 text-sm text-gray-600">
          {errorMsg ? errorMsg : `Showing ${showingStart}–${showingEnd} of ${total}`}
        </p>
      </div>

      <div
        className="
          grid gap-4
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-6
        "
      >
        {items.map((p) => (
          <ProductCard key={`${p.id}-${p.name}`} product={p} />
        ))}
      </div>

      {canLoadMore && (
        <div className="mt-6 flex justify-center">
          <button
            disabled={loading}
            onClick={() => fetchPage(page + 1)}
            className="rounded-2xl bg-gray-900 px-4 py-2 text-white shadow-sm hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        </div>
      )}

      {!loading && items.length === 0 && !errorMsg && (
        <div className="mt-10 text-center text-gray-600">No results.</div>
      )}
    </div>
  );
}
