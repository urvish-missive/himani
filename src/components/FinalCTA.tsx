import { motion } from 'framer-motion';
import Container from './ui/Container';
import Reveal from './ui/Reveal';
import CTAButton from './ui/CTAButton';

export default function FinalCTA() {
  return (
    <section id="contact" className="relative py-14 md:py-20 bg-gradient-to-br from-dark via-dark-card to-dark overflow-hidden">
      {/* Animated gradient blobs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, var(--color-purple) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, var(--color-orange) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.25, 0.15, 0.25],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      <Container className="relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-white mb-6">
              Let's re-architect your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-light to-orange-light">organic growth</span>.
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-base md:text-lg text-white/60 leading-relaxed max-w-xl mx-auto mb-12">
              Whether you need strategic search consulting, team training, executive advisory, or a keynote speaker for your global conference—tell us what you're working on.
            </p>
          </Reveal>

          {/* Two main CTA buttons */}
          <Reveal delay={0.2}>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
              <CTAButton href="#services" variant="primary" size="lg">
                Work With Us
              </CTAButton>
              <CTAButton href="/#hire" variant="gradient-border-dark" size="lg">
                Send me a brief
              </CTAButton>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="text-sm text-white/40">
              <a href="mailto:info@missivedigital.com" className="hover:text-white transition-colors">
                info@missivedigital.com
              </a>
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
