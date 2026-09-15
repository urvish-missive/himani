import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Container from './ui/Container';
import Reveal from './ui/Reveal';
import CTAButton from './ui/CTAButton';
import approachImg from '../images/himanimainimage.jpg';
import { Search, Lightbulb, Rocket, BarChart3 } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Discover',
    description: 'Deep-dive into your business, audience, competitors and current marketing performance.',
    color: '#7C3AED',
  },
  {
    icon: Lightbulb,
    title: 'Design',
    description: 'Build a strategic framework tailored to your goals, resources and market position.',
    color: '#A78BFA',
  },
  {
    icon: Rocket,
    title: 'Deploy',
    description: 'Implement with your team using hands-on workshops, clear workflows and proven systems.',
    color: '#F97316',
  },
  {
    icon: BarChart3,
    title: 'Double Down',
    description: 'Measure what works, iterate fast and scale the strategies that compound.',
    color: '#FB923C',
  },
];

export default function TrainingShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 md:py-32 lg:py-40 bg-gradient-to-br from-dark via-dark-card to-dark overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-orange/10 rounded-full blur-[150px]" />

      {/* Noise */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      <Container className="relative z-10">
        {/* Header */}
        <div className="mb-16">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-orange/60 mb-4">
              My Approach
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.15] text-white mb-4">
              Every engagement follows <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-light to-orange-light">a clear process</span>.
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 items-center">
          {/* Left: Process steps */}
          <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.25, 0.4, 0.25, 1] }}
                className="group relative p-6 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20 transition-all duration-500"
              >
                {/* Step number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: step.color }}>
                  {i + 1}
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300" style={{ background: `${step.color}20` }}>
                  <step.icon className="w-6 h-6" style={{ color: step.color }} />
                </div>

                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-orange-light transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Right: Image */}
          <Reveal delay={0.2}>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-purple to-orange rounded-2xl opacity-30" />
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                <img
                  src={approachImg}
                  alt="Himani Sharma - Marketing Approach"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/40 to-transparent" />
              </div>
            </div>
          </Reveal>
        </div>

        {/* CTA */}
        <Reveal delay={0.4}>
          <div className="mt-16">
            <CTAButton variant="dark">Discuss a Project</CTAButton>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
