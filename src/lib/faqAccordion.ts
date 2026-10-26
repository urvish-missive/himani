/**
 * FAQ and Content Trimming utilities for blog posts and document import.
 *
 * 1. "always take till to faqs not source and internal use things":
 *    Automatically trims imported documents at the end of the FAQ section,
 *    dropping trailing "Sources", "References", "Citations", "Internal Use",
 *    and writer/editorial notes.
 *
 * 2. "fix faqs make like expand and collaps":
 *    Parses FAQ sections (whether formatted as `### Question`, `**Q: ...**`, or `<details><summary>`)
 *    into structured Q&A items that render as interactive expand & collapse accordions.
 */

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ParsedFaqContent {
  beforeFaq: string;
  faqHeading: string;
  faqs: FaqItem[];
  afterFaq: string;
  hasFaqs: boolean;
}

/** Matches headings that introduce a Frequently Asked Questions section. */
export const FAQ_HEADING_RE =
  /^(?:#{2,3})\s+(faqs?|frequently\s*asked\s*questions?(\s*\(faqs?\))?|q\s*&?\s*a|questions?\s*and\s*answers?|common\s*questions?)\s*:?$/i;

/** Matches headings that indicate sources, references, or internal editorial notes that must be dropped. */
export const STRIP_HEADING_RE =
  /^(?:#{2,4})\s+(sources?|references?|citations?|bibliography|further\s*reading|external\s*links?|reference\s*links?|internal\s*use(\s*only)?|for\s*internal\s*use(\s*only)?|internal\s*notes?|writer'?s?\s*notes?|author'?s?\s*notes?|editor'?s?\s*notes?|editorial\s*notes?|document\s*(?:info|history|details)|revision\s*history|content\s*brief|article\s*brief|seo\s*(?:brief|details|notes|checklist)|checklist|internal\s*checklist)\s*:?$/i;

/**
 * Parses FAQs from markdown body so they can be rendered as interactive accordion components.
 */
export function parseFaqsFromMarkdown(content: string): ParsedFaqContent {
  if (!content) {
    return { beforeFaq: '', faqs: [], afterFaq: '', hasFaqs: false, faqHeading: '' };
  }

  const lines = content.split('\n');
  let faqHeadingIndex = -1;
  let faqHeading = 'Frequently Asked Questions';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (FAQ_HEADING_RE.test(line)) {
      faqHeadingIndex = i;
      faqHeading = line.replace(/^#{2,3}\s+/, '').replace(/[:]$/, '').trim();
      break;
    }
  }

  if (faqHeadingIndex === -1) {
    return { beforeFaq: content, faqs: [], afterFaq: '', hasFaqs: false, faqHeading: '' };
  }

  const beforeFaq = lines.slice(0, faqHeadingIndex).join('\n').trim();
  const rest = lines.slice(faqHeadingIndex + 1);

  // Find where the FAQ section ends: next ## heading or a section to be stripped
  let faqEndIndex = rest.length;
  for (let i = 0; i < rest.length; i++) {
    const line = rest[i].trim();
    if (/^##\s+[^#]/.test(line) || STRIP_HEADING_RE.test(line)) {
      faqEndIndex = i;
      break;
    }
  }

  const faqLines = rest.slice(0, faqEndIndex);
  const afterFaq = rest.slice(faqEndIndex).join('\n').trim();

  // Parse individual Q&A items
  const faqs: FaqItem[] = [];
  let currentQ = '';
  let currentA: string[] = [];

  const flush = () => {
    if (currentQ.trim() && currentA.length) {
      faqs.push({
        id: `faq-${faqs.length + 1}`,
        question: currentQ.trim(),
        answer: currentA.join('\n').trim(),
      });
    }
    currentQ = '';
    currentA = [];
  };

  for (const rawLine of faqLines) {
    const line = rawLine.trim();

    // Check for question markers:
    // 1. ### Question text?
    const h3Match = line.match(/^###\s+(.+)$/);
    // 2. **Q: Question text?** or **Question: ...** or 1. **Question?**
    const boldQMatch = line.match(/^\s*(?:\d+[.)]\s*)?\*\*(?:Q(?:uestion)?\s*[:–-]?\s*)?([^*]+)\*\*\s*[:–-]?\s*$/i);
    // 3. <summary>Question text</summary>
    const detailsMatch = line.match(/^<summary>(.+)<\/summary>$/i);

    if (h3Match) {
      flush();
      currentQ = h3Match[1]
        .replace(/^[0-9]+[.)]\s*/, '')
        .replace(/\\([`*_[\]])/g, '$1')
        .trim();
    } else if (
      boldQMatch &&
      (boldQMatch[1].includes('?') || (boldQMatch[1].length < 140 && !boldQMatch[1].endsWith('.')))
    ) {
      flush();
      currentQ = boldQMatch[1]
        .replace(/^[0-9]+[.)]\s*/, '')
        .replace(/\\([`*_[\]])/g, '$1')
        .trim();
    } else if (detailsMatch) {
      flush();
      currentQ = detailsMatch[1].trim();
    } else if (currentQ) {
      if (line !== '</details>' && line !== '<details>') {
        currentA.push(rawLine);
      }
    }
  }
  flush();

  return {
    beforeFaq,
    faqs,
    afterFaq,
    hasFaqs: faqs.length > 0,
    faqHeading,
  };
}

/**
 * Trims document blocks:
 * 1. Takes all content up to and including the FAQs.
 * 2. Drops anything following the FAQs (Sources, References, Internal Notes).
 * 3. If there are no FAQs, strips any trailing Sources / Internal Use sections.
 */
export function cleanDocumentBlocks(
  blocks: string[]
): { blocks: string[]; notes: string[] } {
  const notes: string[] = [];

  // Look for FAQ heading
  let faqIndex = -1;
  for (let i = 0; i < blocks.length; i++) {
    if (FAQ_HEADING_RE.test(blocks[i].trim())) {
      faqIndex = i;
      break;
    }
  }

  if (faqIndex !== -1) {
    // Keep everything up to the FAQ heading
    const kept = blocks.slice(0, faqIndex + 1);

    // Keep all FAQ items (which are ### headings, lists, paragraphs) until next ## heading or strip heading
    let strippedTrailing = false;
    for (let i = faqIndex + 1; i < blocks.length; i++) {
      const b = blocks[i].trim();
      if (/^##\s+[^#]/.test(b) || STRIP_HEADING_RE.test(b)) {
        strippedTrailing = true;
        break;
      }
      kept.push(blocks[i]);
    }

    if (strippedTrailing) {
      notes.push('Content trimmed at the end of FAQs: trailing sources and internal notes were excluded.');
    }

    return { blocks: kept, notes };
  }

  // No FAQ section: strip from the first top-level sources or internal-use heading to the end
  let cutIndex = blocks.length;
  for (let i = 0; i < blocks.length; i++) {
    if (STRIP_HEADING_RE.test(blocks[i].trim())) {
      cutIndex = i;
      notes.push('Excluded trailing sources and internal notes from post content.');
      break;
    }
  }

  return { blocks: blocks.slice(0, cutIndex), notes };
}
