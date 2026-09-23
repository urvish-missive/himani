import { motion } from 'framer-motion';

export default function HomeBeliefs() {
  const beliefs = [
    {
      quote: 'Publishing is only 20% of the work. The other 80% is making it perform.',
      source: 'From my Whitespark talk',
    },
    {
      quote: "AI can write content. It can't make people care. That still takes a point of view.",
      source: 'From Link Up With Het',
    },
    {
      quote: 'Plans before promises. Every client relationship starts with a plan they can hold me to.',
      source: 'How I work',
    },
  ];

  return (
    <section className="py-24 lg:py-28 bg-paper border-b border-rule">
      <div className="max-w-[1160px] mx-auto px-6">
        {/* Header — slides in from right */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-display font-semibold text-xs tracking-wider uppercase text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full inline-block mb-3.5">
            Philosophy
          </span>
          <h2 className="font-display font-extrabold text-[clamp(1.9rem,4vw,3.1rem)] leading-[1.08] text-ink">
            What I believe about marketing
          </h2>
          <p className="text-muted font-body text-[1.1rem] max-w-[56ch] mt-4 leading-relaxed">
            Core principles that guide every strategy, content engine, and executive engagement I lead.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mt-12 lg:mt-14">
          {beliefs.map((b, idx) => (
            <motion.blockquote
              key={b.source}
              /* Each quote draws its top border as a width expansion, then text fades up */
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.55, delay: idx * 0.13, ease: [0.16, 1, 0.3, 1] }}
              className="relative border-t-[3px] border-gold pt-5 font-body italic text-[1.28rem] sm:text-[1.35rem] leading-[1.4] text-ink hover:-translate-y-2 transition-transform duration-300 cursor-default group"
            >
              {/* Animated gold underline on hover */}
              <motion.span
                className="absolute top-[-3px] left-0 h-[3px] bg-ink/20 block"
                initial={{ width: '0%' }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.13 + 0.3, ease: 'easeOut' }}
              />
              &ldquo;{b.quote}&rdquo;
              <small className="block mt-4 not-italic font-display text-[0.9rem] text-muted group-hover:text-accent transition-colors duration-200">
                {b.source}
              </small>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
