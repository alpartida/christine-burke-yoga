# Christine Burke Yoga — website

A plain static site: no build tools, no framework. Open `index.html` in a browser and it works.

## Editing

| What you want to change | Where |
|---|---|
| Class schedule | Christine's Google Sheet (see below), or `SCHEDULE` in `content.js` |
| Workshops, rates, contact info, testimonials | `content.js` — the only file you normally need |
| Page copy (bio, offerings, book blurbs) | `index.html` — find the section comment (`<!-- ABOUT -->` etc.) |
| Colors, fonts | `css/style.css` — the `:root` block at the top; change a hex, the whole site follows |
| Photos | `images/` — web-sized copies used by the site; full-size originals live in `originals/` |

`content.js` is written to be safe to edit by hand. The class schedule is one line per class date:

```js
{ date: "2026-10-13", time: "9:30 – 10:45 AM", title: "Morning Magic" },
```

Add lines to the bottom as Christine sends new dates; past dates hide themselves, so nothing ever needs deleting. Class descriptions live once in `CLASSES` (keyed by title). Workshops/retreats work the same way in `EVENTS`.

## The schedule spreadsheet

So Christine can post her own dates, the site can read the schedule from a Google Sheet she owns. Paste the sheet link into `SITE.scheduleSheet` in `content.js` and it takes over from `SCHEDULE`.

Setting it up, once:

1. New Google Sheet, owned by Christine. Import `data/schedule-template.csv` (File → Import) so the header row and a fortnight of example rows are there.
2. Share → **Anyone with the link → Viewer**. (Or File → Share → Publish to web → CSV; either link works.)
3. Paste the link into `SITE.scheduleSheet`, commit, push.
4. Send her `UPDATING-THE-SITE.md` — it's written for her, not for a developer — with the sheet link pasted into the top of it.

How it behaves:

- Columns are matched **by header name**, not position: `Date, Time, Class, Price, Format, Register, Note`. Only `Date` is required; `Time` and `Class` are what make a row useful.
- Dates are accepted as `2026-10-13`, `10/13/2026` or `Oct 13, 2026` — whatever Google decides to store.
- `Class` keys into `CLASSES` in `content.js` for the description and level. An unknown name still renders, just without a blurb.
- `Note` is a one-off line for that date, shown under the class description.
- `Price` blank → `DEFAULT_PRICE`. `Format` blank → Zoom.
- The page first renders `SCHEDULE` from `content.js`, then replaces it if the sheet answers. Unreachable sheet, no link, offline: the `content.js` list simply stays. So keep a sane list in there as the safety net.

## Past retreat photos

`RETREAT_PHOTOS` in `content.js` feeds the "From past retreats" gallery. While the list is empty the whole section is hidden, so it can ship empty. Web-size the images (~1600px wide) into `images/` first.

## Testimonials

`TESTIMONIALS` in `content.js` fills the Kind words wall. Add `section: "classes"` to a quote and it *also* appears below the class schedule — the page has a slot at `data-quote="classes"`, and more slots can be added anywhere with `<div class="quotes one" data-quote="coaching"></div>`.

## Booking

Deliberately no paid booking platform. Every **Register** button emails Christine (`SITE.defaultRegister` in `content.js`); she replies with the Zoom link and takes payment by Venmo/Zelle. **Book a consultation** goes to `SITE.consultation` — a free Calendly link fits there if she wants one. If she ever outgrows this, paste a booking-tool URL into `defaultRegister` and every button follows; an individual class can also carry its own `register:` link.

The newsletter form is a placeholder — it needs a Mailchimp / Buttondown / Netlify Forms endpoint before launch.

## Before launch

- [ ] Remove the `.demo-banner` div at the top of `index.html`
- [ ] Set up the schedule sheet and paste the link into `SITE.scheduleSheet`
- [ ] Christine's new rates in `RATES` + `DEFAULT_PRICE` (the $19-era studio rates are still in there)
- [ ] Her own class descriptions in `CLASSES` (Vitality Flow is still mine)
- [ ] Real student testimonials in `content.js`
- [ ] Real workshop / SMHD / retreat dates in `EVENTS`
- [ ] Replace stand-in photos with the professional shots
- [ ] Wire the newsletter form

Done: Facebook page confirmed (she's not active there — the link stays but earns nothing), Venmo confirmed, consultations stated as a free 20 minutes.

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
