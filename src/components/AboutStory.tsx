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
    year: '2008',
    label: 'The Beginning',
    headline: 'Organic search, before it had a name',
    description: "I started in organic search and content back in 2008, when SEO still meant keyword density and blog comments — long before brands treated organic as a serious channel.",
    stats: [
      { label: 'Focus', value: 'SEO & Content' },
      { label: 'Format', value: 'On-Page & Blogging' },
      { label: 'Mindset', value: 'Learn By Doing' },
    ],
    image: img2008,
    imagePosition: 'top',
  },
  {
    year: '2012',
    label: 'Building Teams',
    headline: 'From individual contributor to team lead',
    description: "I moved from doing the work myself to building and leading marketing teams — the first time I had to turn what worked for me into something a whole team could repeat.",
    stats: [
      { label: 'Role', value: 'Team Lead' },
      { label: 'Focus', value: 'Process & Training' },
      { label: 'Shift', value: 'IC to Manager' },
    ],
    image: img2012,
    imagePosition: 'top',
  },
  {
    year: '2016',
    label: 'Advising Brands',
    headline: 'B2B SaaS and e-commerce, at scale',
    description: "I started advising global SaaS and e-commerce brands directly on organic strategy — auditing what was broken, then rebuilding the technical and content foundations underneath it.",
    stats: [
      { label: 'Clients', value: 'SaaS & E-Commerce' },
      { label: 'Scope', value: 'Technical + Content' },
      { label: 'Model', value: 'Advisory' },
    ],
    image: img2016,
    imagePosition: 'top',
  },
  {
    year: '2020',
    label: 'Founding Missive Digital',
    headline: 'Missive Digital becomes its own thing',
    description: "I founded Missive Digital to focus on exactly what I cared about: search systems that compound, instead of tactics that reset with every algorithm update.",
    stats: [
      { label: 'Founded', value: 'Missive Digital' },
      { label: 'Focus', value: 'Compounding Systems' },
      { label: 'Model', value: 'Agency' },
    ],
    image: img2020,
    imagePosition: 'top',
  },
  {
    year: '2022',
    label: 'Global Stages',
    headline: 'BrightonSEO and the international circuit',
    description: "I took the same frameworks I use with clients onto international stages — BrightonSEO, the International Search Summit, and WordCamp — turning client work into public frameworks.",
    stats: [
      { label: 'Stages', value: 'BrightonSEO · ISS' },
      { label: 'Format', value: 'Keynotes & Workshops' },
      { label: 'Reach', value: 'International' },
    ],
    image: img2022,
    imagePosition: 'center',
  },
  {
    year: '2024+',
    label: 'The AI Search Era',
    headline: 'Re-architecting for AI search',
    description: "Now I focus on Generative Engine Optimization and Citation Architecture — making sure brands get found and cited inside AI Overviews and chat answers, not just blue links.",
    stats: [
      { label: 'Focus', value: 'GEO & Citations' },
      { label: 'Era', value: 'AI-First Search' },
      { label: 'Status', value: 'Ongoing' },
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
    <section className="py-20 md:py-28 bg-gradient-to-br from-bg-alt/50 to-purple/5">
      <Container>
        <div className="text-center mb-14 md:mb-16">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-orange mb-4">
              The Path So Far
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.15] text-primary mb-5">
              Sixteen years, one thread.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-base text-secondary max-w-xl mx-auto">
              From a blog and a curiosity problem to re-architecting how brands get found by AI. Six chapters, one throughline.
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
