import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CrownIcon, TickIcon } from '../components/ui/BrandIcons';
import portraitImg from '../images/himanimainimage.jpg';

export default function VirtualCMOPage() {
  const [selectedSigns, setSelectedSigns] = useState<number[]>([]);
  const [applyService] = useState('Virtual CMO');
  const [applyStage] = useState('Growth-stage company');
  const [applyWhen, setApplyWhen] = useState('This month');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const signsData = [
    {
      title: "Marketing is busy, pipeline isn't",
      desc: 'Lots of posts, campaigns and reports, but no clear link to revenue.',
    },
    {
      title: 'The founder is still the marketing head',
      desc: 'Every post, campaign and agency brief waits for your sign-off.',
    },
    {
      title: 'Agencies with no one directing them',
      desc: 'You pay for SEO, ads or content, but nobody owns the overall plan.',
    },
    {
      title: 'A capable team without a senior lead',
      desc: 'Good executors who need direction, feedback and priorities.',
    },
    {
      title: 'Your story changes depending on who tells it',
      desc: 'Website, sales deck and LinkedIn all describe you differently.',
    },
    {
      title: "You're not ready for a full-time CMO",
      desc: "The budget or the stage doesn't justify one yet, but the need is real.",
    },
  ];

  const toggleSign = (idx: number) => {
    if (selectedSigns.includes(idx)) {
      setSelectedSigns(selectedSigns.filter((i) => i !== idx));
    } else {
      setSelectedSigns([...selectedSigns, idx]);
    }
  };

  const count = selectedSigns.length;

  const getResult = () => {
    if (count >= 4) {
      return {
        title: 'Virtual CMO is an urgent fit',
        desc: 'Marketing is currently bottlenecked by founder bandwidth or lack of senior leadership. You need someone to own the plan immediately.',
        fixes: [
          'Audit current spend, channels and team to cut waste in Week 1',
          'Align messaging across website, founder LinkedIn and sales deck',
          'Set 3 quarterly revenue-tied marketing bets with clear owners',
        ],
        ctaText: 'Book a priority Virtual CMO call',
      };
    }
    if (count >= 2) {
      return {
        title: 'Strong candidate for Virtual CMO or Advisory',
        desc: 'You have solid execution underway, but strategic gaps are causing friction and slower growth than you should have.',
        fixes: [
          'Clarify channel priorities so your team stops spreading too thin',
          'Put a weekly review and governance rhythm in place for agencies',
          'Define the founder LinkedIn and brand narrative',
        ],
        ctaText: 'Explore Virtual CMO fit',
      };
    }
    return {
      title: 'Coaching or specific workshops may fit best',
      desc: 'Your marketing is relatively on track. 1-on-1 founder coaching or targeted team training could be all you need right now.',
      fixes: [
        'Review specific bottleneck channels during private coaching',
        'Train internal executors on modern AI and search playbooks',
      ],
      ctaText: 'Discuss coaching or training options',
    };
  };

  const result = getResult();

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setSubmitted(true);
  };

  const brief = `${applyService} | ${applyStage} | Start: ${applyWhen} | ${company} | Signs: ${count}/6${
    message ? ` | ${message}` : ''
  }`;

  const calendlyUrl = `https://calendly.com/missivedigital/30min?name=${encodeURIComponent(
    name
  )}&email=${encodeURIComponent(email)}&a1=${encodeURIComponent(brief)}`;

  return (
    <main id="top" className="bg-paper text-ink">
      {/* 1 HERO */}
      <section className="pt-8 pb-14 sm:pt-12 sm:pb-18 lg:pt-14 lg:pb-20 bg-gradient-to-b from-lav to-paper">
        <div className="max-w-[1160px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-12 lg:gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 font-display font-semibold text-[0.95rem] text-accent mb-4">
                <CrownIcon className="w-4 h-4 text-gold shrink-0" />
                <span>Virtual CMO for B2B, SaaS and tech companies</span>
              </div>
              <h1 className="font-display font-extrabold text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.08] tracking-[-0.035em] text-ink max-w-[16ch]">
                A senior marketing leader in weeks, not after a six-month search.
              </h1>
              <p className="mt-5 text-[1.15rem] leading-relaxed text-ink/90 max-w-[52ch]">
                I step in as your part-time CMO: I own the marketing plan, lead your team and agencies, sharpen your brand, and report to leadership, so growth stops depending on the founder's calendar.
              </p>

              <div className="flex flex-wrap gap-3 mt-8">
                <a href="#apply" className="btn solid">
                  Book a Virtual CMO call
                </a>
                <a href="#how" className="btn ghost">
                  See how it works
                </a>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 font-display text-[0.92rem] text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <TickIcon className="w-4 h-4 text-good shrink-0" />
                  Starts with a 30-day diagnosis
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <TickIcon className="w-4 h-4 text-good shrink-0" />
                  Monthly, no long lock-in
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <TickIcon className="w-4 h-4 text-good shrink-0" />
                  Works with your existing team
                </span>
              </div>
            </motion.div>

            {/* Profile Card */}
            <motion.aside
              initial={{ opacity: 0, scale: 0.95, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-card border border-rule rounded-[24px] p-6 shadow-xl shadow-ink/5 max-w-[380px] mx-auto lg:mx-0 w-full card-hover group"
            >
              <div className="relative aspect-square rounded-[18px] overflow-hidden bg-paper-2 border border-rule">
                <img
                  src={portraitImg}
                  alt="Himani Kankaria"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </div>


              <h3 className="font-display font-bold text-[1.3rem] text-ink mt-4">
                Himani Kankaria
              </h3>
              <p className="text-muted text-[0.96rem] mt-0.5">
                Founder, Missive Digital. Virtual CMO & founder coach.
              </p>
              <ul className="mt-4 pt-3 border-t border-rule space-y-2 font-display text-[0.92rem] text-ink/90">
                <li>• 15+ years in marketing and content leadership</li>
                <li>• Worked with BrowserStack, Testsigma, Vymo, Edenred</li>
                <li>• Keynote Speaker, International Search Summit & WordCamp Asia</li>
              </ul>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* Brands Bar */}
      <div className="py-7 border-b border-rule bg-paper">
        <div className="max-w-[1160px] mx-auto px-6 flex flex-wrap items-baseline gap-x-8 gap-y-2 font-display font-semibold text-[1.08rem]">
          <span className="font-normal text-muted text-[0.92rem] min-w-[150px]">
            Brands I've worked with
          </span>
          {['BrowserStack', 'Testsigma', 'Vymo', 'Edenred', 'Sterlite Power', 'Pittie Group'].map((b) => (
            <span key={b} className="hover:text-accent transition-colors duration-200 cursor-default">
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* 2 INTERACTIVE SIGNS SELF-ASSESSMENT */}
      <section className="py-24 lg:py-28 bg-paper" id="signs-section">
        <div className="max-w-[1160px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.55 }}
          >
            <span className="font-display font-semibold text-xs tracking-wider uppercase text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full inline-block mb-3.5">
              Diagnostic Assessment
            </span>
            <h2 className="font-display font-extrabold text-[clamp(1.9rem,4vw,3.1rem)] leading-[1.08] text-ink max-w-[22ch]">
              Do you need a Virtual CMO? Tick what sounds familiar.
            </h2>
            <p className="text-muted font-body text-[1.1rem] max-w-[56ch] mt-4 leading-relaxed">
              Identify the operational and strategic bottlenecks currently stalling your company's growth.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-10">
            {signsData.map((sign, idx) => {
              const isChecked = selectedSigns.includes(idx);
              return (
                <button
                  key={sign.title}
                  type="button"
                  onClick={() => toggleSign(idx)}
                  className={`flex items-start gap-3.5 p-5 rounded-2xl border text-left transition-all cursor-pointer interactive-card ${
                    isChecked
                      ? 'border-accent bg-lav shadow-xs'
                      : 'border-rule bg-card hover:border-accent/40'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 ${
                      isChecked
                        ? 'bg-accent border-accent text-white scale-105'
                        : 'border-muted text-transparent'
                    }`}
                  >
                    ✓
                  </span>
                  <div>
                    <b className="font-display font-semibold text-ink block text-[1.02rem]">
                      {sign.title}
                    </b>
                    <span className="text-muted text-[0.95rem] leading-relaxed block mt-0.5">
                      {sign.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {count === 0 && (
            <p className="mt-5 text-muted font-display text-[0.95rem]">
              Tick the ones that apply to you to see your tailored diagnostic result.
            </p>
          )}

          {/* Dynamic Score & Recommendation Card */}
          <AnimatePresence>
            {count > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.35 }}
                className="mt-8 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] border-2 border-accent rounded-3xl overflow-hidden bg-card shadow-lg card-hover"
              >
                <div className="bg-lav p-7 sm:p-8 flex flex-col justify-between">
                  <div>
                    <span className="font-display font-semibold text-accent text-[0.9rem] uppercase tracking-wider">
                      Your diagnostic score
                    </span>
                    <div className="font-display font-extrabold text-[3.2rem] text-ink leading-none mt-2">
                      {count} <span className="text-muted text-[1.8rem]">of 6</span>
                    </div>
                    {/* Gauge meter */}
                    <div className="grid grid-cols-6 gap-1.5 mt-3.5">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                          key={i}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            i <= count ? 'bg-gold shadow-xs' : 'bg-lav-2'
                          }`}
                        />
                      ))}
                    </div>
                    <h3 className="font-display font-bold text-[1.4rem] text-ink mt-6">
                      {result.title}
                    </h3>
                    <p className="text-muted mt-2 text-[0.98rem] leading-relaxed">
                      {result.desc}
                    </p>
                  </div>
                </div>

                <div className="p-7 sm:p-8 flex flex-col justify-between">
                  <div>
                    <span className="font-display font-semibold text-accent text-[0.9rem] uppercase tracking-wider">
                      What I'd fix first
                    </span>
                    <ol className="mt-3 space-y-2 list-decimal list-inside text-ink font-body text-[1rem]">
                      {result.fixes.map((fix, idx) => (
                        <li key={idx} className="py-1">
                          <span className="font-medium text-ink">{fix}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="mt-8 pt-4 border-t border-rule">
                    <a href="#apply" className="btn gold">
                      {result.ctaText} &rarr;
                    </a>
                    <p className="font-display text-[0.85rem] text-muted mt-2">
                      Your answers go straight into your brief below.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 3 BEFORE / AFTER */}
      <section className="py-24 lg:py-28 bg-paper-2" id="how">
        <div className="max-w-[1160px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.55 }}
          >
            <span className="font-display font-semibold text-xs tracking-wider uppercase text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full inline-block mb-3.5">
              Transformation
            </span>
            <h2 className="font-display font-extrabold text-[clamp(1.9rem,4vw,3.1rem)] leading-[1.08] text-ink max-w-[22ch]">
              What changes in the first 90 days
            </h2>
            <p className="text-muted font-body text-[1.1rem] max-w-[56ch] mt-4 leading-relaxed">
              From disjointed tactics and founder bottlenecking to structured roadmap execution and pipeline revenue.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 mt-10 rounded-[24px] overflow-hidden border border-rule shadow-sm card-hover">
            {/* Before */}
            <div className="p-8 bg-paper">
              <h3 className="font-display font-bold text-[1.15rem] text-muted mb-4 uppercase tracking-wider">
                Without a marketing leader
              </h3>
              <ul className="space-y-3 divide-y divide-rule font-body text-[1rem] text-muted">
                <li className="pt-2">Tactics chosen by whoever shouted last or what a competitor published</li>
                <li className="pt-2">Founder spends 10+ hours a week reviewing drafts and approving briefs</li>
                <li className="pt-2">Agency bills arrive monthly with zero attributable sales pipeline</li>
                <li className="pt-2">Marketing team lacks clear quarterly priorities and strategic feedback</li>
              </ul>
            </div>

            {/* After */}
            <div className="p-8 bg-card border-t md:border-t-0 md:border-l border-rule">
              <h3 className="font-display font-bold text-[1.15rem] text-accent mb-4 uppercase tracking-wider">
                With Himani as Virtual CMO
              </h3>
              <ul className="space-y-3 divide-y divide-rule font-body text-[1rem] text-ink">
                <li className="pt-2 font-medium">A focused quarterly roadmap tied directly to revenue and qualified leads</li>
                <li className="pt-2 font-medium">Founder is freed to lead the business while marketing runs autonomously</li>
                <li className="pt-2 font-medium">Agencies are held accountable to specific weekly output and business KPIs</li>
                <li className="pt-2 font-medium">Internal marketing team is coached, directed, and leveled up continuously</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4 90-DAY RAMP */}
      <section className="py-24 lg:py-28 bg-paper">
        <div className="max-w-[1160px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.55 }}
          >
            <span className="font-display font-semibold text-xs tracking-wider uppercase text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full inline-block mb-3.5">
              Execution Roadmap
            </span>
            <h2 className="font-display font-extrabold text-[clamp(1.9rem,4vw,3.1rem)] text-ink">
              The 90-day ramp
            </h2>
            <p className="text-muted font-body text-[1.1rem] max-w-[56ch] mt-4 leading-relaxed">
              How we get from initial chaos to a predictable, compounding marketing engine.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
            {[
              {
                step: '1',
                when: 'Weeks 1–2',
                title: 'Audit & Diagnose',
                desc: 'Deep audit of existing channels, metrics, past content, and competitor positions to eliminate wasted spend.',
              },
              {
                step: '2',
                when: 'Weeks 3–4',
                title: 'Align & Roadmap',
                desc: 'Define positioning, core messaging, ICP focus, and the Q1 growth roadmap with resource allocations.',
              },
              {
                step: '3',
                when: 'Month 2',
                title: 'First Growth Bets',
                desc: 'Execute founder-led LinkedIn, search visibility plays, and high-intent content engine buildout.',
              },
              {
                step: '4',
                when: 'Month 3',
                title: 'Predictable Engine',
                desc: 'Establish recurring board reporting, channel attribution, and internal playbooks so results compound.',
              },
            ].map((st, idx) => (
              <motion.div
                key={st.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-card border border-rule rounded-2xl p-6 relative flex flex-col justify-between shadow-xs card-hover"
              >
                <div>
                  <span className="w-9 h-9 rounded-full bg-gold text-gold-ink font-display font-extrabold flex items-center justify-center mb-4 transition-transform hover:scale-110">
                    {st.step}
                  </span>
                  <span className="font-display font-semibold text-[0.88rem] text-accent block mb-1">
                    {st.when}
                  </span>
                  <h3 className="font-display font-bold text-[1.2rem] text-ink">
                    {st.title}
                  </h3>
                  <p className="text-muted text-[0.96rem] mt-2.5 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 COMPARISON TABLE */}
      <section className="py-24 lg:py-28 bg-paper-2">
        <div className="max-w-[1160px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.55 }}
          >
            <span className="font-display font-semibold text-xs tracking-wider uppercase text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full inline-block mb-3.5">
              Side-by-Side Comparison
            </span>
            <h2 className="font-display font-extrabold text-[clamp(1.9rem,4vw,3.1rem)] text-ink">
              Compare your options
            </h2>
            <p className="text-muted font-body text-[1.1rem] max-w-[56ch] mt-4 leading-relaxed">
              How a dedicated Virtual CMO compares to traditional agency retainers or recruiting a full-time executive.
            </p>
          </motion.div>
          <div className="mt-10 overflow-x-auto border border-rule rounded-2xl bg-card shadow-xs card-hover">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-rule font-display text-[0.9rem] text-muted">
                  <th className="p-4.5">Dimension</th>
                  <th className="p-4.5 bg-lav text-accent font-bold">Virtual CMO (Himani)</th>
                  <th className="p-4.5">Traditional Agency</th>
                  <th className="p-4.5">Full-Time CMO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule font-body text-[0.96rem]">
                <tr className="hover:bg-lav/30 transition-colors">
                  <td className="p-4.5 font-display font-semibold text-ink">Time to start</td>
                  <td className="p-4.5 bg-lav/60 font-semibold text-accent font-display">2 weeks</td>
                  <td className="p-4.5 text-muted">2–4 weeks onboarding</td>
                  <td className="p-4.5 text-muted">3–6 months recruiting</td>
                </tr>
                <tr className="hover:bg-lav/30 transition-colors">
                  <td className="p-4.5 font-display font-semibold text-ink">Strategic breadth</td>
                  <td className="p-4.5 bg-lav/60 font-semibold text-accent font-display">End-to-end (Strategy to Revenue)</td>
                  <td className="p-4.5 text-muted">Siloed (SEO or Ads only)</td>
                  <td className="p-4.5 text-muted">Broad but single-industry</td>
                </tr>
                <tr className="hover:bg-lav/30 transition-colors">
                  <td className="p-4.5 font-display font-semibold text-ink">Cost commitment</td>
                  <td className="p-4.5 bg-lav/60 font-semibold text-accent font-display">Flexible monthly retainer</td>
                  <td className="p-4.5 text-muted">Scope creep & ad markups</td>
                  <td className="p-4.5 text-muted">$200k+ base + equity + severance</td>
                </tr>
                <tr className="hover:bg-lav/30 transition-colors">
                  <td className="p-4.5 font-display font-semibold text-ink">Founder involvement</td>
                  <td className="p-4.5 bg-lav/60 font-semibold text-accent font-display">1 hr strategic sync per week</td>
                  <td className="p-4.5 text-muted">High (managing agency reps)</td>
                  <td className="p-4.5 text-muted">Low after ramp</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 6 APPLICATION FORM */}
      <section className="py-20 lg:py-24 bg-paper" id="apply">
        <div className="max-w-[780px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-paper-2 border border-rule rounded-[26px] p-8 sm:p-10 shadow-sm card-hover"
          >
            <h2 className="font-display font-extrabold text-[2.2rem] text-ink">
              Apply for a Virtual CMO seat
            </h2>
            <p className="text-muted mt-2 text-[1.05rem]">
              I personally review every application within 48 hours to confirm mutual fit before our call.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 p-6 bg-card rounded-2xl border border-rule"
              >
                <h3 className="font-display font-bold text-[1.4rem] text-ink">
                  Thank you, {name.split(' ')[0]}!
                </h3>
                <p className="text-muted mt-2 text-[0.98rem]">
                  Your brief has been prepared. Please click below to choose your consultation slot on Calendly:
                </p>
                <div className="mt-6">
                  <a
                    href={calendlyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn gold"
                  >
                    Select time on Calendly &rarr;
                  </a>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleApply} className="mt-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-display font-semibold text-[0.9rem] text-ink mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full p-3 rounded-xl border border-rule bg-card text-ink focus:border-ink focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-display font-semibold text-[0.9rem] text-ink mb-1">
                      Work Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@company.com"
                      className="w-full p-3 rounded-xl border border-rule bg-card text-ink focus:border-ink focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-display font-semibold text-[0.9rem] text-ink mb-1">
                      Company Name & URL
                    </label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Acme SaaS (acme.com)"
                      className="w-full p-3 rounded-xl border border-rule bg-card text-ink focus:border-ink focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-display font-semibold text-[0.9rem] text-ink mb-1">
                      Desired Start
                    </label>
                    <select
                      value={applyWhen}
                      onChange={(e) => setApplyWhen(e.target.value)}
                      className="w-full p-3 rounded-xl border border-rule bg-card text-ink focus:border-ink focus:outline-hidden"
                    >
                      <option>This month</option>
                      <option>Next 1–3 months</option>
                      <option>Just exploring</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-display font-semibold text-[0.9rem] text-ink mb-1">
                    Primary growth challenge / notes
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="E.g. We have product-market fit but organic acquisition has stalled..."
                    className="w-full p-3 rounded-xl border border-rule bg-card text-ink focus:border-ink focus:outline-hidden"
                  />
                </div>

                <button type="submit" className="btn solid w-full justify-center !py-3.5 mt-2">
                  Continue to schedule call &rarr;
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
