# Clone Hub — Website

Design, printing and branding studio site for **Clone Hub Prints**, Nairobi.
Built with Next.js 15 + React 19 + TypeScript. Ready to deploy to Vercel.

---

## Quick start (run it on your computer)

You need **Node.js 18.18+** installed (get it from https://nodejs.org — the "LTS" version).

```bash
npm install      # install dependencies (first time only)
npm run dev      # start the site at http://localhost:3000
```

Open http://localhost:3000 in your browser. Edits appear live as you save.

To check the production build:

```bash
npm run build
npm start
```

---

## Deploy to Vercel

See **DEPLOY.md** for full step-by-step instructions with screenshots-level detail.
Short version:

1. Push this folder to a GitHub repository.
2. Go to https://vercel.com, sign in with GitHub, click **Add New → Project**.
3. Import the repository. Vercel auto-detects Next.js — just click **Deploy**.
4. Your site goes live at `your-project.vercel.app` in about a minute.

Every time you push to GitHub's `main` branch, Vercel redeploys automatically.

---

## How to edit the site (no deep coding needed)

Almost everything you'll want to change lives in the **`data/`** folder.

### Business details — `data/site.ts`
Phone, WhatsApp number, email, address, company name. Change once here and it
updates everywhere on the site (header, footer, contact page, WhatsApp links).

### Services — `data/services.ts`
The full service catalog. To add a service, copy one line and edit it:

```ts
S("New Service Name", "printing", "Short description shown on the card."),
```

The category (`"printing"`) must match one of the category ids at the top of the file.

### Client logos — `data/showcase.ts`
By default clients show as styled text chips. To show a **real logo image**:

1. Put the logo file in `public/clients/` (e.g. `public/clients/safaricom.png`).
2. Edit the client line:

```ts
{ name: "Safaricom", logo: "/clients/safaricom.png" },
```

### Portfolio images — `data/showcase.ts`
By default portfolio tiles are branded placeholders marked "Demo". To use a
**real project photo**:

1. Put the photo in `public/work/` (e.g. `public/work/vehicle-wrap.jpg`).
2. Edit the work line:

```ts
{ title: "Retail Vehicle Wrap", cat: "Large Format", image: "/work/vehicle-wrap.jpg", tone: [BRAND.ink, BRAND.sky] },
```

### Hero image
The homepage hero photo is `public/hero.jpg`. Replace that file (keep the name)
to swap it. Keep it optimized (~100–200KB, roughly 1100px wide) for speed.

### Homepage text / colours
Section copy lives in `components/CloneHubApp.tsx`. Brand colours are in
`data/site.ts` under `BRAND`.

---

## What this site does and doesn't do

**Does:** shows the full catalog, lets customers build a detailed quote request
through a guided form, and sends it as a structured **WhatsApp message** or
**email** to Clone Hub. No fake prices — everything is quotation-driven.

**Doesn't (yet):** there is no database and no admin login. Quote requests are
not stored anywhere — they arrive on WhatsApp/email. Content is edited in the
`data/` files above. If you later want a self-service admin dashboard where
Erick edits content and images from a browser, that's the next phase (a headless
CMS such as Sanity is the recommended route).

---

## Project structure

```
app/            Next.js pages, layout, SEO (sitemap, robots, metadata)
components/     UI — Logo + the main CloneHubApp component
data/           EDIT THESE: site.ts, services.ts, showcase.ts
public/         Images: hero.jpg, favicons, and your clients/ + work/ folders
```
