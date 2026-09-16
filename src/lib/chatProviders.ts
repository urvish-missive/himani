export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are the AI assistant on Himani Kankaria's website. Himani is the Founder of Missive Digital, an organic growth and AI-search consultancy, with 15+ years of experience in SEO and content.

She helps B2B SaaS, tech, and e-commerce brands through four engagement models: Consulting (organic strategy audits), 1:1 Executive Coaching, Corporate Training/workshops, and Speaking (BrightonSEO, International Search Summit, WordCamp).

She writes for Search Engine Journal and Search Engine Land, and focuses on technical SEO, Generative Engine Optimization (GEO), and intent-led content — helping brands get found and cited in both traditional search and AI answers.

Answer visitor questions about her services, background, and how to work with her. Keep answers short and conversational (2-4 sentences). If someone wants to get in touch, point them to the "Work With Me" button. If asked something unrelated to Himani's work, politely redirect to what you can help with.`;

interface ProviderConfig {
  name: string;
  apiKey?: string;
  model?: string;
}

async function callGemini({ apiKey, model }: ProviderConfig, messages: ChatMessage[]): Promise<string> {
  if (!apiKey) throw new Error('Gemini API key missing');
  const resolvedModel = model || 'gemini-3.6-flash';

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${resolvedModel}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: messages.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
      }),
    }
  );

  if (!res.ok) throw new Error(`Gemini request failed: ${res.status} ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned no content');
  return text;
}

async function callOpenAICompatible(
  endpoint: string,
  { name, apiKey, model }: ProviderConfig,
  messages: ChatMessage[],
  extraHeaders?: Record<string, string>
): Promise<string> {
  if (!apiKey) throw new Error(`${name} API key missing`);
  if (!model) throw new Error(`${name} model missing`);

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      ...extraHeaders,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
    }),
  });

  if (!res.ok) throw new Error(`${name} request failed: ${res.status} ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error(`${name} returned no content`);
  return text;
}

const callGroq = (config: ProviderConfig, messages: ChatMessage[]) =>
  callOpenAICompatible('https://api.groq.com/openai/v1/chat/completions', config, messages);

const callOpenRouter = (config: ProviderConfig, messages: ChatMessage[]) =>
  callOpenAICompatible('https://openrouter.ai/api/v1/chat/completions', config, messages, {
    'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
    'X-Title': 'Himani Kankaria - Missive Digital',
  });

const providers: { config: ProviderConfig; call: (config: ProviderConfig, messages: ChatMessage[]) => Promise<string> }[] = [
  {
    config: { name: 'Gemini', apiKey: import.meta.env.VITE_GEMINI_API_KEY, model: import.meta.env.VITE_GEMINI_MODEL },
    call: callGemini,
  },
  {
    config: { name: 'Groq', apiKey: import.meta.env.VITE_GROQ_API_KEY, model: import.meta.env.VITE_GROQ_MODEL },
    call: callGroq,
  },
  {
    config: { name: 'OpenRouter', apiKey: import.meta.env.VITE_OPENROUTER_API_KEY, model: import.meta.env.VITE_OPENROUTER_MODEL },
    call: callOpenRouter,
  },
];

export async function askChatbot(messages: ChatMessage[]): Promise<string> {
  const errors: string[] = [];

  for (const { config, call } of providers) {
    if (!config.apiKey) continue;
    try {
      return await call(config, messages);
    } catch (err) {
      errors.push(`${config.name}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  if (errors.length === 0) {
    throw new Error('No AI provider is configured. Add an API key in .env (see .env.example).');
  }
  throw new Error(`All providers failed — ${errors.join('; ')}`);
}
