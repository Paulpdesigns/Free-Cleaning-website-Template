# Free Cleaning Website — Template

A static, animated cleaning-service website template with a live custom quote
calculator and an interactive before/after portfolio slider. No build step —
plain HTML/CSS/JS, so it deploys straight to GitHub Pages.

## Files

```
index.html        Home page (hero, services, process, quote checker, testimonials, contact)
portfolio.html     Before/after case studies with category filter
css/style.css      Design tokens, layout, all animations
js/main.js         Nav, scroll reveals, counters, quote calculator, compare slider, filters
```

## Deploy to GitHub Pages (no build tools needed)

1. Create a new repo on GitHub (e.g. `pinewell-cleaning-template`).
2. Upload these files/folders to the repo root — keep the `css/` and `js/`
   folders exactly as-is so the relative paths in the HTML still work.
3. In the repo: **Settings → Pages → Source → Deploy from a branch**, pick
   `main` and `/ (root)`, then Save.
4. Wait ~1 minute, then your site is live at
   `https://<your-username>.github.io/<repo-name>/`.

## What to customize before handing to a client

- Swap the Unsplash photo URLs in `index.html` / `portfolio.html` for the
  client's own photos (or licensed stock) — search-and-replace the `src="https://images.unsplash.com/..."` lines.
- Update the pricing logic in `js/main.js` (`rates`, `freqMultiplier`,
  `addonCost`) to match the client's actual pricing.
- Wire the contact form (`#contact-form` in `index.html`) to Formspree, a
  mailto link, or the client's CRM — right now it just shows a status message.
- Replace testimonials, stats, and case-study copy with real client content.

## Notes

- Animations respect `prefers-reduced-motion`.
- No frameworks or npm install required — just open `index.html` in a browser
  to preview locally, or use a simple local server (e.g. `python3 -m http.server`)
  so relative paths behave the same as they will on GitHub Pages.
