export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  let product = null;

  try {
    const res = await fetch(`${apiBase}/products/${id}`, { cache: "no-store" });
    if (res.ok) {
      product = await res.json();
    }
  } catch (e) {
    console.error("Failed to fetch product details", e);
  }

  if (!product) {
    return (
      <main className="px-4 py-8">
        <p>Product not found.</p>
      </main>
    );
  }

  return (
    <main className="px-4 py-8">
      <h1 className="mb-2 text-2xl font-semibold text-white">{product.name}</h1>
      {product.category && (
        <p className="mb-6 text-sm text-white">{product.category}</p>
      )}
      {product.vendors.length > 0 ? (
        <ul className="vendor-list space-y-4">
          {product.vendors.map((vendor, index) => (
            <li
              key={index}
              className="vendor-item flex items-center justify-between rounded-lg border border-brand-slate bg-white p-4 shadow-sm"
            >
              <span className="vendor-name font-medium text-white">{vendor.vendor}</span>
              <span className="vendor-price text-white font-bold">
                {`$${Number(vendor.price).toFixed(2)}`}
              </span>
              <a
                href={vendor.buy_url}
                target="_blank"
                rel="noopener noreferrer"
                className="buy-button rounded-md bg-brand-orange px-3 py-2 text-white hover:bg-brand-orange/90"
              >
                Buy Now
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