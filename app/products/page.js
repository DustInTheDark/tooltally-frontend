'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';

function currency(v) {
  if (v == null || Number.isNaN(v)) return '—';
  return `£${Number(v).toFixed(2)}`;
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

  // fetch categories once
  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/categories', { cache: 'no-store' });
        const json = await res.json();
        setCats(Array.isArray(json.items) ? json.items : []);
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
    // keep current category selection
    router.push(`/products?${params.toString()}`);
  };

  const onPickCategory = (slug, name) => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    if (name) params.set('category', name); else params.delete('category');
    router.push(`/products?${params.toString()}`);
  };

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

      {/* Categories */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-900">Categories</h2>
          {cat && (
            <button
              className="text-sm text-slate-600 underline"
              onClick={() => onPickCategory('', '')}
            >
              Clear filter
            </button>
          )}
        </div>

        {catsLoading ? (
          <p className="text-slate-500">Loading categories…</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {cats.map((c) => {
              const active = c.name === cat;
              return (
                <button
                  key={c.slug}
                  onClick={() => onPickCategory(c.slug, c.name)}
                  className={
                    'text-left rounded-xl border-2 px-4 py-3 transition ' +
                    (active
                      ? 'border-slate-900 bg-slate-900/5'
                      : 'border-slate-200 hover:border-slate-300')
                  }
                >
                  <div className="font-medium text-slate-900">{c.name}</div>
                  <div className="text-xs text-slate-600">{c.count} items</div>
                </button>
              );
            })}
          </div>
        )}
      </div>

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
                <div className="aspect-[4/3] w-full bg-slate-50 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                  <span className="text-slate-300 text-sm">No image</span>
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
