import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Container from './ui/Container';
import Reveal from './ui/Reveal';
import aboutPortrait from '../images/Himani-Kankaria4-684x1024.jpg';

const timeline = [
  { year: '2008', event: 'Started in Marketing' },
  { year: '2012', event: 'Built & Led Teams' },
  { year: '2016', event: 'Advised Brands' },
  { year: '2019', event: 'Started Teaching' },
  { year: '2022', event: 'Conference Speaking' },
  { year: '2024', event: 'AI & Modern Marketing' },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px 0px" });

  return (
    <section id="about" className="py-20 md:py-32 lg:py-40 bg-gradient-to-br from-bg-alt/30 to-orange/5 overflow-hidden">
      <Container>
        {/* Header */}
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-orange mb-4">
            About
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.15] text-primary mb-16">
            A marketer who never stopped <span className="gradient-text">being a student</span>.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Portrait first */}
          <Reveal delay={0.15}>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-purple to-orange rounded-2xl opacity-50" />
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-bg-alt">
                <img
                  src={aboutPortrait}
                  alt="Himani Sharma - Marketing Strategist"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
              {/* Glow */}
              <div className="absolute -inset-6 bg-gradient-to-br from-purple/15 to-orange/15 rounded-3xl blur-2xl -z-10" />
            </div>
          </Reveal>

          {/* Right: Description then timeline */}
          <div className="flex flex-col gap-8">
            <Reveal delay={0.2}>
              <div className="space-y-4">
                <p className="text-base text-secondary leading-relaxed">
                  My career has lived at the intersection of strategy, execution and education. I've spent years studying how people discover brands, how ideas spread, how marketing systems compound and how technology changes the way teams work.
                </p>
                <p className="text-base text-secondary leading-relaxed">
                  Today I divide my time between advising organizations, mentoring marketers, teaching teams and speaking about where marketing is heading next.
                </p>
              </div>
            </Reveal>

            {/* Timeline */}
            <div ref={ref} className="mt-4">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
                  className="relative pl-10 pb-6 last:pb-0"
                >
                  {/* Connecting line */}
                  {i < timeline.length - 1 && (
                    <div className="absolute left-[7px] top-4 w-0.5 h-full bg-gradient-to-b from-purple/30 to-orange/30" />
                  )}
                  {/* Dot */}
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-gradient-to-br from-purple to-orange shadow-md ring-4 ring-bg-alt" />
                  
                  <span className="text-xs font-semibold tracking-wider text-orange">
                    {item.year}
                  </span>
                  <p className="text-sm font-medium text-primary mt-0.5">
                    {item.event}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
