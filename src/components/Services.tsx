import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Container from './ui/Container';
import Reveal from './ui/Reveal';
import CTAButton from './ui/CTAButton';
import { services } from '../data/services';
import { Mic, Target, Lightbulb, GraduationCap } from 'lucide-react';

const serviceIcons = [Mic, Target, Lightbulb, GraduationCap];

function ServicePanel({ service, index }: { service: typeof services[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-200px" });
  const Icon = serviceIcons[index];

  return (
    <div ref={ref} className="min-h-[80vh] py-12 md:py-16 flex items-center">
      <div className="w-full">
        <Reveal>
          {/* Label */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple to-orange flex items-center justify-center shadow-lg">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-purple">
              {service.number} — {service.label}
            </span>
          </div>
        </Reveal>

        {/* Headline */}
        <Reveal delay={0.1}>
          <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl leading-[1.2] text-primary mb-6 max-w-2xl">
            {service.headline}
          </h3>
        </Reveal>

        {/* Description */}
        <Reveal delay={0.15}>
          <p className="text-base text-secondary leading-relaxed max-w-xl mb-10">
            {service.description}
          </p>
        </Reveal>

        {/* Topics grid */}
        <Reveal delay={0.2}>
          <div className="flex flex-wrap gap-2 mb-10">
            {service.topics.map((topic) => (
              <span
                key={topic}
                className="text-xs font-medium px-3 py-1.5 rounded-full border border-purple/20 text-purple/70 bg-purple/5 hover:bg-purple/10 transition-colors duration-200"
              >
                {topic}
              </span>
            ))}
          </div>
        </Reveal>

        {/* Metrics */}
        <Reveal delay={0.25}>
          <div className="flex flex-wrap gap-8 md:gap-12 mb-10">
            {service.metrics.map((metric) => (
              <div key={metric.label}>
                <div className="text-2xl md:text-3xl font-bold gradient-text">{metric.value}</div>
                <div className="text-xs text-secondary/60 mt-1">{metric.label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <CTAButton variant="primary">{service.cta}</CTAButton>
        </Reveal>
      </div>
    </div>
  );
}

export default function Services() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + window.innerHeight / 3;
      for (let i = sectionRefs.current.length - 1; i >= 0; i--) {
        const el = sectionRefs.current[i];
        if (el && el.offsetTop <= scrollY) {
          setActiveIndex(i);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="services" className="bg-bg">
      <Container>
        <div className="py-12 md:py-16">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple mb-4">
              Ways to Work With Me
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.15] text-primary mb-16">
              How We Can Work Together
            </h2>
          </Reveal>
        </div>

        {/* Desktop: Sticky nav + panels */}
        <div className="hidden lg:grid grid-cols-[200px_1fr] gap-16 pb-16">
          {/* Sticky sidebar */}
          <div className="sticky top-32 h-fit">
            <div className="flex flex-col gap-1">
              {services.map((service, i) => (
                <a
                  key={service.id}
                  href={`#${service.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    sectionRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`py-2.5 px-4 text-sm font-medium transition-all duration-300 rounded-lg ${
                    activeIndex === i
                      ? 'text-purple bg-purple/5 border-l-2 border-purple'
                      : 'text-secondary/50 hover:text-secondary border-l-2 border-transparent'
                  }`}
                >
                  <span className="mr-2 text-xs opacity-50">{service.number}</span>
                  {service.label}
                </a>
              ))}
            </div>
          </div>

          {/* Panels */}
          <div>
            {services.map((service, i) => (
              <div
                key={service.id}
                ref={(el) => { sectionRefs.current[i] = el; }}
                id={service.id}
              >
                <ServicePanel service={service} index={i} />
                {i < services.length - 1 && <div className="border-b border-purple/10" />}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: Stacked */}
        <div className="lg:hidden pb-16">
          {services.map((service, i) => (
            <div key={service.id} className="border-b border-purple/10 last:border-0">
              <ServicePanel service={service} index={i} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
