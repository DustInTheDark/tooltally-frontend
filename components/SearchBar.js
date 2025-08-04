import React from 'react';

export default function SearchBar({ defaultValue = '' }) {
  return (
    <form action="/products" method="get" className="mb-8 flex w-full max-w-xl items-center gap-2">
      <input
        type="text"
        name="q"
        placeholder="Search for products..."
        defaultValue={defaultValue}
        className="search-input flex-grow rounded-md border border-brand-slate p-3"
      />
      <button
        type="submit"
        className="search-button rounded-md bg-brand-orange px-4 py-3 font-medium text-white hover:bg-brand-orange/90"
      >
        Search
      </button>
    </form>
  );
}
