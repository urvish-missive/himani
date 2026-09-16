import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Container from './ui/Container';
import Reveal from './ui/Reveal';
import CTAButton from './ui/CTAButton';
import { speakingEngagements, speakingTestimonial } from '../data/speaking';
import { Quote } from 'lucide-react';
import stagePhoto from '../images/hiimanisasspeaker.jpg';
import speakerThumb from '../images/himanispeaker.jpg';

export default function ConferenceShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px 0px" });
  const doubled = [...speakingEngagements, ...speakingEngagements];

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
                alt="Himani Kankaria speaking at BrightonSEO"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-dark/20 to-transparent" />
              
              {/* Speaker badge */}
              <div className="absolute bottom-6 left-6 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                  <img src={speakerThumb} alt="Himani Kankaria" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Himani Kankaria</p>
                  <p className="text-xs text-white/50">Founder, Missive Digital & International Speaker</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Marquee */}
        <div ref={ref}>
          <p className="text-xs text-white/40 tracking-wider uppercase mb-5">Recent Engagements</p>

          <div className="relative group/marquee overflow-hidden marquee-fade py-2">
            <div className="flex w-max gap-4 marquee-track group-hover/marquee:[animation-play-state:paused]">
              {doubled.map((engagement, i) => (
                <motion.div
                  key={`${engagement.id}-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: (i % speakingEngagements.length) * 0.08 }}
                  className="w-72 flex-shrink-0 p-6 rounded-xl border border-white/10 bg-dark-card/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:bg-dark-card hover:border-purple/30 transition-colors duration-300"
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
