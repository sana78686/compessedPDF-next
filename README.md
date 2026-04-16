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

### After `npm run build` — make the site visible on the domain

1. Open the **Dashboard** tab (not only “Run Node.js commands”).
2. Set **Application startup file** to **`server.js`** (the file in the same folder as `package.json`). Do **not** leave a broken path to `node_modules/next/...`.
3. Set **Application mode** to **production**.
4. Under **environment variables** / **Custom environment variables**, add at least:
   - `NODE_ENV` = `production`
   - `NEXT_PUBLIC_SITE_DOMAIN` = `my.compresspdf.id` (your real hostname)
   - `NEXT_PUBLIC_CMS_API_URL` = your Laravel API base, e.g. `https://app.apimstec.com` (no trailing slash)
5. **Apache & nginx** (or **Hosting Settings**): ensure the domain is set to **proxy** to the Node.js app (wording varies: e.g. “Serve Node.js application”, “Proxy mode”, or nginx `proxy_pass` to the port/socket Plesk shows). If the domain still shows a default Plesk/Apache page, the request is not reaching Node yet.
6. Click **Restart App** (or **Enable Node.js** if it was off).
7. Wait a few seconds, then open **https://my.compresspdf.id** (or HTTP first if SSL is not ready).

If you see **502 / 503 / connection refused**, check the Node app **logs** in Plesk (same Node.js screen) and confirm **`server.js`** exists in the application root and **`npm run build`** was run in that same folder.

### Plesk “default webpage” (robot) instead of your app

That page is **not** from Next.js — the domain is still serving **Plesk’s static default** `index.html`, so traffic **never reaches** Node.

1. **File Manager** → domain’s document root (often `httpdocs`) → **delete or rename** the default **`index.html`** (welcome page).
2. **Domain → Apache & nginx** (or hosting): enable **proxy to Node.js** / **Proxy mode** (exact name depends on Plesk version) so requests go to the Node port, not only static files.
3. Set **Document root** to the **`public`** subfolder under your app if Plesk asks (see orange warning on the Dashboard).
4. Add **custom environment variables** (`NODE_ENV`, `NEXT_PUBLIC_*`), then **Restart App** and load the site again.

Until the vhost **proxies** to Node, “Application will be restarted after the first request” never helps — the first request never hits Node.

### Env on the server

Add **`NODE_ENV=production`** and your CMS keys in Plesk “Custom environment variables” or `.env.production`:

- `NEXT_PUBLIC_CMS_API_URL`
- `NEXT_PUBLIC_SITE_DOMAIN` (e.g. `my.compresspdf.id`)

### Security (npm warnings)

Keep **Next.js** on a current **patched** 15.x release (see [Next.js security advisories](https://nextjs.org/blog)). This project pins a recent 15.5.x in `package.json`; run `npm update next` periodically after checking the advisory page.
