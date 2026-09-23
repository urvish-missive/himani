// Blog post types and helpers shared by the public blog and the admin editor.
// API calls live in src/store/blogApi.ts (RTK Query).

export type PostStatus = 'draft' | 'published';

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
  /** Epoch millis, set the first time the post is published. */
  publishedAt: number | null;
  createdAt: number | null;
  updatedAt: number | null;
}

export type PostInput = Omit<Post, 'id' | 'publishedAt' | 'createdAt' | 'updatedAt'>;

/** Must match firestore.rules. */
export const POST_LIMITS = { title: 200, slug: 120, excerpt: 400, content: 200_000, coverImage: 1000, coverAlt: 200, tags: 10, tag: 40 } as const;

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

/** Rough reading time at ~220 words a minute. */
export function readMinutes(markdown: string) {
  const words = markdown.replace(/[#>*_`~\-[\]()!|]/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
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
  if (p.status === 'published' && !p.content.trim()) return "Write the post before publishing it.";
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

/** The AI draft returned by /api/generate-post. */
export interface GeneratedDraft {
  title: string;
  excerpt: string;
  tags: string[];
  content: string;
  provider: string;
}
