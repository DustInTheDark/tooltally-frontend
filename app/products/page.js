import ProductCard from "../../components/ProductCard";
import SearchBar from "../../components/SearchBar";

export default async function ProductsPage({ searchParams }) {
  const query = searchParams?.q || "";
  // TODO: Integrate with backend to fetch products based on search query
  const products = []; // No random generation; will populate from backend in the future

  return (
    <main className="px-4 py-8">
      <SearchBar defaultValue={query} />
      {query && (
        <h1 className="mb-6 text-2xl font-semibold text-brand-dark">Search Results for "{query}"</h1>
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