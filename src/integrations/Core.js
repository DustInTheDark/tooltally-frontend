// integrations/Core.js
// Drop-in replacement for the previous “Base44” InvokeLLM.
// Calls your local Flask backend at http://127.0.0.1:5000/search?query=...

export async function InvokeLLM(req) {
  // Try to extract the quoted search term from the prompt; fall back to whole prompt.
  let query = req?.prompt || "";
  const m = typeof query === "string" ? query.match(/"([^"]+)"/) : null;
  if (m && m[1]) query = m[1];

  const url = `http://127.0.0.1:5000/search?query=${encodeURIComponent(query)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Local backend error: ${res.status} ${res.statusText}`);
  }
  return await res.json(); // { product_info, offers }
}
