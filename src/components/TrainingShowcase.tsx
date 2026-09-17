import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Container from './ui/Container';
import Reveal from './ui/Reveal';
import CTAButton from './ui/CTAButton';
import approachImg from '../images/himanimainimage.jpg';
import { Search, Lightbulb, Rocket, BarChart3 } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Discover',
    description: 'Deep-dive audit into brand entities, search intent, competitors, and technical crawl health.',
    color: 'var(--color-purple)',
  },
  {
    icon: Lightbulb,
    title: 'Re-Architect',
    description: 'Design custom Citation Architecture, semantic topic clusters, and commercial intent frameworks.',
    color: 'var(--color-purple-light)',
  },
  {
    icon: Rocket,
    title: 'Deploy',
    description: 'Implement with your team using hands-on workshops, custom AI workflows, and structured schema.',
    color: 'var(--color-orange)',
  },
  {
    icon: BarChart3,
    title: 'Compound',
    description: 'Track conversion metrics, scale authoritative citations, and compound organic pipeline ROI.',
    color: 'var(--color-orange-light)',
  },
];

export default function TrainingShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px 0px" });

  return (
    <section className="relative py-16 md:py-24 lg:py-32 bg-gradient-to-br from-dark via-dark-card to-dark overflow-hidden">
      {/* Gradient orbs - smaller on mobile */}
      <div className="absolute top-0 left-1/3 w-48 md:w-96 h-48 md:h-96 bg-purple/10 rounded-full blur-[80px] md:blur-[150px]" />
      <div className="absolute bottom-0 right-1/3 w-48 md:w-96 h-48 md:h-96 bg-orange/10 rounded-full blur-[80px] md:blur-[150px]" />

      {/* Noise */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      <Container className="relative z-10 px-5 md:px-8">
        {/* Header */}
        <div className="mb-10 md:mb-16">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-orange/60 mb-3 md:mb-4">
              My Approach
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-5xl leading-[1.15] text-white mb-4">
              Every engagement follows <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-light to-orange-light">a clear process</span>.
            </h2>
          </Reveal>
        </div>

        {/* Process steps - clean responsive layout */}
        <div className="lg:grid lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_380px] lg:gap-12 lg:items-center">
          <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
                className="group relative p-5 md:p-6 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20 transition-all duration-500"
              >
                {/* Step number */}
                <div className="absolute -top-2.5 -left-2.5 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: step.color }}>
                  {i + 1}
                </div>

                {/* Icon */}
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 md:mb-4" style={{ background: `${step.color}20` }}>
                  <step.icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: step.color }} />
                </div>

                <h3 className="text-base md:text-lg font-semibold text-white mb-1.5 md:mb-2 group-hover:text-orange-light transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs md:text-sm text-white/50 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Desktop only: side image */}
          <Reveal delay={0.3} className="hidden lg:block">
            <div className="relative mt-8 lg:mt-0">
              <div className="absolute -inset-1 bg-gradient-to-br from-purple to-orange rounded-2xl opacity-30" />
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                <img
                  src={approachImg}
                  alt="Himani Kankaria - Strategic Approach at Missive Digital"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/40 to-transparent" />
              </div>
            </div>
          </Reveal>
        </div>

        {/* CTA */}
        <Reveal delay={0.4}>
          <div className="mt-10 md:mt-16">
            <CTAButton variant="dark">Discuss a Project</CTAButton>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
