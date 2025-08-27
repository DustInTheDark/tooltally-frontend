# ToolTally — Frontend (Next.js 15 + Tailwind)

A modern App Router Next.js UI for ToolTally, a UK power tool price comparison site.

- **Framework:** Next.js 15 (App Router, Turbopack)
- **Styling:** Tailwind + minimal UI primitives
- **API bridge:** Internal `/api/*` routes proxy to the Flask backend (`compat_search.py`)
- **Key features:** Search, category browsing (A→Z), category cards with **Load More**, product list pagination with **Load More**, vendor offer links, product images (scraped & cached by backend)

---

## Quick Start

> **Requires** the backend running at `http://127.0.0.1:5000`. See the scrapers repo README for backend setup.

```bash
# 1) Install deps
npm install

# 2) Configure API base (create if missing)
#   .env.local
#   NEXT_PUBLIC_BACKEND_BASE=http://127.0.0.1:5000
#
#   (You can also set BACKEND_BASE, but NEXT_PUBLIC_BACKEND_BASE is sufficient.)

# 3) Run dev server
npm run dev

# 4) Open the app
# http://localhost:3000
```

What each command does:

- `npm install` — installs frontend dependencies.
- `npm run dev` — runs the Next.js dev server with Turbopack (fast refresh).
- `.env.local` — sets the backend base URL used by the internal API routes.

---

## Project Structure (key files)

```
app/
  page.js                    # Homepage with search + category cards (+ Load More)
  products/
    page.js                  # Search results & category browse (product pagination + Load More)
    [id]/page.js             # Product detail page (offers with vendor links)
  api/
    categories/route.js      # Proxies GET /categories to backend
    products/route.js        # Proxies GET /products to backend
    products/[id]/route.js   # Proxies GET /product/<id> to backend (404-safe JSON)
components/
  ui/
    input.js                 # Minimal input component
    button.js                # Minimal button component
    card.js                  # Minimal card primitives
```

---

## Environment Variables

Create `./.env.local`:

```ini
NEXT_PUBLIC_BACKEND_BASE=http://127.0.0.1:5000
```

- This is used by app API routes to talk to the Flask backend.

---

## Core Flows

### 1) Homepage

- Search bar → navigates to `/products?search=<term>`
- **Categories grid** (A→Z), with **Load More** showing 12 at a time
- Clicking a category opens `/products?category=<Name>`

### 2) Products page

- Shows category grid **only when** no search and no category are active.
- When searching or browsing a category:
  - Fetches the first page: `/api/products?search=<q>&category=<cat>&page=1&limit=24`
  - Shows a **Load More** button if `total > items.length`
  - Clicking **Load More** appends the next page (page 2, 3, …)

### 3) Product detail

- `/products/[id]` fetches `/api/products/[id]` → backend `/product/<id>`
- Renders vendor offers (best entry per vendor), with price and **click-through links**

---

## Image Handling

- Product list card image box is fixed height `h-48` with `object-contain` to avoid overflow/stretch.
- Images come from backend (`products.image_url`).
- If missing, card shows a neutral “No image” placeholder.

---

## Troubleshooting

### “Unexpected token `<` … not valid JSON” in console

This happens when the backend returns an **HTML 404** page and the frontend tries to `res.json()` it.

**Fix**: Run the correct backend:

```powershell
# in scrapers repo
py api\compat_search.py
```

We also hardened the detail proxy (`app/api/products/[id]/route.js`) to return a JSON error object even if the upstream sends HTML.

### 404 detail pages

If `/api/products/[id]` returns 404, ensure the backend route `/product/<id>` exists (only in `compat_search.py`, not `api.py`).

### Multiple lockfiles warning

Delete the extra one:

```
C:\Users\tyler\ToolTally\tooltally-frontend\package-lock.json
```

---

## Useful Dev Commands

```bash
# Lint (if configured)
npm run lint

# Build & start (production)
npm run build
npm start
```

---

## License

MIT (project-specific details may vary in the root LICENSE).
