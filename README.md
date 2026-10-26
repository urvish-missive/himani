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

## Bulk blog upload (admin)

Admin → Blog → **Bulk upload** (`/admin/blog/bulk`) turns one or many documents into blog posts: Word (.docx, .doc) or PDF. To import a single file straight into the editor, use **Import from a document** on the New post page.

- **Formats:** .docx is the most faithful. PDFs have their headings, paragraphs, lists, links, images and simple tables rebuilt from the page layout (page numbers and running headers/footers are dropped), so check the preview. Old .doc files keep only their text and links; formatting, tables and pictures are flagged.

- **Kept as written:** title (Word's *Title* or first *Heading 1*), headings, paragraphs, bold/italic, lists, tables, links and images. Nothing is reworded or added. Images are uploaded to Firebase Storage (large photos are resized to 2000px WebP).
- **SEO details** are read from labelled lines at the top or bottom of the document, under an "SEO details" heading, or from a two-column table: `Meta Title`, `Meta Description`, `Slug`, `Tags`, `Focus Keyword`, `Excerpt`, `Featured Image`, `Image Alt`. Missing details are flagged; an optional AI button suggests only the empty SEO fields (never the article text).
- **After checking**, each post can be previewed in the real blog layout, then saved as a draft, published or scheduled; or pick "Save as drafts", "Publish when valid" or "Schedule" before uploading to do it automatically. Posts with problems are kept as drafts.
- Files process in the background while you use other admin pages. Re-uploading a file that was already imported is detected and skipped; failed files can be retried. Imported posts open in the normal editor.

### One-time setup

1. **Enable Firebase Storage** for the project (Firebase console → Storage).
2. **Deploy the rules and indexes:** `firebase deploy --only firestore:rules,firestore:indexes,storage` (or paste `firestore.rules` and `storage.rules` into the console and create the two indexes in `firestore.indexes.json`). When asked, allow Storage rules to read Firestore: they check the `/admins` collection.
3. AI SEO suggestions use the same `GEMINI_API_KEY` / `GROQ_*` / `OPENROUTER_*` server variables as AI drafting.

Scheduled posts become visible to visitors at their scheduled time (enforced by `firestore.rules`). The admin panel also marks them as published once due.

## Admin sign-in with a PIN

`/admin` asks for a 6-digit PIN. The PIN is checked on the server (`api/pin-login.ts`), never in the browser, and signs you in as the existing admin Firebase account. Email and password sign-in is still available from the "Sign in with email instead" link.

Set these in Vercel → Project → Settings → Environment Variables (and in `.env` for local `npm run dev`), then redeploy. Never commit them.

| Variable | Value |
|---|---|
| `ADMIN_PIN` | The PIN, digits only. |
| `ADMIN_UID` | UID of your admin user (Firebase console → Authentication → Users, or shown on the "No admin access" screen). It must have a document in `/admins`. |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase console → Project settings → Service accounts → Generate new private key. Paste the whole JSON (or base64 of it). |

To slow down guessing, each address gets 5 tries per 15 minutes and everyone together gets 30 per hour; counts are kept in the `pinLogins` Firestore collection, which the website can't read or write. Deploy the updated `firestore.rules`.
