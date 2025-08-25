'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Truck, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

function StockIcon({ availability }) {
  switch (availability) {
    case 'in_stock': return <CheckCircle className="w-4 h-4 text-green-600" />;
    case 'limited_stock': return <AlertCircle className="w-4 h-4 text-amber-600" />;
    case 'out_of_stock': return <XCircle className="w-4 h-4 text-red-600" />;
    default: return <AlertCircle className="w-4 h-4 text-slate-400" />;
  }
}

function currency(v) {
  if (v == null || Number.isNaN(v)) return '—';
  return `£${Number(v).toFixed(2)}`;
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/products/${id}`, { cache: 'no-store' });
        const json = await res.json();
        if (active) setData(json);
      } catch (e) {
        console.error('Detail fetch failed', e);
        if (active) setData(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [id]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8 text-slate-500">Loading…</div>;
  if (!data || !data.product_info) return <div className="max-w-4xl mx-auto px-4 py-8">Not found.</div>;

  const p = data.product_info;
  const offers = Array.isArray(data.offers) ? data.offers : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Card className="border-2 border-slate-200 overflow-hidden">
        <CardContent className="p-0 flex flex-col md:flex-row">
          <div className="md:w-1/3">
            {p.image_url ? (
              <img
                src={p.image_url}
                alt={p.title || 'Product image'}
                className="w-full h-full object-cover bg-slate-50"
              />
            ) : (
              <div className="w-full h-full min-h-64 bg-slate-50 flex items-center justify-center">
                <span className="text-slate-300 text-sm">No image</span>
              </div>
            )}
          </div>
          <div className="p-6 md:w-2/3">
            <p className="font-semibold text-slate-600 mb-1">{p.brand}</p>
            <h1 className="text-2xl font-bold text-slate-900 mb-3">{p.title}</h1>
            <p className="text-slate-600">Compare live vendor offers below.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-slate-100">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-slate-900">
            Offers ({offers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {offers.map((offer, i) => {
            const hasLink = !!offer.vendor_product_url;
            return (
              <div
                key={`${offer.vendor_name || 'vendor'}-${i}`}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  i === 0 ? 'border-green-200 bg-green-50' : 'border-slate-100 bg-white hover:border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-900">{offer.vendor_name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <StockIcon availability={offer.availability} />
                      <span className="text-sm text-slate-600">{offer.availability || 'unknown'}</span>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto text-left sm:text-right mt-3 sm:mt-0">
                    <div className="text-2xl font-bold text-slate-900">{currency(offer.price)}</div>
                    {offer.delivery_info && (
                      <div className="flex items-center gap-1 mt-1 justify-end">
                        <Truck className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-500">{offer.delivery_info}</span>
                      </div>
                    )}

                    <Button
                      className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-semibold mt-2"
                      onClick={() => hasLink && window.open(offer.vendor_product_url, '_blank')}
                      disabled={!hasLink}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {hasLink ? `View at ${offer.vendor_name}` : 'No link provided'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          {offers.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <p>No offers available for this product.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
