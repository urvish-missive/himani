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
    category: "SEO",
    title: "SEO Is Becoming a Brand Discipline",
    description: "Why search optimization is evolving from technical checklist to brand strategy — and what that means for modern marketing teams.",
    readTime: "8 min read",
    date: "2026-01-15",
    slug: "seo-becoming-brand-discipline"
  },
  {
    id: 2,
    category: "AI",
    title: "Your AI Strategy Should Start With Workflows, Not Tools",
    description: "Most teams adopt AI tools without redesigning workflows. Here's why workflow-first thinking produces better outcomes.",
    readTime: "6 min read",
    date: "2026-01-08",
    slug: "ai-strategy-workflows-not-tools"
  },
  {
    id: 3,
    category: "Growth",
    title: "The Distribution Problem Nobody Talks About",
    description: "Creating great content is table stakes. The real competitive advantage is in distribution systems that compound.",
    readTime: "7 min read",
    date: "2025-12-20",
    slug: "distribution-problem"
  }
];

export const contentCategories = ["SEO", "Content", "AI", "Growth", "Leadership", "Personal Brand"];
