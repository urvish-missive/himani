import { motion } from 'framer-motion';
import Container from './ui/Container';
import CTAButton from './ui/CTAButton';
import heroImage from '../images/himanimain.jpg';

const floatingLabels = [
  { text: 'SEO', x: '8%', y: '12%', delay: 0 },
  { text: 'Content', x: '72%', y: '8%', delay: 0.5 },
  { text: 'AI', x: '82%', y: '42%', delay: 1 },
  { text: 'Growth', x: '5%', y: '68%', delay: 1.5 },
  { text: 'Social', x: '78%', y: '72%', delay: 2 },
  { text: 'Brand', x: '10%', y: '38%', delay: 0.8 },
  { text: 'Strategy', x: '68%', y: '22%', delay: 1.2 },
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
    <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple/5 via-bg to-orange/5" />
      <div className="absolute top-20 right-20 w-72 h-72 bg-purple/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-orange/10 rounded-full blur-[120px]" />

      <Container className="relative z-10 w-full py-8 md:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_320px] gap-8 lg:gap-12 items-center">
          {/* Left: Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="min-w-0"
          >
            <motion.p
              variants={itemVariants}
              className="text-xs font-semibold tracking-[0.2em] uppercase text-purple mb-4"
            >
              Marketing Strategist · Speaker · Coach · Consultant
            </motion.p>

            <motion.h1
              variants={itemVariants}
              className="font-serif text-[2.25rem] md:text-5xl lg:text-[3rem] xl:text-[3.5rem] leading-[1.08] text-primary mb-5"
            >
              Helping brands and marketers master growth in an AI-first world.
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg text-secondary leading-relaxed max-w-xl mb-7"
            >
              I work with ambitious marketing teams, leaders and professionals to turn SEO, content, social media, AI and digital strategy into scalable growth systems.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-5">
              <CTAButton variant="primary" size="lg">Work With Me</CTAButton>
              <CTAButton variant="secondary" size="lg" href="#services">Explore My Work</CTAButton>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-xs text-secondary/50 tracking-wide"
            >
              Speaking · Consulting · Coaching · Corporate Training
            </motion.p>
          </motion.div>

          {/* Right: Portrait - tightly constrained */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full max-w-[280px] xl:max-w-[320px] ml-auto">
              {/* Gradient frame */}
              <div className="absolute -inset-[3px] bg-gradient-to-br from-purple to-orange rounded-2xl opacity-60" />
              
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-bg-alt">
                <img
                  src={heroImage}
                  alt="Himani Sharma - Marketing Strategist and Speaker"
                  className="w-full h-full object-cover object-top"
                  loading="eager"
                />

                {/* Floating labels */}
                {floatingLabels.map((label) => (
                  <motion.div
                    key={label.text}
                    className="absolute text-[10px] font-semibold tracking-wider text-purple/60 uppercase"
                    style={{ left: label.x, top: label.y }}
                    animate={{ y: [0, -5, 0], opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 6, repeat: Infinity, delay: label.delay, ease: 'easeInOut' }}
                  >
                    <span className="px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-purple/20 shadow-sm">
                      {label.text}
                    </span>
                  </motion.div>
                ))}

                <div className="absolute inset-0 bg-gradient-to-t from-bg/20 to-transparent" />
              </div>
            </div>

            {/* Corner accents */}
            <div className="absolute -top-2 -left-2 w-10 h-10 border-l-2 border-t-2 border-purple rounded-tl-xl opacity-40" />
            <div className="absolute -bottom-2 -right-2 w-10 h-10 border-r-2 border-b-2 border-orange rounded-br-xl opacity-40" />
          </motion.div>
        </div>
      </Container>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 border-2 border-purple/30 rounded-full flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 bg-gradient-to-b from-purple to-orange rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
