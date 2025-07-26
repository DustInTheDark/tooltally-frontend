'use client';

import { useState } from 'react';
import { useNavigation } from '@/components/NavigationContext';
import Logo from '@/components/Logo';

/**
 * Home page with a hero section that introduces the site and allows users to search.
 * The hero uses a full‑screen background image and overlay to ensure text readability.
 * Users can type a query and be redirected to the search page.
 */
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
    <div
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/hero.png')" }}
    >
      {/* Dark overlay to improve contrast on the hero image */}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 w-full max-w-[700px] px-4 text-center">
        <div className="mb-6 flex items-center justify-center gap-3">
          <Logo />
          <h1 className="text-5xl font-extrabold text-white">ToolTally</h1>
        </div>
        <p className="mb-6 text-lg text-gray-100">
          Find the best tools and materials at the best prices across the UK.
        </p>
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex w-full flex-col gap-4 sm:flex-row"
        >
          <input
            type="text"
            placeholder="Search for a tool or material"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full flex-grow rounded-md border border-brand-slate p-3 text-brand-dark"
          />
          <button
            type="submit"
            className="rounded-md bg-brand-orange px-6 py-3 font-medium text-white hover:bg-brand-orange/90"
          >
            Compare Now
          </button>
        </form>
      </div>
    </div>
  );
}
