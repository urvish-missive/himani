import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Container from './ui/Container';
import Reveal from './ui/Reveal';
import { compoundFramework } from '../data/framework';

export default function Framework() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 lg:py-40 bg-gradient-to-br from-bg to-purple/5">
      <Container>
        <div className="text-center mb-16">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple mb-4">
              How I Think About Growth
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.15] text-primary mb-4">
              <span className="gradient-text">{compoundFramework.fullName}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-lg text-secondary italic font-serif">
              "{compoundFramework.tagline}"
            </p>
          </Reveal>
        </div>

        {/* Framework visualization */}
        <div ref={ref} className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {compoundFramework.steps.map((step, i) => (
              <motion.div
                key={step.letter}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.25, 0.4, 0.25, 1] }}
                className="group relative p-6 rounded-2xl border border-purple/20 bg-white/70 backdrop-blur-sm hover:bg-white hover:border-purple/30 hover:shadow-lg hover:shadow-purple/10 transition-all duration-300"
              >
                <div className="text-4xl font-serif gradient-text opacity-30 group-hover:opacity-60 transition-opacity duration-300 mb-3">
                  {step.letter}
                </div>
                <h3 className="text-sm font-semibold text-primary mb-2">
                  {step.word}
                </h3>
                <p className="text-xs text-secondary/70 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
