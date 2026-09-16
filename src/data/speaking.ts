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
    conference: "BrightonSEO",
    location: "Brighton",
    country: "UK",
    topic: "Organic Re-Architecture",
    year: "2024",
    description: "Unlocking hidden organic value and re-architecting search visibility"
  },
  {
    id: 2,
    conference: "International Search Summit",
    location: "Barcelona",
    country: "Spain",
    topic: "International SEO",
    year: "2024",
    description: "Scaling organic search systems across global markets and multi-lingual queries"
  },
  {
    id: 3,
    conference: "BrightonSEO",
    location: "Brighton",
    country: "UK",
    topic: "Remarketing SEO",
    year: "2022",
    description: "Pioneering the Remarketing SEO framework for compounding organic traffic"
  },
  {
    id: 4,
    conference: "WordCamp",
    location: "Nagpur",
    country: "India",
    topic: "Intent-First Content",
    year: "2024",
    description: "Structuring content frameworks to capture real commercial user intent"
  },
  {
    id: 5,
    conference: "SE Ranking Industry Spotlight",
    location: "Global Virtual",
    country: "Global",
    topic: "GEO & AI Citations",
    year: "2025",
    description: "Generative Engine Optimization and getting cited in AI Overviews & ChatGPT"
  },
  {
    id: 6,
    conference: "Whitespark Local Search Summit",
    location: "Global Virtual",
    country: "USA / Global",
    topic: "Intent & Entity Mapping",
    year: "2023",
    description: "Entity optimization and local search visibility for high-intent queries"
  }
];

export const speakingTestimonial = {
  quote: "Himani is one of the best SEO savvy copywriters and strategists I have had the opportunity to collaborate with! Her insights completely reframe how teams approach modern search.",
  author: "Aleyda Solis",
  event: "International SEO Consultant & Founder, Orainti"
};

