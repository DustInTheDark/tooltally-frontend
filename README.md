# ToolTally Frontend

This repository contains the Next.js frontend for ToolTally. It expects an API backend (for example, the Flask server from [tooltally-scrapers](https://github.com/DustInTheDark/tooltally-scrapers)) running separately.

## Setup

Run these commands from the `tooltally-frontend` directory:

```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
npm install
npm run dev
```

The development server runs at <http://localhost:3000> and forwards API requests to `NEXT_PUBLIC_API_URL`.

## Notes

This frontend targets Next.js 15; dynamic routes await `params` and `searchParams` to avoid runtime warnings.

## Testing and linting

This project does not yet define test or lint scripts. Running them will report missing configuration:

```bash
npm test     # no tests configured
npm run lint # eslint not configured
```

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
