import { motion } from 'framer-motion';

export default function HomeTrust() {
  const brands = [
    'BrowserStack',
    'Testsigma',
    'Vymo',
    'Edenred',
    'Sterlite Power',
    'Pittie Group',
  ];

  const stages = [
    'International Search Summit',
    'WordCamp Asia',
    'Whitespark',
    'Meet Magento',
    'Semrush',
    'Women in Tech SEO',
  ];

  return (
    <div className="py-6 sm:py-8 border-y border-rule bg-paper overflow-hidden">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6 space-y-3.5">
        {/* Brands Row — slides in from left */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-baseline gap-x-6 sm:gap-x-8 gap-y-2 font-display font-semibold text-[0.95rem] sm:text-[1.08rem]"
        >
          <span className="font-normal text-muted text-[0.85rem] sm:text-[0.92rem] w-full sm:w-auto sm:min-w-[150px] shrink-0">
            Brands I've worked with
          </span>
          {brands.map((b, i) => (
            <motion.span
              key={b}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="text-ink/85 hover:text-accent transition-colors"
            >
              {b}
            </motion.span>
          ))}
        </motion.div>

        {/* Stages Row — slides in from right */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-baseline gap-x-6 sm:gap-x-8 gap-y-2 font-display font-semibold text-[0.95rem] sm:text-[1.08rem]"
        >
          <span className="font-normal text-muted text-[0.85rem] sm:text-[0.92rem] w-full sm:w-auto sm:min-w-[150px] shrink-0">
            Stages and shows
          </span>
          {stages.map((s, i) => (
            <motion.span
              key={s}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 + 0.1 }}
              className="text-ink/85 hover:text-accent transition-colors"
            >
              {s}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
