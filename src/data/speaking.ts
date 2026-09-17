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
    conference: "International Search Summit",
    location: "Barcelona",
    country: "Spain",
    topic: "International SEO",
    year: "2025",
    description: "Her biggest 2025 milestone — keynote to 800+ global SEO professionals at the International Search Summit."
  },
  {
    id: 2,
    conference: "WordCamp Asia",
    location: "",
    country: "Asia",
    topic: "AI Panel: Restructuring Marketing Methods",
    year: "2026",
    description: "Panelist on \"How AI is Restructuring Traditional and Modern Marketing Methods\" (April 10, 2026)."
  },
  {
    id: 3,
    conference: "Agile Network India",
    location: "Virtual",
    country: "India",
    topic: "Designing the Next Decade",
    year: "2026",
    description: "Panelist on \"Designing the Next Decade: The Decisions That Will Make the Next Market Leaders\" (August 2026)."
  },
  {
    id: 4,
    conference: "eChai Ventures Ahmedabad Startup Day",
    location: "Ahmedabad",
    country: "India",
    topic: "AI Panel",
    year: "2026",
    description: "AI panel alongside Rushabh Shah and Abhishek Yagnik (June 2026)."
  },
  {
    id: 5,
    conference: "WordCamp Nagpur",
    location: "Nagpur",
    country: "India",
    topic: "Humanizing AI Content",
    year: "2024",
    description: "Session on AI content that still engages and ranks — humanizing content in an AI-first era."
  },
  {
    id: 6,
    conference: "BrightonSEO",
    location: "Brighton",
    country: "UK",
    topic: "Remote Session",
    year: "2021",
    description: "Delivered a session online after two UK visa setbacks during COVID — still working toward the physical stage."
  }
];

export const alsoFeaturedAt = [
  "Whitespark Local Search Summit",
  "Meet Magento",
  "Semrush Events",
  "Click Asia Summit",
  "Crawling Mondays (with Aleyda Solís & Shelley Walsh)"
];

export const speakingTestimonial = {
  quote: "Himani is one of the best SEO savvy copywriters and strategists I have had the opportunity to collaborate with! Her insights completely reframe how teams approach modern search.",
  author: "Aleyda Solis",
  event: "International SEO Consultant & Founder, Orainti"
};
