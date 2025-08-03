import CategoryCard from "../components/CategoryCard";
import SearchBar from "../components/SearchBar";

export default function HomePage() {
  return (
    <main className="px-4 py-8">
      <SearchBar />

      {/* Category cards section */}
      <div className="category-cards grid gap-4 sm:grid-cols-3">
        <CategoryCard title="Power Tools" slug="power-tools" />
        <CategoryCard title="Hand Tools" slug="hand-tools" />
        <CategoryCard title="Accessories" slug="accessories" />
      </div>
    </main>
  );
}