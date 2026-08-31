# EMH Annual Forum 2026 — Microsite

Event site for the **EMH Annual Forum 2026** (December 16–17, 2026, Richcraft Hall, Carleton University, Ottawa).

Single-page site with hash routing: `index.html` contains all six pages (Home, Agenda, Speakers, Sponsors, Venue, Hall of Fame). Images live in `images/`.

**Bilingual:** `fr.html` is the French version — same structure, same images, French text. The EN/FR button in the nav switches languages while staying on the same page.

> ⚠️ **Every content change must be made twice: once in `index.html` (English) and once in `fr.html` (French).** If you only have wording for one language, still update both files (put the English text in `fr.html` temporarily and mark it with `<!-- TODO: traduire -->` so it's easy to find).

## How to make a change

```bash
git pull                # always pull before you start
# ... edit index.html or swap files in images/ ...
git add -A
git commit -m "Describe your change"
git push
```

The site publishes automatically via GitHub Pages about a minute after every push to `main`.

## Previewing locally

Because images are separate files, open the site through a tiny local server (not by double-clicking the file):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Where things live in index.html

| Content | Where |
|---|---|
| Agenda sessions | JS arrays `AGENDA_DAY1` / `AGENDA_DAY2` near the bottom of the file |
| Speakers | Commented-out `speaker-grid-new` block on the Speakers page — uncomment and copy the card template per speaker; the modal fills itself from the `data-*` attributes |
| Sponsor logos | `sponsor-logo-grid` blocks on the Sponsors page — one `sponsor-logo-tile` per logo, tiered by section |
| Countdown target | `updateCountdown()` function (currently 2026-12-16 08:00 EST) |
| Footer | `<template id="footer-template">` — injected into every page by JS, edit once |
| Colours / fonts | CSS variables in `:root` at the top of the file |

## Adding an image

1. Drop the file in `images/` (use a short kebab-case name, e.g. `speaker-jane-doe.jpg`).
2. Reference it as `images/speaker-jane-doe.jpg`.
3. Keep photos reasonably sized (≤ 300 KB is a good target — resize before committing).

## Known placeholders (as of Aug 31, 2026)

- Registration buttons show "Registration soon" and scroll to the newsletter signup — swap in the real Eventbrite event URL when ticketing opens (nav + hero, both languages)
- Speaker grid awaiting real speakers
- Hotel recommendations and parking rates marked "shared before the event"
- French versions of text-bearing graphics (hero lockup, footer logo) pending from the designer
