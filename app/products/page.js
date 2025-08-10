"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("search")?.trim() || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) return;

    async function fetchProducts() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [query]);

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-4 text-white">Search Results for "{query}"</h1>

      {loading && <p className="text-white">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="text-white">No products found.</p>
      )}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            id={p.id}
            name={p.name}
            category={p.category}
            min_price={p.min_price}
            vendors_count={p.vendors_count}
          />
        ))}
      </div>
    </div>
  );
}
