// Reads a PDF into simple HTML for the import pipeline. PDFs store positioned
// text rather than structure, so structure is rebuilt from the layout: larger
// or bold short lines become headings, bullets, numbers and indented runs
// become lists, an indented paragraph becomes a quote, line spacing and short
// last lines separate paragraphs, text in aligned columns becomes a table,
// link areas become links, and embedded pictures are placed in reading order.
// Page numbers and running headers or footers are left out.

import * as pdfjs from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import type { DocImage } from '../documentImport';
import { IMAGE_PLACEHOLDER } from '../bulkUpload';

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

interface Run {
  text: string;
  x: number;
  width: number;
  size: number;
  bold: boolean;
  italic: boolean;
  href: string;
}

interface Line {
  page: number;
  y: number; // distance from the top of the page
  x: number;
  right: number;
  size: number;
  runs: Run[];
  text: string;
  bold: boolean;
  /** Text split where there are wide gaps, as table cells. */
  cells: Run[][];
  /** Set for a picture instead of text. */
  image?: number;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Bullets, including the private-use characters symbol fonts draw bullets with.
const BULLET_CHARS = '•●▪◦‣■□➢►✓✔\\uF000-\\uF0FF';
const BULLET = new RegExp(`^\\s*([${BULLET_CHARS}]\\s*|[-–*]\\s+)`);
const BULLET_ONLY = new RegExp(`^\\s*[${BULLET_CHARS}\\-–*]\\s*$`);
const NUMBERED = /^\s*(\d{1,3}|[a-z])[.)]\s+/;

function percentile(xs: number[], p: number) {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor(s.length * p))];
}

/** Converts pdf.js image data to a PNG. */
async function toPng(img: { width: number; height: number; kind?: number; data?: Uint8ClampedArray | Uint8Array; bitmap?: ImageBitmap }) {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;
  if (img.bitmap) {
    ctx.drawImage(img.bitmap, 0, 0);
  } else if (img.data) {
    const rgba = new Uint8ClampedArray(img.width * img.height * 4);
    const src = img.data;
    if (img.kind === pdfjs.ImageKind.RGBA_32BPP) rgba.set(src.subarray(0, rgba.length));
    else if (img.kind === pdfjs.ImageKind.RGB_24BPP) {
      for (let i = 0, j = 0; j < rgba.length; i += 3, j += 4) {
        rgba[j] = src[i];
        rgba[j + 1] = src[i + 1];
        rgba[j + 2] = src[i + 2];
        rgba[j + 3] = 255;
      }
    } else if (img.kind === pdfjs.ImageKind.GRAYSCALE_1BPP) {
      const rowBytes = Math.ceil(img.width / 8);
      for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
          const on = (src[y * rowBytes + (x >> 3)] >> (7 - (x & 7))) & 1;
          const j = (y * img.width + x) * 4;
          rgba[j] = rgba[j + 1] = rgba[j + 2] = on ? 255 : 0;
          rgba[j + 3] = 255;
        }
      }
    } else return null;
    ctx.putImageData(new ImageData(rgba, img.width, img.height), 0, 0);
  } else return null;
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/png'));
  return blob ? blob.arrayBuffer() : null;
}

const objGet = (objs: { get: (id: string, cb: (v: unknown) => void) => unknown }, id: string) =>
  Promise.race([new Promise<unknown>((r) => objs.get(id, r)), new Promise<null>((r) => setTimeout(() => r(null), 5000))]);

type Link = { url: string; rect: number[] };

/**
 * Splits a text item into runs so only the words inside a link area become the
 * link. Character positions are estimated from the item's width.
 */
const measure = document.createElement('canvas').getContext('2d')!;

function splitByLinks(str: string, x: number, width: number, yBase: number, size: number, family: string, links: Link[], base: Omit<Run, 'text' | 'x' | 'width' | 'href'>): Run[] {
  const hits = links.filter((l) => yBase + size / 3 >= l.rect[1] && yBase <= l.rect[3] && l.rect[0] < x + width && l.rect[2] > x);
  if (!hits.length) return [{ ...base, text: str, x, width, href: '' }];
  // Word widths measured in a similar font, scaled to the item's real width.
  const tokens = str.match(/\s+|\S+/g) ?? [];
  measure.font = `${size}px ${family}`;
  const widths = tokens.map((t) => measure.measureText(t).width);
  const scale = width / Math.max(1, widths.reduce((a, b) => a + b, 0));
  const runs: Run[] = [];
  let tx = x;
  for (const [k, token] of tokens.entries()) {
    const tw = widths[k] * scale;
    const cx = tx + tw / 2;
    const href = /\S/.test(token) ? hits.find((l) => cx >= l.rect[0] && cx <= l.rect[2])?.url ?? '' : '';
    const last = runs[runs.length - 1];
    // Spaces join the run before them; a link only spans its own words.
    if (last && (last.href === href || (!/\S/.test(token) && !href))) {
      last.text += token;
      last.width += tw;
    } else runs.push({ ...base, text: token, x: tx, width: tw, href });
    tx += tw;
  }
  return runs;
}

export async function pdfToHtml(data: ArrayBuffer): Promise<{ html: string; images: DocImage[]; notes: string[] }> {
  const task = pdfjs.getDocument({ data: new Uint8Array(data), fontExtraProperties: true });
  const pdf = await task.promise;
  const lines: Line[] = [];
  const images: DocImage[] = [];
  const seenImages = new Set<string>();
  const pageHeights: number[] = [];

  for (let n = 1; n <= pdf.numPages; n++) {
    const page = await pdf.getPage(n);
    const view = page.getViewport({ scale: 1 });
    pageHeights.push(view.height);
    // The operator list also loads the fonts, whose names tell bold and italic apart.
    const ops = await page.getOperatorList();
    const [content, annotations] = await Promise.all([page.getTextContent(), page.getAnnotations()]);

    const links: Link[] = (annotations as { subtype: string; url?: string; rect: number[] }[])
      .filter((a) => a.subtype === 'Link' && a.url && /^(https?:|mailto:)/i.test(a.url))
      .map((a) => ({ url: a.url!, rect: a.rect }));

    // Text items, grouped into lines by their baseline.
    const pageLines: Line[] = [];
    for (const item of content.items as { str: string; transform: number[]; width: number; fontName: string }[]) {
      if (!item.str) continue;
      const [, , c, d, x, yBase] = item.transform;
      const size = Math.hypot(c, d) || 10;
      let fontName = '';
      try {
        fontName = (page.commonObjs.get(item.fontName) as { name?: string } | undefined)?.name ?? '';
      } catch {
        // Font not loaded; treat as regular.
      }
      const style = { size, bold: /bold|black|heavy|semibold|demi/i.test(fontName), italic: /italic|oblique/i.test(fontName) };
      const family = (content.styles as Record<string, { fontFamily?: string }>)[item.fontName]?.fontFamily || 'sans-serif';
      const runs = splitByLinks(item.str, x, item.width, yBase, size, family, links, style);
      const y = view.height - yBase;
      const line = pageLines.find((l) => Math.abs(l.y - y) < Math.max(2, size * 0.4));
      if (line) line.runs.push(...runs);
      else pageLines.push({ page: n, y, x, right: 0, size, runs, text: '', bold: false, cells: [] });
    }

    for (const line of pageLines) {
      line.runs.sort((a, b) => a.x - b.x);
      line.x = line.runs[0].x;
      line.size = Math.max(...line.runs.map((r) => r.size));
      const last = line.runs[line.runs.length - 1];
      line.right = last.x + last.width;
      let cell: Run[] = [];
      // Gaps are measured from the last visible text: some PDFs fill a column gap with a wide space.
      let inkEnd = -Infinity;
      line.runs.forEach((r, i) => {
        const prev = line.runs[i - 1];
        const ink = /\S/.test(r.text);
        if (prev && ink) {
          const gap = r.x - inkEnd;
          if (gap > r.size * 1.5 && cell.some((x) => /\S/.test(x.text))) {
            line.cells.push(cell);
            cell = [];
            if (!/\s$/.test(prev.text)) prev.text += ' ';
          } else if (gap > r.size * 0.15 && !/\s$/.test(prev.text) && !/^\s/.test(r.text)) prev.text += ' ';
        }
        cell.push(r);
        if (ink) inkEnd = r.x + r.width * (r.text.trimEnd().length / Math.max(1, r.text.length));
      });
      line.cells.push(cell);
      line.text = line.runs.map((r) => r.text).join('').replace(/\s+/g, ' ').trim();
      const letters = line.runs.filter((r) => /[A-Za-z0-9]/.test(r.text));
      line.bold = letters.length > 0 && letters.every((r) => r.bold);
    }

    // A bullet drawn as its own text item sits a little left of its line's text.
    const textLines = pageLines.filter((l) => l.text);
    for (const b of textLines.filter((l) => BULLET_ONLY.test(l.text))) {
      const target = textLines.find((l) => l !== b && !BULLET_ONLY.test(l.text) && Math.abs(l.y - b.y) < l.size * 0.8 && l.x > b.x);
      if (target) {
        target.text = `• ${target.text}`;
        target.x = b.x;
        b.text = '';
      }
    }

    // Pictures, placed by where they're drawn on the page.
    const ctmStack: number[][] = [];
    let ctm = [1, 0, 0, 1, 0, 0];
    const mul = (m: number[], t: number[]) => [
      m[0] * t[0] + m[2] * t[1],
      m[1] * t[0] + m[3] * t[1],
      m[0] * t[2] + m[2] * t[3],
      m[1] * t[2] + m[3] * t[3],
      m[0] * t[4] + m[2] * t[5] + m[4],
      m[1] * t[4] + m[3] * t[5] + m[5],
    ];
    for (let i = 0; i < ops.fnArray.length; i++) {
      const fn = ops.fnArray[i];
      const args = ops.argsArray[i];
      if (fn === pdfjs.OPS.save) ctmStack.push(ctm);
      else if (fn === pdfjs.OPS.restore) ctm = ctmStack.pop() ?? [1, 0, 0, 1, 0, 0];
      else if (fn === pdfjs.OPS.transform) ctm = mul(ctm, args as number[]);
      else if (fn === pdfjs.OPS.paintImageXObject || fn === pdfjs.OPS.paintInlineImageXObject) {
        // Size on the page, in points: skip icons, rules and tiny decorations.
        const drawnW = Math.hypot(ctm[0], ctm[1]);
        const drawnH = Math.hypot(ctm[2], ctm[3]);
        if (drawnW < 40 || drawnH < 40) continue;
        try {
          const id = args[0];
          const obj = (typeof id === 'string' ? await objGet(id.startsWith('g_') ? page.commonObjs : page.objs, id) : id) as Parameters<typeof toPng>[0] | null;
          if (!obj || obj.width < 8 || obj.height < 8) continue;
          const png = await toPng(obj);
          if (!png) continue;
          // A logo repeated on every page is kept once.
          const key = `${obj.width}x${obj.height}:${png.byteLength}`;
          if (seenImages.has(key)) continue;
          seenImages.add(key);
          const index = images.length;
          images.push({ index, contentType: 'image/png', data: png, alt: '' });
          const top = view.height - (ctm[5] + Math.max(ctm[3], 0));
          pageLines.push({ page: n, y: top, x: ctm[4], right: ctm[4] + drawnW, size: 0, runs: [], text: '', bold: false, cells: [], image: index });
        } catch {
          // Skip a picture that can't be read.
        }
      }
    }

    pageLines.sort((a, b) => a.y - b.y || a.x - b.x);
    lines.push(...pageLines.filter((l) => l.image != null || l.text));
    page.cleanup();
  }

  if (!lines.some((l) => l.image == null)) {
    throw new Error('This PDF has no selectable text (it may be a scan or an image). Export it from the original document, or save that as .docx.');
  }

  // Page numbers and running headers/footers: short lines near the top or bottom
  // that are numbers, or that repeat on most pages.
  const edge = (l: Line) => l.y < pageHeights[l.page - 1] * 0.1 || l.y > pageHeights[l.page - 1] * 0.9;
  const key = (l: Line) => l.text.replace(/\d+/g, '#').toLowerCase();
  const repeats = new Map<string, Set<number>>();
  lines.filter((l) => l.image == null && edge(l)).forEach((l) => repeats.set(key(l), (repeats.get(key(l)) ?? new Set()).add(l.page)));
  let removed = 0;
  const kept = lines.filter((l) => {
    if (l.image != null || !edge(l)) return true;
    const drop =
      /^(page\s*)?\d+(\s*(of|\/)\s*\d+)?$/i.test(l.text) ||
      (pdf.numPages >= 2 && l.text.length <= 60 && (repeats.get(key(l))?.size ?? 0) >= Math.max(2, Math.ceil(pdf.numPages * 0.6)));
    if (drop) removed++;
    return !drop;
  });

  // The body text: the size, left edge and line width most text uses.
  const textOnly = kept.filter((l) => l.image == null);
  const tally = (f: (l: Line) => number) => {
    const m = new Map<number, number>();
    textOnly.forEach((l) => m.set(f(l), (m.get(f(l)) ?? 0) + l.text.length));
    return [...m.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 0;
  };
  const body = tally((l) => Math.round(l.size)) || 11;
  const isBody = (l: Line) => l.image == null && Math.abs(l.size - body) < 1;
  const left = tally((l) => (isBody(l) ? Math.round(l.x / 2) * 2 : -1));
  const right = percentile(textOnly.filter(isBody).map((l) => l.right), 0.9);
  const endsEarly = (l: Line) => l.right < right - body * 4;

  const headingSizes = [...new Set(textOnly.filter((l) => Math.round(l.size) >= body * 1.15 && l.text.length < 200).map((l) => Math.round(l.size)))].sort((a, b) => b - a);
  const level = (l: Line) => {
    if (l.image != null) return 0;
    const r = headingSizes.indexOf(Math.round(l.size));
    if (r >= 0) return Math.min(r + 1, 3);
    // A short, wholly bold line at body size that doesn't read as a sentence.
    if (l.bold && l.text.length < 100 && !/[.,;:]$/.test(l.text) && !BULLET.test(l.text) && !NUMBERED.test(l.text) && l.cells.length < 2) return 3;
    return 0;
  };

  // Space between lines of one paragraph: the tighter spacing seen most.
  const gaps: number[] = [];
  for (let i = 1; i < kept.length; i++) {
    const a = kept[i - 1];
    const b = kept[i];
    if (a.page === b.page && isBody(a) && isBody(b) && b.y > a.y) gaps.push(b.y - a.y);
  }
  const lineGap = percentile(gaps, 0.2) || body * 1.3;
  const paraBreak = Math.max(body * 1.25, Math.min(lineGap * 1.3, body * 1.75));

  const runsHtml = (runs: Run[], lineBold: boolean) => {
    let html = '';
    let open = '';
    for (const r of runs) {
      if (r.href !== open) {
        if (open) html += '</a>';
        if (r.href) html += `<a href="${esc(r.href)}">`;
        open = r.href;
      }
      let t = esc(r.href ? r.text.trimEnd() : r.text);
      if (!t) continue;
      const trailing = r.href && /\s$/.test(r.text) ? ' ' : '';
      if (r.bold && !lineBold && /\S/.test(r.text)) t = `<strong>${t}</strong>`;
      if (r.italic && /\S/.test(r.text)) t = `<em>${t}</em>`;
      html += t;
      if (trailing) {
        html += '</a>' + trailing;
        open = '';
      }
    }
    if (open) html += '</a>';
    return html.replace(/<\/strong><strong>|<\/em><em>/g, '').replace(/\s+/g, ' ').trim();
  };
  const lineHtml = (l: Line) => runsHtml(l.runs, l.bold);
  const dropMarker = (html: string) => html.replace(new RegExp(`^((?:<[^>]+>)*)\\s*(?:[${BULLET_CHARS}]|[-–*](?=\\s)|\\d{1,3}[.)]|[a-z][.)])\\s*`), '$1');

  // Lines into blocks.
  const out: string[] = [];
  let para: string[] = [];
  let list: { tag: 'ul' | 'ol'; items: string[]; indent: number; marked: boolean } | null = null;
  let table: string[][] = [];
  let tables = 0;
  const flushPara = () => {
    if (para.length) out.push(`<p>${para.join(' ')}</p>`);
    para = [];
  };
  const flushList = () => {
    if (list) {
      // An indented run with one item and no bullet reads as a quote.
      if (!list.marked && list.items.length === 1) out.push(`<blockquote><p>${list.items[0]}</p></blockquote>`);
      else out.push(`<${list.tag}>${list.items.map((i) => `<li>${i}</li>`).join('')}</${list.tag}>`);
    }
    list = null;
  };
  const flushTable = () => {
    if (table.length >= 2) {
      const cols = Math.max(...table.map((r) => r.length));
      const row = (r: string[], tag: string) => `<tr>${Array.from({ length: cols }, (_, i) => `<${tag}>${r[i] ?? ''}</${tag}>`).join('')}</tr>`;
      out.push(`<table>${row(table[0], 'th')}${table.slice(1).map((r) => row(r, 'td')).join('')}</table>`);
      tables++;
    } else if (table.length === 1) out.push(`<p>${table[0].join(' ')}</p>`);
    table = [];
  };
  const flushAll = () => {
    flushPara();
    flushList();
    flushTable();
  };

  kept.forEach((l, i) => {
    const prev = kept[i - 1];
    const gap = prev && prev.page === l.page ? l.y - prev.y : Infinity;
    if (l.image != null) {
      flushAll();
      out.push(`<p><img src="${IMAGE_PLACEHOLDER}${l.image}" alt=""></p>`);
      return;
    }

    // Text in columns: rows of a table.
    if (l.cells.length >= 2 && !BULLET.test(l.text)) {
      flushPara();
      flushList();
      table.push(l.cells.map((c) => runsHtml(c, l.bold)));
      return;
    }
    flushTable();

    const h = level(l);
    if (h) {
      flushPara();
      flushList();
      const tag = `h${h}`;
      const last = out[out.length - 1];
      // A heading that wraps onto a second line continues the same heading.
      if (prev && level(prev) === h && gap < l.size * 1.6 && last?.startsWith(`<${tag}>`)) {
        out[out.length - 1] = last.replace(`</${tag}>`, ` ${lineHtml(l)}</${tag}>`);
      } else out.push(`<${tag}>${lineHtml(l)}</${tag}>`);
      return;
    }

    const bullet = BULLET.test(l.text);
    const number = !bullet && NUMBERED.test(l.text);
    const indented = isBody(l) && left > 0 && l.x > left + body * 1.2;
    const prevEnded = !prev || endsEarly(prev) || gap > paraBreak;

    if (bullet || number) {
      flushPara();
      const tag = bullet ? 'ul' : 'ol';
      if (list && (list.tag !== tag || !list.marked)) flushList();
      if (!list) list = { tag, items: [], indent: l.x, marked: true };
      list.items.push(dropMarker(lineHtml(l)));
      return;
    }
    // The wrapped line of a list item.
    if (list && list.marked && l.x > list.indent + 2 && gap < paraBreak) {
      list.items[list.items.length - 1] += ` ${lineHtml(l)}`;
      return;
    }
    // Indented lines without markers: list items whose bullets are drawn as
    // shapes, or a quote; flushList decides which.
    if (indented) {
      flushPara();
      if (list && list.marked) flushList();
      if (!list) list = { tag: 'ul', items: [], indent: l.x - 1, marked: false };
      if (prevEnded || !list.items.length) list.items.push(lineHtml(l));
      else list.items[list.items.length - 1] += ` ${lineHtml(l)}`;
      return;
    }
    flushList();
    // A new paragraph after a larger gap, a short last line, a page break, or a change of size.
    if (para.length && (prevEnded || Math.abs(l.size - (prev?.size ?? l.size)) > 1)) flushPara();
    para.push(lineHtml(l));
  });
  flushAll();

  const notes = ['Imported from PDF: headings, paragraphs, lists and tables were rebuilt from the layout. Check the preview before publishing.'];
  if (tables) notes.push(`${tables} table${tables > 1 ? 's were' : ' was'} rebuilt from column positions. Check ${tables > 1 ? 'them' : 'it'}, especially cells that wrap onto several lines.`);
  if (removed) notes.push(`Left out ${removed} page number${removed > 1 ? 's' : ''} and repeated header or footer line${removed > 1 ? 's' : ''}.`);
  await task.destroy();
  return { html: out.join('\n'), images, notes };
}
