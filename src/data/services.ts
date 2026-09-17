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

export interface TrainingTrack {
  id: 'content' | 'linkedin' | 'teamTrainer' | 'symposium';
  badge: string;
  tagline: string;
  title: string;
  description: string;
  whoIsItFor: string[];
  modules: {
    title: string;
    description: string;
    deliverable: string;
  }[];
  formats: string[];
  outcomes: string[];
  ctaText: string;
  featuredIn?: string;
}

export const services: Service[] = [
  {
    id: "consulting",
    number: "01",
    label: "CONSULTING",
    headline: "Growth marketing strategist & business thinking for ambitious brands.",
    description: "At Missive Digital, we are the marketing thinkers and business strategists for businesses across SaaS, IT, eCommerce, D2C, and B2B. Led by Himani Kankaria with 15+ years in organic growth, we help companies build data-driven integrated and channel-specific marketing strategies that achieve >800% growth in website traffic and 200% growth in leads YoY. Our portfolio spans high-growth enterprises to unicorn tech brands.",
    topics: [
      "Marketing Consulting", "Content Strategy", "Copywriting", "Marketing Strategy",
      "Social Media Marketing", "Search Engine Optimization (SEO)", "Content Marketing", "Email Marketing",
      "Growth Marketing", "Strategic Planning"
    ],
    metrics: [
      { value: ">800%", label: "Traffic Growth YoY" },
      { value: "200%", label: "Lead Growth YoY" },
      { value: "B2B SaaS", label: "Enterprise Specialization" }
    ],
    cta: "Discuss a Consulting Engagement"
  },
  {
    id: "coaching",
    number: "02",
    label: "COACHING",
    headline: "1:1 Strategic mentorship for founders, CMOs & modern marketers.",
    description: "Personalized executive advisory designed for marketing leaders, founders, and strategists across Telecom, Fintech SaaS (unicorns), B2B, and eCommerce. Himani guides leaders to master strategic thinking, deploy custom AI workflows, build a defensible personal brand, and guide their teams to scale up with complete conviction.",
    topics: [
      "Strategic Planning", "Growth Marketing", "Content Strategy Consulting", "Executive Presence",
      "LinkedIn Thought Leadership", "Channel-Specific Strategies", "Data-Driven Decisions", "Conversion Optimization",
      "Team Leadership", "Brand Building"
    ],
    metrics: [
      { value: "1-on-1", label: "Executive Advisory" },
      { value: "500+", label: "Coaching Hours" },
      { value: "Custom AI", label: "Workflow Playbooks" }
    ],
    cta: "Explore Executive Advisory"
  },
  {
    id: "training",
    number: "03",
    label: "TRAINING",
    headline: "Upskilling teams, leaders & writers across 4 specialized training tracks.",
    description: "Himani has been associated with Hootsuite, Semrush, SEWA Federation, and WPCouchCon for brand endorsements, corporate training, and workshops around marketing strategies, social media, and content. We build, guide, and train teams across 4 distinct tracks: Content Writing, LinkedIn Executive Branding, Marketing Trainer for In-House Teams, and the Content Writers' Symposium.",
    topics: [
      "Content Writing & Strategy", "LinkedIn Thought Leadership", "Marketing Trainer for Teams", "Content Writers' Symposium",
      "Corporate Training & Workshops", "Modern SEO Systems", "Social Media Marketing", "Email Marketing",
      "Generative Engine Optimization", "B2B Inbound Systems"
    ],
    metrics: [
      { value: "4", label: "Specialized Tracks" },
      { value: "Hands-on", label: "Teardown Clinics" },
      { value: "Team SOPs", label: "Permanent Enablement" }
    ],
    cta: "Explore Training Programs"
  },
  {
    id: "speaking",
    number: "04",
    label: "SPEAKING",
    headline: "International speaker & keynote emcee across global & national stages.",
    description: "Himani speaks at global conferences including the International Search Summit (Barcelona), WordCamp Asia, WordCamp Nagpur, Agile Network India, BrightonSEO, Whitespark Local Search Summit, and Semrush events. A regular contributor to Search Engine Journal and Search Engine Land with featured insights on Wix, Semrush, and SE Ranking.",
    topics: [
      "How AI is Restructuring Marketing Methods",
      "Humanizing AI Content",
      "International SEO at Scale",
      "Intent-First Content for B2B & SaaS",
      "Zero-Click Search & AI Citations",
      "From Search Traffic to Revenue Pipeline",
      "Designing the Next Decade of Market Leaders",
      "Building Defensible Topical Authority"
    ],
    metrics: [
      { value: "Global", label: "Keynotes & Panels" },
      { value: "brightonSEO", label: "Whitespark & Semrush" },
      { value: "UK · Spain", label: "Asia & India Stages" }
    ],
    cta: "Invite Himani to Speak"
  }
];

// ==========================================
// 4 DISTINCT TRAINING TRACKS
// ==========================================
export const trainingTracks: TrainingTrack[] = [
  {
    id: "content",
    badge: "Editorial Architecture",
    tagline: "Intent-Led Content Writing & Strategic Architecture",
    title: "Intent-Led Content Strategy & Writing Masterclass",
    description: "Developed and delivered by the 'Content Queen of India', this masterclass teaches writers, editors, and marketing teams how to move beyond generic AI fluff into high-value content with deep Information Gain that ranks on Google and gets cited by AI search engines.",
    featuredIn: "Search Engine Land & Search Engine Journal Contributor",
    whoIsItFor: [
      "Content Writers & Copywriters aiming to command higher rates and master search intent",
      "Content Strategists & Editors looking to build repeatable editorial systems",
      "B2B SaaS & Tech Marketing Teams scaling high-quality organic content libraries",
      "Agencies wanting to train staff on AI-resistant writing standards"
    ],
    modules: [
      {
        title: "Intent-First Keyword & Audience Mapping",
        description: "Classify micro-intents, map customer journey states, and discover untapped search opportunities competitors overlook.",
        deliverable: "Custom Intent Mapping Matrix & Template"
      },
      {
        title: "The Information Gain Architecture",
        description: "How to extract unique subject-matter expert insights, proprietary data, and original viewpoints so content earns genuine citations.",
        deliverable: "SME Interview Framework & Information Gain Scoring Sheet"
      },
      {
        title: "Hook Formulation & The 3-Second Retention Rule",
        description: "Tactical breakdown of how to craft compelling blog introductions, headlines, and subheads that hook readers and eliminate bounce rates.",
        deliverable: "The 30-Pattern Intro & Hook Swipe File"
      },
      {
        title: "AI-Assisted Editorial Workflows (Without Losing Voice)",
        description: "Using LLMs for rapid ideation, counter-argument exploration, and drafting while strictly protecting human tone and factual integrity.",
        deliverable: "AI Prompt Architecture Library for Writers"
      },
      {
        title: "Content Auditing, Pruning & Decay Recovery",
        description: "Diagnosing decaying rankings, updating outdated information, and consolidating cannibalizing posts into evergreen pillar pages.",
        deliverable: "Content Decay Audit Checklist & Action Plan"
      }
    ],
    formats: [
      "2-Day Virtual Intensive Bootcamp",
      "Hands-on In-Person Corporate Masterclass",
      "4-Week Team Cohort with Weekly Live Review Labs",
      "Executive Writing Sprint (1-on-1)"
    ],
    outcomes: [
      "Produce search-intent-aligned articles that rank and convert",
      "Infuse unique Information Gain into every published asset",
      "Speed up drafting velocity by 2–3× with structured AI workflows",
      "Build a resilient editorial calendar that compounds over quarters"
    ],
    ctaText: "Inquire for Content Writing Training"
  },
  {
    id: "linkedin",
    badge: "Executive Branding",
    tagline: "LinkedIn Personal Branding & Thought Leadership",
    title: "LinkedIn Executive Presence & Authority Engine",
    description: "LinkedIn is the epicenter of B2B influence and high-ticket pipeline. Himani coaches founders, CEOs, and senior leaders on how to build an unmistakable personal brand, articulate domain expertise, and generate consistent inbound leads organically.",
    featuredIn: "Top Voice in SEO & Growth Marketing on LinkedIn",
    whoIsItFor: [
      "Founders, CEOs, & Executives wanting to become category authorities",
      "Heads of Marketing & Sales seeking organic inbound B2B pipeline",
      "Consultants & Solopreneurs scaling high-ticket client acquisition",
      "Internal Brand Ambassadors leading employee advocacy initiatives"
    ],
    modules: [
      {
        title: "Profile Architecture for Conversion",
        description: "Re-engineering personal profiles into high-converting landing pages with authoritative headlines, value propositions, and direct lead magnets.",
        deliverable: "Executive LinkedIn Profile Optimization Blueprint"
      },
      {
        title: "The Thought Leadership Content Flywheel",
        description: "Developing a 4-pillar narrative structure balancing contrarian industry takes, teardowns, personal vulnerability, and tactical playbooks.",
        deliverable: "30-Day LinkedIn Content System & Prompt Deck"
      },
      {
        title: "Algorithmic Reach & Carousel Storytelling",
        description: "Designing carousels, text hooks, and document posts that trigger high dwell time, genuine comments, and viral algorithmic distribution.",
        deliverable: "Carousel Storyboard Templates & Typography Guidelines"
      },
      {
        title: "Social Selling & Inbound DM Conversion",
        description: "Transitioning high-engagement posts into warm direct message conversations without aggressive pitching or spammy automation.",
        deliverable: "Inbound Engagement-to-Meeting DM Scripts"
      },
      {
        title: "Executive Ghostwriting & Voice Capture SOP",
        description: "Frameworks for busy leaders to capture thoughts in 15-minute voice memos and turn them into weekly thought leadership assets.",
        deliverable: "Voice Capture Worksheet & Content Production Pipeline"
      }
    ],
    formats: [
      "Executive 1:1 Intensive (4 Weeks)",
      "Leadership Team Workshop (Half-Day or Full-Day)",
      "B2B Sales & Marketing Enablement Program",
      "Monthly Thought Leadership Advisory Retainer"
    ],
    outcomes: [
      "A fully revamped, authoritative LinkedIn profile that converts profile views into inbound leads",
      "Consistent 3–4 post weekly publishing rhythm in under 90 minutes of your time",
      "Exponential expansion in organic impressions, follower quality, and executive network reach",
      "Inbound inquiries from partners, enterprise clients, and podcast/conference organizers"
    ],
    ctaText: "Book LinkedIn Branding Training"
  },
  {
    id: "teamTrainer",
    badge: "Corporate Enablement",
    tagline: "Marketing Trainer for In-House Teams",
    title: "In-House Marketing Team Enablement & Transformation",
    description: "Empower your in-house marketing team to operate as an autonomous, high-velocity growth engine. Himani embeds inside tech companies, SaaS brands, and agencies to train teams on modern technical SEO, Generative Engine Optimization (GEO), and cross-functional content ops.",
    featuredIn: "Trusted by 60+ Tech Brands & Global Agencies",
    whoIsItFor: [
      "Enterprise & B2B Marketing Departments tired of bloated agency retainer handoffs",
      "In-House SEO & Content Teams needing to upskill for AI-first search",
      "Product & Engineering Teams needing technical crawl and schema alignment",
      "Digital Agencies expanding their client service lines into GEO and modern SEO"
    ],
    modules: [
      {
        title: "Modern Search Architecture & Crawl Engineering",
        description: "Upskill in-house teams on resolving JavaScript rendering bottlenecks, crawl budget traps, faceted navigation bloat, and entity graph structures.",
        deliverable: "Technical SEO Audit & Remediation SOP"
      },
      {
        title: "Generative Engine Optimization (GEO) Integration",
        description: "Hands-on training on how to optimize brand mentions, knowledge graph schema, and documentation so AI Overviews, Perplexity, and ChatGPT cite you.",
        deliverable: "GEO Citation Readiness Playbook & Checklist"
      },
      {
        title: "Cross-Functional Content Operations & Governance",
        description: "Bridge the gap between writers, product specialists, and developers to eliminate editorial bottlenecks and establish rapid publishing cadences.",
        deliverable: "Agile Marketing Sprint Boards & Editorial Workflow SOP"
      },
      {
        title: "Commercial Intent & Conversion Path Engineering",
        description: "Aligning informational organic articles with bottom-of-funnel conversion paths, gated calculators, interactive tools, and demo funnels.",
        deliverable: "Organic Conversion Wireframes & CTAs Playbook"
      },
      {
        title: "Pipeline Attribution & Executive Reporting",
        description: "Training teams how to track assisted conversions, pipeline velocity, and commercial value rather than reporting vanity keyword rankings.",
        deliverable: "Executive Looker Studio / GA4 Growth Dashboard Template"
      }
    ],
    formats: [
      "On-Site Corporate Training (2–3 Days Hands-on Intensive)",
      "6-Week Hybrid Team Transformation Program",
      "Quarterly Skills Check-in & Live Audit Labs",
      "Custom Enterprise Curriculum Tailored to Domain"
    ],
    outcomes: [
      "Total team independence from external agency dependency",
      "Standardized SOPs, documentation, and quality control systems",
      "Accelerated publishing velocity with zero compromise on technical or content quality",
      "Shared vocabulary and strategic alignment between marketing, product, and leadership"
    ],
    ctaText: "Inquire for In-House Team Training"
  },
  {
    id: "symposium",
    badge: "Community Initiative",
    tagline: "Content Writers' Symposium (Ahmedabad & Beyond)",
    title: "Content Writers' Symposium — Live Workshops & Masterclasses",
    description: "The celebrated community initiative founded by Himani Kankaria and Missive Digital. Dedicated to upskilling writers, copywriters, and content creators through high-intensity live clinics, real-time article teardowns, hook formulation workshops, and AI adaptation strategies.",
    featuredIn: "Founded by Himani Kankaria & Missive Digital in Ahmedabad",
    whoIsItFor: [
      "Passionate Content Writers & Copywriters wanting to elevate their craft",
      "Freelancers building high-paying international client portfolios",
      "Junior & Mid-Level Agency Writers navigating AI disruption",
      "Aspiring Authors & Digital Storytellers seeking actionable feedback"
    ],
    modules: [
      {
        title: "Live Content Teardowns & Peer Clinic",
        description: "Participants submit live drafts and published pieces for real-time constructive critique on tone, clarity, sentence velocity, and audience hook.",
        deliverable: "Interactive Teardown Scorecard & Feedback Notes"
      },
      {
        title: "Crafting High-Converting Blog Introductions",
        description: "The signature symposium workshop: mastering the psychology of opening paragraphs, curiosity gaps, and setting immediate authority.",
        deliverable: "The Symposium Intro Master Guidebook"
      },
      {
        title: "Primary Research & Sourcing Without Fluff",
        description: "How to conduct primary research, interview industry leaders, extract meaningful quotes, and cite data that makes articles unignorable.",
        deliverable: "Primary Research Questionnaire & Outreach Script"
      },
      {
        title: "Navigating AI: Becoming an Unreplaceable Writer",
        description: "Strategies for integrating generative AI as an assistant while doubling down on empathy, lived experience, humor, and unique perspective.",
        deliverable: "AI Co-Pilot Workflow Matrix for Creators"
      },
      {
        title: "The Content Career & Freelance Rate Multiplier",
        description: "Practical guidance on positioning yourself as an indispensable content partner, pricing by business value, and retaining premium clients.",
        deliverable: "Freelance Proposal Template & Rate Card Calculator"
      }
    ],
    formats: [
      "Full-Day In-Person Symposium (Ahmedabad Editions)",
      "Interactive Virtual Masterclass & Breakout Workshops",
      "Curated Hands-On Writing Clinics (Cohort Style)",
      "Community Networking & Speaker Roundtables"
    ],
    outcomes: [
      "Direct, personal feedback on your writing from Himani Kankaria",
      "Actionable techniques to immediately elevate readability, flow, and conversion",
      "Lifelong access to the Content Writers' Symposium alumni network",
      "Certificate of Participation & Symposium Resource Bundle"
    ],
    ctaText: "Join the Next Writers' Symposium"
  }
];

export const coachingAreas = [
  "Content Strategy", "SEO & GEO", "LinkedIn Personal Branding", "Executive Thought Leadership",
  "Generative AI Workflows", "Team Enablement", "Conversion Architecture", "Authority Mapping",
  "B2B Inbound Systems", "Agency Operations", "Organic Analytics", "Leadership & Mindset"
];

export const coachingCapabilityMap = {
  center: "MODERN MARKETER",
  branches: [
    {
      name: "Strategic Architecture",
      items: ["Entity Mapping", "Audience Intent", "GTM Positioning", "Compounding Loops"]
    },
    {
      name: "Organic & AI Search",
      items: ["SEO Systems", "GEO Citations", "Information Gain", "Topic Authority"]
    },
    {
      name: "Executive Brand",
      items: ["LinkedIn Presence", "Ghostwriting", "Keynote Positioning", "Social Selling"]
    },
    {
      name: "Team Leadership",
      items: ["Content Ops", "Agile Sprints", "SOP Governance", "Decision Frameworks"]
    }
  ]
};

export const consultingFramework = [
  "Entity & Brand Audit",
  "Technical Crawl & Indexing Fixes",
  "Intent Architecture & Topic Clusters",
  "Information Gain Content Strategy",
  "GEO Citation & Schema Engineering",
  "Conversion Path Optimization",
  "Internal Team Enablement",
  "Compounding Organic Revenue"
];

export const consultingQuestions = [
  "Where is organic growth actually constrained in your funnel?",
  "Is your content earning unique citations in AI Search engines?",
  "How can we build an internal engine that outlives external agencies?",
  "What obsolete tactics should we eliminate to focus on pipeline impact?"
];

export const trainingFormats = [
  "In-House Corporate Workshops",
  "Executive LinkedIn Intensives",
  "Hands-on Content Writing Labs",
  "Content Writers' Symposium Editions",
  "Multi-Week Team Cohorts",
  "Live Technical Audit Clinics"
];

export const trainingJourney = [
  "AUDIT",
  "FRAMEWORK",
  "HANDS-ON LAB",
  "LIVE CLINIC",
  "MASTERY & SOPs"
];

export const trainingCourseClusters = [
  {
    name: "Intent-Led Content Strategy",
    children: ["Information Gain", "Hook Formulation", "AI Co-Piloting", "Topic Clusters"]
  },
  {
    name: "LinkedIn Executive Branding",
    children: ["Profile Architecture", "Thought Leadership", "Carousels", "Social Selling"]
  },
  {
    name: "Marketing Trainer for Teams",
    children: ["Technical SEO", "GEO Readiness", "Content Operations", "Pipeline Tracking"]
  },
  {
    name: "Content Writers' Symposium",
    children: ["Live Teardowns", "Intro Clinics", "Primary Research", "Career Scaling"]
  }
];
