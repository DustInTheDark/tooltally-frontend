// tooltally-frontend/app/products/page.js
"use client";

import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";

export default function ProductsPage({ searchParams }) {
  const query = searchParams?.q?.trim() || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(!!query);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      setError("");
      setProducts([]);
      if (!query) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(
          `${apiBase}/products?search=${encodeURIComponent(query)}`,
          { cache: "no-store" }
        );
        if (!res.ok) {
          throw new Error(`API ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        // API already returns unique products grouped by name+category and min_price.
        setProducts(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Error fetching products:", e);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [query]);

  return (
    <main className="container mx-auto px-4 py-8">
      {query ? (
        <h1 className="text-2xl font-bold mb-6">Search results for “{query}”</h1>
      ) : (
        <h1 className="text-2xl font-bold mb-6">Search</h1>
      )}

      {loading && <p className="text-gray-600">Loading products…</p>}
      {!loading && error && <p className="text-red-600">{error}</p>}

      {!loading && !error && products.length === 0 && query && (
        <p className="text-gray-600">No products found for “{query}”.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={{
                id: p.id,
                name: p.name,
                category: p.category,
                min_price: p.min_price, // <-- pass the correct API field
                // optional: vendors_count could be added by API later
              }}
            />
          ))}
        </div>
      )}
    </main>
  );
}
