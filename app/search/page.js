'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q')?.trim() || '';
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = searchTerm.trim();
    router.push(value ? `/search?q=${encodeURIComponent(value)}` : '/search');
  };

  const sampleProducts = initialQuery
    ? [
        {
          productTitle: `${initialQuery} Pro Max 3000`,
          price: '99.99',
          vendorName: 'Acme Corp',
          buyUrl: '#',
        },
        {
          productTitle: `${initialQuery} Deluxe Set`,
          price: '59.99',
          vendorName: 'Tools R Us',
          buyUrl: '#',
        },
        {
          productTitle: `${initialQuery} Starter Kit`,
          price: '29.99',
          vendorName: 'Basic Tools',
          buyUrl: '#',
        },
      ]
    : [];

  return (
    <div className="px-4 py-8">
      <div className="mb-6 flex flex-col gap-4">
        <Link
          href="/"
          className="self-start rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
        >
          &larr; Back
        </Link>
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-4 sm:flex-row"
        >
          <input
            type="text"
            placeholder="Search for a tool or material"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full flex-grow rounded-md border p-3"
          />
          <button
            type="submit"
            className="rounded-md bg-blue-600 p-3 font-medium text-white sm:px-6"
          >
            Compare
          </button>
        </form>
      </div>
      {initialQuery ? (
        <>
          <h1 className="mb-6 text-2xl font-semibold">
            Search results for: {initialQuery}
          </h1>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sampleProducts.map((product) => (
              <ProductCard
                key={product.productTitle}
                productTitle={product.productTitle}
                price={product.price}
                vendorName={product.vendorName}
                buyUrl={product.buyUrl}
              />
            ))}
          </div>
        </>
      ) : (
        <p className="text-lg">No search term provided.</p>
      )}
    </div>
  );
}