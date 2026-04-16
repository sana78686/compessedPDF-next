# Compress PDF (Next.js + SSR)

Next.js 15 app with **server-side rendering** for CMS pages (blog, legal, dynamic pages) while the **PDF compress tool** stays a **client** component (same behavior as the Vite SPA).

## Setup

```bash
cp .env.example .env.local
# Edit NEXT_PUBLIC_CMS_API_URL and NEXT_PUBLIC_SITE_DOMAIN
npm install
npm run dev
```

Open **http://localhost:3001** (not 3000 — see below).

`postinstall` copies `pdf.worker.min.mjs` into `public/` for the client compressor.

### Blank page + 500 on `/_next/static/...` at port 3000

Your Laravel **CMS API** (`compressedPDF-react` / Vite) often uses **`http://localhost:3000`**. If that server is already running, **Next.js cannot use the same port**, and something else may respond with **500** for `/_next/*` (those are Next.js assets, not Laravel).

- **Fix:** Use the dev script as configured: **`npm run dev`** → **http://localhost:3001**
- Or stop the process on 3000, then run `next dev -p 3000` if you really need 3000.

## Scripts

- `npm run dev` — development
- `npm run build` — production build
- `npm start` — run production server after build

## Relation to `compressedPDF-react`

- **compressedPDF-react** — original Vite SPA (unchanged).
- **compressedpdf-next** — new app for SEO: crawlers get full HTML on blog/legal/CMS routes; home still hydrates the tool.

You can run one or the other during migration.
