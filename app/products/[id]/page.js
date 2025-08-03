export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  // TODO: Fetch product details and vendor offers from backend
  // Dummy vendor offers for demonstration
  const vendors = [
    { name: "Vendor A", price: "$99.00", url: `https://vendor-a.example.com/product/${id}` },
    { name: "Vendor B", price: "$105.50", url: `https://vendor-b.example.com/product/${id}` }
  ];

  return (
    <main className="px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-white">Product {id} Details</h1>
      {vendors.length > 0 ? (
        <ul className="vendor-list space-y-4">
          {vendors.map((vendor, index) => (
            <li key={index} className="vendor-item flex items-center justify-between rounded-lg border border-brand-slate bg-white p-4 shadow-sm">
              <span className="vendor-name font-medium text-brand-dark">{vendor.name}</span>
              <span className="vendor-price text-brand-blue font-bold">{vendor.price}</span>
              <a
                href={vendor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="buy-button rounded-md bg-brand-orange px-3 py-2 text-white hover:bg-brand-orange/90"
              >
                Buy
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No vendor offers available for this product.</p>
      )}
    </main>
  );
}