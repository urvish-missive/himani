export interface ExpertiseNode {
  id: string;
  label: string;
  description: string;
  x: number;
  y: number;
}

export const expertiseNodes: ExpertiseNode[] = [
  { id: "seo", label: "Organic SEO", description: "Entity-based SEO, technical health, and architecture built for traditional and AI search engines.", x: 50, y: 20 },
  { id: "content", label: "Content Architecture", description: "Intent-first content hubs and semantic topic clusters that convert discovery into revenue.", x: 80, y: 30 },
  { id: "social", label: "LinkedIn & Social", description: "Strategic distribution and executive presence across key professional networks.", x: 90, y: 55 },
  { id: "email", label: "Lifecycle Marketing", description: "Owned audience retention, nurture sequences, and compounding email systems.", x: 75, y: 80 },
  { id: "ai", label: "AI Search / GEO", description: "Generative Engine Optimization (GEO) and Citation Architecture for ChatGPT, Gemini & Perplexity.", x: 50, y: 85 },
  { id: "video", label: "Video SEO", description: "YouTube search optimization, video scripts, and multi-format knowledge asset distribution.", x: 25, y: 80 },
  { id: "websites", label: "Web Architecture", description: "High-performance digital experiences built for speed, crawlability, and frictionless conversion.", x: 10, y: 55 },
  { id: "brand", label: "E-E-A-T & Authority", description: "Author entities, industry citations, and defensible trust signals that safeguard visibility.", x: 20, y: 30 },
  { id: "analytics", label: "Revenue Analytics", description: "Data-driven measurement connecting organic search impressions directly to MQLs and SQLs.", x: 65, y: 15 },
  { id: "automation", label: "Marketing Systems", description: "Scalable workflow automation, AI research tooling, and repeatable content operations.", x: 35, y: 15 },
  { id: "strategy", label: "Organic Strategy", description: "Connecting business revenue targets to technical search execution with radical clarity.", x: 50, y: 50 },
  { id: "personal", label: "Executive Presence", description: "Building founder authority and industry thought leadership that outlasts algorithm shifts.", x: 35, y: 50 },
];

