import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Container from './ui/Container';
import Reveal from './ui/Reveal';
import { X, Check } from 'lucide-react';

const beforeItems = [
  "Random acts of content",
  "Chasing vanity search volume",
  "Channel & team silos",
  "Vulnerable to AI search disruption",
  "Over-reliance on rising paid CAC",
  "Disconnected revenue attribution"
];

const afterItems = [
  "Intent-led Citation Architecture",
  "High-converting topical authority",
  "Integrated growth operating models",
  "Cited across ChatGPT & Perplexity",
  "Compounding organic buyer pipeline",
  "Measurable MQL, SQL & revenue impact"
];

export default function CoachingTransformation() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px 0px" });

  return (
    <section className="py-20 md:py-28 lg:py-36 bg-bg overflow-hidden">
      <Container>
        <div className="text-center mb-16">
          <Reveal>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.15] text-primary">
              What changes when organic search<br className="hidden md:block" /> gets re-architected?
            </h2>
          </Reveal>
        </div>

        <div ref={ref} className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 md:gap-0 items-start">
            {/* Before */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
              className="p-8 rounded-2xl border border-red-200 bg-red-50/50"
            >
              <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-red-500 mb-8">
                Before
              </h3>
              <ul className="space-y-4">
                {beforeItems.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                    className="flex items-center gap-3 text-sm text-secondary"
                  >
                    <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <X className="w-3 h-3 text-red-400" />
                    </span>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Divider */}
            <div className="hidden md:flex flex-col items-center px-8">
              <motion.div
                initial={{ scaleY: 0 }}
                animate={isInView ? { scaleY: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
                className="w-0.5 h-full bg-gradient-to-b from-purple to-orange origin-top min-h-[300px]"
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-purple to-orange flex items-center justify-center -ml-px shadow-lg"
              >
                <span className="text-white text-xs font-bold">→</span>
              </motion.div>
            </div>

            {/* Mobile divider */}
            <div className="md:hidden flex justify-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple to-orange flex items-center justify-center shadow-lg">
                <span className="text-white text-xs font-bold">→</span>
              </div>
            </div>

            {/* After */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
              className="p-8 rounded-2xl border border-purple/20 bg-purple/5"
            >
              <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-purple mb-8">
                After
              </h3>
              <ul className="space-y-4">
                {afterItems.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: 10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                    className="flex items-center gap-3 text-sm text-primary"
                  >
                    <span className="w-5 h-5 rounded-full bg-purple/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-purple" />
                    </span>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
