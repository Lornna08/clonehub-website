# Deploying Clone Hub to Vercel — step by step

This gets your site live on the internet, for free. Two stages:
**A)** put the code on GitHub, **B)** connect Vercel. About 10–15 minutes total.

You do **not** need to understand the code to do this.

---

## Before you start

Install these once:

- **Node.js** (LTS version) — https://nodejs.org
- **Git** — https://git-scm.com/downloads
- A free **GitHub** account — https://github.com
- A free **Vercel** account — you'll make this in Stage B

---

## Stage A — Put the project on GitHub

### 1. Create an empty repository on GitHub
- Go to https://github.com/new
- Repository name: `clonehub-website`
- Leave it **Public** (or Private — both work with Vercel)
- Do **not** tick "Add a README" (the project already has one)
- Click **Create repository**

GitHub now shows a page with commands. Keep it open.

### 2. Upload the project

Open a terminal (Command Prompt on Windows, Terminal on Mac), then run these
lines one at a time. Replace `YOUR-USERNAME` with your GitHub username.

```bash
cd path/to/clonehub          # go into this project folder
git init
git add .
git commit -m "Clone Hub website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/clonehub-website.git
git push -u origin main
```

Refresh your GitHub repo page — you should see all the files.

> **No terminal?** Alternative: on the GitHub repo page click
> **uploading an existing file**, then drag in the whole project folder's
> contents (except the `node_modules` folder — don't upload that). This works
> but the terminal method is cleaner.

---

## Stage B — Deploy on Vercel

### 3. Create a Vercel account
- Go to https://vercel.com
- Click **Sign Up** → **Continue with GitHub** → authorise.

### 4. Import the project
- On the Vercel dashboard click **Add New… → Project**.
- You'll see your GitHub repositories. Find `clonehub-website` and click **Import**.
- If you don't see it, click **Adjust GitHub App Permissions** and give Vercel
  access to the repo.

### 5. Deploy
- Vercel automatically detects **Next.js** and fills in the correct settings.
  **You don't need to change anything** — Framework Preset: Next.js, Build
  Command and Output are set for you.
- Click **Deploy**.
- Wait ~1 minute. You'll see a celebration screen and a live link like
  `https://clonehub-website.vercel.app`.

That's it — the site is live.

---

## Stage C — Use your own domain (optional)

When you buy a domain (e.g. `clonehub.co.ke` from a registrar like Truehost):

1. In Vercel, open your project → **Settings → Domains**.
2. Type your domain and click **Add**.
3. Vercel shows DNS records (usually an `A` record and/or `CNAME`). Log into
   your domain registrar and add exactly those records.
4. Wait for it to verify (minutes to a few hours). Vercel adds HTTPS automatically.

Then open `data/site.ts` and change `url` to your real domain, commit, and push —
this keeps SEO links and the sitemap correct.

```ts
url: "https://clonehub.co.ke",
```

---

## Making changes after launch

1. Edit files (see the "How to edit" section in **README.md** — mostly the
   `data/` folder).
2. Save, then in the terminal:

```bash
git add .
git commit -m "describe what you changed"
git push
```

3. Vercel detects the push and redeploys automatically in about a minute.
   No further steps.

---

## Troubleshooting

- **"unable to find your GitHub repository" on Vercel** → Settings for the
  Vercel GitHub app → grant access to `clonehub-website`.
- **Build fails on Vercel** → open the build log; it names the file and line.
  Most often a typo in a `data/` file (a missing comma or quote). Fix, commit, push.
- **Fonts or images look off locally but fine deployed** → the site loads fonts
  from Google Fonts over the internet; a blocked network only affects local
  preview, not the deployed site.
```
