'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';

function currency(v) {
  if (v == null || Number.isNaN(v)) return '—';
  return `£${Number(v).toFixed(2)}`;
}

function dedupeAndSortCategories(raw) {
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
  // alphabetical A→Z
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get('search') || '';
  const cat = searchParams.get('category') || '';

  const [items, setItems] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [term, setTerm] = React.useState(q);

  const [cats, setCats] = React.useState([]);
  const [catsLoading, setCatsLoading] = React.useState(true);

  // fetch categories once (even if we don't always render them)
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
        setCatsLoading(false);
      }
    })();
  }, []);

  const fetchList = React.useCallback(async (search, category) => {
    setLoading(true);
    try {
      const url = `/api/products?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}&page=1&limit=24`;
      const res = await fetch(url, { cache: 'no-store' });
      const data = await res.json();
      setItems(Array.isArray(data.items) ? data.items : []);
      setTotal(Number(data.total || 0));
    } catch (e) {
      console.error('List fetch failed', e);
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { fetchList(q, cat); }, [q, cat, fetchList]);

  const onSubmit = (e) => {
    e.preventDefault();
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    if (term) params.set('search', term); else params.delete('search');
    router.push(`/products?${params.toString()}`);
  };

  const onPickCategory = (slug, name) => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    if (name) params.set('category', name); else params.delete('category');
    router.push(`/products?${params.toString()}`);
  };

  const showCategories = !q && !cat; // hide categories when searching OR a category is selected

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search */}
      <form onSubmit={onSubmit} className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search tools (e.g., DCD796P2, Makita DHP484)"
            className="pl-12 pr-4 py-3 h-12 border-2 border-slate-200 focus:border-slate-900 rounded-xl"
          />
        </div>
        <Button className="h-12 px-6 bg-slate-900 hover:bg-slate-800">Search</Button>
      </form>

      {/* Categories (only when no search & no category) */}
      {showCategories && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-900">Categories</h2>
          </div>

          {catsLoading ? (
            <p className="text-slate-500">Loading categories…</p>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {cats.slice(0, visibleCount).map((c, idx) => (
                  <button
                    key={`${c.slug}-${idx}`}
                    onClick={() => onPickCategory(c.slug, c.name)}
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

              {visibleCount < cats.length && (
                <div className="flex justify-center mt-4">
                  <Button
                    className="px-6 py-2 bg-slate-900 hover:bg-slate-800"
                    onClick={() => setVisibleCount((prev) => prev + 12)}
                  >
                    Load More
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Results */}
      {loading && <p className="text-slate-500">Loading…</p>}

      {!loading && items.length === 0 && (
        <p className="text-slate-600">
          No results{cat ? ` in “${cat}”` : ''}{q ? ` for “${q}”` : ''}.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it) => (
          <Link key={it.id} href={`/products/${it.id}`} className="block">
            <Card className="border-2 border-slate-100 hover:border-slate-200 transition">
              <CardContent className="p-4">
                {/* Image box: fixed height, contain, never overflow */}
                <div className="w-full h-48 rounded-lg mb-3 bg-white border border-slate-100 overflow-hidden flex items-center justify-center">
                  {it.image_url ? (
                    <img
                      src={it.image_url}
                      alt={it.title || 'Product image'}
                      className="max-w-full max-h-full object-contain"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-slate-300 text-sm">No image</span>
                  )}
                </div>

                <p className="text-xs uppercase tracking-wide text-slate-500">{it.brand || ''}</p>
                <h3 className="font-semibold text-slate-900 line-clamp-2">{it.title}</h3>
                <div className="flex items-center justify-between mt-3">
                  <div className="text-lg font-bold text-slate-900">
                    {currency(it.lowest_price)}
                  </div>
                  <div className="text-sm text-slate-600">
                    {it.vendor_count || 0} vendor{(it.vendor_count || 0) === 1 ? '' : 's'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
