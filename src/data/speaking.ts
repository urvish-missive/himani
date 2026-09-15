export interface SpeakingEngagement {
  id: number;
  conference: string;
  location: string;
  country: string;
  topic: string;
  year: string;
  description?: string;
}

export const speakingEngagements: SpeakingEngagement[] = [
  {
    id: 1,
    conference: "Global Marketing Summit",
    location: "Singapore",
    country: "Singapore",
    topic: "AI & Marketing",
    year: "2026",
    description: "Keynote on integrating AI into modern marketing workflows"
  },
  {
    id: 2,
    conference: "Future of Search Conference",
    location: "Dubai",
    country: "UAE",
    topic: "Future of Search",
    year: "2025",
    description: "Exploring how AI is reshaping search and discovery"
  },
  {
    id: 3,
    conference: "Content Marketing World",
    location: "London",
    country: "UK",
    topic: "Organic Growth",
    year: "2025",
    description: "Building organic growth engines that compound"
  },
  {
    id: 4,
    conference: "SEMrush Convention",
    location: "Barcelona",
    country: "Spain",
    topic: "Modern SEO",
    year: "2024",
    description: "SEO beyond rankings — building brand demand"
  },
  {
    id: 5,
    conference: "MarTech Conference",
    location: "San Francisco",
    country: "USA",
    topic: "Marketing Systems",
    year: "2024",
    description: "Building systematic marketing operations"
  }
];

export const speakingTestimonial = {
  quote: "One of the rare sessions that changed how our team thinks about search.",
  author: "Conference Attendee",
  event: "Global Marketing Summit 2025"
};
