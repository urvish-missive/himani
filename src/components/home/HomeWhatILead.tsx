import { motion } from 'framer-motion';

export default function HomeWhatILead() {
  const capabilities = [
    {
      title: 'Marketing strategy',
      description: 'Where to play, what to say and which channels deserve the budget.',
    },
    {
      title: 'Brand and positioning',
      description: 'A story sharp enough that buyers repeat it for you.',
    },
    {
      title: 'Content that sells',
      description: 'Full-funnel content tied to pipeline, not publishing for its own sake.',
    },
    {
      title: 'Founder brand on LinkedIn',
      description: "Turning the founder's voice into the company's best channel.",
    },
    {
      title: 'Search and AI visibility',
      description: 'Being found on Google and named by ChatGPT and Perplexity.',
    },
    {
      title: 'Sales and marketing alignment',
      description: 'Content, messaging and enablement your sales team actually uses.',
    },
  ];

  return (
    <section className="py-24 lg:py-28 bg-paper border-b border-rule">
      <div className="max-w-[1160px] mx-auto px-6">
        {/* Header — clip-path reveal (curtain wipe up) */}
        <motion.div
          initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
          whileInView={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-display font-semibold text-xs tracking-wider uppercase text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full inline-block mb-3.5">
            Core Capabilities
          </span>
          <h2 className="font-display font-extrabold text-[clamp(1.9rem,4vw,3rem)] leading-[1.08] max-w-[22ch] text-ink">
            I lead the marketing that builds brands people choose
          </h2>
          <p className="text-muted max-w-[58ch] mt-4 text-[1.1rem]">
            Content is where I earned the crown. Growth is what I'm hired for.
          </p>
        </motion.div>

        {/* Grid — each cell zooms up with alternating directions */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-12"
        >
          {capabilities.map((item, idx) => {
            const col = idx % 3;
            /* Alternate: even items come from left/right, odd items come from bottom */
            const hiddenAnim =
              idx % 2 === 0
                ? { opacity: 0, x: col === 2 ? 24 : -24, y: 10 }
                : { opacity: 0, y: 28, scale: 0.97 };
            const visibleAnim =
              idx % 2 === 0
                ? { opacity: 1, x: 0, y: 0 }
                : { opacity: 1, y: 0, scale: 1 };
            return (
              <motion.div
                key={item.title}
                variants={{
                  hidden: hiddenAnim,
                  visible: { ...visibleAnim, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                }}
                className={`border-t border-rule py-6 sm:py-7 group transition-colors ${
                  col === 0
                    ? 'md:pr-7 md:pl-0'
                    : col === 1
                    ? 'md:px-7 md:border-l md:border-rule'
                    : 'md:pl-7 md:pr-0 md:border-l md:border-rule'
                }`}
              >
                <h3 className="font-display font-bold text-[1.25rem] sm:text-[1.3rem] text-ink group-hover:text-accent transition-colors duration-200 leading-snug">
                  {item.title}
                </h3>
                <p className="font-body text-muted mt-2 text-[1rem] leading-[1.6]">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
