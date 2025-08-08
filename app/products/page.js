// tooltally-frontend/app/products/page.js
"use client";

import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";

export default function ProductsPage({ searchParams }) {
  const query = searchParams?.q || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiBase}/products?search=${encodeURIComponent(query)}`);
        if (!res.ok) {
          console.error("Failed to fetch products:", res.statusText);
          setProducts([]);
          return;
        }
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    if (query) {
      fetchProducts();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [query]);

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <p className="text-gray-600">Loading products...</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {query && (
        <h1 className="text-2xl font-bold mb-6">
          Search results for "{query}"
        </h1>
      )}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                min_price: product.min_price,
                vendors_count: product.vendors_count || 1, // use vendor count if available
              }}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">
          {query
            ? `No products found for "${query}".`
            : "Please enter a search term."}
        </p>
      )}
    </main>
  );
}
