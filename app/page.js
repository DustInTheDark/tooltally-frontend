'use client';

import { useState } from 'react';
import { useNavigation } from '@/components/NavigationContext';

export default function Home() {
  const { push } = useNavigation();
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = query.trim();
    if (value) {
      push(`/search?q=${encodeURIComponent(value)}`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-[600px] text-center">
        <h1 className="mb-4 text-5xl font-bold">Compare Prices</h1>
        <p className="mb-8 text-lg">
          Compare prices on tools and materials from UK suppliers
        </p>
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 sm:flex-row">
          <input
            type="text"
            placeholder="Search for a tool or material"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full flex-grow rounded-md border p-3"
          />
          <button
            type="submit"
            className="rounded-md bg-brand-blue p-3 font-medium text-white sm:px-6"
          >
            Compare Now
          </button>
        </form>
      </div>
    </div>
  );
}
