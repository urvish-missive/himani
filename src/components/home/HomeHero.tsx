import { motion } from 'framer-motion';
import { CrownIcon } from '../ui/BrandIcons';
import portraitImg from '../../images/Himani-Kankaria4-684x1024.jpg';

const springy = { type: 'spring', stiffness: 260, damping: 22 } as const;

export default function HomeHero() {
  return (
    <section className="pt-8 pb-10 sm:pt-12 sm:pb-14 lg:pt-16 lg:pb-20 overflow-hidden bg-paper border-b border-rule/60">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-[1.22fr_0.78fr] lg:grid-cols-[1.3fr_0.7fr] gap-8 md:gap-8 lg:gap-12 items-start">
          {/* Left Column: Heading, Subtitle & CTAs */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
          >
            {/* Status location */}
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -14 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="font-display text-[0.82rem] sm:text-[0.95rem] lg:text-[1.05rem] font-semibold flex items-center gap-2 sm:gap-2.5 text-ink tracking-tight"
            >
              <span
                className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#2FA36B] shadow-[0_0_0_3px_rgba(47,163,107,0.25)] shrink-0 animate-pulse"
                aria-hidden="true"
              />
              <span className="shrink-0">Himani Kankaria</span>
              <span className="text-muted/50">•</span>
              <span className="font-normal text-muted text-[0.78rem] sm:text-[0.88rem] truncate">
                Ahmedabad, working globally
              </span>
            </motion.div>

            {/* Title: 3-line editorial layout */}
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="mt-3 sm:mt-4 lg:mt-5 font-display font-extrabold tracking-[-0.03em] sm:tracking-[-0.04em] text-ink text-[clamp(2.15rem,8.5vw,3.2rem)] md:text-[clamp(3.2rem,8vw,5.5rem)] lg:text-[clamp(4.2rem,9.5vw,8.5rem)] leading-[0.96] sm:leading-[0.94] lg:leading-[0.92]"
              aria-label="The Content Queen of India"
            >
              <span className="block">
                <span className="inline-flex items-end gap-[0.14em]">
                  <span>Content</span>
                  <CrownIcon className="w-[0.62em] h-[0.62em] text-gold shrink-0 -translate-y-[0.08em] -rotate-8 hover:rotate-12 transition-transform duration-300" />
                </span>
              </span>
              <span className="block">Queen</span>
              <span className="block">
                <span className="inline-flex items-end gap-[0.14em]">
                  <span className="font-body italic font-normal tracking-[-0.02em] text-[0.56em] text-muted mr-[0.16em]">
                    of
                  </span>
                  <span>India.</span>
                </span>
              </span>
            </motion.h1>

            {/* Attribution */}
            <motion.p
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { duration: 0.5, delay: 0.05 } },
              }}
              className="mt-2.5 sm:mt-3.5 text-muted font-display text-[0.78rem] sm:text-[0.85rem] lg:text-[0.88rem] leading-normal"
            >
              As introduced at WordCamp Asia 2026 and Agile Network India
            </motion.p>

            {/* Subtext */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
              }}
              className="mt-3.5 sm:mt-5 max-w-[48ch] text-[0.92rem] sm:text-[1.02rem] lg:text-[1.12rem] leading-[1.6] sm:leading-[1.65] text-ink/80 font-body"
            >
              Virtual CMO, founder coach, team trainer and international speaker. For 15+ years I've helped B2B, SaaS and tech companies build marketing that makes them the obvious choice.
            </motion.p>

            {/* CTA Row */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 14 },
                visible: { opacity: 1, y: 0, transition: springy },
              }}
              className="flex flex-col min-[480px]:flex-row gap-2.5 sm:gap-3 mt-5 sm:mt-7 w-full min-[480px]:w-auto"
            >
              <a
                href="#cmo"
                className="btn solid text-center justify-center py-2.5 px-4 text-[0.88rem] sm:py-3 sm:px-5 sm:text-base font-semibold shadow-2xs"
              >
                Hire me as your Virtual CMO
              </a>
              <a
                href="#stage"
                className="btn ghost text-center justify-center py-2.5 px-4 text-[0.88rem] sm:py-3 sm:px-5 sm:text-base font-semibold"
              >
                Invite me to speak
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column: Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ ...springy, delay: 0.16 }}
            className="flex flex-col gap-3 max-w-[215px] min-[400px]:max-w-[245px] sm:max-w-[270px] md:max-w-[290px] lg:max-w-[340px] mx-auto md:ml-auto w-full group mt-6 sm:mt-8 md:mt-0 lg:pt-1"
          >
            {/* Confident Portrait Card */}
            <div className="relative aspect-[4/5] rounded-[18px] sm:rounded-[20px] overflow-hidden bg-paper-2 border border-rule shadow-sm img-zoom-hover">
              <img
                src={portraitImg}
                alt="Himani Kankaria, the Content Queen of India"
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Seal Badge */}
              <div className="absolute left-2.5 bottom-2.5 sm:left-3 sm:bottom-3 bg-gold text-gold-ink rounded-full py-1 px-2.5 sm:py-1.5 sm:px-3.5 font-display font-extrabold text-[0.72rem] sm:text-[0.82rem] shadow-[0_6px_16px_-4px_rgba(0,0,0,0.4)] flex items-center gap-1.5 z-10 transition-transform duration-300 hover:scale-105 select-none">
                <CrownIcon className="w-3.5 h-3.5 text-gold-ink shrink-0" />
                <span>Content Queen of India</span>
              </div>
            </div>

            {/* Availability Note */}
            <div className="font-display text-[0.8rem] sm:text-[0.84rem] md:text-[0.88rem] border border-rule rounded-[14px] px-3.5 py-2.5 sm:px-4 sm:py-3 bg-card text-ink leading-snug shadow-2xs">
              <b className="block font-bold text-[0.84rem] sm:text-[0.88rem] md:text-[0.92rem]">
                Now booking for Q4 2026
              </b>
              <span className="text-muted text-[0.76rem] sm:text-[0.8rem] md:text-[0.84rem] mt-0.5 block">
                [2] Virtual CMO seats and [3] training slots open
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
