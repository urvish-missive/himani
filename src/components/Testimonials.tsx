import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from './ui/Container';
import Reveal from './ui/Reveal';
import { testimonials } from '../data/testimonials';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

// Filter out Aleyda Solis here because her keynote testimonial is already featured above in ConferenceShowcase
const homeTestimonials = testimonials.filter((t) => t.id !== 1);

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => setCurrentIndex((i) => (i + 1) % homeTestimonials.length), []);
  const prev = useCallback(() => setCurrentIndex((i) => (i - 1 + homeTestimonials.length) % homeTestimonials.length), []);

  // Auto-scroll every 4 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  return (
    <section
      className="py-12 md:py-16 bg-gradient-to-br from-bg-alt/50 to-purple/5"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <Container>
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple mb-3 text-center">
            Testimonials
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.15] text-primary mb-8 md:mb-10 text-center">
            What leaders and marketers say.
          </h2>
        </Reveal>

        {/* Quote carousel */}
        <div className="max-w-4xl mx-auto text-center relative min-h-[280px] md:min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <Quote className="w-10 h-10 text-purple/20 mx-auto mb-6" />
              <blockquote className="text-xl md:text-2xl lg:text-3xl font-serif text-primary leading-relaxed mb-8">
                "{homeTestimonials[currentIndex].quote}"
              </blockquote>
              <div>
                <p className="text-sm font-semibold text-primary">
                  {homeTestimonials[currentIndex].author}
                </p>
                <p className="text-xs text-secondary mt-1">
                  {homeTestimonials[currentIndex].role} — {homeTestimonials[currentIndex].company}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-12">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-purple/20 flex items-center justify-center hover:border-purple/40 hover:bg-purple/5 transition-all duration-200"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-4 h-4 text-secondary" />
          </button>
          <div className="flex gap-2">
            {homeTestimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'bg-gradient-to-r from-purple to-orange w-6'
                    : 'bg-purple/20 hover:bg-purple/30 w-2'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-10 h-10 rounded-full border border-purple/20 flex items-center justify-center hover:border-purple/40 hover:bg-purple/5 transition-all duration-200"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-4 h-4 text-secondary" />
          </button>
        </div>
      </Container>
    </section>
  );
}
