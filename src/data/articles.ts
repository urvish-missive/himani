export interface Article {
  id: number;
  category: string;
  title: string;
  description: string;
  readTime: string;
  date: string;
  slug: string;
}

export const articles: Article[] = [
  {
    id: 1,
    category: "AI",
    title: "The Citation Architecture Framework: Getting Cited by ChatGPT & Perplexity",
    description: "Traditional ranking is no longer enough. Here is Missive Digital's 5-layer methodology (Claim, Evidence, Entity, Answer, Authority) to ensure your brand is cited by generative AI engines.",
    readTime: "8 min read",
    date: "2026-02-10",
    slug: "citation-architecture-framework-ai-search"
  },
  {
    id: 2,
    category: "SEO",
    title: "Remarketing SEO: Turning Existing Search Footprints into Compounding Revenue",
    description: "Why the fastest path to organic growth isn't publishing more articles, but re-architecting your existing search assets to capture qualified buyer intent and conversions.",
    readTime: "7 min read",
    date: "2026-01-20",
    slug: "remarketing-seo-compounding-growth"
  },
  {
    id: 3,
    category: "SEO",
    title: "Why SEO Is Becoming an Entity and Brand Discipline in the AI Era",
    description: "Search engines and LLMs now map entities, author signals, and real-world brand authority. Why technical checklists must evolve into entity-first architecture.",
    readTime: "9 min read",
    date: "2026-01-08",
    slug: "seo-becoming-brand-discipline"
  },
  {
    id: 4,
    category: "AI",
    title: "AI Overviews & Zero-Click Search: The Modern Organic Playbook",
    description: "How generative search experiences and Answer Engine Optimization (AEO) are reshaping discovery — and how forward-thinking B2B brands stay visible.",
    readTime: "8 min read",
    date: "2025-12-18",
    slug: "ai-overviews-zero-click-search"
  },
  {
    id: 5,
    category: "Content",
    title: "Intent-First Content Strategy: Replacing Vanity Traffic with MQLs",
    description: "A pragmatic blueprint for moving beyond high-volume content mills to high-affinity original perspectives that attract high-value enterprise buyers and drive pipeline.",
    readTime: "6 min read",
    date: "2025-12-05",
    slug: "intent-first-content-strategy"
  },
  {
    id: 6,
    category: "Personal Brand",
    title: "Founder & Executive Thought Leadership in the Era of AI Content",
    description: "When AI makes content infinitely abundant, genuine human perspective, lived practitioner experience, and E-E-A-T become the ultimate defensible moat.",
    readTime: "7 min read",
    date: "2025-11-22",
    slug: "executive-visibility-ai-commoditization"
  },
  {
    id: 7,
    category: "Leadership",
    title: "How to Build Modern Organic Marketing Teams That Don't Burn Out",
    description: "Designing high-leverage operating cadence, eliminating channel silos, and empowering marketing teams to build compounding organic distribution engines.",
    readTime: "8 min read",
    date: "2025-11-10",
    slug: "marketing-teams-operating-cadence"
  },
  {
    id: 8,
    category: "SEO",
    title: "Topic Clusters vs. Keyword Lists: Engineering Semantic Authority",
    description: "Search engines understand interconnected topic models. Here is how to construct semantic cluster hubs that outrank massive legacy competitors.",
    readTime: "6 min read",
    date: "2025-10-28",
    slug: "topic-clusters-semantic-topical-authority"
  }
];

export const contentCategories = ["All", "SEO", "AI", "Growth", "Content", "Leadership", "Personal Brand"];

