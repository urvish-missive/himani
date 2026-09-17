import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import Container from './ui/Container';
import Reveal from './ui/Reveal';
import CTAButton from './ui/CTAButton';
import approachImg from '../images/himanimainimage.jpg';
import { trainingTracks } from '../data/services';
import { PenTool, Briefcase, Users2, Sparkles, ArrowUpRight } from 'lucide-react';

const trackIcons = [PenTool, Briefcase, Users2, Sparkles];

export default function TrainingShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px 0px" });

  return (
    <section id="training" className="relative py-12 md:py-16 bg-gradient-to-br from-dark via-dark-card to-dark overflow-hidden text-white">
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/3 w-48 md:w-96 h-48 md:h-96 bg-purple/10 rounded-full blur-[80px] md:blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-48 md:w-96 h-48 md:h-96 bg-orange/10 rounded-full blur-[80px] md:blur-[150px] pointer-events-none" />

      {/* Noise */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      <Container className="relative z-10 px-5 md:px-8">
        {/* Header */}
        <div className="mb-8 md:mb-10 max-w-3xl">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-orange/80 mb-3 md:mb-4">
              Corporate &amp; Team Training
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-[1.15] text-white mb-4">
              Transforming teams across{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-light to-orange-light">
                4 specialized training tracks
              </span>.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-sm sm:text-base text-white/65 leading-relaxed">
              Hands-on corporate enablement, LinkedIn executive branding, search-intent writing, and the signature Content Writers' Symposium — built on live audits and actionable frameworks.
            </p>
          </Reveal>
        </div>

        {/* 4 Training Tracks Grid */}
        <div className="lg:grid lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_380px] lg:gap-12 lg:items-center">
          <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {trainingTracks.map((track, i) => {
              const Icon = trackIcons[i % trackIcons.length];
              return (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
                  className="group relative p-5 md:p-6 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-purple/40 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-purple/20 border border-purple/30 flex items-center justify-center text-orange-light">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/10 text-white/70">
                        {track.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-white mb-2 group-hover:text-orange-light transition-colors">
                      {track.title}
                    </h3>
                    <p className="text-xs text-white/60 leading-relaxed line-clamp-3 mb-4">
                      {track.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-white/40 text-[11px]">{track.tagline}</span>
                    <Link
                      to="/training"
                      className="inline-flex items-center gap-1 font-semibold text-orange-light group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Details</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Desktop only: side image */}
          <Reveal delay={0.3} className="hidden lg:block">
            <div className="relative mt-8 lg:mt-0">
              <div className="absolute -inset-1 bg-gradient-to-br from-purple to-orange rounded-2xl opacity-30" />
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                <img
                  src={approachImg}
                  alt="Himani Kankaria - Corporate Training & Masterclasses"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <p className="font-serif text-lg font-bold">120+ Teams Trained</p>
                  <p className="text-xs text-white/70">Semrush, Hootsuite &amp; Global Enterprises</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* CTA */}
        <Reveal delay={0.4}>
          <div className="mt-10 md:mt-14 flex flex-wrap items-center gap-4">
            <CTAButton href="/training" variant="dark">Explore All 4 Training Tracks</CTAButton>
            <Link
              to="/#contact"
              className="text-xs md:text-sm font-semibold text-white/70 hover:text-white transition-colors"
            >
              Inquire for In-House Corporate Training →
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
