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
    description: "Why search optimization is evolving from technical checklists to brand strategy — and what that means for modern marketing teams navigating AI search engines.",
    readTime: "8 min read",
    date: "2026-01-15",
    slug: "seo-becoming-brand-discipline"
  },
  {
    id: 2,
    category: "AI",
    title: "Your AI Strategy Should Start With Workflows, Not Tools",
    description: "Most teams adopt new AI tools without redesigning core operating workflows. Here's why workflow-first architecture unlocks sustainable compounding advantage.",
    readTime: "6 min read",
    date: "2026-01-08",
    slug: "ai-strategy-workflows-not-tools"
  },
  {
    id: 3,
    category: "Growth",
    title: "The Distribution Problem Nobody Talks About",
    description: "Creating insightful content is table stakes in 2026. The real competitive advantage lies in systematic distribution flywheels that amplify reach repeatedly.",
    readTime: "7 min read",
    date: "2025-12-20",
    slug: "distribution-problem"
  },
  {
    id: 4,
    category: "AI",
    title: "AI Overviews & Zero-Click Search: The New Organic Playbook",
    description: "How generative search experiences and Answer Engine Optimization (AEO) are reshaping buyer discovery — and how forward-thinking brands stay visible.",
    readTime: "9 min read",
    date: "2025-12-14",
    slug: "ai-overviews-zero-click-search"
  },
  {
    id: 5,
    category: "Content",
    title: "From Random Content to Compounding Thought Leadership",
    description: "A pragmatic blueprint for moving beyond high-volume content mills to high-affinity original perspectives that attract high-value enterprise buyers.",
    readTime: "5 min read",
    date: "2025-12-02",
    slug: "compounding-thought-leadership"
  },
  {
    id: 6,
    category: "Personal Brand",
    title: "Founder & Executive Visibility in the Era of AI Commoditization",
    description: "When automated content is abundant, genuine human perspective and lived expertise become the ultimate defensible moat for B2B brands.",
    readTime: "7 min read",
    date: "2025-11-18",
    slug: "executive-visibility-ai-commoditization"
  },
  {
    id: 7,
    category: "Leadership",
    title: "Building Modern Marketing Teams That Don't Burn Out",
    description: "How CMOs and marketing leaders can design high-leverage operating cadence, eliminate channel silos, and empower teams to do deep, strategic work.",
    readTime: "8 min read",
    date: "2025-11-05",
    slug: "marketing-teams-operating-cadence"
  },
  {
    id: 8,
    category: "SEO",
    title: "Why Traditional Keyword Research Is Obsolete",
    description: "Search engines now map intent and semantic topical authority. Why modern keyword strategy is really about audience decision-journey mapping.",
    readTime: "6 min read",
    date: "2025-10-22",
    slug: "modern-topical-authority-vs-keywords"
  }
];

export const contentCategories = ["All", "SEO", "AI", "Growth", "Content", "Leadership", "Personal Brand"];

