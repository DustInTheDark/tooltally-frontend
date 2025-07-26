import LoadingLink from './LoadingLink';

/**
 * ProductCard renders a single product search result.
 * The design has been revamped to use the updated colour palette,
 * larger rounded corners, and improved typography. A hover effect
 * elevates the card slightly to provide interactive feedback.
 */
export default function ProductCard({
  productTitle,
  price,
  vendorName,
  buyUrl,
  searchQuery,
}) {
  // Helper to convert a string into a slug for the product detail page
  const slugify = (str) =>
    str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

  const slug =
    productTitle && vendorName
      ? slugify(`${productTitle} ${vendorName}`)
      : null;

  return (
    <div
      className="flex flex-col justify-between rounded-lg border border-brand-slate bg-white p-5 shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800 dark:border-gray-700"
    >
      <div>
        <h3 className="text-lg font-semibold text-brand-dark dark:text-white">
          {productTitle}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {vendorName}
        </p>
        <p className="mt-2 text-xl font-bold text-brand-blue">
          £{price}
        </p>
      </div>
      {slug ? (
        <LoadingLink
          href={`/product/${slug}${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`}
          className="mt-4 inline-block rounded-md bg-brand-orange px-4 py-2 text-center font-medium text-white hover:bg-brand-orange/90"
        >
          View Details
        </LoadingLink>
      ) : (
        <span className="mt-4 inline-block rounded-md bg-gray-300 px-4 py-2 text-center text-white">
          View Details
        </span>
      )}
    </div>
  );
}
