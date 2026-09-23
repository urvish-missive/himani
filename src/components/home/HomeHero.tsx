import { motion } from 'framer-motion';
import { CrownIcon } from '../ui/BrandIcons';
import portraitImg from '../../images/Himani-Kankaria4-684x1024.jpg';

const springy = { type: 'spring', stiffness: 260, damping: 22 } as const;

export default function HomeHero() {
  return (
    <section className="pt-10 pb-14 sm:pt-14 sm:pb-18 lg:pt-16 lg:pb-20 overflow-hidden bg-paper border-b border-rule/60">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-[1.22fr_0.78fr] lg:grid-cols-[1.3fr_0.7fr] gap-8 md:gap-8 lg:gap-12 items-start">
          {/* Left Column: Heading, Subtitle & CTAs */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.09 } },
            }}
          >
            {/* Status location */}
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -18 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="font-display text-[0.88rem] sm:text-[1rem] lg:text-[1.05rem] font-semibold flex items-center gap-2 sm:gap-2.5 text-ink"
            >
              <span
                className="w-2.5 h-2.5 rounded-full bg-[#2FA36B] shadow-[0_0_0_4px_rgba(47,163,107,0.25)] shrink-0 animate-pulse"
                aria-hidden="true"
              />
              <span className="shrink-0">Himani Kankaria</span>
              <span className="text-muted/60">•</span>
              <small className="font-normal text-muted text-[0.84rem] sm:text-[0.92rem] truncate">
                Ahmedabad, working globally
              </small>
            </motion.div>

            {/* Title: Clean 2-line layout on mobile, same iconic giant 3-line layout on desktop */}
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="mt-3.5 sm:mt-4 lg:mt-5 font-display font-extrabold tracking-[-0.025em] sm:tracking-[-0.035em] lg:tracking-[-0.045em] text-ink text-[clamp(2.1rem,7vw,3.4rem)] lg:text-[clamp(3.6rem,10.5vw,8.5rem)] leading-[1.12] sm:leading-[1.06] lg:leading-[0.92]"
              aria-label="The Content Queen of India"
            >
              {/* Content */}
              <span className="inline-flex items-end gap-[0.12em]">
                <span>Content</span>
                <CrownIcon className="w-[0.62em] h-[0.62em] text-gold shrink-0 -translate-y-[0.08em] -rotate-8 hover:rotate-12 transition-transform duration-300 hidden lg:inline-block" />
              </span>{' '}
              {/* Mobile: Queen stays on line 1 with crown */}
              <span className="lg:hidden inline-flex items-end gap-[0.12em]">
                <span>Queen</span>
                <CrownIcon className="w-[0.58em] h-[0.58em] text-gold shrink-0 -translate-y-[0.06em] -rotate-8 hover:rotate-12 transition-transform duration-300" />
              </span>

              {/* Desktop: Queen on separate line */}
              <br className="hidden lg:inline" />
              <span className="hidden lg:inline">Queen</span>
              <br />

              {/* of India. */}
              <span className="inline-flex items-end gap-[0.12em]">
                <span className="font-body italic font-normal tracking-[-0.02em] text-[0.58em] lg:text-[0.55em] text-muted mr-[0.16em] lg:mr-[0.18em]">
                  of
                </span>
                <span>India.</span>
              </span>
            </motion.h1>

            {/* Attribution */}
            <motion.p
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { duration: 0.5, delay: 0.05 } },
              }}
              className="mt-3 sm:mt-3.5 text-muted font-display text-[0.84rem] sm:text-[0.88rem] leading-normal"
            >
              As introduced at WordCamp Asia 2026 and Agile Network India
            </motion.p>

            {/* Subtext */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
              }}
              className="mt-4 sm:mt-5 max-w-[50ch] text-[0.98rem] sm:text-[1.06rem] lg:text-[1.12rem] leading-[1.65] text-ink/90 font-body"
            >
              Virtual CMO, founder coach, team trainer and international speaker. For 15+ years I've helped B2B, SaaS and tech companies build marketing that makes them the obvious choice.
            </motion.p>

            {/* CTA Row */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: springy },
              }}
              className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-7 w-full sm:w-auto"
            >
              <a href="#cmo" className="btn solid text-center justify-center w-full sm:w-auto py-3 px-5 text-sm sm:text-base">
                Hire me as your Virtual CMO
              </a>
              <a href="#stage" className="btn ghost text-center justify-center w-full sm:w-auto py-3 px-5 text-sm sm:text-base">
                Invite me to speak
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column: Portrait — springs in with a subtle rotation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, rotate: 3, y: 30 }}
            animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
            transition={{ ...springy, delay: 0.18 }}
            className="flex flex-col gap-3.5 max-w-[270px] sm:max-w-[300px] md:max-w-[290px] lg:max-w-[340px] mx-auto md:ml-auto w-full group mt-8 md:mt-0 lg:pt-1"
          >
            {/* Confident Portrait Card */}
            <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden bg-paper-2 border border-rule shadow-sm img-zoom-hover">
              <img
                src={portraitImg}
                alt="Himani Kankaria, the Content Queen of India"
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Seal Badge */}
              <div className="absolute left-3 bottom-3 bg-gold text-gold-ink rounded-full py-1.5 px-3 sm:px-3.5 font-display font-extrabold text-[0.76rem] sm:text-[0.82rem] shadow-[0_8px_20px_-6px_rgba(0,0,0,0.45)] flex items-center gap-1.5 z-10 transition-transform duration-300 hover:scale-105 select-none">
                <CrownIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-ink shrink-0" />
                <span>Content Queen of India</span>
              </div>
            </div>

            {/* Availability Note */}
            <div className="font-display text-[0.84rem] sm:text-[0.88rem] border border-rule rounded-[14px] px-4 py-3 bg-card text-ink leading-snug shadow-2xs">
              <b className="block font-bold text-[0.88rem] sm:text-[0.92rem]">Now booking for Q4 2026</b>
              <span className="text-muted text-[0.8rem] sm:text-[0.84rem] mt-0.5 block">
                [2] Virtual CMO seats and [3] training slots open
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
