// Blog post types and helpers shared by the public blog and the admin editor.
// API calls live in src/store/blogApi.ts (RTK Query).

/** A scheduled post goes live by itself once `scheduledAt` has passed. */
export type PostStatus = 'draft' | 'published' | 'scheduled';

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  /** Markdown. Raw HTML is ignored when rendered. */
  content: string;
  coverImage: string;
  coverAlt: string;
  tags: string[];
  author: string;
  status: PostStatus;
  /** Title tag for search results; the post title is used when empty. */
  seoTitle: string;
  /** Meta description; the excerpt is used when empty. */
  seoDescription: string;
  /** Focus keywords, comma separated. */
  keywords: string;
  /** Epoch millis a scheduled post goes live. */
  scheduledAt: number | null;
  /** Epoch millis, set the first time the post is published (or its scheduled time). */
  publishedAt: number | null;
  createdAt: number | null;
  updatedAt: number | null;
  /** SHA-256 of the Word file a bulk upload created this post from. */
  sourceHash?: string;
  sourceFile?: string;
}

export type PostInput = Omit<Post, 'id' | 'publishedAt' | 'createdAt' | 'updatedAt'>;

/** Must match firestore.rules. */
export const POST_LIMITS = {
  title: 200,
  slug: 120,
  excerpt: 400,
  content: 200_000,
  coverImage: 1000,
  coverAlt: 200,
  tags: 10,
  tag: 40,
  seoTitle: 120,
  seoDescription: 400,
  keywords: 300,
} as const;

/** Lengths search engines usually show in full. */
export const SEO_HINTS = { title: 60, description: 160 } as const;

export const DEFAULT_AUTHOR = 'Himani Kankaria';

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, POST_LIMITS.slug)
    .replace(/-+$/, '');
}

/** Whether visitors can see the post right now. */
export function isLive(p: Pick<Post, 'status' | 'scheduledAt'>, now = Date.now()) {
  return p.status === 'published' || (p.status === 'scheduled' && p.scheduledAt != null && p.scheduledAt <= now);
}

/** Whether the post has ever been visible, so its publish date should be kept. */
export function wentLive(p: Pick<Post, 'publishedAt'>, now = Date.now()) {
  return p.publishedAt != null && p.publishedAt <= now;
}

/** Returns the slug, or the slug with -2, -3… on the end when it is taken. */
export function nextFreeSlug(slug: string, taken: (s: string) => boolean) {
  if (!taken(slug)) return slug;
  for (let n = 2; n < 1000; n++) {
    const suffix = `-${n}`;
    const candidate = `${slug.slice(0, POST_LIMITS.slug - suffix.length).replace(/-+$/, '')}${suffix}`;
    if (!taken(candidate)) return candidate;
  }
  return `${slug.slice(0, POST_LIMITS.slug - 9)}-${Date.now().toString(36)}`;
}

/** Rough reading time at ~220 words a minute. */
export function readMinutes(markdown: string) {
  const words = markdown.replace(/[#>*_`~\-[\]()!|]/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/** Epoch millis ↔ the local time a datetime-local input shows. */
export function toLocalInput(ms: number | null) {
  if (ms == null) return '';
  const d = new Date(ms);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export function fromLocalInput(v: string) {
  const ms = v ? new Date(v).getTime() : NaN;
  return Number.isNaN(ms) ? null : ms;
}

export function formatPostDate(ms: number | null) {
  if (ms == null) return '';
  return new Date(ms).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
}

export function parseTags(input: string) {
  const seen = new Set<string>();
  return input
    .split(',')
    .map((t) => t.trim().slice(0, POST_LIMITS.tag))
    .filter((t) => t && !seen.has(t.toLowerCase()) && seen.add(t.toLowerCase()))
    .slice(0, POST_LIMITS.tags);
}

/** Returns an admin-facing error, or null when the post can be saved. */
export function validatePost(p: PostInput): string | null {
  if (!p.title.trim()) return 'Add a title.';
  if (p.title.length > POST_LIMITS.title) return `Keep the title under ${POST_LIMITS.title} characters.`;
  if (!SLUG_RE.test(p.slug)) return 'The URL can only use lowercase letters, numbers and single hyphens.';
  if (p.slug.length > POST_LIMITS.slug) return `Keep the URL under ${POST_LIMITS.slug} characters.`;
  if (p.excerpt.length > POST_LIMITS.excerpt) return `Keep the summary under ${POST_LIMITS.excerpt} characters.`;
  if (p.content.length > POST_LIMITS.content) return 'The post is too long to store. Split it into two posts.';
  if (p.coverImage && !/^https:\/\/\S+$/.test(p.coverImage)) return 'The cover image must be an https:// link.';
  if (p.coverImage.length > POST_LIMITS.coverImage) return 'The cover image link is too long.';
  if (p.seoTitle.length > POST_LIMITS.seoTitle) return `Keep the SEO title under ${POST_LIMITS.seoTitle} characters.`;
  if (p.seoDescription.length > POST_LIMITS.seoDescription) return `Keep the meta description under ${POST_LIMITS.seoDescription} characters.`;
  if (p.keywords.length > POST_LIMITS.keywords) return `Keep the keywords under ${POST_LIMITS.keywords} characters.`;
  if (p.status !== 'draft' && !p.content.trim()) return "Write the post before publishing it.";
  if (p.status === 'scheduled' && p.scheduledAt == null) return 'Pick a date and time to publish.';
  return null;
}

/** What the admin sends to /api/generate-post. */
export interface GenerateInput {
  topic: string;
  introduction: string;
  conclusion: string;
  /** Use the introduction and conclusion as written, rather than as notes. */
  keepVerbatim: boolean;
  keyword: string;
  length: 'short' | 'standard' | 'long';
}

/** What the admin sends to /api/suggest-seo. Only empty fields are asked for. */
export interface SeoSuggestInput {
  title: string;
  content: string;
  want: ('excerpt' | 'seoTitle' | 'seoDescription' | 'tags' | 'keywords')[];
}

/** SEO details suggested by /api/suggest-seo. Never touches the post body. */
export interface SeoSuggestion {
  excerpt?: string;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  keywords?: string;
  provider: string;
}

/** The AI draft returned by /api/generate-post. */
export interface GeneratedDraft {
  title: string;
  excerpt: string;
  tags: string[];
  content: string;
  provider: string;
}
