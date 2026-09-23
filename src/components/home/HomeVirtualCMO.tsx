import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CrownIcon, TickIcon } from '../ui/BrandIcons';

export default function HomeVirtualCMO() {
  const ownsList = [
    {
      title: 'Own the marketing plan',
      desc: 'Goals, budget, channels and a quarterly roadmap tied to revenue.',
    },
    {
      title: 'Lead your team and agencies',
      desc: 'Weekly direction, reviews and hiring help for your marketers.',
    },
    {
      title: 'Sharpen brand and messaging',
      desc: 'Positioning, website story and sales narrative that match.',
    },
    {
      title: 'Build the content engine',
      desc: 'Founder-led LinkedIn, thought leadership and full-funnel content.',
    },
    {
      title: 'Report to leadership',
      desc: "A monthly board-ready view of what's working and what's next.",
    },
  ];

  const comparisonRows = [
    { key: 'Time to start', me: '2 weeks', hire: '3 to 6 months of hiring' },
    { key: 'Commitment', me: 'Monthly retainer', hire: 'Salary, equity, notice periods' },
    { key: 'Experience', me: '15+ years, many industries', hire: 'Usually one industry' },
    { key: 'Team training', me: 'Built in', hire: 'Extra budget' },
    { key: 'When you outgrow it', me: 'I help you hire your CMO', hire: 'Start over' },
  ];

  return (
    <section className="py-24 lg:py-28 bg-stage text-on-stage" id="cmo">
      <div className="max-w-[1160px] mx-auto px-6">
        {/* Flagship Badge — drops down from above */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        >
          <div className="inline-flex items-center gap-2 font-display font-semibold text-[0.92rem] text-stage-accent mb-4.5">
            <CrownIcon className="w-4 h-4 text-stage-accent shrink-0" />
            <span>Flagship engagement</span>
          </div>

          {/* Title & Lede */}
          <h2 className="font-display font-extrabold text-[clamp(1.9rem,4vw,3.1rem)] leading-[1.08] max-w-[24ch] text-on-stage">
            Your Virtual CMO. Senior marketing leadership without the full-time hire.
          </h2>
          <p className="text-on-stage-muted max-w-[58ch] mt-4 text-[1.1rem]">
            For founders and CEOs of B2B, SaaS and tech companies who need a marketing leader now, not after a six-month search.
          </p>
        </motion.div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-14 mt-12 items-start">
          {/* Left: What I Own — items cascade in from left with stagger */}
          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
            }}
            className="list-none p-0 m-0"
          >
            {ownsList.map((item, idx) => (
              <motion.li
                key={item.title}
                variants={{
                  hidden: { opacity: 0, x: -28, filter: 'blur(3px)' },
                  visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="grid grid-cols-[28px_1fr] gap-3.5 py-4 border-b border-stage-rule last:border-b"
              >
                <TickIcon className="w-5 h-5 text-stage-accent mt-0.5 shrink-0" />
                <div>
                  <b className="font-display font-bold text-on-stage block text-[1.06rem] leading-snug">
                    {item.title}
                  </b>
                  <p className="font-body text-on-stage-muted text-[0.98rem] leading-relaxed mt-1">
                    {item.desc}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ul>

          {/* Right: Comparison card — rises with a spring bounce */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20, delay: 0.15 }}
            className="bg-stage-2 rounded-[20px] p-6 sm:p-7 border border-stage-rule shadow-sm"
          >
            <h3 className="font-display font-bold text-[1.2rem] text-on-stage">
              Virtual CMO vs full-time CMO
            </h3>

            <div className="mt-4">
              {/* Table Header */}
              <div className="grid grid-cols-[1.1fr_1fr_1fr] gap-3 py-3 border-b border-stage-rule font-display font-semibold text-[0.88rem] text-on-stage-muted">
                <span>Metric</span>
                <span className="text-stage-accent">With me</span>
                <span>Full-time hire</span>
              </div>

              {/* Table Rows */}
              {comparisonRows.map((row) => (
                <div
                  key={row.key}
                  className="grid grid-cols-[1.1fr_1fr_1fr] gap-3 py-3.5 border-b border-stage-rule last:border-b-0 text-[0.95rem] hover:bg-lav/40 transition-colors px-1 rounded"
                >
                  <span className="font-display text-on-stage-muted">
                    {row.key}
                  </span>
                  <span className="font-display font-semibold text-stage-accent">
                    {row.me}
                  </span>
                  <span className="text-on-stage-muted/90">
                    {row.hire}
                  </span>
                </div>
              ))}
            </div>

            {/* CTAs inside card */}
            <div className="flex flex-wrap gap-3 mt-6">
              <a href="#hire" className="btn gold">
                Book a Virtual CMO call
              </a>
              <Link
                to="/virtual-cmo"
                className="btn ghost !text-ink !border-ink hover:!bg-lav"
              >
                See how it works
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
