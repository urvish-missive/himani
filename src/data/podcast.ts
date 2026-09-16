export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  type: 'Podcast' | 'Webinar' | 'Talks';
  date: string;
  duration: string;
  youtubeId: string;
  guests?: string;
}

export const podcastEpisodes: PodcastEpisode[] = [
  {
    id: 'seo-content-age-of-ai',
    title: 'SEO & Content in the Age of AI (2026)',
    description:
      'A live webinar with Himani Kankaria covering how generative search, AI Overviews, and answer engines are reshaping SEO and content strategy — and how brands re-architect for compound, AI-era organic growth.',
    type: 'Webinar',
    date: '2026-02-15',
    duration: 'Live Webinar',
    youtubeId: 'KrYbbV1BLmI',
  },
  {
    id: 'seo-for-msme-radical-talks',
    title: 'SEO for MSME | Tips from India\u2019s Top SEO Expert',
    description:
      'Himani Kankaria joins Raj Kanabar on Radical Talks to share practical, high-impact SEO tips for MSMEs — from ranking fundamentals to winning local visibility on a real budget.',
    type: 'Podcast',
    date: '2025-11-12',
    duration: 'Radical Talks',
    youtubeId: 'QqZDlxYIvXE',
    guests: 'Raj Kanabar',
  },
  {
    id: 'college-to-ceo-seo-journey',
    title: 'From College to CEO: Himani Kankaria\u2019s Incredible SEO Journey',
    description:
      'An honest, behind-the-scenes conversation about starting in organic search straight out of college, building teams, founding Missive Digital, and becoming a globally booked SEO speaker.',
    type: 'Podcast',
    date: '2025-09-08',
    duration: 'Interview',
    youtubeId: 'qIh2GQpMKC0',
  },
  {
    id: 'organic-content-bard-sge',
    title: 'Where is Organic Content Headed with BARD & SGE?',
    description:
      'Recorded when AI search first went mainstream — Himani breaks down what BARD and Search Generative Experience mean for content teams, and how to future-proof organic strategy.',
    type: 'Podcast',
    date: '2024-03-20',
    duration: '#TwSEOs 62',
    youtubeId: 'rMqPMgSctYs',
  },
  {
    id: 'truth-about-ai-seo-content',
    title: 'The Truth About AI SEO and Content No One Tells You',
    description:
      'Himani Kankaria on LP001 with Het Balar — a no-BS episode on AI-generated content, what actually still ranks, and the workflow modern SEO teams should be running.',
    type: 'Podcast',
    date: '2025-05-30',
    duration: 'LP001',
    youtubeId: 'cS0zYG88SCU',
    guests: 'Het Balar',
  },
  {
    id: 'featured-snippets-optimization',
    title: 'Content Optimization & Featured Snippets',
    description:
      'A deep-dive episode on winning featured snippets and answer boxes — the research, structure, and formatting decisions that turn ordinary content into the cited answer.',
    type: 'Podcast',
    date: '2023-07-14',
    duration: 'SEO Talk',
    youtubeId: 'rbeWMmSzOLM',
  },
];

export const podcastTags = ['All', 'Podcast', 'Webinar', 'Talks'];