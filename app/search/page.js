'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import LoadingLink from '@/components/LoadingLink';
import ProductCard from '@/components/ProductCard';
import { useNavigation } from '@/components/NavigationContext';

/**
 * SearchPage displays a list of products based on a search term.
 * The page includes a search bar at the top for refining the query and
 * uses the ProductCard component to render each result. Sample data is
 * rendered until a real API is connected.
 */
export default function SearchPage() {
  const searchParams = useSearchParams();
  const { push } = useNavigation();
  const initialQuery = searchParams.get('q')?.trim() || '';
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = searchTerm.trim();
    push(value ? `/search?q=${encodeURIComponent(value)}` : '/search');
  };

  // Sample products used as placeholders until real data is connected.
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
        <LoadingLink
          href="/"
          className="self-start rounded-md bg-brand-light px-3 py-1 text-sm text-brand-dark hover:bg-gray-200 dark:text-gray-900 contrast-text"
        >
          &larr; Back
        </LoadingLink>
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-4 sm:flex-row"
        >
          <input
            type="text"
            placeholder="Search for a tool or material"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full flex-grow rounded-md border border-brand-slate p-3 text-brand-dark"
          />
          <button
            type="submit"
            className="rounded-md bg-brand-orange px-6 py-3 font-medium text-white hover:bg-brand-orange/90"
          >
            Compare
          </button>
        </form>
      </div>
      {initialQuery ? (
        <>
          <h1 className="mb-6 text-2xl font-semibold text-brand-dark">
            Search results for: <span className="italic">{initialQuery}</span>
          </h1>
          {sampleProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sampleProducts.map((product) => (
                <ProductCard
                  key={product.productTitle}
                  productTitle={product.productTitle}
                  price={product.price}
                  vendorName={product.vendorName}
                  buyUrl={product.buyUrl}
                  searchQuery={initialQuery}
                />
              ))}
            </div>
          ) : (
            <p className="text-lg text-brand-dark">
              No products match your search.
            </p>
          )}
        </>
      ) : (
        <p className="text-lg text-brand-dark">No search term provided.</p>
      )}
    </div>
  );
}
