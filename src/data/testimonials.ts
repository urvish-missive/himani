export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  company: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "Himani is one of the best SEO savvy copywriters and strategists I have had the opportunity to collaborate with! If you need compelling, comprehensive content that connects with users' needs and drives real organic impact, you need to work with her!",
    author: "Aleyda Solis",
    role: "International SEO Consultant & Founder",
    company: "Orainti"
  },
  {
    id: 2,
    quote: "We've worked with Himani on a number of important SEO deliverables and will continue to do so. She's reliable, communicative, and, most of all, good at what she does: SEO. I'd have no reservations recommending Himani to any ambitious brand.",
    author: "Andy Chadwick",
    role: "Co-Founder",
    company: "Keyword Insights"
  },
  {
    id: 3,
    quote: "Himani is an extremely hard-working, quality-conscious, and talented individual. Having known and worked with her closely since 2008, I know very few who have her capability to lead strategy and execution. If your project has crossed Himani's eyes, results are guaranteed.",
    author: "Pulkit Agrawal",
    role: "Managing Director",
    company: "UR Digital"
  },
  {
    id: 4,
    quote: "Missive Digital didn't just deliver typical SEO audit spreadsheets—they re-architected our entire content ecosystem for commercial intent and AI citations. Our inbound demo requests surged and organic pipeline grew 4.15x.",
    author: "Growth Marketing Lead",
    role: "Head of Marketing",
    company: "Enterprise B2B SaaS"
  },
  {
    id: 5,
    quote: "Working with Himani transformed how our organic search channels perform. Her Citation Architecture and topic cluster methodology eliminated keyword cannibalization and generated £57K/mo in organic revenue.",
    author: "VP of E-Commerce",
    role: "Digital Commercial Director",
    company: "Global Retail & E-Commerce"
  }
];

