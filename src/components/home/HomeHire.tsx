import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomeHire() {
  const [step, setStep] = useState(1);
  const [service, setService] = useState('Virtual CMO');
  const [stage, setStage] = useState('Growth-stage company');
  const [timeline, setTimeline] = useState('This month');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const services = [
    { id: 'Virtual CMO', label: 'Virtual CMO', sub: 'Lead our marketing' },
    { id: 'Founder coaching', label: 'Founder coaching', sub: 'Help me decide better' },
    { id: 'Team training', label: 'Team training', sub: 'Level up my team' },
    { id: 'Speaking', label: 'Speaking', sub: 'Headline our event' },
  ];

  const handleNext = () => {
    if (step === 1 && !service) {
      setError('Choose what you would like help with to continue.');
      return;
    }
    if (step === 3) {
      if (!name.trim()) {
        setError('Add your name so I know who I am speaking with.');
        return;
      }
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Add a valid work email so I can send the invite.');
        return;
      }
      setError('');
      setStep(4);
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  const briefSummary = `${service} | ${stage} | Start: ${timeline} | ${company}${
    message ? ` | ${message}` : ''
  }`;

  const calendlyUrl = `https://calendly.com/missivedigital/30min?name=${encodeURIComponent(
    name
  )}&email=${encodeURIComponent(email)}&a1=${encodeURIComponent(briefSummary)}`;

  return (
    <section className="py-24 lg:py-28 bg-paper-2" id="hire">
      <div className="max-w-[1160px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.25fr] gap-12 lg:gap-16 items-start">
          {/* Left Intro Column — clips in from above */}
          <motion.div
            initial={{ opacity: 0, y: -30, clipPath: 'inset(0 0 100% 0)' }}
            whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-display font-semibold text-xs tracking-wider uppercase text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full inline-block mb-3.5">
              Get In Touch
            </span>
            <h2 className="font-display font-extrabold text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[1.08] text-ink">
              Let's see if we're a fit
            </h2>
            <p className="text-muted mt-4 text-[1.12rem] leading-relaxed">
              Three quick questions, then pick a time. I read every brief before we speak.
            </p>
            <p className="mt-5 font-display text-[0.98rem] text-ink">
              Prefer to talk first?{' '}
              <a
                href="https://www.linkedin.com/in/himanikankaria/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline font-semibold hover:opacity-85"
              >
                Message me on LinkedIn
              </a>
            </p>
          </motion.div>

          {/* Right Form Card — rises with 3D tilt */}
          <motion.div
            initial={{ opacity: 0, rotateX: 14, y: 48, scale: 0.97 }}
            whileInView={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
            style={{ transformPerspective: 900 }}
            className="bg-card border-2 border-ink rounded-[24px] p-7 sm:p-9 shadow-xs"
          >
            {/* Progress Bars */}
            <div className="flex gap-2 mb-7">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    step >= s ? 'bg-gold' : 'bg-rule'
                  }`}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* Step 1: Service Selection */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  <h3 className="font-display font-bold text-[1.25rem] text-ink mb-6 sm:mb-7">
                    What would you like help with?
                  </h3>
                  <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {services.map((item) => {
                      const isSelected = service === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setService(item.id);
                            setError('');
                          }}
                          className={`text-left p-4 rounded-xl border-2 transition-all cursor-pointer interactive-card ${
                            isSelected
                              ? 'border-ink bg-card shadow-xs'
                              : 'border-rule bg-card/60 hover:border-ink/40'
                          }`}
                        >
                          <div className="font-display font-bold text-ink text-[1.02rem]">
                            {item.label}
                          </div>
                          <div className="text-muted text-[0.88rem] mt-0.5">
                            {item.sub}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Context */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <h3 className="font-display font-bold text-[1.25rem] text-ink mb-5">
                    A little context
                  </h3>
                  <div>
                    <label htmlFor="cstage" className="block font-display font-semibold text-[0.92rem] text-ink mb-1.5">
                      Company or event stage
                    </label>
                    <select
                      id="cstage"
                      value={stage}
                      onChange={(e) => setStage(e.target.value)}
                      className="w-full p-3 rounded-xl border border-rule bg-card text-ink font-display text-[0.95rem] focus:border-ink focus:outline-hidden"
                    >
                      <option>Early-stage startup</option>
                      <option>Growth-stage company</option>
                      <option>Enterprise</option>
                      <option>Conference or community event</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="when" className="block font-display font-semibold text-[0.92rem] text-ink mb-1.5">
                      When do you want to start?
                    </label>
                    <select
                      id="when"
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="w-full p-3 rounded-xl border border-rule bg-card text-ink font-display text-[0.95rem] focus:border-ink focus:outline-hidden"
                    >
                      <option>This month</option>
                      <option>Next 1 to 3 months</option>
                      <option>Just exploring</option>
                    </select>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Contact Details */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3.5"
                >
                  <h3 className="font-display font-bold text-[1.25rem] text-ink mb-5">
                    Where can I reach you?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="nm" className="block font-display font-semibold text-[0.9rem] text-ink mb-1">
                        Name
                      </label>
                      <input
                        id="nm"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full p-2.5 rounded-xl border border-rule bg-card text-ink text-[0.95rem] focus:border-ink focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label htmlFor="em" className="block font-display font-semibold text-[0.9rem] text-ink mb-1">
                        Work email
                      </label>
                      <input
                        id="em"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full p-2.5 rounded-xl border border-rule bg-card text-ink text-[0.95rem] focus:border-ink focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="co" className="block font-display font-semibold text-[0.9rem] text-ink mb-1">
                      Company
                    </label>
                    <input
                      id="co"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Company name"
                      className="w-full p-2.5 rounded-xl border border-rule bg-card text-ink text-[0.95rem] focus:border-ink focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label htmlFor="msg" className="block font-display font-semibold text-[0.9rem] text-ink mb-1">
                      Anything I should know? (optional)
                    </label>
                    <textarea
                      id="msg"
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Brief background or specific goals..."
                      className="w-full p-2.5 rounded-xl border border-rule bg-card text-ink text-[0.95rem] focus:border-ink focus:outline-hidden"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 4: Done / Calendly Booking */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="py-2"
                >
                  <h3 className="font-display font-bold text-[1.4rem] text-ink">
                    Thanks, {name.split(' ')[0]}. Now pick a time.
                  </h3>
                  <p className="text-muted mt-2 text-[0.98rem] leading-relaxed bg-card p-3 rounded-xl border border-rule font-display">
                    <span className="font-semibold text-ink">Your brief: </span>
                    {briefSummary}
                  </p>
                  <div className="mt-6">
                    <a
                      href={calendlyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn gold"
                    >
                      Choose a time on Calendly &rarr;
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            {error && (
              <p className="mt-3.5 text-bad text-xs font-display font-semibold" role="alert">
                {error}
              </p>
            )}

            {/* Navigation Buttons */}
            {step < 4 && (
              <div className="flex items-center justify-between mt-7 pt-4 border-t border-rule">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="btn ghost sm"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  className="btn solid sm"
                >
                  {step === 3 ? 'See available times' : 'Continue'}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
