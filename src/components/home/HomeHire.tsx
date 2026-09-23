import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLeadSubmit } from '../../hooks/useLeadSubmit';
import { LEAD_LIMITS, validateLead, type LeadInput, type LeadSource } from '../../lib/leads';
import LeadThankYou from '../ui/LeadThankYou';
import DateTimePicker, { formatDateTimeValue, hasDateAndTime, isFuture } from '../ui/DateTimePicker';

// Each service choice is filed under the matching form in the admin panel.
const SOURCE_FOR: Record<string, LeadSource> = {
  'Virtual CMO': 'virtual-cmo',
  'Founder coaching': 'founder-coaching',
  'Team training': 'team-training',
  Speaking: 'speaking',
};

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
  const [callTime, setCallTime] = useState('');
  const { submit, submitting } = useLeadSubmit();

  const services = [
    { id: 'Virtual CMO', label: 'Virtual CMO', sub: 'Lead our marketing' },
    { id: 'Founder coaching', label: 'Founder coaching', sub: 'Help me decide better' },
    { id: 'Team training', label: 'Team training', sub: 'Level up my team' },
    { id: 'Speaking', label: 'Speaking', sub: 'Headline our event' },
  ];

  const buildLead = (when: string): LeadInput => ({
    source: SOURCE_FOR[service] ?? 'virtual-cmo',
    name,
    email,
    company,
    message,
    details: {
      Form: 'Get in touch (home page)',
      Service: service,
      Stage: stage,
      Start: timeline,
      'Preferred call': formatDateTimeValue(when),
    },
  });

  // Step 4 saves the lead, with the chosen call time or without one (skip).
  const send = async (when: string) => {
    if (submitting) return;
    setError('');
    const err = await submit(buildLead(when));
    if (err) return setError(err);
    setCallTime(when);
    setStep(5);
  };

  const handleNext = async () => {
    if (step === 1 && !service) {
      setError('Choose what you would like help with to continue.');
      return;
    }
    if (step === 3) {
      // Check the details now so step 4 only has to deal with the time.
      const invalid = validateLead(buildLead(''));
      if (invalid) return setError(invalid);
      setError('');
      setStep(4);
      return;
    }
    if (step === 4) {
      if (!hasDateAndTime(callTime)) {
        return setError(callTime ? 'Pick a time for that day, or skip this step.' : 'Pick a day and a time, or skip this step.');
      }
      if (!isFuture(callTime)) return setError('That time has already passed. Pick another.');
      await send(callTime);
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  return (
    <section className="py-14 sm:py-18 lg:py-24 xl:py-28 bg-paper-2" id="hire">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.25fr] gap-8 lg:gap-16 items-start">
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
              Three quick questions, then pick a time that suits you for a call. I read every brief myself before we speak.
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
            className="bg-card border-2 border-ink rounded-[24px] p-5 sm:p-9 shadow-xs"
          >
            {/* Progress Bars */}
            <div className="flex gap-2 mb-7">
              {[1, 2, 3, 4].map((s) => (
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
                        Name <span className="text-bad" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="nm"
                        type="text"
                        value={name}
                        aria-required="true"
                        maxLength={LEAD_LIMITS.name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full p-2.5 rounded-xl border border-rule bg-card text-ink text-[0.95rem] focus:border-ink focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label htmlFor="em" className="block font-display font-semibold text-[0.9rem] text-ink mb-1">
                        Work email <span className="text-bad" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="em"
                        type="email"
                        value={email}
                        aria-required="true"
                        maxLength={LEAD_LIMITS.email}
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
                      maxLength={LEAD_LIMITS.company}
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
                      maxLength={LEAD_LIMITS.message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Brief background or specific goals..."
                      className="w-full p-2.5 rounded-xl border border-rule bg-card text-ink text-[0.95rem] focus:border-ink focus:outline-hidden"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 4: Day and time for a call */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  <h3 className="font-display font-bold text-[1.25rem] text-ink">When suits you for a call?</h3>
                  <p className="text-muted text-[0.95rem] mt-1.5 mb-5">Pick a day, then a time. I'll confirm it by email.</p>
                  <DateTimePicker
                    value={callTime}
                    onChange={(v) => {
                      setError('');
                      setCallTime(v);
                    }}
                  />
                </motion.div>
              )}

              {/* Step 5: Thank you */}
              {step === 5 && (
                <LeadThankYou
                  key="step5"
                  name={name}
                  email={email}
                  next={
                    callTime
                      ? `You asked for ${formatDateTimeValue(callTime)}, and I'll confirm that time or suggest the nearest free one.`
                      : "I'll look at the service and timing you picked and suggest a sensible first step."
                  }
                />
              )}
            </AnimatePresence>

            {/* Error Message */}
            {error && (
              <p className="mt-3.5 text-bad text-xs font-display font-semibold" role="alert">
                {error}
              </p>
            )}

            {/* Navigation Buttons */}
            {step < 5 && (
              <div className="flex items-center justify-between gap-3 mt-7 pt-4 border-t border-rule">
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

                <div className="flex items-center gap-2">
                  {step === 4 && (
                    <button
                      type="button"
                      onClick={() => send('')}
                      disabled={submitting}
                      className="px-3 py-2 rounded-full font-display font-semibold text-[0.92rem] text-muted hover:text-ink hover:bg-lav disabled:opacity-60"
                    >
                      Skip
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={submitting}
                    className="btn solid sm disabled:opacity-60"
                  >
                    {step === 4 ? (submitting ? 'Sending…' : 'Send') : step === 3 ? 'Next: pick a time' : 'Continue'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
