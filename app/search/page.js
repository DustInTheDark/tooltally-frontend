'use client';

import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.trim();

  if (!query) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="text-lg">No search term provided.</p>
      </div>
    );
  }

  const sampleProducts = [
    {
      productTitle: `${query} Pro Max 3000`,
      price: '99.99',
      vendorName: 'Acme Corp',
      buyUrl: '#',
    },
    {
      productTitle: `${query} Deluxe Set`,
      price: '59.99',
      vendorName: 'Tools R Us',
      buyUrl: '#',
    },
    {
      productTitle: `${query} Starter Kit`,
      price: '29.99',
      vendorName: 'Basic Tools',
      buyUrl: '#',
    },
  ];

  return (
    <div className="px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">
        Search results for: {query}
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
    </div>
  );
}