export default function ProductCard({ productTitle, price, vendorName, buyUrl }) {
  return (
    <div className="border rounded p-4 shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-lg">{productTitle}</h3>
        <p className="text-sm text-gray-500">{vendorName}</p>
        <p className="text-xl font-bold mt-2">£{price}</p>
      </div>
      <a
        href={buyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Buy Now
      </a>
    </div>
  );
}
