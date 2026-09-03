# Setting up the Clone Hub content dashboard (CMS)

This gives Erick (and you) a friendly dashboard to edit the website's content —
homepage text, services, portfolio images, client logos and the catalogue —
without touching any code.

It uses **Sanity**, a free content platform. There are two pieces:

- **The Studio** (the `clonehub-studio` folder) → this becomes the dashboard Erick logs into.
- **The website** (the `clonehub` folder) → already wired to read content from Sanity.

**Important safety net:** until you finish this setup, the website keeps working
exactly as it does now, using its built-in content. Nothing breaks while you set up.
The CMS only *overrides* the built-in content once it's connected and has data.

---

## Part 1 — Create your Sanity project (~5 minutes)

1. Go to **https://www.sanity.io** and click **Get started** → sign up (Google/GitHub/email).
2. On your computer, you'll set up the Studio. Open a terminal **inside the `clonehub-studio` folder** and run:

   ```
   npm install
   npx sanity login
   ```

   `sanity login` opens your browser to confirm — click to approve.

3. Create the project:

   ```
   npx sanity init --env
   ```

   - When asked, choose **Create new project**.
   - Project name: `Clone Hub`
   - Use the default dataset configuration: **Yes** (this creates `production`).
   - It writes a `.env` file with your **project ID**. Open `.env` and copy the
     value of `SANITY_STUDIO_PROJECT_ID` — you'll need it in Part 3.

   > If `init` asks about a project template, choose **Clean project / no predefined schema**
   > (this folder already has the schema).

---

## Part 2 — Put the Studio online for Erick (~2 minutes)

Still in the `clonehub-studio` folder:

```
npx sanity deploy
```

- It asks you to pick a **studio hostname** — choose something like `clonehub`.
- Your dashboard is now live at **https://clonehub.sanity.studio** (or whatever
  hostname you picked). This is the link Erick uses to log in and edit.

To let Erick in: in **https://www.sanity.io/manage**, open the Clone Hub project →
**Members** → **Invite member** → enter Erick's email. He signs up free and can edit.

---

## Part 3 — Connect the website to Sanity (~3 minutes)

The website needs to know your project ID.

1. Go to your **Vercel** project → **Settings** → **Environment Variables**.
2. Add two variables:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SANITY_PROJECT_ID` | *(the project ID you copied in Part 1)* |
   | `NEXT_PUBLIC_SANITY_DATASET` | `production` |

3. Save, then go to **Deployments** → redeploy the latest (⋯ → Redeploy) so the
   new variables take effect.

That's it — the website now reads content from Sanity.

---

## Part 4 — Let images load from Sanity

Sanity serves images from `cdn.sanity.io`. The website is already configured to
allow this (see `next.config.mjs`). No action needed — just noting it works.

---

## Using the dashboard

At your studio URL, Erick will see these editable sections:

- **Site Settings** — business name, address, both phone numbers, WhatsApp,
  email, and the homepage headline / sub-text / hero image.
- **Services** — add, edit, remove services and their category.
- **Portfolio / Work** — upload project photos, set titles and categories,
  mark one as *featured*.
- **Clients / Brands** — brand names and optional logo uploads.
- **Catalogue Sections** — the catalogue page content and images.

Edits appear on the live site within about a minute (no redeploy needed).

### Seeding the initial content
When you first open the Studio it's empty, and the website keeps showing its
built-in content. As you add items in the Studio, they take over. To reproduce
what's on the site now, create entries matching the current services, work and
clients. (Optional — you can also just start editing from scratch.)

---

## If something looks wrong

- **Site shows built-in content, not my edits** → check the two environment
  variables in Vercel are spelled exactly as above and you redeployed.
- **Images don't load** → confirm `next.config.mjs` lists `cdn.sanity.io` under
  images (it does by default in this project).
- **Studio won't deploy** → make sure you ran `npm install` and `sanity login`
  first, inside the `clonehub-studio` folder.

The website is designed so that any CMS problem falls back to the built-in
content — it will not break the live site.
