import ProductCard from "../../../../components/ProductCard";

export default async function CategoryPage({ params }) {
  const { category } = params;
  // TODO: Fetch products by category from backend
  const products = []; // Products will be populated from backend in the future

  return (
    <main className="px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-brand-dark">{category.replace("-", " ")}</h1>
      {products.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p>No products available in this category.</p>
      )}
    </main>
  );
}