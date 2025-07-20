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
    <div className="flex flex-col justify-between rounded border-2 border-gray-300 bg-white p-4 shadow-sm dark:border-gray-600 dark:bg-gray-800">
      <div>
        <h3 className="text-lg font-semibold">{productTitle}</h3>
        <p className="text-sm text-gray-500">{vendorName}</p>
        <p className="mt-2 text-xl font-bold">£{price}</p>
      </div>
      {slug ? (
        <LoadingLink
          href={`/product/${slug}${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`}
          className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700"
        >
          View Details
        </LoadingLink>
      ) : (
        <span className="mt-4 inline-block rounded bg-gray-300 px-4 py-2 text-center text-white">View Details</span>
      )}
    </div>
  );
}
