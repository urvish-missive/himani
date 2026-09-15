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
    category: "Organic Growth",
    headline: "From Paid Dependency to Organic Engine",
    challenge: "Brand relied heavily on paid acquisition with unsustainable CAC and no organic compounding.",
    approach: "SEO + content system + topic authority + distribution flywheel.",
    impact: [
      { value: "+340%", label: "Organic visibility" },
      { value: "47", label: "Priority topics ranking" },
      { value: "3.2×", label: "Organic contribution" }
    ],
    image: "/placeholder-case-1.jpg"
  },
  {
    id: 2,
    number: "02",
    category: "Team Capability",
    headline: "Building a Marketing Team That Thinks in Systems",
    challenge: "Marketing team executing channels in silos with no shared strategic framework.",
    approach: "Capability assessment + strategic framework training + operating system implementation.",
    impact: [
      { value: "60%", label: "Faster execution" },
      { value: "2.5×", label: "Content output quality" },
      { value: "85%", label: "Team satisfaction" }
    ],
    image: "/placeholder-case-2.jpg"
  },
  {
    id: 3,
    number: "03",
    category: "AI Transformation",
    headline: "Integrating AI Into Marketing Workflows",
    challenge: "Team aware of AI but unsure how to integrate it practically into daily marketing operations.",
    approach: "AI audit + workflow mapping + training + implementation support.",
    impact: [
      { value: "4hrs/week", label: "Time saved per person" },
      { value: "3×", label: "Content production" },
      { value: "70%", label: "Workflow efficiency" }
    ],
    image: "/placeholder-case-3.jpg"
  },
  {
    id: 4,
    number: "04",
    category: "Content & SEO Strategy",
    headline: "Turning Expertise Into a Content Machine",
    challenge: "Strong domain expertise but poor content strategy and search performance.",
    approach: "Topic authority mapping + content system + technical SEO + distribution strategy.",
    impact: [
      { value: "+520%", label: "Organic traffic" },
      { value: "38", label: "Featured snippets" },
      { value: "12%", label: "Conversion rate" }
    ],
    image: "/placeholder-case-4.jpg"
  }
];
