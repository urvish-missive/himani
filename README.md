# Himani Kankaria website: developer handoff

**himani-website.html** is the complete site in one self-contained file. The menu switches pages inside the same tab (URLs like `#/virtual-cmo`), so it works when opened directly or shared as a single file. The five separate files below are the same pages split out, for building into a CMS or multi-page site.

Five static pages that share one menu, one footer and one design system (lavender and gold).

| File | Page |
|---|---|
| index.html | Home (personal brand) |
| virtual-cmo.html | Virtual CMO landing page |
| founder-coaching.html | 1-on-1 Founder Coaching landing page |
| team-training.html | Marketing and Sales Team Training landing page |
| speaking.html | Speaking landing page |

## How it's built
- Each page is self-contained: CSS and JavaScript are inline. Fonts load from Google Fonts (Bricolage Grotesque, Literata).
- Links between pages are relative (e.g. `virtual-cmo.html`), so keep all five files in the same folder.
- Light and dark mode are supported through CSS variables in `:root`.
- Forms don't post anywhere. On submit they open Calendly (`calendly.com/missivedigital/30min`) with name, email and a summary pre-filled (`name`, `email`, `a1` parameters). Connect them to a CRM or email tool if needed.

## Images to add
- Portrait / photo placeholders: elements with class `ph` and `portrait`.
- Real-life proof gallery on every page: section `#gallery`. Replace each `<div class="ph-img">` with `<img src="..." alt="...">`. Use training photos, advisory sessions, stage photos or feedback screenshots. Tiles crop with `object-fit: cover`.
- Headshots: see links in the speaker kit on speaking.html.

## Content still to fill (search for `[` in each file)
- Testimonials, quotes and result metrics on every page.
- Home: availability card numbers ("[2] Virtual CMO seats, [3] training slots").
- Virtual CMO: "[2 weeks]" time to start; days per month in the FAQ.
- Founder Coaching: NDA note in the FAQ.
- Team Training: maximum group size "[20]".
- Speaking: speaker kit download link; Link Up With Het episode link.
- "Download speaker kit" and some card links use `href="#"` as placeholders.
