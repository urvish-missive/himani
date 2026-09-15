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
    quote: "Working with Himani fundamentally changed how we approached organic growth. Instead of giving us another checklist, she helped the team build a system that compounds over time.",
    author: "Sarah Chen",
    role: "CMO",
    company: "Meridian Technologies"
  },
  {
    id: 2,
    quote: "One of the strongest marketing thinkers I've encountered. Her frameworks gave our team clarity we'd been missing for years.",
    author: "Marcus Webb",
    role: "Founder",
    company: "Catalyst Digital"
  },
  {
    id: 3,
    quote: "The rare speaker who makes the room think differently — not just nod along. Our team still references her frameworks six months later.",
    author: "Priya Kapoor",
    role: "VP Marketing",
    company: "Horizon Brands"
  },
  {
    id: 4,
    quote: "She doesn't just teach marketing — she teaches you how to think about marketing. That distinction matters more than any tactic.",
    author: "James Thornton",
    role: "Head of Growth",
    company: "Nexus Ventures"
  },
  {
    id: 5,
    quote: "Our team's capability transformed in weeks, not months. The training was practical, challenging and immediately applicable.",
    author: "Elena Vasquez",
    role: "Director of Marketing",
    company: "Aether Corp"
  }
];
