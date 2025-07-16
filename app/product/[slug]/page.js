import Link from 'next/link';

export default async function ProductPage({ params, searchParams }) {
  // In newer Next.js versions params and searchParams may be async
  const resolvedParams =
    typeof params === 'function' ? await params() : params;
  const resolvedSearchParams =
    typeof searchParams === 'function' ? await searchParams() : searchParams;

  const { slug } = resolvedParams;
  const query = resolvedSearchParams?.q || '';

  const slugify = (str) =>
    str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  const products = [
    {
      productTitle: 'Hammer Pro Max 3000',
      vendorName: 'Acme Corp',
      price: '99.99',
      buyUrl: '#',
    },
    {
      productTitle: 'Drill Deluxe Set',
      vendorName: 'Tools R Us',
      price: '59.99',
      buyUrl: '#',
    },
    {
      productTitle: 'Saw Starter Kit',
      vendorName: 'Basic Tools',
      price: '29.99',
      buyUrl: '#',
    },
  ].map((p) => ({ ...p, slug: slugify(`${p.productTitle} ${p.vendorName}`) }));

  const product = products.find((p) => p.slug === slug);

  return (
    <div className="px-4 py-8">
      <Link
        href={`/search${query ? `?q=${encodeURIComponent(query)}` : ''}`}
        className="mb-6 inline-block rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
      >
        &larr; Back to Search
      </Link>
      {product ? (
        <div className="border rounded p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">{product.productTitle}</h1>
          <p className="text-sm text-gray-500">{product.vendorName}</p>
          <p className="mt-4 text-xl font-bold">£{product.price}</p>
          <Link
            href={product.buyUrl}
            className="mt-6 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Buy Now
          </Link>
        </div>
      ) : (
        <p className="text-lg">Product not found.</p>