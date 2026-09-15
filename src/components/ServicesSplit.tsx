import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Container from './ui/Container';
import Reveal from './ui/Reveal';
import CTAButton from './ui/CTAButton';
import { services } from '../data/services';
import { Mic, Target, Lightbulb, GraduationCap } from 'lucide-react';
import speakerImg from '../images/hiimanisasspeaker.jpg';
import coachImg from '../images/himanimarketing.jpg';
import consultantImg from '../images/himanimainsection.jpg';
import trainingImg from '../images/Himani-Kankaria4-684x1024.jpg';

const serviceIcons = [Lightbulb, Target, GraduationCap, Mic];
const serviceImages = [consultantImg, coachImg, trainingImg, speakerImg];
const bgStyles = [
  'bg-gradient-to-br from-bg via-bg to-purple/5',
  'bg-gradient-to-br from-bg via-orange/5 to-bg',
  'bg-gradient-to-br from-orange/5 via-bg to-purple/5',
  'bg-gradient-to-br from-purple/5 via-bg to-bg',
];

function SpeakingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px 0px" });
  const service = services[3];

  return (
    <div id="speaking" ref={ref} className={`py-20 md:py-32 ${bgStyles[0]} overflow-hidden`}>
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div>
            <Reveal>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple to-orange flex items-center justify-center shadow-lg">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-purple">
                  {service.number} — {service.label}
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h3 className="font-serif text-3xl md:text-4xl leading-[1.2] text-primary mb-6">
                {service.headline}
              </h3>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="text-base text-secondary leading-relaxed mb-8">
                {service.description}
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="flex flex-wrap gap-2 mb-8">
                {service.topics.map((topic) => (
                  <span
                    key={topic}
                    className="text-xs font-medium px-3 py-1.5 rounded-full border border-purple/20 text-purple/70 bg-purple/5"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="flex flex-wrap gap-8 mb-10">
                {service.metrics.map((metric) => (
                  <div key={metric.label}>
                    <div className="text-2xl font-bold gradient-text">{metric.value}</div>
                    <div className="text-xs text-secondary/60 mt-1">{metric.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <CTAButton variant="primary">{service.cta}</CTAButton>
            </Reveal>
          </div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
            className="relative"
          >
            <div className="relative image-frame image-frame-glow">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
                <img
                  src={serviceImages[0]}
                  alt="Himani speaking at conference"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex gap-2 flex-wrap">
                    {['AI', 'SEO', 'Content', 'Growth'].map((tag) => (
                      <span key={tag} className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white/80 border border-white/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}

function CoachingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px 0px" });
  const service = services[1];

  const capabilityMap = [
    { name: 'Strategy', items: ['Positioning', 'Audience', 'GTM', 'Growth Models'] },
    { name: 'Organic', items: ['SEO', 'Content', 'Distribution'] },
    { name: 'AI', items: ['Research', 'Writing', 'Video', 'Websites'] },
    { name: 'Leadership', items: ['Team', 'Processes', 'Decision Making'] },
  ];

  return (
    <div id="coaching-overview" ref={ref} className={`py-20 md:py-32 ${bgStyles[1]} overflow-hidden`}>
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Visual first on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
            className="relative order-2 lg:order-1"
          >
            {/* Marketing Capability Map */}
            <div className="relative p-8 rounded-2xl bg-white/70 backdrop-blur-sm border border-orange/20">
              <div className="text-center mb-8">
                <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-purple to-orange text-white text-sm font-semibold">
                  MODERN MARKETER
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {capabilityMap.map((branch, i) => (
                  <motion.div
                    key={branch.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                    className="p-4 rounded-xl border border-purple/10 hover:border-purple/30 transition-all duration-300 group"
                  >
                    <h4 className="text-sm font-semibold text-primary mb-2 group-hover:text-purple transition-colors">{branch.name}</h4>
                    <div className="flex flex-wrap gap-1">
                      {branch.items.map((item) => (
                        <span key={item} className="text-[10px] text-secondary/60 px-2 py-0.5 rounded bg-purple/5">
                          {item}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <Reveal>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple to-orange flex items-center justify-center shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-orange">
                  {service.number} — {service.label}
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h3 className="font-serif text-3xl md:text-4xl leading-[1.2] text-primary mb-6">
                {service.headline}
              </h3>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="text-base text-secondary leading-relaxed mb-8">
                {service.description}
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="flex flex-wrap gap-8 mb-10">
                {service.metrics.map((metric) => (
                  <div key={metric.label}>
                    <div className="text-2xl font-bold gradient-text">{metric.value}</div>
                    <div className="text-xs text-secondary/60 mt-1">{metric.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="flex flex-wrap gap-4">
                <CTAButton variant="primary">{service.cta}</CTAButton>
                <CTAButton variant="secondary">Book a Strategy Call</CTAButton>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </div>
  );
}

function ConsultingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px 0px" });
  const service = services[0];

  const framework = ['DIAGNOSE', 'PRIORITIZE', 'DESIGN', 'IMPLEMENT', 'MEASURE'];
  const questions = [
    'Where is growth actually constrained?',
    'Which activities create compounding returns?',
    'What should we stop doing?',
    'How should AI change the operating model?',
  ];

  return (
    <div id="consulting" ref={ref} className={`py-20 md:py-32 ${bgStyles[2]} overflow-hidden`}>
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div>
            <Reveal>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple to-orange flex items-center justify-center shadow-lg">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-purple">
                  {service.number} — {service.label}
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h3 className="font-serif text-3xl md:text-4xl leading-[1.2] text-primary mb-6">
                {service.headline}
              </h3>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="text-base text-secondary leading-relaxed mb-8">
                {service.description}
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="flex flex-wrap gap-2 mb-8">
                {service.topics.map((topic) => (
                  <span
                    key={topic}
                    className="text-xs font-medium px-3 py-1.5 rounded-full border border-purple/20 text-purple/70 bg-purple/5"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <CTAButton variant="primary">{service.cta}</CTAButton>
            </Reveal>
          </div>

          {/* Visual - Questions Framework */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
            className="relative"
          >
            <div className="p-8 rounded-2xl bg-white/70 backdrop-blur-sm border border-purple/20">
              {/* Diagnostic framework */}
              <div className="flex flex-col items-center gap-0 mb-8">
                {framework.map((step, i) => (
                  <div key={step} className="flex flex-col items-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                      className="w-full py-3 px-4 text-center rounded-lg border border-purple/15 bg-purple/5 hover:bg-purple/10 transition-colors"
                    >
                      <span className="text-xs font-semibold tracking-[0.15em] text-primary">{step}</span>
                    </motion.div>
                    {i < framework.length - 1 && (
                      <div className="w-px h-4 bg-gradient-to-b from-purple to-orange" />
                    )}
                  </div>
                ))}
              </div>

              {/* Annotations */}
              <div className="space-y-3">
                {questions.map((q, i) => (
                  <motion.p
                    key={q}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
                    className="text-xs text-secondary/70 italic pl-4 border-l-2 border-orange/30"
                  >
                    "{q}"
                  </motion.p>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}

function TrainingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px 0px" });
  const service = services[2];

  const journey = ['LEARN', 'PRACTICE', 'APPLY', 'REVIEW', 'MASTER'];
  const courseClusters = [
    { name: 'Organic Growth', children: ['SEO', 'Content', 'Distribution'] },
    { name: 'AI Marketing', children: ['Research', 'Content', 'Video', 'Websites', 'Automation'] },
    { name: 'Growth', children: ['Strategy', 'Analytics', 'Experimentation'] },
  ];

  return (
    <div id="training" ref={ref} className={`py-20 md:py-32 ${bgStyles[3]} overflow-hidden`}>
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Visual - Learning Journey */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
            className="relative order-2 lg:order-1"
          >
            <div className="p-8 rounded-2xl bg-white/70 backdrop-blur-sm border border-orange/20">
              {/* Learning Journey */}
              <div className="flex items-center justify-between mb-8">
                {journey.map((step, i) => (
                  <div key={step} className="flex items-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple to-orange flex items-center justify-center text-white text-xs font-bold shadow-md">
                        {i + 1}
                      </div>
                      <span className="text-[10px] font-semibold tracking-wider text-primary mt-2">{step}</span>
                    </motion.div>
                    {i < journey.length - 1 && (
                      <div className="w-8 h-0.5 bg-gradient-to-r from-purple to-orange mx-1" />
                    )}
                  </div>
                ))}
              </div>

              {/* Course clusters */}
              <div className="space-y-4">
                {courseClusters.map((cluster, i) => (
                  <motion.div
                    key={cluster.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                    className="p-4 rounded-xl border border-orange/15 hover:border-orange/30 transition-colors"
                  >
                    <h4 className="text-sm font-semibold text-primary mb-2">{cluster.name}</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {cluster.children.map((child) => (
                        <span key={child} className="text-[10px] px-2 py-0.5 rounded bg-orange/10 text-orange/70 font-medium">
                          {child}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <Reveal>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple to-orange flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-orange">
                  {service.number} — {service.label}
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h3 className="font-serif text-3xl md:text-4xl leading-[1.2] text-primary mb-6">
                {service.headline}
              </h3>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="text-base text-secondary leading-relaxed mb-8">
                {service.description}
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="flex flex-wrap gap-2 mb-8">
                {service.topics.map((topic) => (
                  <span
                    key={topic}
                    className="text-xs font-medium px-3 py-1.5 rounded-full border border-orange/20 text-orange/70 bg-orange/5"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="flex flex-wrap gap-8 mb-10">
                {service.metrics.map((metric) => (
                  <div key={metric.label}>
                    <div className="text-2xl font-bold gradient-text">{metric.value}</div>
                    <div className="text-xs text-secondary/60 mt-1">{metric.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <CTAButton variant="primary">{service.cta}</CTAButton>
            </Reveal>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function ServicesSplit() {
  return (
    <section id="services" className="bg-bg">
      <Container>
        <div className="py-24 md:py-32">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple mb-4 text-center">
              Ways to Work With Me
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.15] text-primary mb-8 text-center">
              How We Can Work Together
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-base text-secondary max-w-xl mx-auto text-center">
              Four distinct ways to elevate your marketing. Each designed for different needs, budgets and goals.
            </p>
          </Reveal>
        </div>
      </Container>

      <ConsultingSection />
      <CoachingSection />
      <TrainingSection />
      <SpeakingSection />
    </section>
  );
}
