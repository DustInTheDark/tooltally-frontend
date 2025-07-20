import Link from 'next/link';

export default async function ProductPage({ params, searchParams }) {
  // params and searchParams can be Promises in newer Next.js versions
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const { slug } = resolvedParams;
  const query = resolvedSearchParams?.q?.trim() || '';
  const backUrl = `/search${query ? `?q=${encodeURIComponent(query)}` : ''}`;

  const slugify = (str) =>
    str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  const products = (query
    ? [
        {
          productTitle: `${query} Pro Max 3000`,
          vendorName: 'Acme Corp',
          price: '99.99',
          buyUrl: '#',
        },
        {
          productTitle: `${query} Deluxe Set`,
          vendorName: 'Tools R Us',
          price: '59.99',
          buyUrl: '#',
        },
        {
          productTitle: `${query} Starter Kit`,
          vendorName: 'Basic Tools',
          price: '29.99',
          buyUrl: '#',
        },
      ]
    : [
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
      ]
  ).map((p) => ({ ...p, slug: slugify(`${p.productTitle} ${p.vendorName}`) }));

  const product = products.find((p) => p.slug === slug);

  return (
    <div className="px-4 py-8">
      <Link
        href={backUrl}
        className="mb-6 inline-block rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
      >
        &larr; Back to Results
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
      )}
    </div>
  );
}