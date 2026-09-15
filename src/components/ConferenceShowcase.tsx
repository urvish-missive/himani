import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import Container from './ui/Container';
import Reveal from './ui/Reveal';
import CTAButton from './ui/CTAButton';
import { speakingEngagements, speakingTestimonial } from '../data/speaking';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import stagePhoto from '../images/hiimanisasspeaker.jpg';
import speakerThumb from '../images/himanispeaker.jpg';

export default function ConferenceShowcase() {
  const ref = useRef(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px 0px" });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener('scroll', checkScroll);
  }, [checkScroll]);

  // Auto-scroll every 4 seconds
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || isPaused) return;

    const cardWidth = 300; // approximate card + gap width
    let direction = 1;
    const timer = setInterval(() => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      
      if (scrollLeft >= scrollWidth - clientWidth - 10) {
        direction = -1;
      } else if (scrollLeft <= 10) {
        direction = 1;
      }
      
      el.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
    }, 4000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = dir === 'left' ? -300 : 300;
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <section id="speaking" className="relative py-16 md:py-24 lg:py-32 bg-gradient-to-br from-dark via-dark-card to-dark overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple/20 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange/20 rounded-full blur-[150px]" />

      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      <Container className="relative z-10 px-5 md:px-8">
        {/* Header */}
        <div className="mb-10 md:mb-16">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-orange/60 mb-4">
              Speaking
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.15] text-white mb-4">
              From boardrooms to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-light to-orange-light">conference stages</span>.
            </h2>
          </Reveal>
        </div>

        {/* Stage photo */}
        <Reveal>
          <div className="relative mb-16">
            <div className="absolute -inset-1 bg-gradient-to-br from-purple to-orange rounded-2xl opacity-30" />
            <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden">
              <img
                src={stagePhoto}
                alt="Himani Sharma speaking at a conference"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-dark/20 to-transparent" />
              
              {/* Speaker badge */}
              <div className="absolute bottom-6 left-6 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                  <img src={speakerThumb} alt="Himani" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Himani Sharma</p>
                  <p className="text-xs text-white/50">Global Marketing Speaker</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Timeline with auto-scroll */}
        <div
          ref={ref}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation buttons */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-white/40 tracking-wider uppercase">Recent Engagements</p>
            <div className="flex gap-2">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Scrollable cards */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 md:-mx-8 md:px-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {speakingEngagements.map((engagement, i) => (
              <motion.div
                key={engagement.id}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="w-72 flex-shrink-0 p-6 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-purple/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-orange">{engagement.year}</span>
                  <span className="text-xs text-white/30">{engagement.country}</span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">{engagement.conference}</h3>
                <p className="text-xs text-white/40 mb-3">{engagement.location}</p>
                <div className="inline-block text-[10px] font-medium px-2.5 py-1 rounded-full bg-gradient-to-r from-purple/20 to-orange/20 text-white/70 border border-white/10">
                  {engagement.topic}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <Reveal delay={0.3}>
          <div className="mt-16 flex items-start gap-4 max-w-2xl">
            <Quote className="w-8 h-8 text-orange/40 flex-shrink-0 mt-1" />
            <div>
              <p className="text-lg md:text-xl text-white/80 font-serif italic leading-relaxed">
                "{speakingTestimonial.quote}"
              </p>
              <p className="mt-3 text-xs text-white/40">
                — {speakingTestimonial.author}, {speakingTestimonial.event}
              </p>
            </div>
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal delay={0.4}>
          <div className="mt-12">
            <CTAButton variant="dark">Speaking Enquiries</CTAButton>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
