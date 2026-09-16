export interface CaseStudy {
  id: number;
  number: string;
  category: string;
  headline: string;
  challenge: string;
  approach: string;
  impact: { value: string; label: string }[];
  image: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: 1,
    number: "01",
    category: "B2B SaaS Growth",
    headline: "4.15× Organic Growth in 6.5 Months for B2B SaaS",
    challenge: "Hyper-competitive SaaS category facing AI Search disruption, high CAC, and low organic inbound pipeline.",
    approach: "Intent-led keyword mapping + Citation Architecture Framework (CAF) + commercial landing page re-architecture.",
    impact: [
      { value: "4.15×", label: "Organic traffic surge" },
      { value: "+100%", label: "Inbound leads doubled" },
      { value: "6.5 Mo", label: "Turnaround timeline" }
    ],
    image: "/placeholder-case-1.jpg"
  },
  {
    id: 2,
    number: "02",
    category: "Enterprise & Telecom",
    headline: "500% Increase in MQLs & 100% Boost in SQLs",
    challenge: "Complex legacy website structure with severe crawlability issues, high bounce rate, and disconnected buyer journeys.",
    approach: "Complete technical SEO overhaul + entity schema architecture + commercial UX and conversion redesign.",
    impact: [
      { value: "+500%", label: "Marketing Qualified Leads" },
      { value: "+100%", label: "Sales Qualified Leads" },
      { value: "+50%", label: "Organic traffic boost" }
    ],
    image: "/placeholder-case-2.jpg"
  },
  {
    id: 3,
    number: "03",
    category: "E-Commerce SEO",
    headline: "Penalty Recovery to £57K Monthly Organic Revenue",
    challenge: "UK brand suffered heavy ranking drops from algorithmic penalties and severe product cannibalization.",
    approach: "Comprehensive penalty audit + catalog re-architecture + commercial intent realignment + crawl budget optimization.",
    impact: [
      { value: "£57K/mo", label: "Organic revenue reached" },
      { value: "+50%", label: "Organic click recovery" },
      { value: "Top 3", label: "Commercial rankings" }
    ],
    image: "/placeholder-case-3.jpg"
  },
  {
    id: 4,
    number: "04",
    category: "Travel & Discovery",
    headline: "1,078% Organic Growth & 3,062% User Surge",
    challenge: "Low visibility against massive booking aggregators and lack of localized commercial topical authority.",
    approach: "Topic cluster authority mapping + intent-first travel hubs + localized E-E-A-T author signals and schema.",
    impact: [
      { value: "+1,078%", label: "Organic traffic growth" },
      { value: "+3,062%", label: "New organic users" },
      { value: "10+ Countries", label: "Global audience reach" }
    ],
    image: "/placeholder-case-4.jpg"
  }
];

