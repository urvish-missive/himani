import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Container from '../components/ui/Container';
import Reveal from '../components/ui/Reveal';
import CTAButton from '../components/ui/CTAButton';
import { testimonials } from '../data/testimonials';
import { speakingEngagements } from '../data/speaking';
import aboutPortrait from '../images/Himani-Kankaria4-684x1024.jpg';
import candidPhoto from '../images/Himani-.jpg';

const timeline = [
  { year: '2008', event: 'Started in Organic Search & Content' },
  { year: '2012', event: 'Built & Led High-Performing Marketing Teams' },
  { year: '2016', event: 'Advised Global SaaS & E-Commerce Brands' },
  { year: '2020', event: 'Founded Missive Digital Agency' },
  { year: '2022', event: 'BrightonSEO & Global Conference Stages' },
  { year: '2024+', event: 'Pioneered AI Search (GEO) & Citation Architecture' },
];

const principles = [
  {
    title: 'Audit before advice',
    description: "I don't hand over a strategy deck before I've seen the crawl logs, the search console data, and the content that's actually ranking — or not.",
  },
  {
    title: 'Systems over hacks',
    description: "A ranking tactic that stops working the next update isn't a strategy. I build for compounding, not for this quarter's traffic report.",
  },
  {
    title: 'Written to be cited, not just read',
    description: 'AI Overviews and chat answers now sit between your content and the reader. I structure entities and content so both people and models can find it.',
  },
  {
    title: 'Teach the team, not just the deck',
    description: 'Every engagement includes handoff — the frameworks and reasoning, not just a slide with recommendations nobody owns after I leave.',
  },
];

const featuredEngagements = speakingEngagements
  .filter((e, i, arr) => arr.findIndex((x) => x.conference === e.conference) === i)
  .slice(0, 3);
const pullQuote = testimonials[0];

export default function AboutPage() {
  const timelineRef = useRef(null);
  const timelineInView = useInView(timelineRef, { once: true, margin: '-30px 0px' });

  return (
    <main>
      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-bg-alt/40 to-purple/5 overflow-hidden">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
            <Reveal delay={0.15} direction="left" className="order-1 lg:order-2">
              <div className="relative max-w-sm mx-auto lg:h-full lg:max-w-md">
                <div className="absolute -inset-1 bg-gradient-to-br from-purple to-orange rounded-2xl opacity-50" />
                <div className="relative aspect-[3/4] lg:aspect-auto lg:h-full rounded-2xl overflow-hidden bg-bg-alt">
                  <img
                    src={aboutPortrait}
                    alt="Himani Kankaria, Founder of Missive Digital"
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
                <div className="absolute -inset-6 bg-gradient-to-br from-purple/15 to-orange/15 rounded-3xl blur-2xl -z-10" />

                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-2 sm:-left-5 md:-left-8 bg-white rounded-2xl shadow-lg shadow-purple/10 border border-purple/10 px-5 py-4">
                  <p className="text-2xl font-bold gradient-text leading-none">15+</p>
                  <p className="text-[11px] text-secondary/70 uppercase tracking-wider mt-1">Years in Search</p>
                </div>
              </div>
            </Reveal>

            <div className="order-2 lg:order-1 flex flex-col">
              <Reveal>
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple mb-4">
                  About
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.1] text-primary mb-6">
                  15 years in search.<br />
                  <span className="gradient-text">Still learning in public.</span>
                </h1>
              </Reveal>
              <div className="space-y-4 max-w-lg mb-8">
                <Reveal delay={0.15}>
                  <p className="text-base text-secondary leading-relaxed">
                    I started in organic search and content back in 2008, when SEO still meant keyword density and blog comments. Since then I've built and led marketing teams, advised B2B SaaS, tech, and e-commerce brands on organic strategy, and founded Missive Digital to focus on what I actually care about: search systems that keep compounding instead of resetting with every algorithm update.
                  </p>
                </Reveal>
                <Reveal delay={0.2}>
                  <p className="text-base text-secondary leading-relaxed">
                    My work today sits at the intersection of technical SEO, Generative Engine Optimization (GEO), and intent-led content — auditing why a site isn't ranking or getting cited, then rebuilding the architecture underneath it.
                  </p>
                </Reveal>
                <Reveal delay={0.25}>
                  <p className="text-base text-secondary leading-relaxed">
                    Outside client work, I write for Search Engine Journal and Search Engine Land, and speak at events like BrightonSEO, the International Search Summit, and WordCamp — usually about the same thing: why re-architecting beats optimizing.
                  </p>
                </Reveal>
              </div>
              <Reveal delay={0.3}>
                <div className="flex flex-wrap gap-4 mt-auto">
                  <CTAButton href="/#contact" size="lg">Work With Me</CTAButton>
                  <CTAButton href="/#services" variant="secondary" size="lg">See the Programs</CTAButton>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Timeline */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-bg-alt/50 to-purple/5">
        <Container narrow>
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-orange mb-4 text-center">
              The Path So Far
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-serif text-3xl md:text-4xl leading-[1.15] text-primary mb-16 text-center">
              Sixteen years, one thread.
            </h2>
          </Reveal>

          <div ref={timelineRef} className="relative max-w-xl mx-auto">
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: 20 }}
                animate={timelineInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
                className="relative pl-12 pb-10 last:pb-0"
              >
                {i < timeline.length - 1 && (
                  <div className="absolute left-[9px] top-5 w-0.5 h-full bg-gradient-to-b from-purple/30 to-orange/30" />
                )}
                <div className="absolute left-0 top-1 w-5 h-5 rounded-full bg-gradient-to-br from-purple to-orange shadow-md ring-4 ring-bg" />

                <span className="text-xs font-semibold tracking-wider text-orange">
                  {item.year}
                </span>
                <p className="text-base font-medium text-primary mt-1">
                  {item.event}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Principles */}
      <section className="py-20 md:py-28 bg-bg">
        <Container>
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple mb-4 text-center">
              How I Work
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-serif text-3xl md:text-4xl leading-[1.15] text-primary mb-16 text-center">
              Four things I won't skip.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {principles.map((principle, i) => (
              <Reveal key={principle.title} delay={i * 0.08}>
                <div className="h-full p-6 sm:p-8 rounded-2xl border border-purple/10 bg-white/70 backdrop-blur-sm hover:border-purple/25 hover:bg-white transition-all duration-300">
                  <span className="block text-2xl font-serif gradient-text mb-3">0{i + 1}</span>
                  <h3 className="text-lg font-semibold text-primary mb-2">{principle.title}</h3>
                  <p className="text-sm text-secondary leading-relaxed">{principle.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Recognition */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-purple/5 via-bg to-orange/5">
        <Container narrow>
          <div className="max-w-2xl mx-auto text-center">
            <Reveal>
              <svg className="w-8 h-8 text-purple/30 mx-auto mb-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
              </svg>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="font-serif text-xl md:text-2xl text-primary leading-relaxed mb-6">
                "{pullQuote.quote}"
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-sm text-secondary">
                <span className="font-semibold text-primary">{pullQuote.author}</span> · {pullQuote.role}, {pullQuote.company}
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-12 pt-12 border-t border-purple/10">
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-orange/60 mb-6">
                  On Stage
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {featuredEngagements.map((e) => (
                    <span
                      key={e.id}
                      className="text-xs font-medium px-4 py-2 rounded-full border border-purple/15 text-secondary bg-white/60"
                    >
                      {e.conference} · {e.year}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Beyond the client work */}
      <section className="py-20 md:py-28 bg-bg">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <Reveal direction="right">
              <div className="relative max-w-sm">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-bg-alt image-frame">
                  <img
                    src={candidPhoto}
                    alt="Himani Kankaria"
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
              </div>
            </Reveal>
            <div>
              <Reveal>
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple mb-4">
                  Off The Clock
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="font-serif text-3xl md:text-4xl leading-[1.15] text-primary mb-6">
                  Still the same person who started with a blog and a curiosity problem.
                </h2>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="text-base text-secondary leading-relaxed">
                  Sixteen years in, the tools have changed — crawlers, AI Overviews, citation graphs — but the job hasn't: figure out what's actually true about how people (and now models) find information, then build for it. That's still what gets me to the desk every morning.
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Closing CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-dark via-dark-card to-dark text-center">
        <Container narrow>
          <Reveal>
            <h2 className="font-serif text-3xl md:text-4xl leading-[1.15] text-white mb-6">
              Have a search or AI-visibility problem worth re-architecting?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-wrap justify-center gap-4">
              <CTAButton href="/#contact" size="lg">Work With Me</CTAButton>
              <CTAButton href="/#services" variant="secondary" size="lg">Explore the Engagement Models</CTAButton>
            </div>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}
