'use client';

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Loader2, ServerCrash, Zap } from "lucide-react";
import { InvokeLLM } from "@/integrations/Core";
import PriceComparison from "@/components/tools/PriceComparison";

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const prompt = `Find current UK prices for the power tool "${searchTerm}". Search these specific retailers: Screwfix, Toolstation, D&M Tools, and UK Planet Tools. Provide a canonical product title, brand, brief description, and a representative image URL. For each retailer stocking the item, provide their name, the current price in GBP, stock availability, a direct URL to the product page, and any delivery information. If the item is on sale, you MUST also provide the original, non-discounted price.`;

      const response = await InvokeLLM({
        prompt,
        add_context_from_internet: false,
        response_json_schema: {},
      });

      if (response && Array.isArray(response.offers) && response.offers.length > 0) {
        setResults(response);
      } else {
        setError("Could not find that tool in the local catalogue. Try a different name or model number.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred while searching. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const product = results?.product_info || {};
  const offers = results?.offers || [];

  return (
    <div className="w-full">
      {/* Search Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            Find the best price, instantly.
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            Enter a tool name or model number to compare prices across major UK retailers.
          </p>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="e.g., Makita DHP484"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 h-14 text-lg border-2 border-slate-200 focus:border-slate-900 rounded-xl"
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="h-14 px-8 bg-slate-900 hover:bg-slate-800 text-lg"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Search"}
            </Button>
          </form>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading && (
          <div className="text-center space-y-4">
            <Zap className="w-12 h-12 text-slate-400 mx-auto animate-pulse" />
            <h3 className="text-xl font-semibold text-slate-700">Searching local catalogue...</h3>
            <p className="text-slate-500">Reading your SQLite backend and comparing offers.</p>
          </div>
        )}

        {error && (
          <div className="text-center space-y-4 bg-red-50 border border-red-200 rounded-lg p-8">
            <ServerCrash className="w-12 h-12 text-red-500 mx-auto" />
            <h3 className="text-xl font-semibold text-red-800">Search Failed</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {offers.length > 0 && (
          <div className="space-y-8">
            <Card className="border-2 border-slate-200 overflow-hidden">
              <CardContent className="p-0 flex flex-col md:flex-row">
                <div className="md:w-1/3">
                  <img
                    src={
                      product.image_url ||
                      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop"
                    }
                    alt={product.title || "Product image"}
                    className="w-full h-full object-cover bg-slate-50"
                  />
                </div>
                <div className="p-6 md:w-2/3">
                  <p className="font-semibold text-slate-600 mb-1">
                    {product.brand}
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">
                    {product.title}
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    {product.description || "Comparable offers from multiple UK retailers."}
                  </p>
                </div>
              </CardContent>
            </Card>

            <PriceComparison offers={offers} />
          </div>
        )}
      </div>
    </div>
  );
}
