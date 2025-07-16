'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get('q')?.trim() || '';
  const [searchTerm, setSearchTerm] = useState(q);

  const slugify = (str) =>
    str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

  const results = useMemo(() => {
    if (!q) return [];
    return [
      {
        productTitle: `${q} Pro Max 3000`,
        price: '99.99',
        vendorName: 'Acme Corp',
        buyUrl: '#',
      },
      {
        productTitle: `${q} Deluxe Set`,
        price: '59.99',
        vendorName: 'Tools R Us',
        buyUrl: '#',
      },
      {
        productTitle: `${q} Starter Kit`,
        price: '29.99',
        vendorName: 'Basic Tools',
        buyUrl: '#',
      },
    ].map((p) => ({ ...p, slug: slugify(`${p.productTitle} ${p.vendorName}`) }));
  }, [q]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = searchTerm.trim();
    router.push(value ? `/search?q=${encodeURIComponent(value)}` : '/search');
  };

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
      {q ? (
        <>
          <h1 className="mb-6 text-2xl font-semibold">Search results for: {q}</h1>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((product) => (
              <Link
                key={product.slug}
                href={`/product/${product.slug}?q=${encodeURIComponent(q)}`}
                className="border rounded p-4 shadow-sm flex flex-col justify-between hover:ring-2 hover:ring-blue-400"
              >
                <div>
                  <h3 className="text-lg font-semibold">{product.productTitle}</h3>
                  <p className="text-sm text-gray-500">{product.vendorName}</p>
                  <p className="mt-2 text-xl font-bold">£{product.price}</p>
                </div>
                <span className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700">
                  View Details
                </span>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <p className="text-lg">No search term provided.</p>
      )}
    </div>
  );
}