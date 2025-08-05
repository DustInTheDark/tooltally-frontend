import ProductCard from "../../components/ProductCard";
import SearchBar from "../../components/SearchBar";

export default async function ProductsPage({ searchParams }) {
  const query = searchParams?.q || "";
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const url = `${apiBase}/products${query ? `?search=${encodeURIComponent(query)}` : ""}`;
  let products = [];

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (res.ok) {
      products = await res.json();
    }
  } catch (e) {
    console.error("Failed to fetch products", e);
  }

  return (
    <main className="px-4 py-8">
      <SearchBar defaultValue={query} />
      {query && (
        <h1 className="mb-6 text-2xl font-semibold text-white">Search Results for "{query}"</h1>
      )}
      {products.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </main>
  );
}