export interface Article {
  id: number;
  category: string;
  outlet: string;
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
    outlet: "Search Engine Journal",
    title: "11 Ways To Do SEO Content Research Beyond Competitor Analysis",
    description: "Competitor analysis alone leaves gaps. Eleven research methods for finding content opportunities your competitors haven't already covered.",
    readTime: "8 min read",
    date: "2024-08-14",
    slug: "seo-content-research-beyond-competitor-analysis"
  },
  {
    id: 2,
    category: "Content",
    outlet: "Search Engine Journal",
    title: "Why Does A Content Strategy Fail?",
    description: "Most content strategies don't fail from a lack of effort — they fail from a lack of structure. Here's what actually breaks them.",
    readTime: "7 min read",
    date: "2023-12-19",
    slug: "why-does-a-content-strategy-fail"
  },
  {
    id: 3,
    category: "Growth",
    outlet: "Search Engine Journal",
    title: "19 Email Marketing Mistakes Affecting Open, Click, Conversion Rates",
    description: "A rundown of the mistakes quietly capping open rates, click-throughs, and conversions in most email programs.",
    readTime: "9 min read",
    date: "2023-08-08",
    slug: "email-marketing-mistakes"
  },
  {
    id: 4,
    category: "SEO",
    outlet: "Search Engine Journal",
    title: "How To Optimize For Google Featured Snippets: A 12-Step Guide",
    description: "A 12-step, practical guide to structuring content so it earns the featured snippet instead of just ranking below it.",
    readTime: "8 min read",
    date: "2021-12-08",
    slug: "optimize-for-featured-snippets"
  },
  {
    id: 5,
    category: "Content",
    outlet: "Search Engine Journal",
    title: "How To Fix 21 Content Creation Mistakes That Impact ROI",
    description: "Twenty-one common content creation mistakes that quietly erode ROI — and how to fix each one.",
    readTime: "9 min read",
    date: "2021-11-15",
    slug: "content-creation-mistakes-roi"
  },
  {
    id: 6,
    category: "Content",
    outlet: "Search Engine Journal",
    title: "13 Tips for Writing Product Descriptions That Convert",
    description: "Practical, tested tips for writing product descriptions that do more than describe — they convert.",
    readTime: "6 min read",
    date: "2021-05-05",
    slug: "product-descriptions-that-convert"
  },
  {
    id: 7,
    category: "Content",
    outlet: "Martech Zone",
    title: "The Ultimate Guide to Building a B2B Content Marketing Strategy",
    description: "A complete framework for building a B2B content marketing strategy from the ground up — positioning, channels, and measurement included.",
    readTime: "10 min read",
    date: "2023-06-20",
    slug: "b2b-content-marketing-strategy-guide"
  },
  {
    id: 8,
    category: "Growth",
    outlet: "StoryChief",
    title: "15 ROI-Driven Growth Marketing Strategies",
    description: "Fifteen growth marketing strategies chosen specifically for measurable ROI, not vanity metrics.",
    readTime: "8 min read",
    date: "2023-03-10",
    slug: "roi-driven-growth-marketing-strategies"
  }
];

export const contentCategories = ["All", "SEO", "AI", "Growth", "Content", "Leadership", "Personal Brand"];
