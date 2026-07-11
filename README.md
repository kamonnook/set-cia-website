# SET International Affairs Website

A free, modern, bilingual (English / Thai) website for the **International Affairs unit** of the **School of Engineering and Technology (SET), Walailak University** (school level — distinct from the university’s Center for International Affairs).

Pure HTML / CSS / JavaScript — no build step, no framework, no server required. Designed to deploy free on **GitHub Pages**, Netlify, Vercel, Cloudflare Pages, or any static host.

---

## Folder structure

```
website/
├── index.html               # Home page
├── pages/
│   ├── about.html           # About / mission / team
│   ├── partners.html        # Partner directory + advertising opportunities
│   ├── programs.html        # Outbound + inbound programs
│   ├── news.html            # News and events with category filter
│   └── contact.html         # Inquiry form (info gathering)
└── assets/
    ├── css/style.css        # Single shared stylesheet
    ├── js/i18n.js           # EN / TH translation dictionary
    ├── js/main.js           # Nav, language toggle, news filter
    └── images/              # (drop your photos and partner logos here)
```

---

## What's inside

- **Home** — hero, six "what we offer" cards, partner snapshot, news snapshot, call-to-action banner.
- **About** — mission, vision, values, team placeholders.
- **Partners** — partner directory (12 example cards), advertising/spotlight opportunities, "become a partner" CTA.
- **Programs** — three outbound programs (exchange / summer / research) and three inbound programs (degree / exchange / internship).
- **News & Events** — six example posts with category filter (All / News / Events / Opportunities).
- **Contact** — bilingual inquiry form with Formspree integration; topic pre-selectable via `?topic=` URL parameter.
- **Bilingual** — every UI string has English + Thai. A pill toggle in the header switches language; the choice persists across pages via `localStorage`.
- **Responsive** — looks good on desktop, tablet, and mobile (hamburger menu kicks in below 640 px).
- **Accessible** — semantic HTML, ARIA labels, focus styles, sufficient color contrast.

---

## Quick start — preview locally

You only need a browser to open `index.html`. For the full experience (so the language toggle's `localStorage` works reliably and image paths resolve consistently), run a tiny local server:

```bash
# from inside the website/ folder
python3 -m http.server 8080
# then open http://localhost:8080
```

---

## Deploy free on GitHub Pages

1. **Create a GitHub account** if you don't have one ([github.com/signup](https://github.com/signup)).
2. **Create a new repository.** Suggested name: `set-cia-website` (or anything you like). Keep it **Public** so GitHub Pages is free.
3. **Upload these files** to the repository. Two easy ways:
   - **Drag & drop**: on the new empty repo page, click *uploading an existing file*, drag the contents of this `website/` folder in, then *Commit changes*.
   - **Git command line**:
     ```bash
     cd "1. SET-CIA/website"
     git init
     git add .
     git commit -m "Initial site"
     git branch -M main
     git remote add origin https://github.com/<your-username>/set-cia-website.git
     git push -u origin main
     ```
4. **Turn on GitHub Pages**: in the repo, go to **Settings → Pages**. Under *Build and deployment → Source*, choose **Deploy from a branch**, pick `main` and `/ (root)`, then **Save**.
5. Wait ~1 minute. GitHub will give you a public URL like
   `https://<your-username>.github.io/set-cia-website/`. That's your live site.

### Custom domain (optional, free apart from the domain cost)

If you own a domain like `cia.set.wu.ac.th`:
1. Add a file named `CNAME` (no extension) to the repo root containing just your domain on a single line.
2. In your DNS, add a CNAME record pointing the domain to `<your-username>.github.io`.
3. In **Settings → Pages → Custom domain**, enter the domain and enable **Enforce HTTPS**.

---

## Make the inquiry form work (Formspree — free)

The contact form posts to Formspree, which forwards submissions to your email — no backend needed.

1. Sign up at [formspree.io](https://formspree.io) (free tier: 50 submissions/month).
2. Create a new form, copy the endpoint URL (looks like `https://formspree.io/f/abcd1234`).
3. Open `pages/contact.html` and replace `https://formspree.io/f/YOUR_FORM_ID` in the `<form action="…">` attribute with your real endpoint.
4. Commit & push. You'll receive an email for each submission.

If you'd rather use Google Forms, Tally, or Netlify Forms — any of them will work. Just replace the `<form>` block.

---

## How to edit content

All content lives inside the HTML files. You don't need to know JavaScript to edit text — but **bilingual text lives in `assets/js/i18n.js`** because each string has both an English and a Thai version.

### Editing English & Thai text together

1. Find the element in the HTML, e.g.
   ```html
   <h1 data-i18n="home.title.line1">Engineering futures</h1>
   ```
   The `data-i18n="home.title.line1"` key is what matters.
2. Open `assets/js/i18n.js` and edit **both** the English (`en`) and Thai (`th`) versions of that key:
   ```js
   "home.title.line1": "Engineering futures",   // under en:
   "home.title.line1": "สร้างวิศวกรของอนาคต",   // under th:
   ```
3. Save and refresh the browser.

### Editing one-off English-only text

If a piece of text doesn't have a `data-i18n` attribute (for example, dates in news cards, or partner names), just edit the HTML directly.

### Adding a news item

Open `pages/news.html` and copy any `<article class="news-card">` block. Change:
- the `data-news-item` attribute (`news`, `events`, or `opportunities`) — controls which filter button it shows under,
- the gradient `style` on `.cover`,
- the `<span class="tag">` label,
- the date in `.meta`,
- the title and description.

### Adding a partner

Open `pages/partners.html`. Copy any `<div class="partner-card">` block and edit the logo abbreviation, the school name, and the small caption. To use a real logo image, replace `<div class="logo">KU</div>` with `<div class="logo"><img src="../assets/images/kyoto.png" alt="Kyoto University"></div>`.

---

## Suggested next steps (free things you can add)

- **Replace the hero image** with a Walailak campus photo — drop it in `assets/images/` and update `.hero-visual` in `style.css`.
- **Add real partner logos** to `assets/images/partners/` and reference them in `pages/partners.html`.
- **Wire up Google Analytics 4** for free traffic stats — paste your GA snippet into each `<head>`.
- **Open Graph tags** — add `<meta property="og:image">` etc. so links unfurl nicely on LinkedIn, Facebook, and Line.
- **Sitemap & robots.txt** — create `sitemap.xml` and `robots.txt` for better SEO.
- **Real student stories** — replace the placeholder news items.

---

## License

This site is yours — modify and use it freely for Walailak University's Center for International Affairs.

Built with care for international engineering.
