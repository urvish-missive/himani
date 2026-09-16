import { motion } from 'framer-motion';
import Container from './ui/Container';
import CTAButton from './ui/CTAButton';
import heroImage from '../images/himanimain.jpg';

const floatingLabels = [
  { text: 'SEO', x: '8%', y: '12%', delay: 0 },
  { text: 'GEO', x: '72%', y: '8%', delay: 0.5 },
  { text: 'AI Search', x: '82%', y: '42%', delay: 1 },
  { text: 'Citations', x: '5%', y: '68%', delay: 1.5 },
  { text: 'Organic', x: '78%', y: '72%', delay: 2 },
  { text: 'Authority', x: '10%', y: '38%', delay: 0.8 },
  { text: 'Content', x: '68%', y: '22%', delay: 1.2 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] } }
};

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-between overflow-hidden pt-16 sm:pt-32 md:pt-28 pb-8 md:pb-12">
      {/* Background with soft ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple/5 via-bg to-orange/5" />
      <div className="absolute top-16 right-10 md:right-20 w-64 md:w-80 h-64 md:h-80 bg-purple/10 rounded-full blur-[90px] md:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 md:left-20 w-72 md:w-96 h-72 md:h-96 bg-orange/10 rounded-full blur-[100px] md:blur-[130px] pointer-events-none" />

      <Container className="relative z-10 w-full my-auto py-4 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px] gap-8 lg:gap-12 items-center">
          {/* Left: Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="min-w-0 text-center lg:text-left"
          >
            {/* Pill Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple/5 border border-purple/20 backdrop-blur-sm mb-5 shadow-xs">
              <span className="!min-w-2 h-2 rounded-full bg-gradient-to-r from-purple to-orange animate-pulse" />
              <span className="text-[11px] sm:text-xs font-semibold tracking-[0.16em] uppercase text-purple">
                Founder, Missive Digital · Organic Strategist · Speaker · Consultant
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-primary mb-4"
            >
              Himani Kankaria
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[2.25rem] leading-[1.18] text-primary/85 mb-5 max-w-2xl mx-auto lg:mx-0"
            >
              Helping brands re-architect organic growth in an AI-first world.
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg text-secondary leading-relaxed max-w-xl mx-auto lg:mx-0 mb-7"
            >
              Led by Himani Kankaria, Missive Digital works with ambitious B2B SaaS, tech brands, and marketing leaders to turn SEO, content architecture, and AI search into compounding growth engines.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6">
              <CTAButton variant="primary" size="lg" target="_blank" rel="noopener noreferrer">Work With Me</CTAButton>
              <CTAButton variant="secondary" size="lg" href="#services">Explore My Work</CTAButton>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-xs text-secondary/60 tracking-wide"
            >
              Organic Growth Consulting · 1:1 Executive Mentorship · Corporate Training · Global Keynotes
            </motion.p>
          </motion.div>

          {/* Right: Portrait - Visible on both mobile and desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
            className="relative flex justify-center lg:justify-end mt-4 lg:mt-0"
          >
            <div className="relative w-full max-w-[240px] sm:max-w-[270px] lg:max-w-[300px] xl:max-w-[330px]">
              {/* Gradient frame glow */}
              <div className="absolute -inset-[3px] bg-gradient-to-br from-purple via-purple-light to-orange rounded-2xl opacity-60 blur-xs" />
              
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-bg-alt shadow-xl shadow-purple/10">
                <img
                  src={heroImage}
                  alt="Himani Kankaria - Founder of Missive Digital, Organic Marketing Strategist and Speaker"
                  className="w-full h-full object-cover object-top"
                  loading="eager"
                />

                {/* Floating labels */}
                <div className="hidden sm:block">
                  {floatingLabels.map((label) => (
                    <motion.div
                      key={label.text}
                      className="absolute text-[10px] font-semibold tracking-wider text-purple/70 uppercase pointer-events-none"
                      style={{ left: label.x, top: label.y }}
                      animate={{ y: [0, -4, 0], opacity: [0.6, 0.9, 0.6] }}
                      transition={{ duration: 5, repeat: Infinity, delay: label.delay, ease: 'easeInOut' }}
                    >
                      <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-purple/20 shadow-xs">
                        {label.text}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-dark/20 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Corner accents */}
              <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-purple rounded-tl-xl opacity-60 pointer-events-none" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-orange rounded-br-xl opacity-60 pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Scroll indicator - cleanly positioned below content, hidden on small mobile to avoid any overlap */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="relative z-10 hidden md:flex flex-col items-center justify-center pt-4 pb-2"
      >
        <a href="#services" aria-label="Scroll down to explore" className="group flex flex-col items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-secondary/40 group-hover:text-purple transition-colors">Scroll</span>
          <div className="w-5 h-8 border-2 border-purple/25 group-hover:border-purple/50 rounded-full flex items-start justify-center pt-1.5 transition-colors">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-1.5 bg-gradient-to-b from-purple to-orange rounded-full"
            />
          </div>
        </a>
      </motion.div>

      {/* Bottom transition border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple/20 to-transparent" />
    </section>
  );
}
