export interface Service {
  id: string;
  number: string;
  label: string;
  headline: string;
  description: string;
  topics: string[];
  metrics: { value: string; label: string }[];
  cta: string;
}

export const services: Service[] = [
  {
    id: "consulting",
    number: "01",
    label: "CONSULTING",
    headline: "Organic strategy for brands ready to re-architect growth.",
    description: "We work directly with founders, CMOs, and marketing teams to audit digital footprints, resolve indexing and crawl barriers, and engineer sustainable organic engines across SEO, Generative Engine Optimization (GEO), and intent-led content.",
    topics: [
      "Organic Growth Strategy", "AI Search & GEO", "SEO Audits", "Citation Architecture",
      "Intent-First Content", "Entity & Schema Mapping", "Technical Crawlability", "Conversion Architecture",
      "E-Commerce SEO", "B2B SaaS Acquisition"
    ],
    metrics: [
      { value: "60+", label: "Brands Advised" },
      { value: "4.15×", label: "Avg. Organic Lift" },
      { value: "15+", label: "Years in Search" }
    ],
    cta: "Discuss a Consulting Engagement"
  },
  {
    id: "coaching",
    number: "02",
    label: "COACHING",
    headline: "Become the authoritative marketing leader in your space.",
    description: "One-on-one and executive advisory designed for marketing leaders, founders, and strategists who want to master strategic thinking, embed custom AI workflows, and lead organic growth with conviction.",
    topics: [
      "Organic Search Strategy", "Content Architecture", "Citation Readiness", "Executive Presence",
      "Personal Branding", "Generative AI Workflows", "Prompt Architecture", "Marketing Systems",
      "Conversion Optimization", "Data-Driven Decisions", "Team Leadership"
    ],
    metrics: [
      { value: "500+", label: "Coaching Hours" },
      { value: "80+", label: "Leaders Mentored" },
      { value: "95%", label: "Satisfaction Rate" }
    ],
    cta: "Explore Executive Advisory"
  },
  {
    id: "training",
    number: "03",
    label: "TRAINING",
    headline: "Turn organic and AI search knowledge into organizational capability.",
    description: "Interactive corporate training programs and hands-on workshops designed around real workflows, live audits, and proven frameworks—building autonomous, high-performing marketing teams.",
    topics: [
      "Modern SEO Systems", "Intent-Led Content Writing", "Generative Engine Optimization", "Entity Schema",
      "AI for Marketing Teams", "Content Distribution", "Technical SEO Audits", "LinkedIn Thought Leadership",
      "Marketing Automation", "Conversion Tracking", "Organic Analytics"
    ],
    metrics: [
      { value: "120+", label: "Workshops Delivered" },
      { value: "15+", label: "Custom Formats" },
      { value: "4.9/5", label: "Average Rating" }
    ],
    cta: "Explore Corporate Training"
  },
  {
    id: "speaking",
    number: "04",
    label: "SPEAKING",
    headline: "High-impact perspectives built for global stages.",
    description: "Himani Kankaria delivers keynote addresses and masterclasses at premier global conferences (BrightonSEO, International Search Summit, WordCamp). Blending deep technical search experience with actionable frameworks teams can apply immediately.",
    topics: [
      "The Future of Search in an AI-First World",
      "We Don't Optimize, We Re-Architect",
      "Remarketing SEO: Compounding Existing Traffic",
      "Citation Architecture for ChatGPT & Perplexity",
      "From Search Traffic to Revenue Pipeline",
      "Zero-Click Search & AI Overviews",
      "Building Defensible Topical Authority",
      "AI-Powered Content Operations"
    ],
    metrics: [
      { value: "85+", label: "Keynotes Delivered" },
      { value: "12+", label: "Countries Reached" },
      { value: "15K+", label: "Attendees Reached" }
    ],
    cta: "Invite Himani to Speak"
  }
];

export const coachingAreas = [
  "Content Strategy", "SEO", "Social Media Strategy", "Email Marketing",
  "Personal Branding", "AI Marketing", "Video Generation", "AI Content Workflows",
  "Website Generation", "Marketing Automation", "Growth Strategy", "Analytics", "Team Leadership"
];

export const coachingCapabilityMap = {
  center: "MODERN MARKETER",
  branches: [
    {
      name: "Strategy",
      items: ["Positioning", "Audience", "GTM", "Growth Models"]
    },
    {
      name: "Organic",
      items: ["SEO", "Content", "Distribution"]
    },
    {
      name: "AI",
      items: ["Research", "Writing", "Video", "Websites", "Automation"]
    },
    {
      name: "Leadership",
      items: ["Team", "Processes", "Decision Making"]
    }
  ]
};

export const consultingFramework = [
  "Business Goal",
  "Market",
  "Audience",
  "Positioning",
  "Channels",
  "Content",
  "Conversion",
  "Measurement"
];

export const consultingQuestions = [
  "Where is growth actually constrained?",
  "Which activities create compounding returns?",
  "What should we stop doing?",
  "How should AI change the operating model?"
];

export const trainingFormats = [
  "Corporate Workshops", "Team Training", "Masterclasses", "Cohort Programs",
  "Bootcamps", "Online Courses", "Leadership Sessions"
];

export const trainingJourney = ["LEARN", "PRACTICE", "APPLY", "REVIEW", "MASTER"];

export const trainingCourseClusters = [
  {
    name: "Organic Growth",
    children: ["SEO", "Content", "Distribution"]
  },
  {
    name: "AI Marketing",
    children: ["Research", "Content", "Video", "Websites", "Automation"]
  },
  {
    name: "Growth",
    children: ["Strategy", "Analytics", "Experimentation"]
  }
];
