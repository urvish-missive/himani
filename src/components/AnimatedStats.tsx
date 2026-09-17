import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Container from './ui/Container';

const words = [
  { text: 'Audit', color: 'text-purple' },
  { text: 'Architect', color: 'text-primary' },
  { text: 'Compound', color: 'text-orange' },
];

export default function AnimatedStats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-12 md:py-16 bg-bg overflow-hidden">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Large animated words */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-12">
            {words.map((word, i) => (
              <motion.div
                key={word.text}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.7, delay: i * 0.2, ease: [0.25, 0.4, 0.25, 1] }}
                className="relative"
              >
                <span className={`font-serif text-6xl md:text-8xl lg:text-9xl ${word.color} tracking-tight`}>
                  {word.text}
                </span>
                {i < words.length - 1 && (
                  <span className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 text-2xl md:text-3xl text-secondary/30">
                    ·
                  </span>
                )}
              </motion.div>
            ))}
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center text-lg md:text-xl text-secondary max-w-xl mx-auto"
          >
            That's how Missive Digital delivers sustainable results. Data-driven audits, engineered search architecture, and compounding revenue.
          </motion.p>

          {/* Animated line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.9, ease: [0.25, 0.4, 0.25, 1] }}
            className="mt-10 mx-auto w-32 h-0.5 bg-gradient-to-r from-purple to-orange origin-center"
          />
        </div>
      </Container>
    </section>
  );
}
