// Turns a document (Word .docx or .doc, or PDF) into a blog post: the title,
// the body as the Markdown the blog already renders, its images, and any SEO
// details the writer put in the document. The writing itself is kept exactly as
// it is: nothing is reworded, summarised or added.
//
// Each format is first turned into simple HTML (headings, paragraphs, lists,
// tables, links, images); one shared pipeline then reads it into a post.
// Only the admin imports this, and each format's library loads on demand.

import { slugify } from './blog';
import { IMAGE_PLACEHOLDER } from './bulkUpload';
import { cleanDocumentBlocks } from './faqAccordion';

export interface DocImage {
  index: number;
  contentType: string;
  data: ArrayBuffer;
  alt: string;
}

/** SEO details written into the document, such as "Meta Description: …". Empty when not given. */
export interface DocMeta {
  title: string;
  seoTitle: string;
  seoDescription: string;
  excerpt: string;
  slug: string;
  tags: string[];
  keywords: string;
  coverImage: string;
  coverAlt: string;
  author: string;
}

export interface ParsedDoc {
  title: string;
  /** Where the title came from, so a guessed one can be flagged. */
  titleFrom: 'document' | 'label' | 'file';
  /** Markdown body. Images point at IMAGE_PLACEHOLDER + index. */
  content: string;
  meta: DocMeta;
  images: DocImage[];
  /** Index of the image used as the cover, which was the first thing in the document. */
  coverImageIndex: number | null;
  headingCount: number;
  tableCount: number;
  linkCount: number;
  /** What this file format couldn't carry over, for flagging. */
  notes: string[];
}

// Word styles that mammoth doesn't map by default.
const STYLE_MAP = [
  "p[style-name='Title'] => h1:fresh",
  "p[style-name='Quote'] => blockquote > p:fresh",
  "p[style-name='Intense Quote'] => blockquote > p:fresh",
  "p[style-name='Block Text'] => blockquote > p:fresh",
  "p[style-name='Code'] => pre:separator('\\n')",
  "r[style-name='Code'] => code",
];

/**
 * Labels writers use for SEO details, mapped to the field they fill. Labels
 * that could also start an ordinary paragraph ("Summary:", "Author:") are weak:
 * they only count next to a strong one, or under an "SEO details" heading.
 */
const LABELS: [RegExp, keyof DocMeta, 'strong' | 'weak'][] = [
  [/^(meta|seo)\s*titles?$|^title\s*tag$/, 'seoTitle', 'strong'],
  [/^page\s*title$/, 'seoTitle', 'weak'],
  [/^(meta|seo)\s*desc(ription)?s?$/, 'seoDescription', 'strong'],
  [/^description$/, 'seoDescription', 'weak'],
  [/^(blog|post|article)\s*title$|^h1(\s*title)?$/, 'title', 'strong'],
  [/^title$|^headline$/, 'title', 'weak'],
  [/^excerpt$|^standfirst$/, 'excerpt', 'strong'],
  [/^summary$/, 'excerpt', 'weak'],
  [/^(url\s*)?slug$|^permalink$|^(suggested\s*)?url\s*path$/, 'slug', 'strong'],
  [/^url$/, 'slug', 'weak'],
  [/^tags?$/, 'tags', 'strong'],
  [/^categor(y|ies)$|^topics?$/, 'tags', 'weak'],
  [/^(focus|primary|target|main|seo|secondary|lsi)\s*key\s*(words?|phrases?)$|^key\s*words?$/, 'keywords', 'strong'],
  [/^(cover|featured|hero|header)\s*image(\s*url)?$/, 'coverImage', 'strong'],
  [/^(cover|featured|hero|header)\s*image\s*alt(\s*text)?$|^image\s*alt(\s*text)?$|^alt\s*text$/, 'coverAlt', 'strong'],
  [/^author$|^written\s*by$|^byline$/, 'author', 'weak'],
];

type Label = { field: keyof DocMeta; value: string; strong: boolean };

const LABEL_LINE = /^\s*([A-Za-z0-9][A-Za-z0-9 /&()-]{0,40}?)\s*[:：]\s*(.*)$/s;
const META_HEADING =
  /^(seo|meta|seo\s*(details|data|info(rmation)?|meta\s*data|metadata)|meta\s*(data|details|info(rmation)?)|metadata|post\s*details|blog\s*details|internal\s*use(\s*only)?|internal\s*notes?|writer'?s?\s*notes?|editorial\s*notes?|content\s*brief)\s*:?$/i;

const text = (el: Element | null) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();

/** "Meta Description: …" → its field and value, or null when the text isn't a label. */
function readLabel(line: string): Label | null {
  const m = line.match(LABEL_LINE);
  if (!m) return null;
  const l = m[1].toLowerCase().replace(/[()]/g, '').replace(/\s+/g, ' ').trim();
  const hit = LABELS.find(([re]) => re.test(l));
  return hit ? { field: hit[1], value: m[2].trim(), strong: hit[2] === 'strong' } : null;
}

/** The labels a block holds, or null if any of it is ordinary writing. */
function labelsOf(el: Element): Label[] | null {
  if (el.tagName === 'TABLE') {
    // A two-column table of labels and values, such as an SEO brief.
    const rows = [...el.querySelectorAll('tr')];
    const found: Label[] = [];
    for (const row of rows) {
      const cells = [...row.children].filter((c) => c.tagName === 'TD' || c.tagName === 'TH');
      if (cells.length !== 2) return null;
      const label = readLabel(`${text(cells[0]).replace(/[:：]\s*$/, '')}: ${text(cells[1])}`);
      if (label) found.push(label);
    }
    return found.length && found.length >= rows.length / 2 ? found : null;
  }
  if (el.tagName !== 'P' && !/^H[1-6]$/.test(el.tagName)) return null;
  // One paragraph can hold several labels on separate lines.
  const lines = el.innerHTML
    .split(/<br\s*\/?>/i)
    .map((h) => {
      const d = el.ownerDocument.createElement('div');
      d.innerHTML = h;
      return text(d);
    })
    .filter(Boolean);
  const found = lines.map(readLabel);
  return found.length && found.every(Boolean) ? (found as Label[]) : null;
}

function setMeta(meta: DocMeta, { field, value }: Label) {
  if (!value) return;
  if (field === 'tags') {
    meta.tags = [...meta.tags, ...value.split(/[,;|]/).map((t) => t.trim().replace(/^#/, '')).filter(Boolean)];
  } else if (field === 'slug') {
    // Accept a full URL or a path: keep only the last part.
    const last = value.replace(/[?#].*$/, '').replace(/\/+$/, '').split('/').pop() ?? '';
    if (!meta.slug) meta.slug = slugify(last);
  } else if (field === 'keywords') {
    meta.keywords = meta.keywords ? `${meta.keywords}, ${value}` : value;
  } else if (!meta[field]) {
    (meta[field] as string) = value;
  }
}

/**
 * Takes SEO details off the start and end of the document, and out of an
 * "SEO details" section, so they don't appear in the post.
 */
function extractMeta(body: Element, meta: DocMeta) {
  const blocks = () => [...body.children].filter((el) => text(el) || el.querySelector('img'));

  const apply = (run: { el: Element; labels: Label[] }[], heading?: Element) => {
    if (!run.length || !(heading || run.some((r) => r.labels.some((l) => l.strong)))) return;
    run.forEach(({ el, labels }) => {
      labels.forEach((l) => setMeta(meta, l));
      el.remove();
    });
    heading?.remove();
  };

  // From the top, stepping over the title heading.
  const top: { el: Element; labels: Label[] }[] = [];
  let skippedTitle = false;
  for (const el of blocks()) {
    const labels = labelsOf(el);
    if (!labels && el.tagName === 'H1' && !skippedTitle) {
      skippedTitle = true;
      continue;
    }
    if (!labels) break;
    top.push({ el, labels });
  }
  apply(top);

  // From the bottom, with any "SEO details" heading above them.
  const rest = blocks();
  const bottom: { el: Element; labels: Label[] }[] = [];
  let i = rest.length - 1;
  for (; i >= 0; i--) {
    const labels = labelsOf(rest[i]);
    if (!labels) break;
    bottom.unshift({ el: rest[i], labels });
  }
  const above = rest[i];
  apply(bottom, above && META_HEADING.test(text(above)) ? above : undefined);

  // An "SEO details" heading in the middle, followed only by labels up to the next heading.
  for (const h of blocks()) {
    if (!META_HEADING.test(text(h)) || !/^H[1-6]$|^P$/.test(h.tagName)) continue;
    const run: { el: Element; labels: Label[] }[] = [];
    let ok = true;
    for (let n = h.nextElementSibling; n && !/^H[1-6]$/.test(n.tagName); n = n.nextElementSibling) {
      if (!text(n)) continue;
      const labels = labelsOf(n);
      if (!labels) {
        ok = false;
        break;
      }
      run.push({ el: n, labels });
    }
    if (ok) apply(run, h);
  }
}

// ---------------------------------------------------------------- HTML → Markdown

/** Escapes characters Markdown would otherwise treat as formatting. */
function esc(s: string) {
  return s.replace(/([\\`*_[\]<>~])/g, '\\$1');
}

/** Escapes what would start a heading, list or quote at the start of a line. */
function escLineStart(s: string) {
  return s
    .replace(/^(\s*)(#{1,6})(?=\s|$)/, '$1\\$2')
    .replace(/^(\s*)([-+*])(?=\s)/, '$1\\$2')
    .replace(/^(\s*)(\d+)([.)])(?=\s)/, '$1$2\\$3')
    .replace(/^(\s*)(=+|-{3,})\s*$/, '$1\\$2');
}

/** Wraps text in a marker, keeping surrounding spaces outside it so the Markdown stays valid. */
function wrap(inner: string, mark: string) {
  const m = inner.match(/^(\s*)([\s\S]*?)(\s*)$/)!;
  return m[2] ? `${m[1]}${mark}${m[2]}${mark}${m[3]}` : inner;
}

const safeUrl = (href: string) => href.trim().replace(/ /g, '%20').replace(/\(/g, '%28').replace(/\)/g, '%29');

interface Ctx {
  inTable: boolean;
  links: number;
}

function inline(node: Node, ctx: Ctx): string {
  if (node.nodeType === Node.TEXT_NODE) return esc((node.textContent ?? '').replace(/\s+/g, ' '));
  if (node.nodeType !== Node.ELEMENT_NODE) return '';
  const el = node as Element;
  const kids = () => [...el.childNodes].map((n) => inline(n, ctx)).join('');
  switch (el.tagName) {
    case 'STRONG':
    case 'B':
      return wrap(kids(), '**');
    case 'EM':
    case 'I':
      return wrap(kids(), '*');
    case 'S':
    case 'DEL':
    case 'STRIKE':
      return wrap(kids(), '~~');
    case 'CODE':
      return `\`${(el.textContent ?? '').replace(/`/g, "'")}\``;
    case 'BR':
      return ctx.inTable ? ' ' : '\\\n';
    case 'IMG': {
      const alt = esc((el.getAttribute('alt') ?? '').replace(/\s+/g, ' ').trim());
      return `![${alt}](${el.getAttribute('src') ?? ''})`;
    }
    case 'A': {
      const href = el.getAttribute('href') ?? '';
      const label = kids();
      // Footnote back-links ("↑") add nothing outside Word.
      if (href.startsWith('#') && /^\s*↑\s*$/.test(el.textContent ?? '')) return '';
      // Bookmarks and links within the document (like a table of contents) keep their text.
      if (!href || href.startsWith('#')) return label;
      if (!label.trim()) return '';
      ctx.links++;
      return `[${label}](${safeUrl(href)})`;
    }
    case 'SUP': {
      // Footnote markers become [1] so the reference survives.
      const t = (el.textContent ?? '').trim();
      return el.querySelector('a[href^="#"]') ? `\\[${esc(t.replace(/^\[|\]$/g, ''))}\\]` : kids();
    }
    default:
      return kids();
  }
}

/** Inline content of a block, tidied: single spaces, no stray spaces at line ends. */
function inlineBlock(el: Element, ctx: Ctx) {
  return [...el.childNodes]
    .map((n) => inline(n, ctx))
    .join('')
    .replace(/[ \t]+/g, ' ')
    .replace(/ ?\\\n ?/g, '\\\n')
    .replace(/(\\\n)+$/, '')
    .trim();
}

function list(el: Element, ctx: Ctx, depth: number): string {
  const ordered = el.tagName === 'OL';
  let n = Number(el.getAttribute('start') ?? 1) || 1;
  const pad = '    '.repeat(depth);
  const items: string[] = [];
  for (const li of [...el.children].filter((c) => c.tagName === 'LI')) {
    const marker = ordered ? `${n++}.` : '-';
    const parts: string[] = [];
    const nested: string[] = [];
    let line = '';
    for (const child of [...li.childNodes]) {
      if (child.nodeType === Node.ELEMENT_NODE && /^(UL|OL)$/.test((child as Element).tagName)) {
        nested.push(list(child as Element, ctx, depth + 1));
      } else if (child.nodeType === Node.ELEMENT_NODE && (child as Element).tagName === 'P') {
        if (line.trim()) parts.push(line.trim());
        line = '';
        parts.push(inlineBlock(child as Element, ctx));
      } else {
        line += inline(child, ctx);
      }
    }
    if (line.trim()) parts.push(line.replace(/\s+/g, ' ').trim());
    const body = parts.filter(Boolean).join(`\\\n${pad}    `);
    items.push(`${pad}${marker} ${body}`.trimEnd() + (nested.length ? `\n${nested.join('\n')}` : ''));
  }
  return items.join('\n');
}

function table(el: Element, ctx: Ctx): string {
  const rows = [...el.querySelectorAll('tr')].filter((tr) => tr.closest('table') === el);
  if (!rows.length) return '';
  const tctx: Ctx = { ...ctx, inTable: true };
  const grid = rows.map((tr) => {
    const cells: string[] = [];
    for (const cell of [...tr.children].filter((c) => c.tagName === 'TD' || c.tagName === 'TH')) {
      // A cell's paragraphs and list items sit on one line, as a Markdown table needs.
      const parts = [...cell.childNodes].map((n) => {
        if (n.nodeType !== Node.ELEMENT_NODE) return inline(n, tctx);
        const c = n as Element;
        if (c.tagName === 'UL' || c.tagName === 'OL') {
          return [...c.querySelectorAll('li')].map((li, i) => `${c.tagName === 'OL' ? `${i + 1}.` : '•'} ${inlineBlock(li, tctx)}`).join(' ');
        }
        return inlineBlock(c, tctx);
      });
      const value = parts.map((p) => p.trim()).filter(Boolean).join(' ').replace(/\|/g, '\\|');
      cells.push(value);
      // Merged cells keep the columns lined up.
      for (let i = 1; i < Number(cell.getAttribute('colspan') ?? 1); i++) cells.push('');
    }
    return cells;
  });
  ctx.links = tctx.links;
  const cols = Math.max(...grid.map((r) => r.length));
  const line = (r: string[]) => `| ${Array.from({ length: cols }, (_, i) => r[i] ?? '').join(' | ')} |`;
  return [line(grid[0]), `| ${Array(cols).fill('---').join(' | ')} |`, ...grid.slice(1).map(line)].join('\n');
}

function blocks(parent: Element, ctx: Ctx, out: string[]) {
  for (const node of [...parent.childNodes]) {
    if (node.nodeType === Node.TEXT_NODE) {
      const t = (node.textContent ?? '').trim();
      if (t) out.push(escLineStart(esc(t)));
      continue;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) continue;
    const el = node as Element;
    const tag = el.tagName;
    if (/^H[1-6]$/.test(tag)) {
      const t = inlineBlock(el, ctx).replace(/\\\n/g, ' ');
      if (t) out.push(`${'#'.repeat(Number(tag[1]))} ${t}`);
    } else if (tag === 'P') {
      const t = inlineBlock(el, ctx);
      if (t) out.push(t.split('\n').map(escLineStart).join('\n'));
    } else if (tag === 'UL' || tag === 'OL') {
      const t = list(el, ctx, 0);
      if (t.trim()) out.push(t);
    } else if (tag === 'TABLE') {
      const t = table(el, ctx);
      if (t) out.push(t);
    } else if (tag === 'BLOCKQUOTE') {
      const inner: string[] = [];
      blocks(el, ctx, inner);
      if (inner.length) out.push(inner.join('\n\n').split('\n').map((l) => (l ? `> ${l}` : '>')).join('\n'));
    } else if (tag === 'PRE') {
      const code = el.textContent ?? '';
      if (code.trim()) out.push('```\n' + code.replace(/```/g, "'''") + '\n```');
    } else if (tag === 'HR') {
      out.push('---');
    } else if (tag === 'IMG') {
      out.push(inline(el, ctx));
    } else {
      blocks(el, ctx, out);
    }
  }
}

// ---------------------------------------------------------------- Entry points

const fileTitle = (name: string) =>
  name
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** Reads any supported file into a post. */
export async function parseDocument(file: File): Promise<ParsedDoc> {
  const ext = file.name.match(/\.([a-z0-9]+)$/i)?.[1].toLowerCase();
  if (ext === 'pdf') {
    const { pdfToHtml } = await import('./import/pdf');
    const { html, images, notes } = await pdfToHtml(await file.arrayBuffer());
    return htmlToPost(html, images, file.name, notes, true);
  }
  if (ext === 'doc') {
    const { docToHtml } = await import('./import/doc');
    const { html, notes } = docToHtml(await file.arrayBuffer());
    return htmlToPost(html, [], file.name, notes, true);
  }
  return parseDocx(file);
}

async function parseDocx(file: File): Promise<ParsedDoc> {
  const { default: mammoth } = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const images: DocImage[] = [];

  const { value: html } = await mammoth.convertToHtml(
    { arrayBuffer },
    {
      styleMap: STYLE_MAP,
      convertImage: mammoth.images.imgElement(async (image) => {
        const index = images.length;
        images.push({ index, contentType: image.contentType, data: await image.readAsArrayBuffer(), alt: '' });
        return { src: `${IMAGE_PLACEHOLDER}${index}` };
      }),
    }
  );
  return htmlToPost(html, images, file.name, []);
}

/**
 * The shared pipeline. `html` uses <img src="bulk-image:N"> for images[N];
 * an <h1> as the first text is taken as the title. For formats without
 * heading styles, `firstLineTitle` takes a short opening line as the title.
 */
export function htmlToPost(html: string, images: DocImage[], fileName: string, notes: string[], firstLineTitle = false): ParsedDoc {
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  const body = doc.body;

  // The image's alt text (Word's "Alt Text" box) is on the tag.
  body.querySelectorAll('img').forEach((img) => {
    const i = Number(img.getAttribute('src')?.slice(IMAGE_PLACEHOLDER.length));
    if (images[i] && !images[i].alt) images[i].alt = (img.getAttribute('alt') ?? '').trim();
  });

  const meta: DocMeta = { title: '', seoTitle: '', seoDescription: '', excerpt: '', slug: '', tags: [], keywords: '', coverImage: '', coverAlt: '', author: '' };
  extractMeta(body, meta);

  if (firstLineTitle && !meta.title) {
    const first = [...body.children].find((el) => text(el));
    const t = text(first ?? null);
    if (first && first.tagName !== 'H1' && /^(P|H[2-6])$/.test(first.tagName) && !body.querySelector('h1') && t.length < 150 && !/[.!?:;,]$/.test(t)) {
      const h1 = doc.createElement('h1');
      h1.innerHTML = first.innerHTML;
      first.replaceWith(h1);
    }
  }

  // The title: the first top-level heading (Word's Title or Heading 1 style), else a "Title:" label, else the file name.
  let title = '';
  let titleFrom: ParsedDoc['titleFrom'] = 'file';
  const firstText = [...body.children].find((el) => text(el));
  const h1 = body.querySelector('h1');
  if (h1 && h1 === firstText) {
    title = text(h1);
    titleFrom = 'document';
    h1.remove();
  } else if (meta.title) {
    title = meta.title;
    titleFrom = 'label';
    // Drop a heading that only repeats the labelled title.
    if (h1 && text(h1).toLowerCase() === meta.title.toLowerCase()) h1.remove();
  }
  if (!title) title = fileTitle(fileName);

  // The page shows the title as its only top-level heading. If the document has
  // more, every heading moves down a level so the outline keeps its shape.
  if (body.querySelector('h1')) {
    [...body.querySelectorAll('h1,h2,h3,h4,h5')].reverse().forEach((h) => {
      const next = doc.createElement(`h${Number(h.tagName[1]) + 1}`);
      next.innerHTML = h.innerHTML;
      h.replaceWith(next);
    });
  }

  const ctx: Ctx = { inTable: false, links: 0 };
  const rawBlocks: string[] = [];
  blocks(body, ctx, rawBlocks);

  // Always take till FAQs, dropping trailing sources, references and internal use sections
  const { blocks: out, notes: trimNotes } = cleanDocumentBlocks(rawBlocks);
  notes.push(...trimNotes);

  // An image before any text becomes the cover, rather than showing twice.
  let coverImageIndex: number | null = null;
  const lone = out[0]?.match(new RegExp(`^!\\[[^\\]]*\\]\\(${IMAGE_PLACEHOLDER}(\\d+)\\)$`));
  if (lone && !meta.coverImage) {
    coverImageIndex = Number(lone[1]);
    out.shift();
  }

  return {
    title,
    titleFrom,
    content: out.join('\n\n').replace(/\n{3,}/g, '\n\n').trim(),
    meta,
    images,
    coverImageIndex,
    headingCount: out.filter((b) => /^#{2,6} /.test(b)).length,
    tableCount: out.filter((b) => b.startsWith('| ')).length,
    linkCount: ctx.links,
    notes,
  };
}
