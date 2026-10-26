// Reads an old Word 97–2003 document (.doc) into simple HTML for the import
// pipeline. Browsers can only get at the text of this binary format: the words,
// paragraphs and links come through, but heading styles, bold, tables and
// pictures don't, so those posts are flagged for checking.

import * as CFB from 'cfb';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The document's main text, read through Word's piece table. */
function mainText(file: ArrayBuffer) {
  const cfb = CFB.read(new Uint8Array(file), { type: 'array' });
  const stream = (name: string) => {
    const e = CFB.find(cfb, name);
    return e?.content ? new Uint8Array(e.content as ArrayLike<number> as Uint8Array) : null;
  };
  const word = stream('WordDocument');
  if (!word) throw new Error("This file couldn't be opened as a Word document. Re-save it as .docx and try again.");
  const wv = new DataView(word.buffer, word.byteOffset, word.byteLength);
  if (wv.getUint16(0, true) !== 0xa5ec) throw new Error('This .doc file is from a Word version older than 97. Re-save it as .docx and try again.');
  const flags = wv.getUint16(0x0a, true);
  if (flags & 0x0100) throw new Error('This .doc file is password protected. Remove the password and try again.');
  const table = stream(flags & 0x0200 ? '1Table' : '0Table');
  if (!table) throw new Error("This Word file is damaged. Re-save it as .docx and try again.");
  const tv = new DataView(table.buffer, table.byteOffset, table.byteLength);

  const ccpText = wv.getInt32(0x4c, true); // characters in the main body
  const fcClx = wv.getUint32(0x1a2, true);
  const lcbClx = wv.getUint32(0x1a6, true);

  // The piece table says where each run of characters is stored, and how.
  let pos = fcClx;
  const end = fcClx + lcbClx;
  while (pos < end && table[pos] === 0x01) pos += 3 + tv.getUint16(pos + 1, true); // skip formatting (Prc)
  if (table[pos] !== 0x02) throw new Error("This Word file's text couldn't be found. Re-save it as .docx and try again.");
  const lcb = tv.getUint32(pos + 1, true);
  const plc = pos + 5;
  const n = (lcb - 4) / 12;

  let out = '';
  for (let i = 0; i < n && out.length < ccpText; i++) {
    const cpStart = tv.getUint32(plc + i * 4, true);
    const cpEnd = tv.getUint32(plc + (i + 1) * 4, true);
    const pcd = plc + (n + 1) * 4 + i * 8;
    const fcRaw = tv.getUint32(pcd + 2, true);
    const compressed = (fcRaw & 0x40000000) !== 0;
    const count = Math.min(cpEnd - cpStart, ccpText - out.length);
    if (compressed) {
      const fc = (fcRaw & ~0x40000000) / 2;
      out += new TextDecoder('windows-1252').decode(word.subarray(fc, fc + count));
    } else {
      out += new TextDecoder('utf-16le').decode(word.subarray(fcRaw, fcRaw + count * 2));
    }
  }
  return out;
}

/**
 * Turns Word's control characters into HTML. Fields keep their displayed
 * result, and HYPERLINK fields become links.
 */
function toHtml(raw: string) {
  let html = '';
  let i = 0;
  const readField = (): string => {
    // At a field-begin (0x13): code up to the separator (0x14), result up to the end (0x15).
    let code = '';
    let result = '';
    let inResult = false;
    i++;
    while (i < raw.length && raw[i] !== '\x15') {
      if (raw[i] === '\x13') {
        const inner = readField();
        if (inResult) result += inner;
        continue;
      }
      if (raw[i] === '\x14') inResult = true;
      else if (inResult) result += raw[i];
      else code += raw[i];
      i++;
    }
    i++; // past the field end
    const link = code.match(/^\s*HYPERLINK\s+(?:\\l\s+)?"([^"]+)"/i)?.[1];
    const shown = result.replace(/[\x01\x08]/g, '');
    if (link && /^(https?:|mailto:)/i.test(link) && shown.trim()) return `\x00a${link}\x00${shown}\x00/a\x00`;
    return /^\s*(TOC|PAGE|NUMPAGES|INDEX|SEQ)\b/i.test(code) ? '' : shown;
  };
  let text = '';
  while (i < raw.length) {
    if (raw[i] === '\x13') text += readField();
    else text += raw[i++];
  }

  // Paragraphs end in \r; cells and rows in \x07. Page breaks also end a paragraph.
  const paras = text
    .replace(/\x0c/g, '\r')
    .split(/[\r\x07]/)
    .map((p) =>
      p
        .replace(/[\x01\x02\x05\x08\x15]/g, '') // pictures, footnote marks, annotations
        .replace(/\x1e/g, '-')
        .replace(/\x1f/g, '')
        .replace(/[ \t]+/g, ' ')
        .trim()
    )
    .filter(Boolean);

  const inline = (p: string) =>
    p
      .split('\x0b')
      .map((part) =>
        esc(part).replace(/\x00a([^\x00]+)\x00([^\x00]*)\x00\/a\x00/g, (_m, href: string, shown: string) => `<a href="${href.replace(/"/g, '%22')}">${shown}</a>`)
      )
      .join('<br>');

  paras.forEach((p) => {
    if (/^[•·▪◦\-–*]\s+/.test(p)) html += `<ul><li>${inline(p.replace(/^[•·▪◦\-–*]\s+/, ''))}</li></ul>`;
    else html += `<p>${inline(p)}</p>`;
  });
  // Neighbouring single-item lists join into one.
  return html.replace(/<\/ul><ul>/g, '');
}

export function docToHtml(data: ArrayBuffer): { html: string; notes: string[] } {
  const raw = mainText(data);
  const hadPictures = /[\x01\x08]/.test(raw);
  const hadTables = raw.includes('\x07');
  const html = toHtml(raw);
  if (!html.replace(/<[^>]+>/g, '').trim()) throw new Error('No text was found in this .doc file. Re-save it as .docx and try again.');
  const notes = ['Old Word format (.doc): only the text could be read, so headings, bold and italic weren’t carried over. Save the file as .docx in Word for a faithful import.'];
  if (hadTables) notes.push('This .doc has tables; their cells came through as separate paragraphs.');
  if (hadPictures) notes.push('This .doc has pictures, which can’t be read from the old format. Add them in the editor, or import the .docx.');
  return { html, notes };
}
