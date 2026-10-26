// Handles visual/image placeholders in imported documents and blog drafts.
// Writers frequently place tags like:
//   [VISUAL 9: Mock-up of a healthcare blog header with a "Medically reviewed by" line and a finance CTA banner with the advisor's credentials beside the button.]
//   [VISUAL: Diagram of marketing funnel]
//   [IMAGE 1: Comparison table screenshot]
//   [GRAPHIC: Brand architecture]
//
// When imported, brackets may be escaped as \[VISUAL 9: ...\] by Markdown formatters.
// This utility detects them, extracts the label and description, suggests prompts/alt text,
// and replaces them with generated or uploaded images.

export interface VisualPlaceholder {
  /** The full raw matched string in content (including brackets or escapes). */
  raw: string;
  /** Normalized uppercase label, e.g. "VISUAL 9", "IMAGE 1", "GRAPHIC". */
  label: string;
  /** Extracted visual number if present, e.g. 9. */
  number: number | null;
  /** Clean human-readable description/prompt. */
  description: string;
  /** Character index where match was found in the text. */
  index: number;
  /** Suggested alt text for the visual (clean and concise). */
  suggestedAlt: string;
  /** Suggested prompt for AI image generation. */
  suggestedPrompt: string;
}

export type VisualStyle = 'mockup' | 'infographic' | 'editorial' | 'photo' | 'auto';

export const VISUAL_STYLES: { id: VisualStyle; label: string; description: string }[] = [
  { id: 'auto', label: 'Auto (Smart Match)', description: 'Chooses the best visual style based on your prompt' },
  { id: 'mockup', label: 'Web / UI Mockup', description: 'Clean modern website headers, CTA banners, interfaces & product screens' },
  { id: 'infographic', label: 'Infographic / Chart', description: 'Structured diagrams, workflows, data graphics & frameworks' },
  { id: 'editorial', label: 'Modern Editorial', description: 'Polished vector or digital art for business blogs' },
  { id: 'photo', label: 'Realistic Photo', description: 'Studio photography with natural lighting' },
];

/**
 * Regex matching visual placeholders:
 * - Supports `[VISUAL 9: ...]`, `\[VISUAL 9: ...\]`, `[IMAGE: ...]`, `[GRAPHIC 2: ...]`, etc.
 * - Supports separators `:` or `-` or `–`.
 */
export const VISUAL_PLACEHOLDER_REGEX =
  /(?:\\?\[)\s*((?:VISUAL|IMAGE|GRAPHIC|PHOTO|FIGURE|DIAGRAM|CHART|INFOGRAPHIC|MOCKUP|BANNER)\b(?:\s*\d+)?)\s*[:–-]\s*([\s\S]*?)(?:\\?\])/gi;

/**
 * Unescapes Markdown escaping (like \", \[, \], \\) and normalizes whitespace.
 */
export function cleanVisualDescription(desc: string): string {
  return desc
    .replace(/\\([\\`*_[\]<>~"'])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Creates clean, accessible alt text from a visual description.
 */
export function generateSuggestedAlt(label: string, desc: string): string {
  const clean = cleanVisualDescription(desc);
  if (!clean) return label;
  if (clean.length <= 120) return clean;
  // Truncate at word boundary
  return clean.slice(0, 117).replace(/\s+\S*$/, '') + '...';
}

/**
 * Tunes the visual description into an optimized image generation prompt.
 */
export function generateSuggestedPrompt(desc: string, style: VisualStyle = 'auto'): string {
  const clean = cleanVisualDescription(desc);
  if (!clean) return '';

  let effectiveStyle = style;
  if (effectiveStyle === 'auto') {
    if (/mock-?up|header|banner|button|ui|interface|dashboard|form|cta|landing\s*page/i.test(clean)) {
      effectiveStyle = 'mockup';
    } else if (/chart|diagram|workflow|framework|graph|funnel|table|infographic|steps/i.test(clean)) {
      effectiveStyle = 'infographic';
    } else if (/photo|portrait|office|meeting|person|people|desk|real/i.test(clean)) {
      effectiveStyle = 'photo';
    } else {
      effectiveStyle = 'editorial';
    }
  }

  let styleModifier = '';
  switch (effectiveStyle) {
    case 'mockup':
      styleModifier = ', clean modern web design UI mockup, sleek website header and banner, elegant typography, professional UI card layout, dribbble showcase, 4k high resolution';
      break;
    case 'infographic':
      styleModifier = ', clean modern vector infographic, elegant structured data presentation, sleek minimalist diagram, professional marketing framework, clear visual hierarchy';
      break;
    case 'photo':
      styleModifier = ', professional editorial studio photography, soft natural lighting, high dynamic range, crisp 8k details, commercial quality';
      break;
    case 'editorial':
    default:
      styleModifier = ', modern editorial blog illustration, polished digital vector aesthetic, premium color palette, clean geometric composition, professional marketing publication';
      break;
  }

  return `${clean}${styleModifier}`;
}

/**
 * Finds all visual placeholders within a markdown string.
 */
export function findVisualPlaceholders(content: string): VisualPlaceholder[] {
  if (!content) return [];
  const matches: VisualPlaceholder[] = [];
  const regex = new RegExp(VISUAL_PLACEHOLDER_REGEX.source, 'gi');
  let m: RegExpExecArray | null;

  while ((m = regex.exec(content)) !== null) {
    const raw = m[0];
    const rawLabel = m[1].replace(/\s+/g, ' ').trim().toUpperCase();
    const numMatch = rawLabel.match(/\d+/);
    const num = numMatch ? Number(numMatch[0]) : null;
    const description = cleanVisualDescription(m[2]);

    matches.push({
      raw,
      label: rawLabel,
      number: num,
      description,
      index: m.index,
      suggestedAlt: generateSuggestedAlt(rawLabel, description),
      suggestedPrompt: generateSuggestedPrompt(description, 'auto'),
    });
  }

  return matches;
}

/**
 * Replaces the first exact occurrence of a visual placeholder with markdown image tag.
 */
export function replaceVisualPlaceholder(content: string, raw: string, replacementMarkdown: string): string {
  if (!content || !raw) return content;
  return content.replace(raw, replacementMarkdown);
}

/**
 * Formats a markdown image with optional caption.
 */
export function formatMarkdownImage(alt: string, url: string, caption?: string): string {
  const cleanAlt = alt.replace(/[\]\r\n]/g, ' ').trim();
  const cleanUrl = url.trim();
  const imgTag = `![${cleanAlt}](${cleanUrl})`;
  if (caption && caption.trim()) {
    return `${imgTag}\n*${caption.trim()}*`;
  }
  return imgTag;
}
