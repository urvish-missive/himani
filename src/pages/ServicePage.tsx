import Container from '../components/ui/Container';
import Reveal from '../components/ui/Reveal';
import CTAButton from '../components/ui/CTAButton';
import { Link } from 'react-router-dom';
import {
  services,
  coachingAreas,
  coachingCapabilityMap,
  consultingFramework,
  consultingQuestions,
  trainingFormats,
  trainingJourney,
  trainingCourseClusters,
} from '../data/services';
import { caseStudies } from '../data/caseStudies';
import { speakingEngagements, speakingTestimonial } from '../data/speaking';
import {
  Lightbulb,
  Target,
  GraduationCap,
  Mic,
  ArrowRight,
  CheckCircle2,
  ArrowUpRight,
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

interface ServicePageProps {
  serviceId: keyof typeof serviceMeta;
}

export default function ServicePage({ serviceId }: ServicePageProps) {
  const service = services.find((s) => s.id === serviceId);
  if (!service) return null;

  const meta = serviceMeta[serviceId];
  const Icon = meta.icon;
  const accent = meta.accent;
  const accentText = accent === 'purple' ? 'text-purple' : 'text-orange';
  const accentBg = `bg-${accent}/10`;
  const accentBorder = `border-${accent}/20`;
  const otherServices = services.filter((s) => s.id !== serviceId);

  return (
    <main>
      {/* Hero */}
      <section className="pt-28 md:pt-36 pb-16 md:pb-24 bg-gradient-to-br from-bg-alt/40 to-purple/5 overflow-hidden">
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

      {/* What's covered */}
      <section className="py-16 md:py-24 bg-bg">
        <Container>
          <div className="max-w-3xl">
            <Reveal>
              <p className={`text-xs font-semibold tracking-[0.2em] uppercase ${accentText} mb-4`}>
                What It Covers
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-serif text-3xl md:text-4xl leading-[1.15] text-primary mb-8">
                Everything inside a {service.label.toLowerCase()} engagement.
              </h2>
            </Reveal>
          </div>

          <div className="flex flex-wrap gap-2.5 mb-14">
            {service.topics.map((topic) => (
              <Reveal key={topic} delay={0.02}>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-full border ${accentBorder} ${accentBg} text-secondary`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${accentText}`} />
                  {topic}
                </span>
              </Reveal>
            ))}
          </div>

          <ServiceExtras serviceId={serviceId} />
        </Container>
      </section>

      {/* Proof strip */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-bg-alt/50 to-purple/5">
        <Container>
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple mb-6 text-center">
              Proof Behind the Promise
            </p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {caseStudies.slice(0, 3).map((study, i) => (
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

      {/* Other services */}
      <section className="py-16 md:py-24 bg-bg">
        <Container>
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-orange/60 mb-4 text-center">
              Continue Exploring
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-serif text-3xl md:text-4xl leading-[1.15] text-primary mb-12 text-center">
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
      <section className="py-20 md:py-28 bg-gradient-to-br from-dark via-dark-card to-dark text-center">
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

function ServiceExtras({ serviceId }: { serviceId: keyof typeof serviceMeta }) {
  const accent = serviceMeta[serviceId].accent;

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
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Reveal>
          <div className="p-6 sm:p-8 rounded-2xl border border-orange/20 bg-white/70 backdrop-blur-sm">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-orange mb-6">
              Learning Journey
            </p>
            <div className="flex flex-col items-start gap-0">
              {trainingJourney.map((step, i) => (
                <div key={step} className="flex flex-col items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple to-orange flex items-center justify-center text-white text-[10px] font-bold shadow-md">
                      {i + 1}
                    </div>
                    <span className="text-sm font-semibold text-primary">{step}</span>
                  </div>
                  {i < trainingJourney.length - 1 && (
                    <div className="w-px h-5 bg-gradient-to-b from-purple to-orange ml-4" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="p-6 sm:p-8 rounded-2xl border border-purple/20 bg-white/70 backdrop-blur-sm">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple mb-6">
              Course Clusters
            </p>
            <div className="space-y-4">
              {trainingCourseClusters.map((cluster) => (
                <div key={cluster.name} className="p-4 rounded-xl border border-orange/15 hover:border-orange/30 transition-colors">
                  <h4 className="text-sm font-semibold text-primary mb-2">{cluster.name}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {cluster.children.map((child) => (
                      <span key={child} className="text-[10px] px-2 py-0.5 rounded bg-orange/10 text-orange/70 font-medium">
                        {child}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="p-6 sm:p-8 rounded-2xl border border-orange/20 bg-white/70 backdrop-blur-sm">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-orange mb-6">
              Delivery Formats
            </p>
            <div className="space-y-2.5">
              {trainingFormats.map((format) => (
                <div key={format} className="flex items-center gap-2.5 text-sm text-secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple to-orange" />
                  {format}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    );
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