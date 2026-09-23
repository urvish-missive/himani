/**
 * POST /api/generate-post
 *
 * Drafts a blog post with AI from a topic, introduction and conclusion.
 * Runs on the server (a Vercel Function in production, Vite middleware in dev)
 * so AI keys never reach the browser, and only signed-in admins may call it.
 */
import { createRemoteJWKSet, jwtVerify } from 'jose';

declare const process: { env: Record<string, string | undefined> };

type Env = Record<string, string | undefined>;

export interface GenerateRequest {
  topic: string;
  introduction?: string;
  conclusion?: string;
  /** Use the introduction and conclusion as written, rather than as notes. */
  keepVerbatim?: boolean;
  keyword?: string;
  length?: 'short' | 'standard' | 'long';
}

export interface GeneratedPost {
  title: string;
  excerpt: string;
  tags: string[];
  content: string;
  provider: string;
}

// Vercel: allow time for a long article to be written.
export const maxDuration = 120;

export async function POST(request: Request): Promise<Response> {
  return handleGeneratePost(request, process.env);
}

const WORDS = { short: 700, standard: 1200, long: 1800 } as const;
const LIMITS = { topic: 300, introduction: 4000, conclusion: 4000, keyword: 100 };

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

const JWKS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com')
);

/** Verifies the Firebase ID token, then checks the user is listed in /admins. */
async function requireAdmin(request: Request, env: Env): Promise<string | Response> {
  const projectId = env.FIREBASE_PROJECT_ID || env.VITE_FIREBASE_PROJECT_ID;
  if (!projectId) return json(500, { error: 'Server is missing the Firebase project ID.' });

  const token = request.headers.get('authorization')?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return json(401, { error: 'Sign in again to use AI drafting.' });

  let uid: string;
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    });
    if (!payload.sub) throw new Error('no subject');
    uid = payload.sub;
  } catch {
    return json(401, { error: 'Your session has expired. Sign in again.' });
  }

  // Firestore's own rules let a user read only their own /admins doc, so this
  // succeeds only for admins. The user's token is used; no service account needed.
  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/admins/${encodeURIComponent(uid)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) return json(403, { error: 'Only admins can use AI drafting.' });
  return uid;
}

function buildPrompt(input: Required<Omit<GenerateRequest, 'keyword'>> & { keyword: string }) {
  const words = WORDS[input.length];
  const intro = input.introduction.trim();
  const outro = input.conclusion.trim();

  const bookends = input.keepVerbatim
    ? [
        intro && `Start the article with this introduction, word for word:\n"""\n${intro}\n"""`,
        outro && `End the article with a final section: write a short "## " heading of your own (a few words, not the conclusion text itself), then this conclusion word for word as the section's text:\n"""\n${outro}\n"""`,
      ]
    : [
        intro && `The introduction should cover these points (rewrite them in your own words):\n"""\n${intro}\n"""`,
        outro && `The conclusion should land on these points (rewrite them in your own words):\n"""\n${outro}\n"""`,
      ];

  return [
    `Write a blog post for Himani Kankaria's website.`,
    `Topic: ${input.topic.trim()}`,
    input.keyword && `Primary search keyword: "${input.keyword.trim()}". Use it naturally in the title, the opening paragraph and one heading. Never stuff it.`,
    `Target length: about ${words} words.`,
    ...bookends,
    !intro && 'Open by stating the reader\'s problem in the first two sentences.',
    !outro && 'Close with a short section that tells the reader what to do first.',
  ]
    .filter(Boolean)
    .join('\n\n');
}

const SYSTEM = `You write blog posts for Himani Kankaria, founder of Missive Digital and known as the Content Queen of India. She has 15+ years in marketing and content and works as a Virtual CMO, founder coach, marketing team trainer and speaker for B2B, SaaS and tech companies. Readers are founders, CMOs and marketing leads.

Write in her voice: first person where it helps, direct, practical, confident, built on specific observations rather than platitudes.

Rules:
- Specific over aspirational. Explain how something works and what to do, with concrete examples. If a paragraph could sit on a competitor's blog unchanged, rewrite it.
- Mention trade-offs and when advice does not apply ("this matters more if...", "for companies with...").
- Never invent statistics, studies, client names, quotes or results. If a number would help, describe the pattern instead.
- No em dashes. Avoid semicolons. Vary sentence and paragraph length. Prefer active voice.
- Never use these phrases: "in today's digital landscape", "fast-paced world", "ever-evolving", "it is important to note", "when it comes to", "let's dive in", "look no further", "this is where X comes in", "unlock", "harness the power", "game-changing", "revolutionary", "cutting-edge", "seamlessly", "robust", "comprehensive solution", "transformative", "navigate the complexities", "elevate", "supercharge", "empower", "take your business to the next level". Avoid "furthermore", "moreover", "additionally", "ultimately" as transitions.
- Headings must be informative when read alone (not "Introduction", "Benefits" or "Conclusion").
- No manufactured urgency and no promises of rankings, traffic or revenue.

Format the article body as Markdown: "## " for sections, "### " for sub-sections, short paragraphs, lists only where they genuinely help. Do not put the title in the body. Do not use HTML.

Reply in exactly this format and nothing else (no code fences, no JSON):
TITLE: under 70 characters, specific, no clickbait
EXCERPT: 1-2 sentences, under 160 characters, saying what the reader will learn
TAGS: 2 to 4 short topic tags, comma separated
===CONTENT===
the full Markdown article body`;

/** Waits, then retries once when a provider reports it's busy or rate limited. */
async function fetchWithRetry(url: string, init: RequestInit) {
  const res = await fetch(url, init);
  if (res.status !== 429 && res.status !== 503) return res;
  await new Promise((r) => setTimeout(r, 2500));
  return fetch(url, init);
}

async function callGemini(env: Env, prompt: string) {
  const key = env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY;
  if (!key) return null;
  const model = env.GEMINI_MODEL || env.VITE_GEMINI_MODEL || 'gemini-3.6-flash';
  const res = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      // Thinking models spend part of the output budget before writing, so leave room.
      generationConfig: { temperature: 0.7, maxOutputTokens: 16384 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  return (data?.candidates?.[0]?.content?.parts ?? []).map((p: { text?: string }) => p.text ?? '').join('');
}

async function callOpenAICompatible(name: string, endpoint: string, key: string | undefined, model: string | undefined, prompt: string, extra: Record<string, string> = {}) {
  if (!key || !model) return null;
  const res = await fetchWithRetry(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}`, ...extra },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      max_tokens: 8192,
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: prompt },
      ],
    }),
  });
  if (!res.ok) throw new Error(`${name} ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? '';
}

/**
 * Reads the labelled reply (TITLE / EXCERPT / TAGS / ===CONTENT===).
 * A plain format survives long Markdown far better than JSON, which breaks on
 * a single unescaped quote or newline.
 */
function parseDraft(raw: string): Omit<GeneratedPost, 'provider'> {
  const text = raw.trim().replace(/^```[a-z]*\s*\n/i, '').replace(/\n```\s*$/, '');
  const marker = text.search(/^\s*=+\s*CONTENT\s*=+\s*$/im);
  if (marker < 0) throw new Error('reply was missing the content marker');
  const head = text.slice(0, marker);
  const content = text.slice(marker).replace(/^\s*=+\s*CONTENT\s*=+\s*\n?/i, '').trim().slice(0, 200_000);
  const field = (name: string) => head.match(new RegExp(`^\\s*\\**${name}\\**\\s*:\\s*(.+)$`, 'im'))?.[1].trim() ?? '';
  if (content.length < 200) throw new Error('reply was too short');
  return {
    title: field('TITLE').replace(/^["']|["']$/g, '').slice(0, 200),
    excerpt: field('EXCERPT').slice(0, 400),
    tags: field('TAGS')
      .split(',')
      .map((t) => t.trim().replace(/^#/, '').slice(0, 40))
      .filter(Boolean)
      .slice(0, 10),
    // The house style bans em dashes; catch any the model slipped in.
    content: content.replace(/\s*—\s*/g, ', '),
  };
}

export async function handleGeneratePost(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') return json(405, { error: 'Use POST.' });

  const admin = await requireAdmin(request, env);
  if (admin instanceof Response) return admin;

  let body: GenerateRequest;
  try {
    body = (await request.json()) as GenerateRequest;
  } catch {
    return json(400, { error: 'Invalid request.' });
  }

  const topic = String(body.topic ?? '').trim();
  const introduction = String(body.introduction ?? '');
  const conclusion = String(body.conclusion ?? '');
  const keyword = String(body.keyword ?? '');
  if (!topic) return json(400, { error: 'Add a topic.' });
  if (topic.length > LIMITS.topic) return json(400, { error: `Keep the topic under ${LIMITS.topic} characters.` });
  if (introduction.length > LIMITS.introduction || conclusion.length > LIMITS.conclusion) {
    return json(400, { error: 'The introduction or conclusion is too long.' });
  }
  if (keyword.length > LIMITS.keyword) return json(400, { error: 'The keyword is too long.' });

  try {
    const draft = await generateDraft({ topic, introduction, conclusion, keyword, keepVerbatim: body.keepVerbatim, length: body.length }, env);
    return json(200, draft);
  } catch (err) {
    if (err instanceof NoProviderError) return json(500, { error: 'No AI provider is configured on the server.' });
    console.error('[generate-post]', err instanceof Error ? err.message : err);
    return json(502, { error: "The AI couldn't write a draft right now. Try again in a minute." });
  }
}

class NoProviderError extends Error {}

/** Writes the draft, trying Gemini, then Groq, then OpenRouter. */
export async function generateDraft(input: GenerateRequest, env: Env): Promise<GeneratedPost> {
  const prompt = buildPrompt({
    topic: input.topic,
    introduction: input.introduction ?? '',
    conclusion: input.conclusion ?? '',
    keyword: input.keyword ?? '',
    keepVerbatim: input.keepVerbatim !== false,
    length: input.length && input.length in WORDS ? input.length : 'standard',
  });
  const providers: [string, () => Promise<string | null>][] = [
    ['Gemini', () => callGemini(env, prompt)],
    [
      'Groq',
      () =>
        callOpenAICompatible('Groq', 'https://api.groq.com/openai/v1/chat/completions', env.GROQ_API_KEY || env.VITE_GROQ_API_KEY, env.GROQ_MODEL || env.VITE_GROQ_MODEL, prompt),
    ],
    [
      'OpenRouter',
      () =>
        callOpenAICompatible(
          'OpenRouter',
          'https://openrouter.ai/api/v1/chat/completions',
          env.OPENROUTER_API_KEY || env.VITE_OPENROUTER_API_KEY,
          env.OPENROUTER_MODEL || env.VITE_OPENROUTER_MODEL,
          prompt,
          { 'X-Title': 'Himani Kankaria admin' }
        ),
    ],
  ];

  const failures: string[] = [];
  for (const [name, call] of providers) {
    try {
      const raw = await call();
      if (raw == null) continue; // not configured
      if (failures.length) console.warn('[generate-post] fell back to', name, 'after:', failures.join(' | '));
      return { ...parseDraft(raw), provider: name };
    } catch (err) {
      failures.push(`${name}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  if (!failures.length) throw new NoProviderError('No AI provider is configured.');
  throw new Error(failures.join(' | '));
}
