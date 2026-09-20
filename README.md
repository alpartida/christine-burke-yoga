# Christine Burke Yoga — website

A plain static site: no build tools, no framework. Open `index.html` in a browser and it works.

## Editing

| What you want to change | Where |
|---|---|
| Class schedule, workshops, rates, contact info, testimonials | `content.js` — the only file you normally need |
| Page copy (bio, offerings, book blurbs) | `index.html` — find the section comment (`<!-- ABOUT -->` etc.) |
| Colors, fonts | `css/style.css` — the `:root` block at the top; change a hex, the whole site follows |
| Photos | `images/` — web-sized copies used by the site; full-size originals live in `originals/` |

`content.js` is written to be safe to edit by hand. The class schedule is one line per class date:

```js
{ date: "2026-10-13", time: "9:30 – 10:45 AM", title: "Morning Magic" },
```

Add lines to the bottom as Christine sends new dates; past dates hide themselves, so nothing ever needs deleting. Class descriptions live once in `CLASSES` (keyed by title). Workshops/retreats work the same way in `EVENTS`.

## Booking

Deliberately no paid booking platform. Every **Register** button emails Christine (`SITE.defaultRegister` in `content.js`); she replies with the Zoom link and takes payment by Venmo/Zelle. **Book a consultation** goes to `SITE.consultation` — a free Calendly link fits there if she wants one. If she ever outgrows this, paste a booking-tool URL into `defaultRegister` and every button follows; an individual class can also carry its own `register:` link.

The newsletter form is a placeholder — it needs a Mailchimp / Buttondown / Netlify Forms endpoint before launch.

## Before launch

- [ ] Remove the `.demo-banner` div at the top of `index.html`
- [ ] Confirm the Facebook page in `content.js`
- [ ] Replace stand-in photos with the professional shots
- [ ] Real student testimonials in `content.js`
- [ ] Wire the newsletter form
- [ ] Real class dates in `content.js` (current ones follow her pattern but are examples) and her own Vitality Flow description

## Publishing

**Live site:** https://alpartida.github.io/christine-burke-yoga/ (GitHub Pages, from the `main` branch of `alpartida/christine-burke-yoga`).

To push a change:

```sh
git add -A
git commit -m "Add October class dates"
git push
```

GitHub rebuilds the site in about a minute. When Christine has a domain (e.g. christineburkeyoga.com), add it under the repo's Settings → Pages → Custom domain and point the domain's DNS at GitHub Pages; the site itself doesn't change.

`scripts/build-artifact.sh` makes the wrapper-stripped copy used for the Claude Artifact review link — not needed for the live site.
