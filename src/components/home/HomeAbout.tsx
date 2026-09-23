import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.14, delayChildren: 0.1 },
  },
};

const stepVariants = {
  hidden: { opacity: 0, x: 32, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function HomeAbout() {
  const journey = [
    {
      title: 'IT graduate turned writer',
      detail: 'Picked words over code and started as a content writer.',
    },
    {
      title: 'Independent consultant',
      detail: 'Took on clients until demand outgrew one person.',
    },
    {
      title: 'Founder, Missive Digital',
      detail: 'Built a team serving B2B, SaaS and tech brands.',
    },
    {
      title: 'Global stages',
      detail: 'Barcelona, Mumbai and the Search Engine Journal byline.',
    },
    {
      title: 'Virtual CMO and coach',
      detail: 'Now leading marketing alongside founders and CEOs.',
    },
  ];

  return (
    <section className="py-24 lg:py-28 bg-paper border-b border-rule" id="about">
      <div className="max-w-[1160px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-start">
          {/* Story Column — wipes in from left with a slight skew */}
          <motion.div
            initial={{ opacity: 0, x: -36, skewY: 1.5 }}
            whileInView={{ opacity: 1, x: 0, skewY: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-display font-semibold text-xs tracking-wider uppercase text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full inline-block mb-3.5">
              About Himani
            </span>
            <h2 className="font-display font-extrabold text-[clamp(1.9rem,4vw,3.1rem)] leading-[1.08] text-ink">
              From IT graduate to the Content Queen of India
            </h2>
            <p className="text-muted mt-4 text-[1.12rem] leading-relaxed">
              I had to choose between coding and marketing. I chose the one about people, and I've spent 15+ years learning how they discover, trust and decide.
            </p>
            <p className="mt-4 text-ink text-[1.02rem] leading-relaxed">
              Today I run Missive Digital, but my personal work is with leaders: advising companies as their Virtual CMO, coaching founders, training teams, and teaching branding to early-stage founders as guest faculty at GUSEC. I'm also part of the Women in Tech SEO community and host meetups for Ahmedabad's marketers.
            </p>
          </motion.div>

          {/* 5-Step Journey Timeline — each step blurs in from the right */}
          <motion.ol
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
            className="space-y-0 list-none p-0 m-0 border-l-2 border-rule pl-6 relative"
          >
            {journey.map((step, idx) => (
              <motion.li
                key={step.title}
                variants={stepVariants}
                custom={idx}
                className="relative pb-7 last:pb-0 group"
              >
                {/* Timeline node */}
                <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-gold border-[3px] border-paper shadow-xs group-hover:scale-125 transition-transform duration-300" />
                <b className="font-display font-bold text-ink block text-[1.05rem] group-hover:text-accent transition-colors duration-200">
                  {step.title}
                </b>
                <span className="text-muted text-[0.96rem] mt-0.5 block leading-normal">
                  {step.detail}
                </span>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
