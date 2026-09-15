export interface ExpertiseNode {
  id: string;
  label: string;
  description: string;
  x: number;
  y: number;
}

export const expertiseNodes: ExpertiseNode[] = [
  { id: "seo", label: "SEO", description: "Building demand, discoverability and authority across search and AI discovery.", x: 50, y: 20 },
  { id: "content", label: "Content", description: "Turning expertise into narratives, assets and distribution systems.", x: 80, y: 30 },
  { id: "social", label: "Social Media", description: "Strategic presence and distribution across social platforms.", x: 90, y: 55 },
  { id: "email", label: "Email", description: "Owned audience building and systematic email marketing.", x: 75, y: 80 },
  { id: "ai", label: "AI", description: "Integrating generative AI into practical marketing workflows.", x: 50, y: 85 },
  { id: "video", label: "Video", description: "From idea to script, generation, repurposing and distribution.", x: 25, y: 80 },
  { id: "websites", label: "Websites", description: "Using AI and modern tools to move rapidly from concept to digital experience.", x: 10, y: 55 },
  { id: "brand", label: "Brand", description: "Building recognition, trust and positioning in crowded markets.", x: 20, y: 30 },
  { id: "analytics", label: "Analytics", description: "Data-driven decision making and measurement systems.", x: 65, y: 15 },
  { id: "automation", label: "Automation", description: "Systematic marketing operations and workflow automation.", x: 35, y: 15 },
  { id: "strategy", label: "Strategy", description: "Connecting business goals to marketing execution with clarity.", x: 50, y: 50 },
  { id: "personal", label: "Personal Brand", description: "Building authority and recognition through thought leadership.", x: 35, y: 50 },
];
