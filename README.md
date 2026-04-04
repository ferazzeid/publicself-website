# PublicSelf — marketing site (Next.js)

Standalone public landing for **publicself.app** (`/`, `/de`, `/fr`). The product app (Vite) lives in a **separate repository** and is deployed at **studio.publicself.app**.

This folder was split out from the `stepin` monorepo so marketing and product can each have their own Git remote and Coolify app without path confusion.

## Deploy on the root domain (Coolify)

Point **only** `https://publicself.app` at **this** repository.

| Setting | Value |
|--------|--------|
| **Repository** | This repo (e.g. `your-org/publicself-marketing`) |
| **Build pack** | Dockerfile |
| **Dockerfile path** | `Dockerfile` |
| **Build context** | `.` (repository root) |
| **Port** | `3000` |
| **Domains** | `https://publicself.app` |

**Environment variables** (build + runtime):

- `NEXT_PUBLIC_MARKETING_SITE_URL` = `https://publicself.app`
- `NEXT_PUBLIC_PRODUCT_SITE_URL` = `https://studio.publicself.app`

### Verification

**View Page Source** on the apex should show `/_next/static/` and real HTML. It should **not** show `stepIn_faviconUrl` (that is the Vite product shell).

## What this app owns

- `/`, `/de`, `/fr`, `sitemap.xml`, `robots.txt`, locale metadata and alternates

## What it does not own

- Authenticated product, studio, gallery — those are the **studio** deployment (other repo).

## Environment variables

- **`NEXT_PUBLIC_MARKETING_SITE_URL`** — canonical URL for this site (default `https://publicself.app`).
- **`NEXT_PUBLIC_PRODUCT_SITE_URL`** — tool app URL for CTAs and legal links (default `https://studio.publicself.app`).

## Supabase / SEO notes

- Auth **Site URL** and redirects belong on the **studio** product host; see that repo’s docs.
- Regenerate the **product** sitemap from the **product** repo (`npm run generate:sitemap` there).

## Local dev

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
