import { motion } from 'framer-motion';

export default function HomeFAQ() {
  const faqs = [
    {
      q: 'What does a Virtual CMO actually do?',
      a: 'I lead your marketing part-time: I set the strategy and budget, direct your team and agencies, shape brand and messaging, and report results to leadership each month.',
    },
    {
      q: 'How is coaching different from the Virtual CMO role?',
      a: "As Virtual CMO, I lead your company's marketing. In coaching, you lead it and I help you make better decisions as a founder.",
    },
    {
      q: 'Are trainings one-off or ongoing?',
      a: "Both. A one-off workshop closes a specific gap. A recurring programme builds habits by reviewing your team's real work every month.",
    },
    {
      q: 'Do you only work on SEO?',
      a: 'No. Content is where I built my name, but I work across marketing strategy, brand, founder-led LinkedIn, sales enablement, AI in marketing, and search.',
    },
    {
      q: 'Do you work with companies outside India?',
      a: 'Yes. Engagements run online across time zones, and I travel for on-site trainings and events.',
    },
    {
      q: 'Is this you or your agency?',
      a: 'Everything on this page is delivered by me personally. If you need a team to execute, Missive Digital can support separately.',
    },
  ];

  return (
    <section className="py-14 sm:py-18 lg:py-24 xl:py-28 bg-paper border-b border-rule" id="faq">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-8 lg:gap-16 items-start">
          {/* Left Column: Header & Context */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.55 }}
            className="lg:sticky lg:top-28"
          >
            <span className="font-display font-semibold text-xs tracking-wider uppercase text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full inline-block mb-3.5">
              FAQs
            </span>
            <h2 className="font-display font-extrabold text-[clamp(2.2rem,4.2vw,3.2rem)] leading-[1.06] text-ink tracking-tight">
              Before you hire me
            </h2>
            <p className="mt-4 text-muted font-body text-base sm:text-lg leading-relaxed max-w-[36ch]">
              Answers to common questions about my role, scope, travel, and how engagements run.
            </p>

            <div className="mt-8 p-5.5 rounded-2xl bg-paper-2 border border-rule text-sm">
              <p className="font-display font-bold text-ink text-[0.98rem]">
                Prefer to talk first?
              </p>
              <p className="text-muted font-body text-sm mt-1.5 leading-relaxed">
                Reach out on LinkedIn with your company overview and what you are looking for.
              </p>
              <a
                href="https://www.linkedin.com/in/himanikankaria/"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1.5 text-accent font-display font-semibold text-sm mt-3.5 hover:underline"
              >
                Message me on LinkedIn ↗
              </a>
            </div>
          </motion.div>

          {/* Right Column: FAQ Accordion */}
          <div className="divide-y divide-rule">
            {faqs.map((faq, idx) => (
              <motion.details
                key={faq.q}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.45, delay: idx * 0.05 }}
                className="py-5 group cursor-pointer"
              >
                <summary className="font-display font-semibold text-[1.08rem] sm:text-[1.15rem] text-ink list-none [&::-webkit-details-marker]:hidden flex justify-between items-start gap-4 select-none hover:text-accent transition-colors">
                  <span className="leading-snug pt-0.5">{faq.q}</span>
                  <span className="w-7 h-7 rounded-full bg-paper-2 border border-rule flex items-center justify-center text-accent text-lg leading-none shrink-0 group-open:rotate-45 group-open:bg-accent group-open:text-paper group-open:border-accent transition-all duration-300">
                    +
                  </span>
                </summary>
                <p className="text-muted font-body mt-3 leading-relaxed text-[0.98rem] pr-8">
                  {faq.a}
                </p>
              </motion.details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
