/**
 * POST /api/generate-visual
 *
 * Generates an AI visual/image from a visual placeholder description
 * (e.g., [VISUAL 9: Mock-up of a healthcare blog header with a "Medically reviewed by" line...]).
 * Runs on the server so API keys stay private and only verified admins can call it.
 */
import { requireAdmin, json } from './generate-post';

declare const process: { env: Record<string, string | undefined> };
type Env = Record<string, string | undefined>;

export interface GenerateVisualRequest {
  prompt: string;
  label?: string;
  style?: 'mockup' | 'infographic' | 'editorial' | 'photo' | 'auto';
  width?: number;
  height?: number;
}

export interface GeneratedVisualResponse {
  imageUrl: string;
  dataUrl: string;
  prompt: string;
  label?: string;
}

export const maxDuration = 60;

export async function POST(request: Request): Promise<Response> {
  return handleGenerateVisual(request, process.env);
}

function refinePrompt(prompt: string, style = 'auto'): string {
  const clean = prompt.replace(/\s+/g, ' ').trim();
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

  let suffix = '';
  switch (effectiveStyle) {
    case 'mockup':
      suffix = ', modern clean UI mockup, website interface, digital product design, high resolution, professional presentation, dribbble style';
      break;
    case 'infographic':
      suffix = ', clean modern vector infographic, elegant typography, professional data visualization, structured layout';
      break;
    case 'photo':
      suffix = ', realistic photography, soft natural studio lighting, 8k resolution, crisp details';
      break;
    case 'editorial':
    default:
      suffix = ', modern editorial blog illustration, tasteful color palette, high aesthetic, tech journalism';
      break;
  }
  return `${clean}${suffix}`;
}

export async function handleGenerateVisual(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') return json(405, { error: 'Use POST.' });

  const admin = await requireAdmin(request, env, 'AI visual generation');
  if (admin instanceof Response) return admin;

  let body: GenerateVisualRequest;
  try {
    body = (await request.json()) as GenerateVisualRequest;
  } catch {
    return json(400, { error: 'Invalid request body.' });
  }

  const rawPrompt = String(body.prompt ?? '').trim();
  if (!rawPrompt) return json(400, { error: 'Prompt is required.' });

  const style = body.style || 'auto';
  const width = Math.min(Math.max(body.width || 1024, 400), 1600);
  const height = Math.min(Math.max(body.height || 640, 300), 1200);

  const enhancedPrompt = refinePrompt(rawPrompt, style);
  const seed = Math.floor(Math.random() * 1_000_000);
  const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=${width}&height=${height}&nologo=true&seed=${seed}`;

  try {
    const res = await fetch(pollinationsUrl, {
      headers: {
        'User-Agent': 'Himani-Web-Visual-Generator/1.0',
      },
    });

    if (!res.ok) {
      throw new Error(`Visual generator returned status ${res.status}`);
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const dataUrl = `data:${contentType};base64,${buffer.toString('base64')}`;

    const responseData: GeneratedVisualResponse = {
      imageUrl: pollinationsUrl,
      dataUrl,
      prompt: enhancedPrompt,
      label: body.label,
    };

    return json(200, responseData);
  } catch (err) {
    console.error('[generate-visual]', err instanceof Error ? err.message : err);
    return json(502, { error: "Couldn't generate visual right now. You can upload an image manually or try again." });
  }
}
