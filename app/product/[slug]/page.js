import Link from 'next/link';
import LoadingLink from '@/components/LoadingLink';

/**
 * ProductPage renders the details for a single product.
 * It uses sample data until the backend integration is implemented.
 * The page design uses the updated colour palette and improved typography.
 */
export default async function ProductPage({ params, searchParams }) {
  // params and searchParams can be Promises in newer Next.js versions
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const { slug } = resolvedParams;
  const query = resolvedSearchParams?.q?.trim() || '';
  const backUrl = `/search${query ? `?q=${encodeURIComponent(query)}` : ''}`;

  // Helper to slugify product titles to ensure the links match
  const slugify = (str) =>
    str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

  // Sample products used until real data integration
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
      <LoadingLink
        href={backUrl}
        className="mb-6 inline-block rounded-md bg-brand-light px-3 py-1 text-sm text-brand-dark hover:bg-gray-200 dark:text-gray-900 contrast-text"
      >
        &larr; Back to Results
      </LoadingLink>
      {product ? (
        <div className="rounded-lg border border-brand-slate bg-white p-6 shadow-md dark:bg-gray-800 dark:border-gray-700">
          <h1 className="text-3xl font-bold text-brand-dark dark:text-white">
            {product.productTitle}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {product.vendorName}
          </p>
          <p className="mt-4 text-2xl font-bold text-brand-blue">
            £{product.price}
          </p>
          <Link
            href={product.buyUrl}
            className="mt-6 inline-block rounded-md bg-brand-orange px-6 py-3 font-medium text-white hover:bg-brand-orange/90"
          >
            Buy Now
          </Link>
        </div>
      ) : (
        <p className="text-lg text-brand-dark">Product not found.</p>
      )}
    </div>
  );
}
