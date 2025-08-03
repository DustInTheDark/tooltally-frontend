import CategoryCard from "../components/CategoryCard";
import SearchBar from "../components/SearchBar";

export default function HomePage() {
  return (
    <main className="px-4 py-8">
      <SearchBar />

      {/* Category cards section */}
      <h2 className="mt-8 mb-4 text-xl font-semibold text-white">Categories</h2>
      <div className="category-cards grid gap-4 sm:grid-cols-3">
        <CategoryCard title="Power Tools" slug="power-tools" />
        <CategoryCard title="Hand Tools" slug="hand-tools" />
        <CategoryCard title="Accessories" slug="accessories" />
      </div>
    </main>
  );
}