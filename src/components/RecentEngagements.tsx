import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Container from './ui/Container';
import Reveal from './ui/Reveal';
import { speakingEngagements } from '../data/speaking';

export default function RecentEngagements() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [isPaused, setIsPaused] = useState(false);
  const doubled = [...speakingEngagements, ...speakingEngagements];

  return (
    <section className="relative py-12 md:py-16 bg-gradient-to-br from-dark via-dark-card to-dark overflow-hidden text-white">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange/15 rounded-full blur-[160px] pointer-events-none" />

      {/* Noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <Container className="relative z-10 mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-orange-light text-xs font-semibold uppercase tracking-widest mb-4 backdrop-blur-sm shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Global Stages & Conferences</span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-[1.15] text-white">
                Recent Engagements &{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-light to-orange-light">
                  Keynotes
                </span>
                .
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-3 text-sm sm:text-base text-white/65 leading-relaxed">
                Keynote speaker and panelist across premier global &amp; national search summits — including the
                International Search Summit (Barcelona), WordCamp Asia, Agile Network India, eChai Ventures, and BrightonSEO.
              </p>
            </Reveal>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-xs text-white/60">
              <Sparkles className="w-3.5 h-3.5 text-orange" />
              <span>Hover cards to pause</span>
            </div>
          </div>
        </div>
      </Container>

      {/* Autoscroll Marquee */}
      <div
        ref={ref}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative overflow-hidden marquee-fade py-2 cursor-pointer"
      >
        <div
          style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
          className="flex w-max gap-4 marquee-track"
        >
          {doubled.map((engagement, i) => (
            <motion.div
              key={`${engagement.id}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: (i % speakingEngagements.length) * 0.08 }}
              className="w-80 flex-shrink-0 p-6 rounded-xl border border-white/10 bg-dark-card/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:bg-dark-card hover:border-purple/30 transition-colors duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-orange tracking-wide">{engagement.year}</span>
                <span className="text-xs text-white/40">{engagement.country}</span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1 leading-snug">{engagement.conference}</h3>
              <p className="text-xs text-white/50 mb-3">{engagement.location}</p>
              <div className="inline-block text-[10px] font-medium px-2.5 py-1 rounded-full bg-gradient-to-r from-purple/20 to-orange/20 text-white/80 border border-white/10 line-clamp-1" title={engagement.topic}>
                {engagement.topic}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
