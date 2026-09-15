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
    headline: "Strategy for teams that have outgrown random acts of marketing.",
    description: "I work with founders, CMOs and marketing teams to diagnose growth problems, identify leverage points and design practical systems across organic growth, content, SEO, AI, brand and digital acquisition.",
    topics: [
      "Marketing Strategy", "SEO Strategy", "Content Strategy", "Organic Growth",
      "AI Transformation", "Marketing Systems", "Growth Audits", "Digital Positioning",
      "Website Strategy", "Team Capability Building"
    ],
    metrics: [
      { value: "60+", label: "Engagements" },
      { value: "40+", label: "Industries" },
      { value: "3×", label: "Avg. ROI" }
    ],
    cta: "Discuss a Consulting Engagement"
  },
  {
    id: "coaching",
    number: "02",
    label: "COACHING",
    headline: "Become the marketer people come to for answers.",
    description: "One-to-one and small-group coaching designed for marketers, founders and marketing leaders who want stronger strategic thinking — not another list of tactics.",
    topics: [
      "Content Strategy", "SEO", "Social Media Strategy", "Email Marketing",
      "Personal Branding", "AI Marketing", "Video Generation", "AI Content Workflows",
      "Website Generation", "Marketing Automation", "Growth Strategy", "Analytics", "Team Leadership"
    ],
    metrics: [
      { value: "500+", label: "Coaching Hours" },
      { value: "80+", label: "Active Clients" },
      { value: "95%", label: "Satisfaction Rate" }
    ],
    cta: "Explore Coaching"
  },
  {
    id: "training",
    number: "03",
    label: "TRAINING",
    headline: "Turn marketing knowledge into organizational capability.",
    description: "Practical training programs for marketing teams and professionals designed around real workflows, frameworks, exercises and implementation — not passive presentations.",
    topics: [
      "SEO", "Content Marketing", "Social Media", "Email Marketing",
      "AI for Marketing", "Generative AI", "AI Video Creation", "AI Website Generation",
      "Marketing Automation", "Personal Branding", "Content Distribution", "Analytics"
    ],
    metrics: [
      { value: "120+", label: "Workshops" },
      { value: "15+", label: "Formats" },
      { value: "4.9", label: "Avg. Rating" }
    ],
    cta: "Explore Training Programs"
  },
  {
    id: "speaking",
    number: "04",
    label: "SPEAKING",
    headline: "Ideas built for the stage — and the Monday after.",
    description: "I speak about modern marketing, organic growth, AI, content, search, brand building and the changing role of marketers. Sessions combine strategic thinking, practical frameworks, real-world examples and perspectives teams can immediately discuss and apply.",
    topics: [
      "The Future of Search in an AI-First World",
      "Building Organic Growth Engines",
      "Marketing in the Age of Generative AI",
      "How AI Changes Content Strategy",
      "From Traffic to Brand Demand",
      "Modern SEO Beyond Rankings",
      "Building High-Performance Marketing Teams",
      "AI-Powered Marketing Workflows"
    ],
    metrics: [
      { value: "85+", label: "Talks Delivered" },
      { value: "12", label: "Countries" },
      { value: "15K+", label: "Attendees Reached" }
    ],
    cta: "Invite Me to Speak"
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
