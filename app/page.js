// app/page.js
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Search Bar */}
      <form action="/products" method="get" className="max-w-md mx-auto mb-8 flex">
        <input
          type="text"
          name="search"            // <-- important: use ?search=
          placeholder="Search for products..."
          className="flex-grow border border-gray-300 rounded-l px-4 py-2 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-r"
        >
          Search
        </button>
      </form>

      {/* (Any other home content you already have) */}
    </main>
  );
}
