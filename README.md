# Proteinomat.pt — Deploy Guide

Dark navy + electric green aesthetic. Bold Archivo display type. Bilingual PT/EN throughout. Multi-page static site, built for Cloudflare Pages + Formspree.

## Site structure

```
proteinomat-site/
├── index.html              ← homepage (navy hero, green headline, product visual)
├── partners/index.html     ← /partners/ territory partner program
├── faq/index.html          ← /faq/ tabbed (Gyms / Partners / General)
├── privacy/index.html      ← /privacy/ GDPR-compliant, PT+EN
├── terms/index.html        ← /terms/ PT law, Leiria jurisdiction
├── cookies/index.html      ← /cookies/ PT+EN
├── assets/
│   ├── css/main.css        ← shared stylesheet
│   ├── js/main.js          ← shared JS (lang toggle, cookie banner, forms, FAQ, reveal)
│   └── img/                ← put hero-machine.png here
├── favicon.svg
├── robots.txt, sitemap.xml
├── _redirects, _headers
```

## BEFORE deploying — 3 things to do

### 1. Drop in your real machine photo (replaces the SVG placeholder)

Right now the hero uses a stylized SVG machine illustration. To swap for your real photo:

1. Save your photo as `/assets/img/hero-machine.png` (or `.jpg` — PNG with transparency preferred, ideally ~800x1000px with the machine on a transparent or dark background)
2. Open `index.html`, find this block (around line 470):
   ```html
   <div class="machine-placeholder">
     <svg viewBox="0 0 280 440" ...
     ...
     </svg>
   </div>
   ```
3. Replace the entire `<div class="machine-placeholder">...</div>` with:
   ```html
   <img src="/assets/img/hero-machine.png" alt="Proteinomat machine" />
   ```

That's it. The metric cards stay floating on top of the photo.

### 2. Set up Formspree (5 min)

Without this, forms silently fail. Free tier = 50 submissions/month, plenty for launch.

1. Go to [formspree.io](https://formspree.io) → sign up
2. Create form **#1: "Proteinomat — Contact"** → copy endpoint URL (`https://formspree.io/f/xabc1234`)
3. Create form **#2: "Proteinomat — Partner Applications"** → copy its endpoint URL
4. Point the forms' destination emails to:
   - Contact form → `hello@proteinomat.pt`
   - Partner form → `partners@proteinomat.pt`

Then replace the placeholders:

```
index.html line ~560:  YOUR_CONTACT_FORM_ID  →  xabc1234 (your actual ID)
partners/index.html line ~426:  YOUR_PARTNER_FORM_ID  →  xdef5678
```

### 3. Set up email aliases

Make sure these addresses actually receive mail:
- `hello@proteinomat.pt`
- `partners@proteinomat.pt`
- `privacy@proteinomat.pt` (GDPR requests — referenced in Privacy Policy)

Cloudflare Email Routing is free if your domain is on Cloudflare and handles this in 2 minutes.

## Deploy to Cloudflare Pages

**Option A — direct upload (fastest):**

1. Zip the `proteinomat-site` folder
2. [dash.cloudflare.com](https://dash.cloudflare.com) → Workers & Pages → Create → Pages → Upload assets
3. Project name: `proteinomat` → drop the zip → Deploy
4. Live at `https://proteinomat.pages.dev` in ~30 seconds

**Option B — GitHub-connected (better for iterating):**

```bash
cd proteinomat-site
git init
git add .
git commit -m "Initial"
git branch -M main
git remote add origin https://github.com/YOUR_USER/proteinomat-site.git
git push -u origin main
```

Cloudflare dashboard → Pages → Connect to Git → select repo → Build command: **leave empty** → Output: `/` → Deploy. Future `git push` auto-deploys in ~20s.

**Connect custom domain:**

Cloudflare Pages → Custom domains → Add `proteinomat.pt` and `www.proteinomat.pt`. If domain not on Cloudflare yet, add a CNAME pointing to `proteinomat.pages.dev` at your registrar. SSL auto-provisions in a few minutes.

## Post-deploy checklist

- [ ] Homepage loads, language toggle works (PT ↔ EN persists on refresh)
- [ ] No double-language text showing (old bug, should be fixed)
- [ ] Nav scrolls and gets dark blur background past 40px
- [ ] Mobile menu opens
- [ ] Cookie banner appears once, disappears after choice
- [ ] FAQ tabs switch panels; accordions expand
- [ ] Forms submit and land in Formspree inbox
- [ ] `/robots.txt`, `/sitemap.xml`, `/favicon.svg` all load

## Known things to do eventually

- **Real machine photo** in hero (most important for credibility — SVG placeholder works but reads as placeholder)
- **Lawyer review** of legal pages before serious traffic (~€200–400 Portuguese lawyer)
- **Analytics** — Plausible (€9/mo, GDPR-safe, cookie-less) or GA4. Script goes in `<head>` of all 6 pages. Update `/cookies/index.html` analytics table accordingly.
- **Partner agreement template** drafted before first application arrives. The /partners/ page promises territory exclusivity which is a contractual commitment.
- **Social links** in footer — update Instagram/LinkedIn when accounts live
- **Territory chips** on /partners/ — mark taken ones with `class="territory-chip taken"` and tag `<span class="tag">TAKEN</span>` as they close

## Troubleshooting

**Both PT and EN showing at once** — that bug is now fixed via `[data-lang] { display: none !important }` base rule. If you ever see it again, check that `<body>` has `class="lang-pt"` or `class="lang-en"` and the JS is loading.

**Forms submit but inbox empty** — first Formspree submission triggers email verification. Check Formspree dashboard Submissions tab, verify the confirmation email.

**Fonts look wrong** — the site uses Archivo (900 weight) for display and Inter for body. Google Fonts call is in each `<head>`. If offline or blocked, fonts fall back to system sans.

**CSS/JS not loading on a subdomain** — asset paths are absolute (`/assets/...`). If deploying to a subpath instead of root, change to relative paths in all 6 HTML files.

---

Built April 2026 — v2 (navy + green + bold sans aesthetic).
