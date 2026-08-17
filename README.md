# Emanueli Tours and Safari — website

A production-ready, bilingual (English / French) website for Emanueli Tours and Safari,
a Tanzania-based safari driver-guide. Plain HTML/CSS/JS — **no build step, no framework,
no dependencies to install.** Deploys as-is to Vercel or GitHub Pages.

## Structure

```
index.html            Home
about.html             About Emanueli
destinations.html      Serengeti / Ngorongoro / Tarangire / Lake Manyara / Kogatende
tours.html              7 safari packages, itineraries & pricing
gallery.html           Photo & video gallery
faq.html                Frequently asked questions
contact.html            Contact form + WhatsApp + map
404.html                Custom not-found page

css/style.css           Entire design system (colors, type, components)
js/config.js            ⭐ Single place to set WhatsApp number, email, phone, socials
js/fr-dict.js           French translations (English lives directly in the HTML)
js/i18n.js              Language-switch engine (EN default, persisted in localStorage)
js/partials.js          Injects the shared header/footer/WhatsApp button on every page
js/main.js              Accordions, tabs, filters, gallery lightbox, photo placeholders

partials/header.html    Shared navigation
partials/footer.html    Shared footer + WhatsApp float button + back-to-top

assets/logo.png          Full-resolution logo (background removed)
assets/logo-small.png    Optimized logo used in the header/footer
assets/favicon-*.png, apple-touch-icon.png, og-image.jpg
assets/images/...         Photos (see "Photos" section below)
assets/videos/...         Videos (see "Photos" section below)
```

## Preview locally

Because the header/footer are loaded with `fetch()`, opening `index.html` directly by
double-clicking it (`file://...`) will NOT show the navigation — browsers block `fetch()`
on the `file://` protocol. Always preview through a local server:

```bash
cd emanuele-website
python3 -m http.server 8080
# then open http://localhost:8080
```

or, with Node installed:

```bash
npx serve .
```

## Deploy — GitHub + Vercel

1. Create a new GitHub repository and push this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the GitHub repo.
3. Framework preset: **Other** (it's a static site, no build command needed, no output
   directory to set — Vercel will serve the files as-is). Click **Deploy**.
4. Once live, add your custom domain under the Vercel project's **Domains** tab.

That's it — no environment variables, no build step.

## Before you go live — a short checklist

1. **WhatsApp number.** Open `js/config.js` and replace `whatsapp` and `whatsappDisplay`
   with the real number (international format, digits only, e.g. Tanzania mobile →
   `"2557XXXXXXXX"`). This single value powers the floating WhatsApp button, every
   "Book via WhatsApp" button, and the contact form.
2. **Email & phone.** Same file, `email` and `phone` fields.
3. **Social links.** Same file, `social.instagram` / `facebook` / `tripadvisor` / `youtube`.
4. **Domain.** Every page's `<head>` has a `canonical` and `og:url`-style tag pointing at
   `https://www.emanuelitoursandsafari.com/` — once you know the real domain, find-and-replace
   that placeholder across the `.html` files and in `robots.txt` / `sitemap.xml`.
5. **Testimonials.** Real client quotes weren't invented for you — `index.html` has three
   clearly-marked placeholder testimonial cards ("Your review will go here..."). Swap in
   real reviews (Google, TripAdvisor, WhatsApp screenshots) once you have a few.
6. **Double-check prices.** The 7 packages in `tours.html` use realistic Tanzania safari
   market pricing as a starting point — sanity-check every number against your real costs
   before publishing.

## Photos & video — how the placeholder system works

Every photo on the site sits inside a `.photo-slot` container that points at the **final**
expected filename. If that file exists, it shows. If it doesn't exist yet, a clean
"photo coming soon" placeholder is shown automatically instead of a broken-image icon —
so the site always looks intentional, never broken.

**To add a real photo, just save it with the exact filename already referenced in the
HTML — no code changes needed.** Most of the site is already filled with real photos you
provided or licensed stock photography (see credits below). Only four placeholders are
still empty:

| File to add | Used on |
|---|---|
| `assets/images/vehicle/land-cruiser-exterior.jpg` | Gallery |
| `assets/images/vehicle/land-cruiser-interior.jpg` | Gallery |
| `assets/images/vehicle/land-cruiser-pop-up-roof.jpg` | About page |
| `assets/videos/showreel.mp4` | Gallery (currently a styled placeholder card) |

Recommended sizes: photos ~1600px on the longest side, JPEG quality ~75–85 (keeps pages
fast). The video block on `gallery.html` is currently a static placeholder card — once you
have a real showreel, replace that block with a proper `<video>` tag (or embed a YouTube/
Vimeo link) and update `js/fr-dict.js` / the caption text accordingly.

**One thing to check:** the photo `assets/images/clients/kids-with-guide-vehicle.jpg`
shows the spare-tire cover of another company ("Active Tanzania Adventures") in the
background. It's a genuine client photo, so it's in the site as-is — you may want to
crop it, blur that panel, or swap it for a different shot before launch.

## Editing text & prices

- **English** copy lives directly in the `.html` files — edit it like normal HTML text.
- **French** copy lives in `js/fr-dict.js`, a flat `{ "key": "French text" }` dictionary.
  Every translatable element has a `data-i18n="some.key"` attribute in the HTML; the
  matching French string uses the exact same key in `fr-dict.js`. If you add new English
  text with a new `data-i18n` key, add the matching French line to `fr-dict.js` — otherwise
  the French version will simply fall back to showing the English text (never broken,
  just untranslated).
- **Prices & itineraries** are all in `tours.html` (English) and the `tours.*` keys in
  `js/fr-dict.js` (French).

## Credits

- Client photos: provided by Emanueli Tours and Safari.
- Wildlife & landscape photos: free-license stock photography from
  [Pexels](https://www.pexels.com) (Pexels License — free for commercial use, no
  attribution required), used as placeholders until replaced with the guide's own photos.
- Logo: supplied by the client; background removed for this build.
- Fonts: Fraunces &amp; Work Sans, both open-source via Google Fonts.
