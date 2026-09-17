import { useState } from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/ui/Container';
import Reveal from '../components/ui/Reveal';
import CTAButton from '../components/ui/CTAButton';
import {
  services,
  coachingAreas,
  coachingCapabilityMap,
  consultingFramework,
  consultingQuestions,
  trainingFormats,
  trainingJourney,
  trainingCourseClusters,
  trainingTracks,
} from '../data/services';
import { caseStudies } from '../data/caseStudies';
import { speakingEngagements, speakingTestimonial } from '../data/speaking';
import { servicePageContent } from '../data/servicePageContent';
import { stats, trustedLogos } from '../data/stats';
import { testimonials } from '../data/testimonials';
import {
  Lightbulb,
  Target,
  GraduationCap,
  Mic,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Users,
  Building2,
  Rocket,
  Quote,
  PenTool,
  Briefcase,
  Users2,
  BookOpen,
  Layers,
  Presentation,
  Sparkles,
} from 'lucide-react';
import speakerImg from '../images/hiimanisasspeaker.jpg';
import coachImg from '../images/himanimarketing.jpg';
import consultantImg from '../images/himanimainsection.jpg';
import trainingImg from '../images/Himani-Kankaria4-684x1024.jpg';

const serviceMeta = {
  consulting: {
    icon: Lightbulb,
    image: consultantImg,
    accent: 'purple',
    eyebrow: 'Service 01',
  },
  coaching: {
    icon: Target,
    image: coachImg,
    accent: 'orange',
    eyebrow: 'Service 02',
  },
  training: {
    icon: GraduationCap,
    image: trainingImg,
    accent: 'orange',
    eyebrow: 'Service 03',
  },
  speaking: {
    icon: Mic,
    image: speakerImg,
    accent: 'purple',
    eyebrow: 'Service 04',
  },
} as const;
const audienceIcons = [Rocket, Building2, Users];

const serviceKeyStats = [
  { value: "15+", label: "Years Experience" },
  { value: "60+", label: "Brands Consulted" },
  { value: "120+", label: "Teams Trained" },
  { value: "2000+", label: "Marketers Mentored" },
];

interface ProofCard {
  id: string;
  category: string;
  headline: string;
  impact: { value: string; label: string }[];
}

const serviceProofMap: Record<keyof typeof serviceMeta, ProofCard[]> = {
  consulting: [
    {
      id: 'c1',
      category: 'B2B SaaS Growth',
      headline: '4.15× Organic Growth in 6.5 Months for B2B SaaS',
      impact: [
        { value: '4.15×', label: 'Organic Traffic Surge' },
        { value: '+100%', label: 'Inbound Leads Doubled' },
      ],
    },
    {
      id: 'c2',
      category: 'Enterprise & Telecom',
      headline: '500% Increase in MQLs & 100% Boost in SQLs',
      impact: [
        { value: '+500%', label: 'Qualified Leads' },
        { value: '+50%', label: 'Organic Traffic' },
      ],
    },
    {
      id: 'c3',
      category: 'E-Commerce SEO',
      headline: 'Penalty Recovery to £57K Monthly Organic Revenue',
      impact: [
        { value: '£57K/mo', label: 'Organic Revenue' },
        { value: 'Top 3', label: 'Commercial Rankings' },
      ],
    },
  ],
  coaching: [
    {
      id: 'm1',
      category: 'Executive Presence',
      headline: 'From Tactical Marketer to Boardroom Strategic Leader',
      impact: [
        { value: '1-on-1', label: 'Private Mentorship' },
        { value: '100%', label: 'Strategy Confidence' },
      ],
    },
    {
      id: 'm2',
      category: 'AI Workflow Integration',
      headline: 'Operationalized Custom AI Search & Research Stacks',
      impact: [
        { value: '5×', label: 'Team Velocity' },
        { value: 'Custom', label: 'Prompt Frameworks' },
      ],
    },
    {
      id: 'm3',
      category: 'Personal Branding',
      headline: 'Founder & CMO LinkedIn Thought Leadership Pipeline',
      impact: [
        { value: '3×', label: 'Inbound Inquiries' },
        { value: 'High-Ticket', label: 'Client Retainers' },
      ],
    },
  ],
  training: [
    {
      id: 't1',
      category: 'Global Brand Training',
      headline: 'Workshops & Associations with Hootsuite and Semrush',
      impact: [
        { value: '120+', label: 'Corporate Teams' },
        { value: 'Hands-on', label: 'Framework Teardowns' },
      ],
    },
    {
      id: 't2',
      category: 'Flagship Symposium',
      headline: 'Founding Faculty at Content Writers’ Symposium',
      impact: [
        { value: '2000+', label: 'Marketers Mentored' },
        { value: 'Zero Fluff', label: 'Writing Clinics' },
      ],
    },
    {
      id: 't3',
      category: 'Digital Capability',
      headline: 'Community Masterclasses with SEWA & WPCouchCon',
      impact: [
        { value: '4 Tracks', label: 'Curriculum Scope' },
        { value: 'Permanent', label: 'Team SOP Library' },
      ],
    },
  ],
  speaking: [
    {
      id: 's1',
      category: 'International Keynote',
      headline: 'International Search Summit Keynote (Barcelona)',
      impact: [
        { value: '800+', label: 'Global SEO Pros' },
        { value: 'Keynote', label: 'International SEO' },
      ],
    },
    {
      id: 's2',
      category: 'Global Flagship Stages',
      headline: 'brightonSEO (UK) & Whitespark Local Search Summit',
      impact: [
        { value: 'Global', label: 'Industry Stages' },
        { value: 'Featured', label: 'Search Re-Architecture' },
      ],
    },
    {
      id: 's3',
      category: 'National Summits',
      headline: 'Honored as AMAZE SEO Champion & SSA Conference Speaker',
      impact: [
        { value: 'Champion', label: 'AMAZE Conference' },
        { value: 'SSA Jaipur', label: 'Zero-Click Search' },
      ],
    },
  ],
};

interface ServicePageProps {
  serviceId: keyof typeof serviceMeta;
}

export default function ServicePage({ serviceId }: ServicePageProps) {
  const service = services.find((s) => s.id === serviceId);
  if (!service) return null;

  const meta = serviceMeta[serviceId];
  const Icon = meta.icon;
  const otherServices = services.filter((s) => s.id !== serviceId);

  return (
    <main>
      {/* Hero */}
      <section className="pt-20 md:pt-24 pb-12 md:pb-16 bg-gradient-to-br from-bg-alt/40 to-purple/5 overflow-hidden">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <Reveal>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple/10 border border-purple/20 text-purple text-xs font-semibold tracking-[0.2em] uppercase mb-6">
                  <Icon className="w-3.5 h-3.5" />
                  {service.label}
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.12] text-primary mb-6">
                  {service.headline}
                </h1>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="text-base md:text-lg text-secondary leading-relaxed mb-8 max-w-xl">
                  {service.description}
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="flex flex-wrap gap-x-10 gap-y-6 mb-10">
                  {service.metrics.map((metric) => (
                    <div key={metric.label}>
                      <div className="text-3xl font-bold gradient-text">{metric.value}</div>
                      <div className="text-xs text-secondary/60 mt-1 tracking-wide uppercase">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={0.25}>
                <div className="flex flex-wrap gap-4">
                  <CTAButton size="lg">{service.cta}</CTAButton>
                  <CTAButton href="/#services" variant="secondary" size="lg">
                    See Other Programs
                  </CTAButton>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.15} direction="left">
              <div className="relative image-frame image-frame-glow">
                <div className="relative aspect-[4/5] sm:aspect-[4/4] rounded-2xl overflow-hidden bg-bg-alt">
                  <img
                    src={meta.image}
                    alt={`${service.label} with Himani Kankaria`}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/30 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2">
                    {service.topics.slice(0, 4).map((topic) => (
                      <span
                        key={topic}
                        className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white/90 border border-white/10"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="absolute -inset-6 bg-gradient-to-br from-purple/15 to-orange/15 rounded-3xl blur-2xl -z-10" />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Trusted by */}
      <section className="py-10 md:py-12 bg-bg border-b border-purple/10">
        <Container>
          <Reveal>
            <p className="text-center text-[11px] font-semibold tracking-[0.2em] uppercase text-secondary/50 mb-6">
              Trusted by teams at
            </p>
          </Reveal>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-3">
            {trustedLogos.map((logo) => (
              <span
                key={logo}
                className="text-sm font-semibold text-secondary/45 tracking-wide uppercase hover:text-purple/60 transition-colors"
              >
                {logo}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* Key Metrics Bar - Slim, refined & minimal */}
      <section className="py-6 md:py-8 border-b border-purple/10">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 items-center">
            {serviceKeyStats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 text-center sm:text-left ${
                  i > 0 ? 'sm:border-l sm:border-purple/15 sm:pl-6' : ''
                }`}
              >
                <span className="font-serif text-2xl md:text-3xl font-bold gradient-text leading-none shrink-0">
                  {stat.value}
                </span>
                <span className="text-[11px] md:text-xs font-semibold uppercase tracking-wider text-secondary/75 leading-tight max-w-[120px]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* What's covered */}
      <section className="py-12 md:py-16 bg-bg">
        <Container>
          <div className="max-w-3xl">
            <Reveal>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple mb-3">
                What It Covers
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-serif text-3xl md:text-4xl leading-[1.15] text-primary mb-6 md:mb-8">
                Everything inside a {service.label.toLowerCase()} engagement.
              </h2>
            </Reveal>
          </div>

          <div className="flex flex-wrap gap-2.5 mb-8 md:mb-10">
            {service.topics.map((topic) => (
              <Reveal key={topic} delay={0.02}>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-full border border-purple/20 bg-purple/10 text-secondary`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple" />
                  {topic}
                </span>
              </Reveal>
            ))}
          </div>

          <ServiceExtras serviceId={serviceId} />
        </Container>
      </section>

      {/* How it works */}
      <ProcessSection serviceId={serviceId} />

      {/* Who it's for */}
      <AudienceSection serviceId={serviceId} />

      {/* Outcomes */}
      <OutcomesSection serviceId={serviceId} />

      {/* Proof */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-bg-alt/50 to-purple/5">
        <Container>
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple mb-4 text-center">
              Proof Behind the Promise
            </p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {serviceProofMap[serviceId].map((study, i) => (
              <Reveal key={study.id} delay={i * 0.08}>
                <div className="h-full p-6 rounded-2xl border border-purple/15 bg-white/70 backdrop-blur-sm hover:bg-white hover:border-purple/30 transition-all duration-300 flex flex-col">
                  <span className="text-xs font-semibold tracking-[0.15em] uppercase text-orange mb-3">
                    {study.category}
                  </span>
                  <h3 className="text-base font-semibold text-primary leading-snug mb-4">
                    {study.headline}
                  </h3>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-purple/10">
                    {study.impact.slice(0, 2).map((m) => (
                      <div key={m.label}>
                        <div className="text-lg font-bold gradient-text">{m.value}</div>
                        <div className="text-[10px] uppercase tracking-wide text-secondary/60">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <TestimonialSection serviceId={serviceId} />

      {/* FAQ */}
      <FaqSection serviceId={serviceId} />

      {/* Other services */}
      <section className="py-12 md:py-16 bg-bg">
        <Container>
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-orange/60 mb-3 text-center">
              Continue Exploring
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-serif text-3xl md:text-4xl leading-[1.15] text-primary mb-8 md:mb-10 text-center">
              Other ways to work together.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {otherServices.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.08}>
                <Link
                  to={`/${s.id}`}
                  className="group h-full flex flex-col justify-between p-6 rounded-2xl border border-purple/15 bg-white/70 backdrop-blur-sm hover:bg-white hover:border-purple/35 hover:shadow-xl hover:shadow-purple/10 transition-all duration-300"
                >
                  <div>
                    <span className="text-xs font-semibold tracking-[0.2em] uppercase text-orange mb-3 block">
                      {s.number} — {s.label}
                    </span>
                    <h3 className="text-lg font-semibold text-primary leading-snug mb-2 group-hover:text-purple transition-colors">
                      {s.headline}
                    </h3>
                    <p className="text-sm text-secondary leading-relaxed line-clamp-3">
                      {s.description}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:text-purple transition-colors mt-5">
                    Explore {s.label.toLowerCase()}
                    <ArrowUpRight className="w-4 h-4 text-secondary/40 group-hover:text-purple group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Closing CTA */}
      <section className="py-14 md:py-20 bg-gradient-to-br from-dark via-dark-card to-dark text-center">
        <Container narrow>
          <Reveal>
            <h2 className="font-serif text-3xl md:text-4xl leading-[1.15] text-white mb-6">
              Ready to start your {service.label.toLowerCase()} journey?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-wrap justify-center gap-4">
              <CTAButton size="lg">{service.cta}</CTAButton>
              <CTAButton href="/#services" variant="secondary" size="lg">
                Explore Engagement Models
              </CTAButton>
            </div>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}

function ProcessSection({ serviceId }: { serviceId: keyof typeof serviceMeta }) {
  const content = servicePageContent[serviceId];
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-bg-alt/40 to-purple/5">
      <Container>
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple mb-3 text-center">
            How It Works
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-serif text-3xl md:text-4xl leading-[1.15] text-primary mb-8 md:mb-10 text-center">
            From first call to compounding results.
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {content.process.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.08}>
              <div className="group relative h-full p-6 rounded-2xl border border-purple/15 bg-white/70 backdrop-blur-sm hover:bg-white hover:border-purple/35 hover:shadow-lg hover:shadow-purple/10 transition-all duration-300">
                <span className="block text-5xl font-serif gradient-text opacity-30 group-hover:opacity-60 transition-opacity duration-300 mb-4">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-lg font-semibold text-primary mb-2">{step.title}</h3>
                <p className="text-sm text-secondary leading-relaxed">{step.description}</p>
                {i < content.process.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-[26px] -translate-y-1/2 w-5 h-5 text-purple/30 z-10" />
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function AudienceSection({ serviceId }: { serviceId: keyof typeof serviceMeta }) {
  const content = servicePageContent[serviceId];
  return (
    <section className="py-12 md:py-16 bg-bg">
      <Container>
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-orange/60 mb-3 text-center">
            Who It&rsquo;s For
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-serif text-3xl md:text-4xl leading-[1.15] text-primary mb-8 md:mb-10 text-center">
            Built for the people re-architecting growth.
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {content.audience.map((item, i) => {
            const AudienceIcon = audienceIcons[i % audienceIcons.length];
            return (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="h-full p-6 sm:p-8 rounded-2xl border border-purple/15 bg-white/70 backdrop-blur-sm hover:bg-white hover:border-purple/35 hover:shadow-xl hover:shadow-purple/10 transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple to-orange flex items-center justify-center mb-5 shadow-md">
                    <AudienceIcon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-2">{item.title}</h3>
                  <p className="text-sm text-secondary leading-relaxed">{item.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function OutcomesSection({ serviceId }: { serviceId: keyof typeof serviceMeta }) {
  const content = servicePageContent[serviceId];
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-bg-alt/40 to-purple/5">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <Reveal>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple mb-4">
                What You&rsquo;ll Walk Away With
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-serif text-3xl md:text-4xl leading-[1.15] text-primary mb-6">
                Deliverables you can touch, not just admire.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-base text-secondary leading-relaxed mb-8 max-w-lg">
                Every engagement ends with artifacts that keep working after we leave — systems,
                frameworks, and documentation your team can run and scale on their own.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <CTAButton href="/#contact">{'Ask About a Custom Engagement'}</CTAButton>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {content.outcomes.map((outcome, i) => (
              <Reveal key={outcome} delay={i * 0.06}>
                <div className="flex items-start gap-3 p-4 rounded-xl border border-purple/15 bg-white/70 backdrop-blur-sm hover:bg-white hover:border-purple/30 transition-all duration-300">
                  <CheckCircle2 className="w-5 h-5 text-orange shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-primary leading-snug">{outcome}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function TestimonialSection({ serviceId }: { serviceId: keyof typeof serviceMeta }) {
  const content = servicePageContent[serviceId];
  const featured = content.testimonialIds
    .map((id) => testimonials.find((t) => t.id === id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <section className="py-12 md:py-16 bg-bg">
      <Container>
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-orange/60 mb-3 text-center">
            Client Words
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-serif text-3xl md:text-4xl leading-[1.15] text-primary mb-8 md:mb-10 text-center">
            What partners say about working together.
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featured.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.08}>
              <div className="h-full p-6 sm:p-8 rounded-2xl border border-purple/15 bg-white/70 backdrop-blur-sm hover:bg-white hover:border-purple/35 hover:shadow-xl hover:shadow-purple/10 transition-all duration-300 flex flex-col">
                <Quote className="w-7 h-7 text-purple/25 mb-4" />
                <p className="text-sm text-secondary leading-relaxed mb-6 flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="pt-4 border-t border-purple/10">
                  <p className="text-sm font-semibold text-primary">{t.author}</p>
                  <p className="text-xs text-secondary/60 mt-0.5">
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function FaqSection({ serviceId }: { serviceId: keyof typeof serviceMeta }) {
  const content = servicePageContent[serviceId];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-bg-alt/40 to-purple/5">
      <Container>
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple mb-3 text-center">
            Frequently Asked
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-serif text-3xl md:text-4xl leading-[1.15] text-primary mb-8 md:mb-10 text-center">
            Answers before you even ask.
          </h2>
        </Reveal>
        <div className="max-w-3xl mx-auto space-y-3">
          {content.faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <Reveal key={faq.q} delay={i * 0.04}>
                <div
                  className={`rounded-2xl border bg-white/70 backdrop-blur-sm transition-all duration-300 ${
                    isOpen
                      ? 'border-purple/30 bg-white shadow-lg shadow-purple/5'
                      : 'border-purple/15 hover:border-purple/30'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-5 text-left"
                  >
                    <span className="text-sm sm:text-base font-semibold text-primary">{faq.q}</span>
                    <span
                      className={`shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
                        isOpen
                          ? 'border-purple text-purple rotate-180 bg-purple/5'
                          : 'border-purple/20 text-secondary'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 sm:px-6 pb-5 text-sm text-secondary leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function ServiceExtras({ serviceId }: { serviceId: keyof typeof serviceMeta }) {
  if (serviceId === 'consulting') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Reveal>
          <div className="p-6 sm:p-8 rounded-2xl border border-purple/20 bg-white/70 backdrop-blur-sm">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple mb-6">
              The Engagement Flow
            </p>
            <div className="flex flex-col gap-0">
              {consultingFramework.map((step, i) => (
                <div key={step} className="flex flex-col items-start">
                  <div className="w-full py-3 px-4 rounded-lg border border-purple/15 bg-purple/5 flex items-center gap-3">
                    <span className="text-xs font-bold gradient-text w-6">{i + 1}</span>
                    <span className="text-sm font-semibold tracking-wide text-primary">{step}</span>
                  </div>
                  {i < consultingFramework.length - 1 && (
                    <div className="w-px h-4 bg-gradient-to-b from-purple to-orange ml-7" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="p-6 sm:p-8 rounded-2xl border border-orange/20 bg-white/70 backdrop-blur-sm">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-orange mb-6">
              Questions We Ask First
            </p>
            <div className="space-y-4">
              {consultingQuestions.map((q) => (
                <p
                  key={q}
                  className="text-sm text-secondary italic pl-4 border-l-2 border-orange/30 leading-relaxed"
                >
                  &ldquo;{q}&rdquo;
                </p>
              ))}
            </div>
            <div className="mt-8">
              <CTAButton>{'Discuss a Consulting Engagement'}</CTAButton>
            </div>
          </div>
        </Reveal>
      </div>
    );
  }

  if (serviceId === 'coaching') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Reveal>
          <div className="p-6 sm:p-8 rounded-2xl border border-orange/20 bg-white/70 backdrop-blur-sm">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-orange mb-6">
              Modern Marketer Capability Map
            </p>
            <div className="grid grid-cols-2 gap-3">
              {coachingCapabilityMap.branches.map((branch) => (
                <div key={branch.name} className="p-4 rounded-xl border border-purple/10 hover:border-purple/30 transition-colors">
                  <h4 className="text-sm font-semibold text-primary mb-2">{branch.name}</h4>
                  <div className="flex flex-wrap gap-1">
                    {branch.items.map((item) => (
                      <span key={item} className="text-[10px] text-secondary/60 px-2 py-0.5 rounded bg-purple/5">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="p-6 sm:p-8 rounded-2xl border border-purple/20 bg-white/70 backdrop-blur-sm flex flex-col">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple mb-6">
              Coaching Areas
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {coachingAreas.map((area) => (
                <span
                  key={area}
                  className="text-xs font-medium px-3 py-1.5 rounded-full border border-orange/20 bg-orange/5 text-secondary"
                >
                  {area}
                </span>
              ))}
            </div>
            <p className="text-sm text-secondary leading-relaxed mt-auto">
              Every engagement is tailored around your context — no recycled playbooks.
            </p>
          </div>
        </Reveal>
      </div>
    );
  }

  if (serviceId === 'training') {
    return <TrainingTracksView />;
  }

  if (serviceId === 'speaking') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Reveal>
          <div className="p-6 sm:p-8 rounded-2xl border border-purple/20 bg-white/70 backdrop-blur-sm">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple mb-6">
              Recent Stages
            </p>
            <div className="space-y-3">
              {speakingEngagements.slice(0, 6).map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between gap-4 py-3 px-4 rounded-xl border border-purple/10 hover:border-purple/30 transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-primary">{e.conference}</p>
                    <p className="text-xs text-secondary/60 mt-0.5">
                      {e.topic} · {e.location}, {e.country}
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold tracking-wider text-orange">{e.year}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="p-6 sm:p-8 rounded-2xl border border-orange/20 bg-white/70 backdrop-blur-sm flex flex-col">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-orange mb-4">
              From the Stage
            </p>
            <svg className="w-8 h-8 text-purple/30 mb-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
            </svg>
            <p className="text-lg font-serif italic text-primary leading-relaxed mb-6">
              &ldquo;{speakingTestimonial.quote}&rdquo;
            </p>
            <p className="text-sm text-secondary mt-auto">
              <span className="font-semibold text-primary">{speakingTestimonial.author}</span>{' '}
              <span className="inline-flex items-center gap-1 text-purple">
                · {speakingTestimonial.event}
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </p>
          </div>
        </Reveal>
      </div>
    );
  }

  return null;
}

function TrainingTracksView() {
  const [activeTrackId, setActiveTrackId] = useState<string>('all');

  const filteredTracks = activeTrackId === 'all'
    ? trainingTracks
    : trainingTracks.filter((t) => t.id === activeTrackId);

  const trackIcons: Record<string, React.ElementType> = {
    content: PenTool,
    linkedin: Briefcase,
    teamTrainer: Users2,
    symposium: Sparkles,
  };

  return (
    <div className="space-y-12">
      {/* Intro Header */}
      <div className="text-center max-w-3xl mx-auto">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple/10 border border-purple/20 text-purple text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>4 Dedicated Training Tracks</span>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h3 className="font-serif text-3xl sm:text-4xl text-primary leading-tight mb-4">
            Specialized Masterclasses & In-House Enablement Programs
          </h3>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-sm sm:text-base text-secondary leading-relaxed">
            Choose from 4 purpose-built training tracks designed for writers, executive leaders, in-house marketing departments, and community practitioners.
          </p>
        </Reveal>
      </div>

      {/* Interactive Track Selector Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-bg border border-purple/15 max-w-4xl mx-auto">
        <button
          type="button"
          onClick={() => setActiveTrackId('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTrackId === 'all'
              ? 'bg-gradient-to-r from-purple to-orange text-white shadow-md'
              : 'text-secondary hover:text-primary hover:bg-white/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All 4 Tracks ({trainingTracks.length})</span>
        </button>

        {trainingTracks.map((track) => {
          const isCurrent = activeTrackId === track.id;
          const Icon = trackIcons[track.id] || BookOpen;
          return (
            <button
              key={track.id}
              type="button"
              onClick={() => setActiveTrackId(track.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-gradient-to-r from-purple to-orange text-white shadow-md'
                  : 'text-secondary hover:text-primary hover:bg-white/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{track.badge}</span>
            </button>
          );
        })}
      </div>

      {/* Track Cards */}
      <div className="space-y-12">
        {filteredTracks.map((track, trackIdx) => {
          const Icon = trackIcons[track.id] || BookOpen;
          const trackNumber = trainingTracks.findIndex((t) => t.id === track.id) + 1;

          return (
            <Reveal key={track.id} delay={trackIdx * 0.08}>
              <div className="relative p-6 sm:p-8 md:p-10 rounded-3xl border border-purple/20 bg-white/85 backdrop-blur-md shadow-xl shadow-purple/5 hover:border-purple/35 transition-all">
                {/* Header Strip */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-purple/10 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-purple to-orange flex items-center justify-center text-white shrink-0 shadow-lg shadow-purple/20">
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full bg-purple/10 text-purple border border-purple/20">
                          Track 0{trackNumber} · {track.badge}
                        </span>
                        {track.featuredIn && (
                          <span className="text-[11px] font-medium text-secondary/80 bg-bg px-3 py-0.5 rounded-full border border-border">
                            {track.featuredIn}
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif text-2xl sm:text-3xl text-primary leading-tight">
                        {track.title}
                      </h4>
                      <p className="text-xs sm:text-sm font-semibold text-orange mt-1">
                        {track.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    <CTAButton href="#contact" size="md">
                      {track.ctaText}
                    </CTAButton>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-secondary leading-relaxed max-w-4xl mb-8">
                  {track.description}
                </p>

                {/* Modules Grid */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-purple" />
                      <span>Curriculum & Core Modules ({track.modules.length})</span>
                    </p>
                    <span className="text-xs text-secondary/70">Includes hands-on deliverables</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {track.modules.map((module, mIdx) => (
                      <div
                        key={module.title}
                        className="p-4 sm:p-5 rounded-2xl border border-purple/15 bg-white/70 hover:bg-white hover:border-purple/35 hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div>
                          <span className="text-[11px] font-bold tracking-wider text-orange block mb-1">
                            MODULE 0{mIdx + 1}
                          </span>
                          <h5 className="text-sm font-semibold text-primary mb-2 leading-snug">
                            {module.title}
                          </h5>
                          <p className="text-xs text-secondary leading-relaxed mb-4">
                            {module.description}
                          </p>
                        </div>
                        <div className="pt-3 border-t border-purple/10 flex items-start gap-1.5 text-[11px] font-medium text-purple">
                          <CheckCircle2 className="w-3.5 h-3.5 text-orange shrink-0 mt-0.5" />
                          <span className="leading-tight">{module.deliverable}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audience & Delivery Formats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 sm:p-7 rounded-2xl bg-bg/70 border border-purple/10 mb-6">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.16em] uppercase text-primary mb-3 flex items-center gap-2">
                      <Users2 className="w-4 h-4 text-orange" />
                      <span>Who This Track Is Built For</span>
                    </p>
                    <ul className="space-y-2">
                      {track.whoIsItFor.map((aud) => (
                        <li key={aud} className="flex items-start gap-2.5 text-xs text-secondary leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange mt-1.5 shrink-0" />
                          <span>{aud}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-semibold tracking-[0.16em] uppercase text-primary mb-3 flex items-center gap-2">
                      <Presentation className="w-4 h-4 text-purple" />
                      <span>Delivery Formats & Scheduling</span>
                    </p>
                    <ul className="space-y-2">
                      {track.formats.map((fmt) => (
                        <li key={fmt} className="flex items-start gap-2.5 text-xs text-secondary leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple mt-1.5 shrink-0" />
                          <span>{fmt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Key Outcomes Footer */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-purple/10">
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-secondary">
                    <span className="font-semibold text-primary text-[11px] uppercase tracking-wider">Key Outcomes:</span>
                    {track.outcomes.map((out) => (
                      <span key={out} className="inline-flex items-center gap-1.5 text-xs font-medium text-secondary">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{out}</span>
                      </span>
                    ))}
                  </div>

                  <CTAButton href="#contact" variant="secondary" size="md">
                    Inquire About This Track
                  </CTAButton>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* The 5-Stage Learning Framework */}
      <div className="p-6 sm:p-8 md:p-10 rounded-3xl border border-orange/20 bg-white/80 backdrop-blur-sm shadow-lg shadow-orange/5">
        <div className="max-w-xl mx-auto text-center mb-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-orange mb-2">
            The 5-Stage Framework
          </p>
          <h4 className="font-serif text-2xl sm:text-3xl text-primary">
            How Every Training Engagement Delivers Real Capability
          </h4>
          <p className="text-xs text-secondary mt-2">
            From initial gap diagnostics to custom internal SOPs that compound after training concludes.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          {trainingJourney.map((step, i) => (
            <div key={step} className="p-4 rounded-2xl bg-bg border border-orange/15 text-center flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple to-orange flex items-center justify-center text-white text-xs font-bold shadow-md mb-2.5">
                0{i + 1}
              </div>
              <span className="text-xs font-bold tracking-wider text-primary">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}