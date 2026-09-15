import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Container from './ui/Container';
import Reveal from './ui/Reveal';
import { caseStudies } from '../data/caseStudies';
import marketingImg from '../images/himanimarketing.jpg';

export default function CaseStudies() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px 0px" });

  return (
    <section className="py-20 md:py-32 lg:py-40 bg-gradient-to-br from-bg-alt/50 to-orange/5 overflow-hidden">
      <Container>
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-orange mb-4">
            Results
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.15] text-primary mb-4">
            Strategy is interesting.<br />
            <span className="gradient-text">Outcomes matter more.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-base text-secondary max-w-xl mb-16">
            Real results from real engagements. Every project is different, but the principles remain consistent.
          </p>
        </Reveal>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {caseStudies.map((study, i) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
              className="group relative bg-white/70 backdrop-blur-sm rounded-2xl border border-purple/20 overflow-hidden hover:border-purple/30 hover:shadow-lg hover:shadow-purple/10 transition-all duration-500"
            >
              {/* Image with zoom on hover */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={marketingImg}
                  alt={`Case study: ${study.headline}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/40 to-transparent" />
                
                {/* Number overlay */}
                <div className="absolute top-4 left-4">
                  <span className="text-3xl font-serif gradient-text opacity-60">{study.number}</span>
                </div>
              </div>

              <div className="p-6 md:p-8">
                {/* Category */}
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-orange">
                  {study.category}
                </span>

                <h3 className="text-lg md:text-xl font-semibold text-primary mt-2 mb-3 group-hover:text-purple transition-colors duration-300">
                  {study.headline}
                </h3>

                <p className="text-sm text-secondary leading-relaxed mb-6">
                  {study.challenge}
                </p>

                {/* Impact metrics */}
                <div className="flex gap-6 pt-4 border-t border-purple/10">
                  {study.impact.map((metric) => (
                    <div key={metric.label}>
                      <div className="text-xl font-bold gradient-text">{metric.value}</div>
                      <div className="text-[10px] text-secondary/60 mt-0.5">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
