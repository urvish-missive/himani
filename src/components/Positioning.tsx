import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Container from './ui/Container';
import Reveal from './ui/Reveal';
import positioningImg from '../images/himani.jpg';

const frameworkSteps = [
  { label: 'INTENT', color: 'var(--color-purple)', desc: 'Map true buyer commercial journeys' },
  { label: 'STRUCTURE', color: 'var(--color-purple-light)', desc: 'Engineer entity schema & technical health' },
  { label: 'CITATIONS', color: 'var(--color-accent)', desc: 'Secure mentions across AI & traditional search' },
  { label: 'CONVERSION', color: 'var(--color-orange)', desc: 'Turn organic visits into MQLs and pipeline' },
  { label: 'COMPOUNDING', color: 'var(--color-orange-light)', desc: 'Scale sustainable category authority' },
];

export default function Positioning() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px 0px" });

  return (
    <section className="py-20 md:py-32 lg:py-40 bg-gradient-to-br from-bg-alt/50 to-purple/5 overflow-hidden">
      <Container>
        {/* Header */}
        <div className="mb-16">
          <Reveal>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.15] text-primary mb-5">
              We don't chase algorithms.<br />
              <span className="gradient-text">We build compounding organic systems.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-base text-secondary leading-relaxed max-w-2xl">
              Algorithms shift. Search interfaces evolve. True organic authority compounds. At Missive Digital, we combine technical search architecture, intent-first content, and AI citation models to help brands establish enduring market visibility.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Image with proper framing */}
          <Reveal>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-purple to-orange rounded-2xl opacity-40" />
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-bg-alt">
                <img
                  src={positioningImg}
                  alt="Himani Kankaria - Founder of Missive Digital & Organic Growth Strategist"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/20 to-transparent" />
              </div>
            </div>
          </Reveal>

          {/* Right: Framework as visual grid */}
          <div ref={ref}>
            <Reveal delay={0.15}>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple mb-6">
                The Growth Flywheel
              </p>
            </Reveal>

            {/* Framework as connected steps */}
            <div className="relative">
              {frameworkSteps.map((step, i) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, x: 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.12, ease: [0.25, 0.4, 0.25, 1] }}
                  className="relative flex items-stretch mb-3 last:mb-0"
                >
                  {/* Step number */}
                  <div
                    className="flex-shrink-0 w-12 flex items-center justify-center rounded-l-xl text-white text-sm font-bold"
                    style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}dd)` }}
                  >
                    {i + 1}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 py-4 px-5 bg-white/70 backdrop-blur-sm rounded-r-xl border border-l-0 border-purple/10 hover:border-purple/25 hover:bg-white transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold tracking-wide text-primary group-hover:text-purple transition-colors">
                          {step.label}
                        </h3>
                        <p className="text-xs text-secondary/60 mt-0.5">{step.desc}</p>
                      </div>
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold opacity-80"
                        style={{ background: step.color }}
                      >
                        →
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Connecting line on left */}
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-purple via-purple-light to-orange opacity-20" />
            </div>

            {/* Bottom note */}
            <Reveal delay={0.5}>
              <p className="mt-8 text-sm text-secondary italic">
                Each step compounds the next. That's how sustainable growth works.
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
