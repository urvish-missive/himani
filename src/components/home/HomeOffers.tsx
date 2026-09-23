import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomeOffers() {
  const [format, setFormat] = useState<'one' | 'rec'>('one');

  const coachingQuestions = [
    '"What should we actually be known for?"',
    '"Should I be the face of the brand on LinkedIn?"',
    '"Which channel do we bet on first?"',
    '"Who is my first marketing hire, and how do I brief them?"',
  ];

  const trainingTags = [
    'Marketing strategy',
    'LinkedIn for teams',
    'Content strategy',
    'AI in marketing',
    'Search and AI visibility',
    'Sales enablement',
  ];

  return (
    <section className="py-14 sm:py-18 lg:py-24 xl:py-28 bg-paper" id="offers">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6">
        {/* Header — blurs in from center */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-display font-semibold text-xs tracking-wider uppercase text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full inline-block mb-3.5">
            Coaching & Training
          </span>
          <h2 className="font-display font-extrabold text-[clamp(1.9rem,4vw,3.1rem)] leading-[1.08] max-w-[24ch] text-ink">
            Or work with me one-on-one, or with your whole team
          </h2>
          <p className="text-muted font-body text-[1.1rem] max-w-[56ch] mt-4 leading-relaxed">
            Private strategic coaching for founders who own marketing, and intensive workshops that elevate your marketing and sales teams.
          </p>
        </motion.div>

        {/* 2 Offer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 mt-8 sm:mt-12 items-stretch">
          {/* Card 1: 1-on-1 Founder Coaching — slides in from left */}
          <motion.article
            id="coaching"
            initial={{ opacity: 0, x: -40, rotate: -1 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[24px] p-6 sm:p-8 lg:p-9 bg-paper-2 border border-rule flex flex-col justify-between card-hover"
          >
            <div>
              <div className="font-display font-semibold text-muted text-[0.95rem]">
                1-on-1 founder coaching
              </div>
              <h3 className="font-display font-extrabold text-[clamp(1.6rem,2.6vw,2.1rem)] mt-2 text-ink max-w-[18ch]">
                A marketing mind in your corner
              </h3>
              <p className="mt-3 text-muted leading-relaxed text-[1rem]">
                Private sessions for founders who still own marketing and want to make better, faster calls on it.
              </p>

              {/* Sample Questions — staggered fade from left */}
              <motion.ul
                className="mt-6 space-y-2.5"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } },
                }}
              >
                {coachingQuestions.map((q) => (
                  <motion.li
                    key={q}
                    variants={{
                      hidden: { opacity: 0, x: -16 },
                      visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
                    }}
                    className="italic text-ink py-2 border-b border-rule last:border-b-0 text-[0.98rem] hover:text-accent transition-colors"
                  >
                    {q}
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mt-8 pt-4">
              <a href="#hire" className="btn solid text-center justify-center w-full sm:w-auto">
                Apply for coaching
              </a>
              <Link to="/founder-coaching" className="btn ghost text-center justify-center w-full sm:w-auto">
                See how coaching works
              </Link>
            </div>
          </motion.article>

          {/* Card 2: Team Training — slides in from right */}
          <motion.article
            id="training"
            initial={{ opacity: 0, x: 40, rotate: 1 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[24px] p-6 sm:p-8 lg:p-9 bg-card border-2 border-ink flex flex-col justify-between shadow-xs card-hover"
          >
            <div>
              <div className="font-display font-semibold text-muted text-[0.95rem]">
                Marketing and sales team training
              </div>
              <h3 className="font-display font-extrabold text-[clamp(1.6rem,2.6vw,2.1rem)] mt-2 text-ink max-w-[18ch]">
                Workshops that change Monday morning
              </h3>
              <p className="mt-3 text-muted leading-relaxed text-[1rem]">
                Hands-on sessions built on your own website, content and pipeline, for marketing, content and sales teams.
              </p>

              {/* Format Toggle Pill */}
              <div
                className="inline-flex mt-5 border-[1.5px] border-ink rounded-full p-[3px] bg-paper"
                role="group"
                aria-label="Training format"
              >
                <button
                  type="button"
                  onClick={() => setFormat('one')}
                  className={`font-display font-semibold text-[0.92rem] px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                    format === 'one' ? 'bg-ink text-paper shadow-sm' : 'text-ink hover:text-accent'
                  }`}
                >
                  One-off
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('rec')}
                  className={`font-display font-semibold text-[0.92rem] px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                    format === 'rec' ? 'bg-ink text-paper shadow-sm' : 'text-ink hover:text-accent'
                  }`}
                >
                  Recurring
                </button>
              </div>

              {/* Dynamic Format Output */}
              <div className="mt-4 min-h-[90px] text-[0.98rem] leading-relaxed">
                <AnimatePresence mode="wait">
                  {format === 'one' ? (
                    <motion.div
                      key="one"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-muted">
                        <b className="font-display font-bold text-ink block mb-1">
                          Half-day or full-day workshop.
                        </b>
                        One focused topic, built on your team's real material, with a take-home playbook. Online or on-site.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="rec"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-muted">
                        <b className="font-display font-bold text-ink block mb-1">
                          Monthly programme, 3 to 6 months.
                        </b>
                        A live session each month plus review of your team's actual work between sessions, so new habits stick.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Tags — pop in with spring bounce */}
              <motion.div
                className="flex flex-wrap gap-2 mt-5"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.3 } },
                }}
              >
                {trainingTags.map((tag) => (
                  <motion.span
                    key={tag}
                    variants={{
                      hidden: { opacity: 0, scale: 0.7 },
                      visible: {
                        opacity: 1,
                        scale: 1,
                        transition: { type: 'spring', stiffness: 320, damping: 18 },
                      },
                    }}
                    className="font-display text-[0.86rem] border border-rule rounded-full py-1 px-3 text-ink bg-paper-2 hover:border-accent hover:bg-lav/50 transition-colors"
                  >
                    {tag}
                  </motion.span>
                ))}
              </motion.div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mt-8 pt-4">
              <a href="#hire" className="btn solid text-center justify-center w-full sm:w-auto">
                Plan a training
              </a>
              <Link to="/team-training" className="btn ghost text-center justify-center w-full sm:w-auto">
                See training details
              </Link>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
