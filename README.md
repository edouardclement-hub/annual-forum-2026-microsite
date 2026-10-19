# EMH Annual Forum 2026 — Microsite

Event site for the **EMH Annual Forum 2026** (December 16–17, 2026, Richcraft Hall, Carleton University, Ottawa).

**Live at:** https://forum2026.cme-emh.ca (EN) · https://forum2026.cme-emh.ca/fr.html (FR)

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
| Speakers | `SPEAKERS` array near the bottom of the file — one entry per person. The speakers grid, the agenda speaker cards and the modal all render from it. See “Adding a speaker” below |
| Sponsor logos | `sponsor-logo-grid` blocks on the Sponsors page — one `sponsor-logo-tile` per logo, tiered by section |
| Countdown target | `updateCountdown()` function (currently 2026-12-16 08:00 EST) |
| Footer | `<template id="footer-template">` — injected into every page by JS, edit once |
| Colours / fonts | CSS variables in `:root` at the top of the file |

## Adding an image

1. Drop the file in `images/` (use a short kebab-case name, e.g. `speaker-jane-doe.jpg`).
2. Reference it as `images/speaker-jane-doe.jpg`.
3. Keep photos reasonably sized (≤ 300 KB is a good target — resize before committing).

## Adding a speaker

One entry in the `SPEAKERS` array drives the speakers grid, the agenda speaker cards and
the modal. Add it to **both** `index.html` and `fr.html` with the same `id`, `type`,
`photo` and `sessions`; only the `_en` / `_fr` fields differ.

```js
{
  id: "jane-doe",                                   // lowercase first-last, unique
  name: "Jane Doe",
  type: "Speaker",                                  // "Speaker" | "Keynote" | "Moderator"
                                                    // or an array for two roles, e.g.
                                                    // ["Moderator", "Speaker"]
  french_title_form: "feminine",                    // fr.html only: "feminine" | "masculine",
                                                    // agrees the French type badge
  title_en: "Director of Modelling",
  title_fr: "Direction de la modélisation",
  organization_en: "Example Institute",
  organization_fr: "Institut Exemple",
  linkedin: "https://www.linkedin.com/in/janedoe/",
  photo: "images/speaker-jane-doe.jpg",             // a file path, never base64 — see below
  bio_en: "First paragraph.\n\nSecond paragraph.",
  bio_fr: "Premier paragraphe.\n\nDeuxi\u00e8me paragraphe.",
  sessions: ["d1-s3"],                              // IDs from AGENDA_DAY1 / AGENDA_DAY2
  presentation_title: ""                            // shown in the modal when set
}
```

Blank lines (`\n\n`) in a bio become separate paragraphs in the modal. Entries are sorted
by first name at render time, so order in the array doesn't matter.

`type` renders as a badge next to the name in the modal. On `fr.html` the badge is
gendered from `french_title_form`, so set it on every entry. A speaker with no `photo` gets a
neutral placeholder showing their initials, so an entry can go in before the headshot does.

The `sessions` IDs come from the speaker spreadsheet, which numbers sessions by their place
in the programme; `SESSION_ID_MAP` translates each one onto the agenda row it belongs to.

### Speaker photos: use a file, never base64

Embedding a photo as a `data:image/jpeg;base64,...` string works, but it is a bad trade here:

- base64 is ~33% larger than the file it encodes, and the same photo is duplicated across
  `index.html` **and** `fr.html`
- git stores a **complete new copy of the whole HTML file** on every edit, so each future
  wording tweak re-commits every embedded photo
- browsers can't cache an inlined image separately, so it is re-downloaded on every page load

Two speakers embedded this way took the files from ~100 KB to ~231 KB each. As separate
files they cost ~45 KB once, shared by both languages, and cached by the browser.

Prepare a photo like this (macOS, no extra tools needed) — square, 400×400, under 60 KB:

```bash
sips -s format jpeg -s formatOptions 72 -z 400 400 source.jpg --out images/speaker-jane-doe.jpg
```

`-z` ignores the aspect ratio, so crop to a square centred on the face first (Preview →
Tools → Rectangular Selection → Crop) or the photo will be squashed. Then reference it as
`photo: "images/speaker-jane-doe.jpg"`.

## Known placeholders (as of Aug 31, 2026)

- Registration buttons show "Registration soon" and scroll to the newsletter signup — swap in the real Eventbrite event URL when ticketing opens (nav + hero, both languages)
- Speaker grid awaiting real speakers
- Parking rates marked "shared before the event" (hotel block at the Delta is live, deadline 19 Nov 2026)
- French versions of text-bearing graphics (hero lockup, footer logo) pending from the designer
