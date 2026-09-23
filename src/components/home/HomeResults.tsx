import { motion } from 'framer-motion';

export default function HomeResults() {
  const results = [
    {
      stat: '800%',
      label: 'organic growth, year over year',
      quote:
        'Himani rebuilt our entire organic search architecture from scratch. Our traffic exploded by 800% with qualified pipeline leads.',
      author: 'SaaS Founder & CEO',
      company: 'Enterprise Test Platform',
    },
    {
      stat: '10x',
      label: "founder's LinkedIn reach",
      quote:
        'Coaching with Himani gave me absolute clarity on what to say and how to say it. My personal brand on LinkedIn is now our #1 inbound lead generator.',
      author: 'Early Stage B2B Founder',
      company: 'HR Tech Startup',
    },
    {
      stat: '21+',
      label: 'marketing teams trained',
      quote:
        'Hands-down the most practical marketing training our team has attended. We rewrote our whole sprint backlog on Monday morning.',
      author: 'Head of Marketing',
      company: 'Cloud Infrastructure Provider',
    },
  ];

  return (
    <section className="py-24 lg:py-28 bg-paper-2 border-b border-rule" id="results">
      <div className="max-w-[1160px] mx-auto px-6">
        {/* Header — scale up from below */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 24 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <span className="font-display font-semibold text-xs tracking-wider uppercase text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full inline-block mb-3.5">
            Client Impact
          </span>
          <h2 className="font-display font-extrabold text-[clamp(1.9rem,4vw,3.1rem)] leading-[1.08] text-ink">
            What changes when we work together
          </h2>
          <p className="text-muted font-body text-[1.1rem] max-w-[56ch] mt-4 leading-relaxed">
            Real outcomes from B2B, SaaS and tech companies that trusted me to lead their marketing.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 lg:mt-14">
          {results.map((r, idx) => (
            <motion.div
              key={r.label}
              /* Each card flips up from a perspective tilt */
              initial={{ opacity: 0, rotateX: 18, y: 40 }}
              whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformPerspective: 900 }}
              className="bg-card border border-rule rounded-[20px] p-7 sm:p-8 flex flex-col justify-between shadow-xs card-hover"
            >
              <div>
                <div className="font-display font-extrabold text-[3.2rem] leading-none text-accent">
                  {r.stat}
                </div>
                <div className="font-display text-muted text-[1rem] mt-2 font-medium">
                  {r.label}
                </div>
                <p className="mt-5 font-body italic text-[1.02rem] text-ink leading-relaxed">
                  &ldquo;{r.quote}&rdquo;
                </p>
              </div>
              <small className="block mt-6 font-display text-[0.88rem] text-muted">
                {r.author}, <span className="text-ink font-medium">{r.company}</span>
              </small>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
