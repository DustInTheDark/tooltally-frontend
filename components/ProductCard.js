import LoadingLink from './LoadingLink';

export default function ProductCard({
  productTitle,
  price,
  vendorName,
  buyUrl,
  searchQuery,
}) {
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
      className="flex flex-col justify-between rounded-md border-2 border-gray-400 bg-gray-100 p-4 shadow-lg dark:border-gray-600 dark:bg-gray-800 contrast:border-yellow-400 contrast:bg-gray-900 contrast:text-yellow-300"
    >
      <div>
        <h3 className="text-lg font-semibold">{productTitle}</h3>
        <p className="text-sm text-gray-500 contrast:text-yellow-300">{vendorName}</p>
        <p className="mt-2 text-xl font-bold">£{price}</p>
      </div>
      {slug ? (
        <LoadingLink
          href={`/product/${slug}${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`}
          className="mt-4 inline-block rounded bg-brand-blue px-4 py-2 text-center text-white hover:bg-brand-blue/90"
        >
          View Details
        </LoadingLink>
      ) : (
        <span className="mt-4 inline-block rounded bg-gray-300 px-4 py-2 text-center text-white">View Details</span>
      )}
    </div>
  );
}
