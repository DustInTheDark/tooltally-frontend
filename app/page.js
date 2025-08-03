import CategoryCard from "../components/CategoryCard";

export default function HomePage() {
  return (
    <main className="px-4 py-8">
      {/* Search bar form */}
      <form action="/products" method="get" className="mb-8 flex w-full max-w-xl items-center gap-2">
        <input
          type="text"
          name="q"
          placeholder="Search for products..."
          className="search-input flex-grow rounded-md border border-brand-slate p-3 text-brand-dark"
        />
        <button type="submit" className="search-button rounded-md bg-brand-orange px-4 py-3 font-medium text-white hover:bg-brand-orange/90">
          Search
        </button>
      </form>

      {/* Category cards section */}
      <div className="category-cards grid gap-4 sm:grid-cols-3">
        <CategoryCard title="Power Tools" slug="power-tools" />
        <CategoryCard title="Hand Tools" slug="hand-tools" />
        <CategoryCard title="Accessories" slug="accessories" />
      </div>
    </main>
  );
}