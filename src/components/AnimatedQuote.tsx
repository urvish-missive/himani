import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Container from './ui/Container';

const words = ['Strategy', 'Systems', 'Skills'];

export default function AnimatedQuote() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px 0px" });

  return (
    <section ref={ref} className="py-20 md:py-32 lg:py-40 bg-bg overflow-hidden">
      <Container>
        <div className="max-w-5xl mx-auto text-center">
          {/* Animated word reveal */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8">
            {words.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 40, rotateX: -90 }}
                animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.2, ease: [0.25, 0.4, 0.25, 1] }}
                className="font-serif text-5xl md:text-7xl lg:text-8xl text-primary"
              >
                {word}
              </motion.span>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="font-serif text-2xl md:text-3xl text-secondary italic"
          >
            For modern marketing teams.
          </motion.p>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            className="mt-12 mx-auto w-24 h-0.5 bg-gradient-to-r from-purple to-orange origin-center"
          />
        </div>
      </Container>
    </section>
  );
}
