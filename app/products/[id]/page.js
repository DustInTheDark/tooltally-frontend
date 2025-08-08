"use client";

import { useEffect, useState } from "react";

export default function ProductDetailPage({ params }) {
  const { id } = params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/products/${id}`
        );
        if (!res.ok) {
          console.error("Failed to fetch product:", res.statusText);
          setProduct(null);
          return;
        }
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <p className="text-gray-600">Loading product details...</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="container mx-auto px-4 py-8">
        <p className="text-gray-600">Product not found.</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      {product.category && (
        <p className="mb-6 text-sm text-gray-600">{product.category}</p>
      )}

      {product?.vendors?.length > 0 ? (
        <ul className="space-y-4">
          {product.vendors.map((vendor, index) => (
            <li
              key={index}
              className="flex items-center justify-between border border-gray-300 rounded-lg p-4"
            >
              <div className="font-medium">{vendor.vendor}</div>
              <div className="flex items-center space-x-4">
                <div className="font-semibold">£{vendor.price}</div>
                <a
                  href={vendor.buy_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-3 py-2 rounded"
                >
                  Buy
                </a>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No vendors available for this product.</p>
      )}
    </main>
  );
}
