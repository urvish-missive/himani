import Container from '../components/ui/Container';
import Reveal from '../components/ui/Reveal';
import CTAButton from '../components/ui/CTAButton';
import ScrollRevealWords from '../components/ui/ScrollRevealWords';
import AboutStory from '../components/AboutStory';
import { testimonials } from '../data/testimonials';
import { speakingEngagements, alsoFeaturedAt } from '../data/speaking';
import aboutPortrait from '../images/Himani-Kankaria4-684x1024.jpg';
import candidPhoto from '../images/Himani-.jpg';

function LinkedinIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.22 8.98h4.56V23H.22V8.98zM8.98 8.98h4.38v1.92h.06c.61-1.16 2.1-2.38 4.32-2.38 4.62 0 5.47 3.04 5.47 6.99V23h-4.56v-6.7c0-1.6-.03-3.66-2.23-3.66-2.23 0-2.57 1.74-2.57 3.54V23H8.98V8.98z" />
    </svg>
  );
}

const linkedinThoughts = [
  {
    title: 'Stop the AEO/GEO content spam',
    body: "LinkedIn Pulse traffic peaked around March 2024 and has declined since (Foundation Marketing), even as Semrush puts LinkedIn as the 2nd-most-cited site by AI tools (11.03%, Jan 2026). Citation stats don't justify dumping valueless content — write from first-hand experience, original data, and real client stories.",
  },
  {
    title: 'Human intelligence is the most expensive thing going forward.',
    body: 'On customer psychology, handwritten letters, faces in social posts, and the conference boom — proof that people still want people.',
  },
  {
    title: 'Dear AI, what an influence.',
    body: 'On blind trust in AI for vendor selection, medical self-diagnosis, legal work, and startup validation. "You are not the problem; the blind trust is."',
  },
  {
    title: "Two visa rejections didn't stop the talk.",
    body: 'A resilience post about delivering a BrightonSEO session online after two UK visa setbacks during COVID — still working toward the physical stage.',
  },
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
const pullQuote = testimonials[2];

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="pt-20 md:pt-24 pb-12 md:pb-16 bg-gradient-to-br from-bg-alt/40 to-purple/5 overflow-hidden">
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
                    Himani Kankaria is the Founder of <span className="font-semibold text-primary">Missive Digital</span> — an organic digital marketing agency for B2B, SaaS, and Tech companies. She helps businesses create data-driven integrated and channel-specific marketing strategies to achieve <span className="font-semibold gradient-text">more than 800% growth in website traffic</span> and <span className="font-semibold gradient-text">200% growth in leads YoY</span>.
                  </p>
                </Reveal>
                <Reveal delay={0.2}>
                  <p className="text-base text-secondary leading-relaxed">
                    She specializes in strategizing, writing, and optimizing research-oriented, search-intent-based, and value-driven content for B2B companies. At Missive Digital, services encompass auditing, strategizing, conceptualizing, creating, and optimization for content, SEO, social media, and email marketing.
                  </p>
                </Reveal>
                <Reveal delay={0.25}>
                  <p className="text-base text-secondary leading-relaxed">
                    Himani speaks at global conferences such as BrightonSEO, Whitespark Local Search Summit, Semrush, Meet Magento, and more. A regular contributor to <span className="text-primary font-medium">Search Engine Journal</span> and <span className="text-primary font-medium">Search Engine Land</span>, her insights are also featured on Wix, Semrush, and SE Ranking. She has been associated with Hootsuite, Semrush, SEWA Federation, and WPCouchCon for brand endorsements, corporate training, and workshops.
                  </p>
                </Reveal>
              </div>
              <Reveal delay={0.3}>
                <div className="flex flex-wrap gap-4 mt-auto">
                  <CTAButton size="lg" target="_blank" rel="noopener noreferrer">Work With Me</CTAButton>
                  <CTAButton href="/#services" variant="secondary" size="lg">See the Programs</CTAButton>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      <AboutStory />

      {/* Principles */}
      <section className="py-12 md:py-16 bg-bg">
        <Container>
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple mb-3 text-center">
              How I Work
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-serif text-3xl md:text-4xl leading-[1.15] text-primary mb-10 md:mb-12 text-center">
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
      <section className="py-12 md:py-16 bg-gradient-to-br from-purple/5 via-bg to-orange/5">
        <Container narrow>
          <div className="max-w-2xl mx-auto text-center">
            <Reveal>
              <svg className="w-8 h-8 text-purple/30 mx-auto mb-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
              </svg>
            </Reveal>
            <ScrollRevealWords
              text={`"${pullQuote.quote}"`}
              className="font-serif text-xl md:text-2xl text-primary leading-relaxed mb-6"
            />
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
                <p className="mt-6 text-xs text-secondary/60">
                  Also featured at {alsoFeaturedAt.join(' · ')}
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* On LinkedIn */}
      <section className="py-12 md:py-16 bg-bg">
        <Container>
          <div className="text-center mb-8 md:mb-10">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple/10 border border-purple/20 text-purple text-xs font-semibold tracking-[0.2em] uppercase mb-3">
                <LinkedinIcon className="w-3.5 h-3.5" />
                On LinkedIn
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-serif text-3xl md:text-4xl leading-[1.15] text-primary mb-4">
                What I'm writing about right now.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-base text-secondary max-w-xl mx-auto">
                AI made human judgment the scarce asset — not output. That's the throughline of almost everything I post.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {linkedinThoughts.map((thought, i) => (
              <Reveal key={thought.title} delay={i * 0.08}>
                <div className="h-full p-6 sm:p-7 rounded-2xl border border-purple/10 bg-white/70 backdrop-blur-sm hover:border-purple/25 hover:bg-white transition-all duration-300">
                  <h3 className="text-base font-semibold text-primary mb-2 leading-snug">{thought.title}</h3>
                  <p className="text-sm text-secondary leading-relaxed">{thought.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="mt-8 text-center">
              <a
                href="https://www.linkedin.com/in/himanikankaria/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-purple transition-colors duration-200"
              >
                <LinkedinIcon className="w-4 h-4" />
                <span>Follow on LinkedIn</span>
              </a>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Beyond the client work */}
      <section className="py-12 md:py-16 bg-bg border-t border-purple/10">
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
                  Curiosity first, technology second.
                </h2>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="text-base text-secondary leading-relaxed">
                  Sixteen years in, the search ecosystem has evolved dramatically — from early keyword algorithms to AI Overviews and citation graphs. Yet the heart of the craft remains unchanged: understanding what is genuinely useful to human beings, then building digital authority that earns trust across every platform.
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Closing CTA */}
      <section className="py-14 md:py-20 bg-gradient-to-br from-dark via-dark-card to-dark text-center">
        <Container narrow>
          <Reveal>
            <h2 className="font-serif text-3xl md:text-4xl leading-[1.15] text-white mb-6">
              Have a search or AI-visibility problem worth re-architecting?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-wrap justify-center gap-4">
              <CTAButton size="lg" target="_blank" rel="noopener noreferrer">Work With Me</CTAButton>
              <CTAButton href="/#services" variant="secondary" size="lg">Explore the Engagement Models</CTAButton>
            </div>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}
