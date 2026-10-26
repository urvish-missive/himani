/**
 * POST /api/suggest-seo
 *
 * Suggests the SEO details a bulk-uploaded post is missing (summary, SEO
 * title, meta description, tags, focus keywords) from its text. It only reads
 * the article: the post body is never rewritten. Admins only, like
 * /api/generate-post, whose AI providers it shares.
 */
import { json, NoProviderError, requireAdmin, runProviders } from './generate-post.js';

declare const process: { env: Record<string, string | undefined> };

type Env = Record<string, string | undefined>;

const FIELDS = ['excerpt', 'seoTitle', 'seoDescription', 'tags', 'keywords'] as const;
type Field = (typeof FIELDS)[number];

export interface SuggestRequest {
  title: string;
  content: string;
  want: Field[];
}

export const maxDuration = 60;

export async function POST(request: Request): Promise<Response> {
  return handleSuggestSeo(request, process.env);
}

const SYSTEM = `You write SEO metadata for blog posts on Himani Kankaria's website (marketing, content strategy and leadership for B2B, SaaS and tech founders and marketers).

You are given a finished article. Do not rewrite, summarise at length or add to the article. Only write the metadata asked for, based strictly on what the article says. Never invent facts, numbers or claims that are not in the article.

Style: plain, specific, no clickbait, no em dashes, no hype words ("unlock", "ultimate", "game-changing", "revolutionary", "supercharge").

Reply in exactly this format, one line per field you were asked for, and nothing else:
EXCERPT: 1-2 sentences under 160 characters saying what the reader will learn
SEO_TITLE: under 60 characters, includes the main topic
SEO_DESCRIPTION: 140-160 characters, includes the focus keyword naturally
TAGS: 2 to 4 short topic tags, comma separated
KEYWORDS: 1 focus keyword phrase, then up to 3 related phrases, comma separated`;

const LABEL: Record<Field, string> = {
  excerpt: 'EXCERPT',
  seoTitle: 'SEO_TITLE',
  seoDescription: 'SEO_DESCRIPTION',
  tags: 'TAGS',
  keywords: 'KEYWORDS',
};

function parse(raw: string, want: Field[]) {
  const text = raw.trim().replace(/^```[a-z]*\s*\n/i, '').replace(/\n```\s*$/, '');
  const field = (name: string) =>
    text
      .match(new RegExp(`^\\s*\\**${name}\\**\\s*:\\s*(.+)$`, 'im'))?.[1]
      .trim()
      .replace(/^["']|["']$/g, '')
      .replace(/\s*—\s*/g, ', ') ?? '';
  const out: Partial<Record<Field, string | string[]>> = {};
  for (const f of want) {
    const v = field(LABEL[f]);
    if (!v) continue;
    out[f] =
      f === 'tags'
        ? v
            .split(',')
            .map((t) => t.trim().replace(/^#/, '').slice(0, 40))
            .filter(Boolean)
            .slice(0, 4)
        : v.slice(0, f === 'seoTitle' ? 120 : f === 'keywords' ? 300 : 400);
  }
  if (!Object.keys(out).length) throw new Error('reply had none of the fields');
  return out;
}

export async function handleSuggestSeo(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') return json(405, { error: 'Use POST.' });

  const admin = await requireAdmin(request, env, 'AI suggestions');
  if (admin instanceof Response) return admin;

  let body: SuggestRequest;
  try {
    body = (await request.json()) as SuggestRequest;
  } catch {
    return json(400, { error: 'Invalid request.' });
  }

  const title = String(body.title ?? '').trim().slice(0, 300);
  const content = String(body.content ?? '').slice(0, 24_000);
  const want = (Array.isArray(body.want) ? body.want : []).filter((f): f is Field => FIELDS.includes(f as Field));
  if (!content.trim()) return json(400, { error: 'The post has no text to work from.' });
  if (!want.length) return json(400, { error: 'Nothing to suggest.' });

  const prompt = [
    `Write only these fields: ${want.map((f) => LABEL[f]).join(', ')}.`,
    `Article title: ${title || '(none)'}`,
    `Article:\n"""\n${content}\n"""`,
  ].join('\n\n');

  try {
    return json(200, await runProviders(env, SYSTEM, prompt, (raw) => parse(raw, want)));
  } catch (err) {
    if (err instanceof NoProviderError) return json(500, { error: 'No AI provider is configured on the server.' });
    console.error('[suggest-seo]', err instanceof Error ? err.message : err);
    return json(502, { error: "The AI couldn't suggest details right now. Try again in a minute." });
  }
}
