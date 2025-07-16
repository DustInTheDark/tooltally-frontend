+28
-19

import Link from 'next/link';

export default function ProductCard({ productTitle, price, vendorName, buyUrl }) {
  const slugify = (str) =>
    str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

  const slug = slugify(`${productTitle} ${vendorName}`);

  return (
    <div className="border rounded p-4 shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-lg">{productTitle}</h3>
        <p className="text-sm text-gray-500">{vendorName}</p>
        <p className="text-xl font-bold mt-2">£{price}</p>
      </div>
      <Link
        href={`/product/${slug}`}
        className="mt-4 inline-block text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        View Details
      </Link>
    </div>
  );
}