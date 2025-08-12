# tooltally-frontend/README.md

````markdown
# ToolTally — Frontend (Next.js 15 + Tailwind)

UK tool price comparison UI. Uses the App Router and a built‑in proxy so the browser calls our Next.js `/api/*` routes, which forward to the Flask backend (no CORS issues).

## Stack
- Next.js 15.4.x (App Router)
- React 18
- Tailwind CSS
- Node 18+ (LTS) or Node 20+

## Quick start

1) Install
```bash
npm i
````

2. Configure
   Create `.env.local` in the repo root:

```
# Local Flask API (default dev address)
BACKEND_API_URL=http://127.0.0.1:5000
```

3. Run dev server

```bash
npm run dev
# http://localhost:3000
```

## How data flows

**Browser** → `GET /api/products?...` → **Next.js proxy** → `GET {BACKEND_API_URL}/products?...` (Flask)

The proxy normalizes/guards the response so the UI always receives a consistent shape.

### Frontend API routes (proxy)

* `GET /api/products?search=<term>&category=<optional>&page=<optional>&limit=<optional>`

  * Proxies to Flask and groups/dedupes if the backend returns vendor‑level rows.
  * If server‑side pagination is enabled in the proxy, it returns:

    ```json
    {
      "items": [
        { "id": 123, "name": "...", "category": "...", "min_price": 12.34, "vendors_count": 3 }
      ],
      "total": 312, "page": 1, "limit": 24
    }
    ```

    Otherwise, it returns a plain array of normalized products.

* `GET /api/products/:id`

  * Proxies to Flask `/products/:id` and returns:

    ```json
    {
      "id": 123, "name": "...", "category": "...",
      "vendors": [ { "vendor": "Toolstation", "price": 12.34, "buy_url": "..." } ]
    }
    ```

> In development, the proxy calls use `fetch(..., { cache: "no-store" })` to avoid stale data.

## UI behavior

* `/products?search=<term>` shows a grid of **unique products**.
* Each card renders:

  * **Name** (explicit `text-gray-900` so the title is always visible on white cards),
  * Category (if available),
  * Left: `N vendor(s)` (when present),
  * Right: **GBP min price** (`£12.34`).
* Client‑side pagination: **24 per page** with a **Load more** button that appends the next 24. If the proxy returns `{items,total,page,limit}`, the page uses that; otherwise it paginates in the browser.
* Clicking a card → `/products/[id]` detail page listing all vendor offers (sorted by price) with **Buy** links opening in a new tab.

## Aliases & utils

Path alias in `jsconfig.json`:

```json
{
  "compilerOptions": { "paths": { "@/*": ["./*"] } }
}
```

Utility helpers in `utils/format.js`:

* `formatGBP(value)` – uses `Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" })`
* `pluralize(count, one, many)` – simple pluralizer for labels like `vendor(s)`

## Production build

```bash
npm run build
npm run start
```

Ensure `BACKEND_API_URL` points at your deployed Flask API.

## Troubleshooting

* **Invisible product titles**: fixed by adding `text-gray-900` to the card title.
* **CORS**: avoided by the Next.js proxy; the browser never talks to Flask directly.
* **API 404/ECONNREFUSED**: make sure Flask is running and the DB has data (see scrapers README for `migrate.py`, scrapers, and `resolver.py`).
* **Windows**: prefer PowerShell or Git Bash; no WSL required.

````

---

# tooltally-scrapers/README.md

```markdown
# ToolTally — Scrapers & API (Flask + SQLite + Scrapy)

Scrapes UK tool retailers into a staging table (`raw_offers`), resolves them into canonical `products` + `offers`, and serves a Flask API used by the frontend.

## Stack
- Python 3.11+ (tested on 3.12)
- Scrapy 2.13
- Flask
- SQLite (DB file at `data/tooltally.db` by default)

## Data flow

````

Scrapers  ──►  raw\_offers (staging)
Resolver  ──►  products (unique) + offers (per vendor)
Flask API ──►  /products, /products/\:id, /categories
Frontend  ──►  Next.js proxy uses the API

````

## Quick start (Windows PowerShell shown; macOS/Linux: use `python3`)

### 1) Install
```powershell
py -m venv .venv
. .venv\Scripts\Activate.ps1
pip install -r requirements.txt
````

### 2) Ensure schema

```powershell
py scripts\migrate.py
# Creates tables if missing and applies lightweight migrations (e.g. adds offers.created_at)
```

### 3) Scrape data

Run scrapers individually:

```powershell
py scripts\scrape_toolstation.py
py scripts\scrape_screwfix.py
py scripts\scrape_toolstop.py
py scripts\scrape_dandm.py
```

Or run them all:

```powershell
py scripts\scrape_all.py
```

These write rows to **`raw_offers`** (staging). The runner scripts throttle requests and bypass project pipelines; they insert directly.

### 4) Resolve to canonical products/offers

```powershell
py scripts\resolver.py
# Rebuilds products + offers from raw_offers (deletes and re-inserts in one pass)
```

Optional dry run (no writes):

```powershell
py scripts\resolver.py --dry-run
```

### 5) Run the API

```powershell
set FLASK_APP=api.py
set FLASK_ENV=development
py api.py
# http://127.0.0.1:5000
```

The API reads the **canonical** tables (`products`, `offers`, `vendors`) that the resolver builds.

## Database schema (summary)

* `raw_offers` — scraper staging

  ```
  id, vendor, title, price_pounds, url, vendor_sku, category_name, scraped_at, processed
  ```
* `vendors` — unique vendor names

  ```
  id, name (unique)
  ```
* `products` — canonical products

  ```
  id, name, category
  ```
* `offers` — vendor offers tied to products

  ```
  id, product_id, vendor_id, price_pounds, url, created_at
  ```

### Indexes (created by `scripts/migrate.py`)

* `vendors(name)` unique
* `products(name)` index
* `offers(product_id)`, `offers(vendor_id)` indexes
* `offers(url)` unique (dedupe)
* `raw_offers(vendor)`, `raw_offers(url)` indexes

## API endpoints (served by `api.py`)

* `GET /products?search=<term>&category=<optional>`
  Returns **grouped** (unique) products with min price and vendor count. Example:

  ```json
  [
    { "id": 123, "name": "Makita DHP484Z 18V Bare Unit", "category": "Cordless Drill",
      "min_price": 70.50, "vendors_count": 2 }
  ]
  ```

  If you add server‑side pagination in the proxy, you can also return `{ items, total, page, limit }` here.

* `GET /products/<id>`
  Returns one product + all vendor offers (sorted by price):

  ```json
  { "id": 123, "name": "Makita DHP484Z 18V Bare Unit", "category": "Cordless Drill",
    "vendors": [ { "vendor": "Toolstation", "price": 70.50, "buy_url": "..." } ] }
  ```

* `GET /categories`
  Returns distinct product categories.

## Environment variables

* `DB_PATH` — path to SQLite DB (default: `data/tooltally.db`)
* `FLASK_ENV` / `FLASK_DEBUG` — standard Flask flags
* `FLASK_RUN_PORT` — change API port if needed

Example:

```powershell
set DB_PATH=C:\path\to\tooltally.db
py scripts\migrate.py
```

## Common checks

How many products/offers/vendors:

```powershell
py -c "import sqlite3; con=sqlite3.connect(r'data/tooltally.db'); \
print('products:', con.execute('select count(*) from products').fetchone()[0]); \
print('offers:', con.execute('select count(*) from offers').fetchone()[0]); \
print('vendors:', con.execute('select count(*) from vendors').fetchone()[0]); con.close()"
```

Products merged across multiple vendors (merge quality):

```powershell
py -c "import sqlite3; con=sqlite3.connect(r'data/tooltally.db'); \
print('products with >1 vendor:', con.execute('select count(*) from (select product_id, count(distinct vendor_id) c from offers group by product_id having c>1)').fetchone()[0]); con.close()"
```

Peek a few merged examples:

```powershell
py -c "import sqlite3, json; con=sqlite3.connect(r'data/tooltally.db'); con.row_factory=sqlite3.Row; \
q='''select p.id, p.name, count(distinct o.vendor_id) as vendors, min(o.price_pounds) as min_price\n     from products p join offers o on o.product_id=p.id\n     group by p.id having vendors>1\n     order by vendors desc, min_price asc limit 10''' ; \
print(json.dumps([dict(r) for r in con.execute(q)], indent=2)); con.close()"
```

## Resetting (optional)

Soft reset (same effect the resolver has on each run: clears products/offers):

```powershell
py scripts\reset_canonical.py
```

Hard reset (also clears vendors; resolver will repopulate):

```powershell
py scripts\reset_canonical.py --all
```

Nuclear (also clears raw\_offers; re‑scrape required):

```powershell
py scripts\reset_canonical.py --all --raw
```

> If `reset_canonical.py` is not in your repo yet, it’s optional. You can always just run `resolver.py` to rebuild products/offers from `raw_offers`.

## Troubleshooting

* **`No module named 'scripts'`**: Run from repo root (`tooltally-scrapers`) and call modules like `py scripts\scrape_toolstation.py`.
* **`offers has no column named created_at`**: Run `py scripts\migrate.py` to add the column.
* **Scrapy signals/pipelines**: The runner scripts connect signals per crawler and disable project pipelines/telnet.
* **PowerShell quoting**: Avoid multi‑line `-c` strings; prefer the single‑line commands above.
* **SQLite CLI missing**: Use the Python one‑liners instead, or install DB Browser for SQLite.

## Notes

* The resolver (v2.1) merges across vendors using brand + model/MPN + voltage + kit signature (bare/kit), with brand‑aware regexes (Makita, DeWalt, Bosch, Milwaukee, Einhell, Ryobi, Black+Decker). It’s idempotent—each run clears and rebuilds the canonical tables.
* WAL mode is enabled for better read/write concurrency with the frontend.

```
```
