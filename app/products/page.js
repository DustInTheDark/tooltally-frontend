"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { formatInt } from "@/utils/format";

const DEFAULT_LIMIT = 24;

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const term = (searchParams.get("search") || searchParams.get("q") || "").trim();

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(null); // null means unknown (array fallback)
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(() => {
    const urlLimit = Number(searchParams.get("limit"));
    return Number.isFinite(urlLimit) && urlLimit > 0 ? urlLimit : DEFAULT_LIMIT;
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const firstLoadRef = useRef(true);

  const qs = useMemo(() => {
    const params = new URLSearchParams();
    if (term) params.set("search", term);
    params.set("page", String(page));
    params.set("limit", String(limit));
    return params.toString();
  }, [term, page, limit]);

  const fetchPage = useCallback(async () => {
    if (!term) {
      setItems([]);
      setTotal(0);
      setDone(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/products?${qs}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // Proxy may return paginated shape { items, total, page, limit }
      // or legacy array []. Handle both.
      if (Array.isArray(data)) {
        // Legacy: single fetch returns everything. We slice client-side.
        const start = (page - 1) * limit;
        const end = start + limit;
        setTotal(data.length);
        setItems((prev) => [...prev, ...data.slice(start, end)]);
        if (end >= data.length) setDone(true);
      } else if (data && Array.isArray(data.items)) {
        setTotal(typeof data.total === "number" ? data.total : null);
        setItems((prev) => [...prev, ...data.items]);
        const fetchedSoFar = (page) * limit;
        if (data.items.length < limit || (typeof data.total === "number" && fetchedSoFar >= data.total)) {
          setDone(true);
        }
      } else {
        // Unexpected shape; fail gracefully
        setDone(true);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
      setDone(true);
    } finally {
      setLoading(false);
    }
  }, [term, qs, page, limit]);

  // Reset when term changes
  useEffect(() => {
    setItems([]);
    setTotal(null);
    setPage(1);
    setDone(false);
    firstLoadRef.current = true;
  }, [term, limit]);

  // Initial + subsequent page loads
  useEffect(() => {
    if (!term) return;
    fetchPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, term]);

  const onLoadMore = () => {
    if (!done && !loading) setPage((p) => p + 1);
  };

  const rangeLabel = useMemo(() => {
    if (!term) return "";
    const shown = items.length;
    if (typeof total === "number") {
      const start = shown === 0 ? 0 : 1;
      return `Showing ${start}–${shown} of ${formatInt(total)}`;
    }
    // Unknown total
    return `Showing ${items.length}`;
  }, [items.length, total, term]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6">
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
        {term ? (
          <>Search results for ‘{term}’</>
        ) : (
          <>Search results</>
        )}
      </h1>
      <p className="mt-1 text-sm text-gray-600">{term ? rangeLabel : "Enter a search term above."}</p>

      {/* Grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={`${p.id}-${p.min_price ?? ""}`} product={p} />
        ))}
      </div>

      {/* Empty state */}
      {!loading && term && items.length === 0 && (
        <div className="mt-10 rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-700">
          No results. Try refining your search.
        </div>
      )}

      {/* Load more */}
      {term && items.length > 0 && !done && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="rounded-xl bg-gray-900 px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-60"
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
