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

---

## Plesk / InterServer VPS (Node.js extension)

### Why `node_modules/next/dist/bin/next` was “file not found”

1. **Application Root** must be the folder that **contains `package.json` and `node_modules`** after `npm install`. If the repo is a monorepo, the root might be `Final-seo-projects/` but the Next app is in **`compressedpdf-next/`** — set Application Root to that inner folder (or deploy only that folder via Git).
2. **Run `npm install` (or `npm ci`) in that same folder** on the server. Until `node_modules/next` exists, no Next path will work.
3. Plesk is happier with a **real project file** as the startup entry. This repo includes **`server.js`** at the app root — use that instead of pointing at `node_modules/.../next` directly.

### Settings (typical)

| Field | Value |
|--------|--------|
| Application mode | production |
| Application root | e.g. `/var/www/vhosts/.../my.compresspdf.id` = folder with **`package.json`** |
| Application startup file | **`server.js`** (name only or relative path, per your Plesk version) |
| Node.js | Prefer **20.x or 22.x LTS**. Node **25** is very new; use LTS if anything breaks. |

### Deploy commands (SSH or Plesk “Run script”)

```bash
cd /path/to/app   # folder with package.json
npm ci --omit=dev   # or npm install --omit=dev
npm run build       # required before first start
```

Then **Restart App** in Plesk. The server reads **`PORT`** from the environment (Plesk usually sets this).

### Env on the server

Add **`NODE_ENV=production`** and your CMS keys in Plesk “Custom environment variables” or `.env.production`:

- `NEXT_PUBLIC_CMS_API_URL`
- `NEXT_PUBLIC_SITE_DOMAIN` (e.g. `my.compresspdf.id`)

### Security (npm warnings)

Keep **Next.js** on a current **patched** 15.x release (see [Next.js security advisories](https://nextjs.org/blog)). This project pins a recent 15.5.x in `package.json`; run `npm update next` periodically after checking the advisory page.
