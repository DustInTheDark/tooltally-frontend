import Link from 'next/link';

export default function ProductPage({ params }) {
  const { slug } = params;
  const products = [
    {
      slug: 'hammer-acme-corp',
      productTitle: 'Hammer',
      vendorName: 'Acme Corp',
      price: '19.99',
      buyUrl: '#',
    },
    {
      slug: 'drill-tools-r-us',
      productTitle: 'Drill',
      vendorName: 'Tools R Us',
      price: '59.99',
      buyUrl: '#',
    },
    {
      slug: 'saw-basic-tools',
      productTitle: 'Saw',
      vendorName: 'Basic Tools',
      price: '29.99',
      buyUrl: '#',
    },
  ];

  const product = products.find((p) => p.slug === slug);

  return (
    <div className="px-4 py-8">
      <Link href="/search?q=yourQuery" className="mb-6 inline-block rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200">
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
      )}
    </div>
  );
}