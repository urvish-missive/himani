import { useEffect, useRef, useState } from 'react';
import Container from './ui/Container';
import Reveal from './ui/Reveal';

import img2008 from '../images/himanimain.jpg';
import img2012 from '../images/himanimarketing.jpg';
import img2016 from '../images/himanimainsection.jpg';
import img2020 from '../images/himani.jpg';
import img2022 from '../images/hiimanisasspeaker.jpg';
import img2024 from '../images/himanispeaker.jpg';

interface Chapter {
  year: string;
  label: string;
  headline: string;
  description: string;
  stats: { label: string; value: string }[];
  image: string;
  imagePosition: string;
}

const chapters: Chapter[] = [
  {
    year: '2017',
    label: 'Where It Started',
    headline: 'Digital marketing, one campaign at a time',
    description: "I started as a Digital Marketing Strategist at RadixWeb — running inbound and content marketing, optimizing organic traffic and lead flow, and managing Google Ads and AdRoll campaigns, tracked through GA, GSC, SpyFu, and Moz.",
    stats: [
      { label: 'Role', value: 'Digital Marketing Strategist' },
      { label: 'Company', value: 'RadixWeb' },
      { label: 'Focus', value: 'Inbound & Paid' },
    ],
    image: img2008,
    imagePosition: 'top',
  },
  {
    year: '2018',
    label: 'The Founding Story',
    headline: 'Founding Missive Digital: The Organic Growth Agency',
    description: "Frustrated by agency models focused on short-lived ranking hacks and vanity metrics, I founded Missive Digital to serve as the true marketing thinkers and business strategists for B2B, SaaS, and Tech companies. I built the agency around data-driven integrated strategies, deep research, and search-intent-focused content that compound into sustainable pipeline — scaling brands from high-growth startups to unicorns with over 800% traffic growth and 200% lead growth YoY.",
    stats: [
      { label: 'Agency', value: 'Missive Digital' },
      { label: 'Specialization', value: 'B2B, SaaS & Tech' },
      { label: 'Proven Impact', value: '>800% Traffic · 200% Leads' },
    ],
    image: img2012,
    imagePosition: 'top',
  },
  {
    year: '2018–2023',
    label: 'A Recognized Voice',
    headline: 'Brand Ambassador for Hootsuite',
    description: "Alongside building Missive Digital, I spent five years as a Hootsuite Brand Ambassador — plus brand endorsement and corporate training work with Semrush, SEWA Federation, and WPCouchCon.",
    stats: [
      { label: 'Role', value: 'Brand Ambassador' },
      { label: 'Partner', value: 'Hootsuite' },
      { label: 'Duration', value: '2018–2023' },
    ],
    image: img2016,
    imagePosition: 'top',
  },
  {
    year: '2021',
    label: 'Publishing at Scale',
    headline: 'Becoming a regular Search Engine Journal contributor',
    description: "Starting in 2021, I began publishing regularly with Search Engine Journal and Search Engine Land — one piece was later named among SEJ's 12 best contributions of the year, a career highlight.",
    stats: [
      { label: 'Outlet', value: 'Search Engine Journal' },
      { label: 'Also', value: 'Search Engine Land' },
      { label: 'Recognition', value: "SEJ's Top 12" },
    ],
    image: img2020,
    imagePosition: 'top',
  },
  {
    year: '2024–2025',
    label: 'Global Stages',
    headline: 'From WordCamp Nagpur to Barcelona',
    description: "2024 brought a session on humanizing AI content at WordCamp Nagpur and founding membership in the Content Writers' Symposium. 2025 brought my biggest milestone yet: keynoting the International Search Summit in Barcelona to 800+ global SEO professionals.",
    stats: [
      { label: '2024', value: 'WordCamp Nagpur' },
      { label: '2024', value: "Content Writers' Symposium" },
      { label: '2025', value: 'ISS Barcelona' },
    ],
    image: img2022,
    imagePosition: 'center',
  },
  {
    year: '2026',
    label: 'The AI Era, On Stage',
    headline: 'Panels on AI, growth, and what comes next',
    description: "This year I've spoken on AI's impact on marketing at WordCamp Asia, joined an AI panel at eChai Ventures' Ahmedabad Startup Day, and discussed the next decade of market leadership at Agile Network India.",
    stats: [
      { label: 'WordCamp Asia', value: 'AI Panel' },
      { label: 'eChai Ventures', value: 'AI Panel' },
      { label: 'Agile Network India', value: 'Panel' },
    ],
    image: img2024,
    imagePosition: 'center 30%',
  },
];

function ChapterBadgeOverlay({ chapter }: { chapter: Chapter }) {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(26,16,40,0.05) 0%, rgba(26,16,40,0.6) 100%)' }}
      />
      <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-dark/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
        {chapter.year} · {chapter.label}
      </div>
      <div
        className="absolute inset-x-5 bottom-4 font-serif text-white"
        style={{ fontSize: 'clamp(1.85rem, 6vw, 2.6rem)', lineHeight: 1 }}
      >
        {chapter.year}
      </div>
    </>
  );
}

export default function AboutStory() {
  const [activeIndex, setActiveIndex] = useState(0);
  const chapterRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = chapterRefs.current.findIndex((el) => el === entry.target);
          if (idx !== -1) setActiveIndex(idx);
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    chapterRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-bg-alt/50 to-purple/5">
      <Container>
        <div className="text-center mb-8 md:mb-10">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-orange mb-3">
              The Path So Far
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.15] text-primary mb-4">
              Eight years, one thread.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-base text-secondary max-w-xl mx-auto">
              From RadixWeb to global stages — six chapters building Missive Digital and a career in search.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-8 xl:grid-cols-2 xl:gap-16">
          {/* Sticky visual — desktop only */}
          <aside className="hidden xl:block">
            <div className="sticky top-0 flex h-screen flex-col items-stretch justify-center py-6">
              <div className="relative mx-auto w-full max-w-[480px]">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px] border border-purple/10 bg-bg-alt shadow-[0_28px_62px_-28px_rgba(26,16,40,0.35)]">
                  {chapters.map((chapter, i) => (
                    <img
                      key={chapter.year}
                      src={chapter.image}
                      alt={chapter.headline}
                      className="absolute inset-0 w-full h-full object-cover transition-[opacity,transform] duration-[900ms] ease-out"
                      style={{
                        objectPosition: chapter.imagePosition,
                        opacity: activeIndex === i ? 1 : 0,
                        transform: activeIndex === i ? 'scale(1)' : 'scale(1.06)',
                      }}
                    />
                  ))}
                  <ChapterBadgeOverlay chapter={chapters[activeIndex]} />
                </div>
              </div>
            </div>
          </aside>

          {/* Chapters */}
          <ol className="flex flex-col">
            {chapters.map((chapter, i) => (
              <li
                key={chapter.year}
                ref={(el) => { chapterRefs.current[i] = el; }}
                className="relative flex flex-col justify-center py-8 xl:min-h-[80vh] xl:py-12"
              >
                {/* Mobile / tablet inline image */}
                <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-2xl bg-bg-alt xl:hidden">
                  <img
                    src={chapter.image}
                    alt={chapter.headline}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectPosition: chapter.imagePosition }}
                    loading="lazy"
                  />
                  <ChapterBadgeOverlay chapter={chapter} />
                </div>

                <Reveal>
                  <span className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-orange">
                    Chapter {String(i + 1).padStart(2, '0')} · {chapter.label}
                  </span>
                  <h3 className="mt-2.5 font-serif text-2xl md:text-3xl leading-[1.2] text-primary">
                    {chapter.headline}
                  </h3>
                  <p className="mt-3 max-w-xl text-base text-secondary leading-relaxed">
                    {chapter.description}
                  </p>
                  <dl className="mt-5 grid max-w-xl grid-cols-1 sm:grid-cols-3 gap-px overflow-hidden rounded-2xl border border-purple/10 bg-purple/10">
                    {chapter.stats.map((stat) => (
                      <div key={stat.label} className="bg-white px-4 py-3">
                        <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary/50">
                          {stat.label}
                        </dt>
                        <dd className="mt-1 text-sm font-semibold text-primary">{stat.value}</dd>
                      </div>
                    ))}
                  </dl>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
