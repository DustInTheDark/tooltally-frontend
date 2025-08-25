'use client';

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Truck, CheckCircle, AlertCircle, XCircle, Percent } from "lucide-react";

function StockIcon({ availability }) {
  switch (availability) {
    case "in_stock":
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case "limited_stock":
      return <AlertCircle className="w-4 h-4 text-amber-600" />;
    case "out_of_stock":
      return <XCircle className="w-4 h-4 text-red-600" />;
    default:
      return <AlertCircle className="w-4 h-4 text-slate-400" />;
  }
}

function stockText(availability) {
  switch (availability) {
    case "in_stock":
      return "In Stock";
    case "limited_stock":
      return "Limited Stock";
    case "out_of_stock":
      return "Out of Stock";
    default:
      return "Unknown";
  }
}

export default function PriceComparison({ offers = [] }) {
  const sorted = [...offers].sort((a, b) => {
    const ap = typeof a.price === "number" ? a.price : Number.POSITIVE_INFINITY;
    const bp = typeof b.price === "number" ? b.price : Number.POSITIVE_INFINITY;
    return ap - bp;
  });

  return (
    <Card className="border-2 border-slate-100">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-slate-900">
          Price Comparison ({offers.length} vendor{offers.length !== 1 ? "s" : ""})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sorted.map((offer, i) => {
          const hasPrice = typeof offer.price === "number";
          const hasOrig  = typeof offer.original_price === "number";
          const isDiscounted = hasPrice && hasOrig && offer.original_price > offer.price;
          const savingsPercent = isDiscounted
            ? Math.round(((offer.original_price - offer.price) / offer.original_price) * 100)
            : 0;

          return (
            <div
              key={`${offer.vendor_name || "vendor"}-${i}`}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                i === 0 ? "border-green-200 bg-green-50" : "border-slate-100 bg-white hover:border-slate-200"
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  {offer.vendor_logo ? (
                    <img
                      src={offer.vendor_logo}
                      alt={offer.vendor_name || "Vendor"}
                      className="w-12 h-12 object-contain rounded-lg bg-white border border-slate-200 p-2"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
                      <span className="text-xs font-bold text-slate-600">
                        {(offer.vendor_name || "?").charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-slate-900">{offer.vendor_name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <StockIcon availability={offer.availability} />
                      <span className="text-sm text-slate-600">{stockText(offer.availability)}</span>
                    </div>
                    {offer.delivery_info && (
                      <div className="flex items-center gap-1 mt-1">
                        <Truck className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-500">{offer.delivery_info}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-full sm:w-auto text-left sm:text-right">
                  <div className="flex items-baseline justify-end gap-2 mb-2">
                    <span className="text-2xl font-bold text-slate-900">
                      £{hasPrice ? offer.price.toFixed(2) : "—"}
                    </span>
                    {isDiscounted && (
                      <span className="text-sm text-slate-400 line-through">
                        £{offer.original_price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-end items-center gap-2 mb-2">
                    {i === 0 && <Badge className="bg-green-600 text-white">Best Price</Badge>}
                    {isDiscounted && (
                      <Badge variant="outline" className="border-red-300 bg-red-50 text-red-700">
                        <Percent className="w-3 h-3 mr-1" />
                        {savingsPercent}% OFF
                      </Badge>
                    )}
                  </div>

                  <Button
                    className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-semibold"
                    onClick={() => window.open(offer.vendor_product_url, "_blank")}
                    disabled={offer.availability === "out_of_stock" || !offer.vendor_product_url}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View at {offer.vendor_name || "Vendor"}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        {offers.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <p>No pricing information available for this product.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
