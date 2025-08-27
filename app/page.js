'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';

function dedupeAndSortCategories(raw) {
  // Defensive dedupe by slug and sum counts; sort by count desc then name
  const toSlug = (s) =>
    (s || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-{2,}/g, '-')
      .replace(/^-|-$/g, '') || 'uncategorized';

  const map = new Map();
  for (const c of Array.isArray(raw) ? raw : []) {
    const slug = c.slug || toSlug(c.name);
    const prev = map.get(slug);
    if (prev) {
      prev.count += Number(c.count || 0);
    } else {
      map.set(slug, { name: c.name, slug, count: Number(c.count || 0) });
    }
  }
  return Array.from(map.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

export default function HomePage() {
  const router = useRouter();
  const [term, setTerm] = React.useState('');
  const [cats, setCats] = React.useState([]);
  const [loadingCats, setLoadingCats] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/categories', { cache: 'no-store' });
        const json = await res.json();
        setCats(dedupeAndSortCategories(json.items));
      } catch (e) {
        console.error('categories fetch failed', e);
        setCats([]);
      } finally {
        setLoadingCats(false);
      }
    })();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const q = (term || '').trim();
    router.push(q ? `/products?search=${encodeURIComponent(q)}` : '/products');
  };

  const onPickCategory = (name) => {
    router.push(`/products?category=${encodeURIComponent(name)}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero + Search */}
      <section className="text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
          Find the best price on UK tools
        </h1>
        <p className="text-slate-600 mb-6">
          Search by model number or pick a category to compare live prices across retailers.
        </p>

        <form onSubmit={onSubmit} className="mx-auto max-w-3xl flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="e.g., DCD796P2, Makita DHP484, SDS drill…"
              className="pl-12 pr-4 py-3 h-12 border-2 border-slate-200 focus:border-slate-900 rounded-xl"
            />
          </div>
          <Button className="h-12 px-6 bg-slate-900 hover:bg-slate-800">Search</Button>
        </form>

        <div className="mt-3">
          <Link className="text-sm text-slate-600 underline" href="/products">
            Browse all products
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Categories</h2>
          <Link className="text-sm text-slate-600 underline" href="/products">
            View all
          </Link>
        </div>

        {loadingCats ? (
          <p className="text-slate-500">Loading categories…</p>
        ) : cats.length === 0 ? (
          <p className="text-slate-600">No categories found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {cats.map((c, idx) => (
              <button
                key={`${c.slug}-${idx}`} // guaranteed-unique key
                onClick={() => onPickCategory(c.name)}
                className="text-left"
              >
                <Card className="border-2 border-slate-200 hover:border-slate-300 transition h-full">
                  <CardContent className="p-4">
                    <div className="font-medium text-slate-900">{c.name}</div>
                    <div className="text-xs text-slate-600">{c.count} items</div>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
