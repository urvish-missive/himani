import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CrownIcon, TickIcon } from '../components/ui/BrandIcons';
import trainerHeroImg from '../images/himanimarketing.jpg';
import aboutImg from '../images/himanimainsection.jpg';
import galleryImg1 from '../images/himanispeaker.jpg';
import galleryImg2 from '../images/hiimanisasspeaker.jpg';
import galleryImg3 from '../images/himanimainimage.jpg';
import galleryImg4 from '../images/Himani-Kankaria4-684x1024.jpg';

export default function TeamTrainingPage() {
  const [selectedAudience, setSelectedAudience] = useState('Marketing team');
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formSize, setFormSize] = useState('11 to 20');
  const [formFormat, setFormFormat] = useState('Not sure yet');
  const [formWhere, setFormWhere] = useState('Online');
  const [formMsg, setFormMsg] = useState('');
  const [formErr, setFormErr] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const audiences = [
    'Marketing team',
    'Content team',
    'Sales team',
    'Marketing and sales together',
    'Leadership team',
  ];

  const modulesData = [
    {
      title: 'Marketing strategy and planning',
      desc: 'Goals, channels and a plan everyone can follow.',
      duration: 'Half day',
    },
    {
      title: 'Brand and messaging',
      desc: 'One clear story across every team and channel.',
      duration: 'Half day',
    },
    {
      title: 'Content strategy that sells',
      desc: 'Full-funnel content mapped to buyer questions.',
      duration: 'Half day',
    },
    {
      title: 'LinkedIn for teams',
      desc: 'Profiles, posting and employee advocacy that bring leads.',
      duration: 'Half day',
    },
    {
      title: 'AI in marketing',
      desc: 'Practical AI workflows, and where humans still matter.',
      duration: 'Half day',
    },
    {
      title: 'Search and AI visibility',
      desc: 'Being found on Google and named in AI answers.',
      duration: 'Half day',
    },
    {
      title: 'Sales enablement content',
      desc: 'Case studies, decks and follow-ups sales will use.',
      duration: 'Half day',
    },
    {
      title: 'Measuring what matters',
      desc: 'Metrics tied to pipeline, not vanity numbers.',
      duration: 'Half day',
    },
  ];

  const toggleModule = (title: string) => {
    if (selectedModules.includes(title)) {
      setSelectedModules(selectedModules.filter((m) => m !== title));
    } else {
      setSelectedModules([...selectedModules, title]);
    }
  };

  const getFormatRecommendation = () => {
    const len = selectedModules.length;
    if (len === 0) return null;
    if (len === 1) return 'Suggested format: a half-day workshop.';
    if (len === 2) return 'Suggested format: a full-day workshop.';
    const months = Math.min(Math.max(len, 3), 6);
    return `Suggested format: a ${months}-month recurring programme, one module a month.`;
  };

  const handleApplyFromBuilder = () => {
    const len = selectedModules.length;
    const msg = `${selectedAudience}${
      len ? `. Modules: ${selectedModules.join('; ')}.` : '.'
    }`;
    setFormMsg(msg);
    setFormFormat(
      len > 2
        ? 'Recurring programme'
        : len > 0
        ? 'One-off workshop'
        : 'Not sure yet'
    );
    const applySection = document.getElementById('apply');
    if (applySection) applySection.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectFormat = (fmt: string) => {
    setFormFormat(fmt);
    const applySection = document.getElementById('apply');
    if (applySection) applySection.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormErr('Add your name so I know who I am speaking with.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail.trim())) {
      setFormErr('Add a valid work email so I can send the invite.');
      return;
    }
    if (!formCompany.trim()) {
      setFormErr('Add your company name.');
      return;
    }
    setFormErr('');
    setFormSubmitted(true);
  };

  const brief = `Team training | ${formCompany} | ${formSize} people | ${formFormat} | ${formWhere}${
    formMsg.trim() ? ' | ' + formMsg.trim() : ''
  }`;

  const calendlyUrl = `https://calendly.com/missivedigital/30min?name=${encodeURIComponent(
    formName
  )}&email=${encodeURIComponent(formEmail)}&a1=${encodeURIComponent(brief)}`;

  return (
    <div>
      {/* 1 HERO */}
      <section className="pt-8 pb-14 sm:pt-12 sm:pb-18 lg:pt-14 lg:pb-20 bg-gradient-to-b from-lav to-paper border-b border-rule">
        <div className="max-w-[1160px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 font-display font-semibold text-sm text-accent mb-4">
                <CrownIcon className="w-5 h-5 text-gold" />
                <span>Marketing and sales team training</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-[4.6rem] font-display font-extrabold tracking-tight leading-[1.05] text-ink max-w-[16ch]">
                Training that changes what your team does on Monday.
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted font-body leading-relaxed max-w-[52ch]">
                Hands-on workshops for marketing, content and sales teams, built on your own website, content and pipeline. Run it once, or make it a monthly habit.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <a href="#apply" className="btn solid">
                  Plan a training
                </a>
                <a href="#build" className="btn ghost">
                  Build your agenda
                </a>
              </div>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted font-display font-medium">
                <span className="inline-flex items-center gap-2">
                  <TickIcon className="w-4 h-4 text-good" /> Built on your real work
                </span>
                <span className="inline-flex items-center gap-2">
                  <TickIcon className="w-4 h-4 text-good" /> Online or on-site
                </span>
                <span className="inline-flex items-center gap-2">
                  <TickIcon className="w-4 h-4 text-good" /> One-off or recurring
                </span>
              </div>
            </motion.div>

            {/* Profile Aside Card */}
            <motion.aside
              initial={{ opacity: 0, scale: 0.95, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-card border border-rule rounded-3xl p-6 shadow-xl max-w-sm lg:max-w-none mx-auto w-full card-hover group"
            >
              <div className="aspect-square rounded-2xl overflow-hidden border border-rule relative">
                <img
                  src={trainerHeroImg}
                  alt="Himani training a team"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <h3 className="mt-4 text-xl font-display font-extrabold text-ink">
                Himani Kankaria
              </h3>
              <p className="text-muted text-sm mt-1 font-body">
                Trainer, Virtual CMO and international speaker.
              </p>
              <ul className="mt-4 pt-2 border-t border-rule space-y-2 text-sm font-display text-ink">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                  21+ marketing teams trained
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                  Guest faculty at GUSEC
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                  Speaker, International Search Summit and WordCamp Asia
                </li>
              </ul>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* 2 TRAINING BUILDER */}
      <section id="build" className="py-24 border-b border-rule">
        <div className="max-w-[1160px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-2xl mb-12"
          >
            <span className="font-display font-semibold text-accent text-xs tracking-wider uppercase block mb-3">
              Curriculum Builder
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-ink tracking-tight">
              Build your team's training
            </h2>
            <p className="mt-4 text-muted font-body text-lg">
              Choose who it's for, then pick the modules. I'll tailor every one to your company and live pipeline.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-8 items-start">
            <div>
              {/* Audience selector pills */}
              <div className="flex flex-wrap gap-2.5 mb-6" role="group" aria-label="Who is attending">
                {audiences.map((aud) => {
                  const isActive = selectedAudience === aud;
                  return (
                    <button
                      key={aud}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setSelectedAudience(aud)}
                      className={`font-display font-semibold text-sm rounded-full px-4 py-2 border transition-all cursor-pointer interactive-card ${
                        isActive
                          ? 'bg-ink text-paper border-ink shadow-sm'
                          : 'bg-card text-ink border-rule hover:border-accent'
                      }`}
                    >
                      {aud}
                    </button>
                  );
                })}
              </div>

              {/* Modules 2-column grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {modulesData.map((mod) => {
                  const isChecked = selectedModules.includes(mod.title);
                  return (
                    <button
                      key={mod.title}
                      type="button"
                      aria-pressed={isChecked}
                      onClick={() => toggleModule(mod.title)}
                      className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer interactive-card ${
                        isChecked
                          ? 'border-accent bg-lav text-ink'
                          : 'border-rule bg-card text-ink hover:border-accent/40'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 ${
                          isChecked
                            ? 'bg-accent border-accent text-white scale-105'
                            : 'border-muted text-transparent'
                        }`}
                      >
                        <TickIcon className="w-3.5 h-3.5 text-white" />
                      </span>
                      <div>
                        <b className="font-display font-semibold text-base block leading-snug">
                          {mod.title}
                        </b>
                        <span className="text-muted text-sm font-body block mt-1 leading-normal">
                          {mod.desc}
                        </span>
                        <em className="not-italic font-display text-xs text-accent font-semibold block mt-2">
                          {mod.duration}
                        </em>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Summary Card (Sticky) */}
            <aside className="bg-card border-2 border-accent rounded-3xl p-6 sm:p-8 sticky top-24 shadow-sm card-hover">
              <div className="font-display font-semibold text-xs tracking-wider text-accent uppercase">
                Your training
              </div>
              <h3 className="text-2xl font-display font-extrabold text-ink mt-2">
                {selectedAudience}
              </h3>

              {selectedModules.length === 0 ? (
                <p className="text-muted font-body text-sm mt-3">
                  Tick modules to build your agenda.
                </p>
              ) : (
                <ol className="mt-4 space-y-2 list-decimal list-inside text-ink font-body text-sm">
                  {selectedModules.map((item, idx) => (
                    <li key={idx} className="font-medium">
                      {item}
                    </li>
                  ))}
                </ol>
              )}

              {getFormatRecommendation() && (
                <p className="mt-5 pt-4 border-t border-rule font-display font-semibold text-sm text-ink">
                  {getFormatRecommendation()}
                </p>
              )}

              <div className="mt-6 pt-4 border-t border-rule">
                <button
                  type="button"
                  onClick={handleApplyFromBuilder}
                  className="btn gold w-full justify-center"
                >
                  Get this plan
                </button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* 3 FORMATS */}
      <section className="py-24 bg-paper-2 border-b border-rule">
        <div className="max-w-[1160px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-2xl mb-14"
          >
            <span className="font-display font-semibold text-accent text-xs tracking-wider uppercase block mb-3">
              Delivery Options
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-ink tracking-tight">
              Two ways to run it
            </h2>
            <p className="mt-4 text-muted font-body text-lg">
              Deliver a high-impact workshop or build compounding capabilities across several months.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Workshop */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.55 }}
              className="border border-rule rounded-3xl p-8 sm:p-10 bg-card flex flex-col justify-between card-hover"
            >
              <div>
                <span className="font-display font-semibold text-accent text-sm tracking-wide">
                  Half day or full day
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-ink mt-2">
                  One-off workshop
                </h3>
                <p className="mt-3 text-muted font-body text-base">
                  A focused, hands-on session to close a specific capability gap.
                </p>
                <ul className="mt-6 space-y-3 font-body text-ink">
                  <li className="flex items-start gap-3">
                    <TickIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>Pre-read of your website, content, sales decks and materials</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <TickIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>Live workshop with exercises on your own assets and customer data</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <TickIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>Take-home playbook and template toolkit for the team</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <TickIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>30-day follow-up call with the team lead to review output</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-rule">
                <button
                  type="button"
                  onClick={() => handleSelectFormat('One-off workshop')}
                  className="btn ghost"
                >
                  Plan a workshop
                </button>
              </div>
            </motion.article>

            {/* Recurring */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="border-2 border-accent rounded-3xl p-8 sm:p-10 bg-lav flex flex-col justify-between shadow-md card-hover"
            >
              <div>
                <span className="font-display font-semibold text-accent text-sm tracking-wide">
                  Monthly, 3 to 6 months
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-ink mt-2">
                  Recurring programme
                </h3>
                <p className="mt-3 text-muted font-body text-base">
                  A monthly session plus review of real work in between, so new habits stick.
                </p>
                <ul className="mt-6 space-y-3 font-body text-ink">
                  <li className="flex items-start gap-3">
                    <TickIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>One live session each month, tackling one module at a time</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <TickIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>Review of the team's actual work and campaign deliverables between sessions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <TickIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>Regular progress check-ins with executive leadership</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <TickIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>A living playbook that grows and adapts each month</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-rule">
                <button
                  type="button"
                  onClick={() => handleSelectFormat('Recurring programme')}
                  className="btn gold"
                >
                  Plan a programme
                </button>
              </div>
            </motion.article>
          </div>
        </div>
      </section>

      {/* 4 HOW EVERY TRAINING WORKS */}
      <section className="py-24 bg-lav border-b border-rule">
        <div className="max-w-[1160px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-2xl mb-12"
          >
            <span className="font-display font-semibold text-accent text-xs tracking-wider uppercase block mb-3">
              Step-by-Step
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-ink tracking-tight">
              How every training works
            </h2>
            <p className="mt-4 text-muted font-body text-lg">
              A structured four-part cadence that guarantees lessons translate directly into weekly execution.
            </p>
          </motion.div>

          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: 1,
                title: 'Brief',
                time: 'Call with team lead',
                desc: 'We agree on objectives, skill gaps, and exactly who attends.',
              },
              {
                num: 2,
                title: 'Pre-work',
                time: 'Before the session',
                desc: 'I review your website, content, sales decks and materials to build real custom exercises.',
              },
              {
                num: 3,
                title: 'Workshop',
                time: 'Live, online or on-site',
                desc: 'Short crisp teaching, then hands-on work on your own live assets.',
              },
              {
                num: 4,
                title: 'Follow-through',
                time: 'After the session',
                desc: 'A custom playbook, and a check-in to see what the team is doing differently.',
              },
            ].map((step, idx) => (
              <motion.li
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-card border border-rule rounded-2xl p-6 relative shadow-sm card-hover"
              >
                <span className="w-9 h-9 rounded-full bg-gold text-gold-ink font-display font-extrabold text-sm flex items-center justify-center mb-4 transition-transform hover:scale-110">
                  {step.num}
                </span>
                <h3 className="text-lg font-display font-extrabold text-ink">{step.title}</h3>
                <div className="text-xs font-display font-semibold text-accent mt-1">{step.time}</div>
                <p className="mt-3 text-muted text-sm font-body">{step.desc}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5 BEFORE AFTER */}
      <section className="py-24 border-b border-rule">
        <div className="max-w-[1160px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-2xl mb-12"
          >
            <span className="font-display font-semibold text-accent text-xs tracking-wider uppercase block mb-3">
              Behavioral Shift
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-ink tracking-tight">
              What your team does differently
            </h2>
            <p className="mt-4 text-muted font-body text-lg">
              Training isn't about passive listening. It transforms day-to-day execution.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden border border-rule bg-card card-hover">
            <div className="p-8 sm:p-10 bg-paper-2">
              <h3 className="text-xl font-display font-extrabold text-muted mb-6">
                Before
              </h3>
              <ul className="space-y-4 font-body text-muted">
                <li className="pb-3 border-b border-rule">Content made to fill a calendar</li>
                <li className="pb-3 border-b border-rule">Everyone describes the company differently</li>
                <li className="pb-3 border-b border-rule">AI tools used randomly, or not at all</li>
                <li className="pb-3 border-b border-rule">Sales ignores what marketing creates</li>
                <li>Reports full of vanity numbers nobody acts on</li>
              </ul>
            </div>

            <div className="p-8 sm:p-10 bg-card border-t md:border-t-0 md:border-l border-rule">
              <h3 className="text-xl font-display font-extrabold text-accent mb-6">
                After
              </h3>
              <ul className="space-y-4 font-body text-ink">
                <li className="pb-3 border-b border-rule flex items-start gap-2.5">
                  <TickIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>Content planned against buyer questions and sales pipeline</span>
                </li>
                <li className="pb-3 border-b border-rule flex items-start gap-2.5">
                  <TickIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>One shared message across marketing and sales</span>
                </li>
                <li className="pb-3 border-b border-rule flex items-start gap-2.5">
                  <TickIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>Clear AI workflows with human judgement built in</span>
                </li>
                <li className="pb-3 border-b border-rule flex items-start gap-2.5">
                  <TickIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>Sales actively using marketing assets in real deals</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <TickIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>A few metrics the team actually moves and improves</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6 PROOF */}
      <section className="py-24 bg-paper-2 border-b border-rule">
        <div className="max-w-[1160px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-2xl mb-12"
          >
            <span className="font-display font-semibold text-accent text-xs tracking-wider uppercase block mb-3">
              Proven Impact
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-ink tracking-tight">
              From teams I've trained
            </h2>
            <p className="mt-4 text-muted font-body text-lg">
              Tangible pipeline gains, increased content velocity, and real leadership feedback.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                stat: '21+',
                label: 'marketing teams trained',
                quote: 'Our team finally stopped guessing what to write and started building content that our enterprise prospects actually quote on calls.',
                author: 'Head of Marketing, SaaS Co.',
              },
              {
                stat: '3x',
                label: 'organic pipeline growth',
                quote: 'The LinkedIn training got 12 of our consultants active. It is now our second biggest source of high-intent inbound inquiries.',
                author: 'Managing Director, Tech Consulting',
              },
              {
                stat: '6 mos',
                label: 'recurring capability habit',
                quote: 'Monthly sessions gave our team real accountability. Instead of one-off excitement, our content engine compounded month over month.',
                author: 'VP Growth, E-commerce Tech',
              },
            ].map((item, idx) => (
              <motion.div
                key={item.stat}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-card border border-rule rounded-2xl p-6 sm:p-8 card-hover"
              >
                <div className="font-display font-extrabold text-4xl text-accent">{item.stat}</div>
                <div className="font-display text-muted text-sm mt-1">{item.label}</div>
                <p className="mt-4 font-body italic text-ink">&ldquo;{item.quote}&rdquo;</p>
                <small className="block mt-4 font-display text-muted text-xs font-semibold">
                  {item.author}
                </small>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 ABOUT HIMANI */}
      <section className="py-24 border-b border-rule">
        <div className="max-w-[1160px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.6 }}
              className="aspect-[4/5] rounded-3xl overflow-hidden border border-rule max-w-sm mx-auto shadow-md card-hover group"
            >
              <img
                src={aboutImg}
                alt="Himani Kankaria"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-ink tracking-tight">
                A trainer who still does the work
              </h2>
              <p className="mt-6 text-lg text-muted font-body leading-relaxed">
                I've spent 15+ years in marketing and content, and I still run real campaigns every week. That's why my sessions use today's examples, not last year's slides.
              </p>
              <p className="mt-4 text-base text-ink font-body leading-relaxed">
                I've trained 21+ marketing teams, taught branding to early-stage founders as guest faculty at GUSEC, and hosted meetups for 50+ SEOs, writers and business owners in Ahmedabad. On stage, I've spoken from Barcelona to Mumbai.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {['21+ teams trained', 'Guest faculty, GUSEC', 'Content Queen of India'].map((badge) => (
                  <span
                    key={badge}
                    className="font-display text-sm border border-rule rounded-full px-4 py-1.5 bg-card text-ink hover:border-accent hover:bg-lav/50 transition-colors"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              <div className="mt-8">
                <a href="/" className="btn ghost">
                  More about Himani
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* REAL-LIFE PROOF GALLERY */}
      <section className="py-24 bg-paper-2 border-b border-rule" id="gallery">
        <div className="max-w-[1160px] mx-auto px-6">
          <div className="inline-flex items-center gap-2 font-display font-semibold text-sm text-accent mb-3">
            <CrownIcon className="w-5 h-5 text-gold" />
            <span>From the training room</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-ink tracking-tight">
            Teams that walk out different.
          </h2>
          <p className="mt-4 text-muted font-body text-lg">
            Workshops, team sessions and feedback from the people who attended.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[160px] sm:auto-rows-[190px] gap-4 mt-10">
            {[
              {
                src: galleryImg1,
                alt: 'Marketing team training',
                caption: 'Full-Day Team Strategy Intensive',
                span: 'col-span-2 row-span-2',
                focus: 'object-[center_35%]',
              },
              {
                src: galleryImg2,
                alt: 'Hands-on content workshop',
                caption: 'Hands-on Content Lab',
                span: '',
                focus: 'object-[center_20%]',
              },
              {
                src: galleryImg3,
                alt: 'Interactive group training',
                caption: 'LinkedIn Advocacy Workshop',
                span: 'row-span-2',
                focus: 'object-[center_18%]',
              },
              {
                src: galleryImg4,
                alt: 'Training feedback session',
                caption: 'Playbook Review & Q&A',
                span: '',
                focus: 'object-[center_15%]',
              },
            ].map((img, idx) => (
              <motion.figure
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className={`rounded-2xl overflow-hidden relative border border-rule shadow-sm group card-hover ${img.span}`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className={`w-full h-full object-cover ${img.focus} group-hover:scale-105 transition-transform duration-700 ease-out`}
                />
                <figcaption className="absolute bottom-3 left-3 bg-paper/95 text-ink text-xs font-display font-medium px-3 py-1 rounded-full backdrop-blur-md border border-rule/60 shadow-xs">
                  {img.caption}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* 8 FAQ */}
      <section className="py-24 bg-paper-2/60 border-t border-b border-rule" id="faq">
        <div className="max-w-[1160px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.55fr] gap-12 lg:gap-16 items-start">
            {/* Left: Section Header & Context */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.55 }}
              className="lg:sticky lg:top-28"
            >
              <div className="inline-flex items-center gap-2 font-display font-semibold text-[0.88rem] text-accent mb-3.5">
                <CrownIcon className="w-4 h-4 text-accent shrink-0" />
                <span>Frequently asked questions</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-display font-extrabold text-ink leading-[1.08] tracking-tight">
                Questions teams ask
              </h2>
              <p className="mt-4 text-muted font-body text-base sm:text-lg leading-relaxed max-w-[36ch]">
                Everything you need to know about team sizes, on-site vs online workshops, customization, and follow-up reviews.
              </p>

              <div className="mt-8 p-5.5 rounded-2xl bg-paper border border-rule shadow-2xs">
                <p className="font-display font-bold text-ink text-[0.98rem]">
                  Planning a workshop for your team?
                </p>
                <p className="text-muted font-body text-sm mt-1.5 leading-relaxed">
                  Tell me your team size and marketing goals, and I will tailor a syllabus around your real work.
                </p>
                <a
                  href="#apply"
                  className="inline-flex items-center gap-1.5 text-accent font-display font-semibold text-sm mt-3.5 hover:underline"
                >
                  Plan your team training ↓
                </a>
              </div>
            </motion.div>

            {/* Right: Accordion Items */}
            <div className="space-y-3.5">
              {[
                {
                  q: 'How many people can attend?',
                  a: 'Workshops work best with up to 20 people so everyone gets hands-on time and direct feedback. Larger organisations can be split into smaller cohorts.',
                },
                {
                  q: 'Online or on-site?',
                  a: 'Both. Online sessions run on your preferred video tool with interactive boards. For on-site workshops I travel to your office; travel logistics are agreed upfront.',
                },
                {
                  q: 'How customised is it?',
                  a: 'Every module is rebuilt around your company. Exercises use your actual website, content, sales decks and buyer journeys, never generic dummy examples.',
                },
                {
                  q: 'Can marketing and sales attend together?',
                  a: "Yes, and it's often the single most impactful format. Shared sessions permanently fix the messaging and handoff gap between the two teams.",
                },
                {
                  q: 'What happens after the workshop?',
                  a: "Your team receives a tailored playbook, and I hold a 30-day follow-up call to review what they've implemented. The recurring programme adds monthly reviews of real work.",
                },
              ].map((faq, idx) => (
                <motion.details
                  key={faq.q}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.45, delay: idx * 0.05 }}
                  className="border border-rule rounded-2xl p-5 sm:p-6 bg-paper shadow-2xs group transition-shadow duration-200 open:shadow-xs"
                >
                  <summary className="font-display font-semibold text-[1.05rem] sm:text-[1.12rem] text-ink cursor-pointer list-none [&::-webkit-details-marker]:hidden flex justify-between items-start gap-4 select-none hover:text-accent transition-colors">
                    <span className="leading-snug pt-0.5">{faq.q}</span>
                    <span className="w-7 h-7 rounded-full bg-paper-2 border border-rule flex items-center justify-center text-accent text-lg leading-none shrink-0 group-open:rotate-45 group-open:bg-accent group-open:text-paper group-open:border-accent transition-all duration-300">
                      +
                    </span>
                  </summary>
                  <div className="mt-3.5 pt-3.5 border-t border-rule/70">
                    <p className="text-muted font-body leading-relaxed text-[0.98rem]">
                      {faq.a}
                    </p>
                  </div>
                </motion.details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9 APPLY */}
      <section id="apply" className="py-24 bg-paper-2">
        <div className="max-w-[1160px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-14 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.55 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-ink tracking-tight">
                Get a training plan for your team
              </h2>
              <p className="mt-4 text-muted font-body text-lg leading-relaxed">
                Share a few details and book a call. I'll come back with an agenda built for your team.
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3 text-ink font-body">
                  <TickIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>A tailored agenda after our first call.</span>
                </li>
                <li className="flex items-start gap-3 text-ink font-body">
                  <TickIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>Exercises built on your own materials.</span>
                </li>
                <li className="flex items-start gap-3 text-ink font-body">
                  <TickIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>Clear scope and format before you commit.</span>
                </li>
              </ul>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.6 }}
              onSubmit={handleFormSubmit}
              className="bg-card border-2 border-ink rounded-3xl p-8 sm:p-10 shadow-lg card-hover"
            >
              {!formSubmitted ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-display font-semibold text-ink uppercase mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Your name"
                        className="w-full px-4 py-2.5 rounded-xl border border-rule bg-paper text-ink focus:outline-none focus:border-accent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-display font-semibold text-ink uppercase mb-1">
                        Work email
                      </label>
                      <input
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-rule bg-paper text-ink focus:outline-none focus:border-accent text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-display font-semibold text-ink uppercase mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        value={formCompany}
                        onChange={(e) => setFormCompany(e.target.value)}
                        placeholder="Company name"
                        className="w-full px-4 py-2.5 rounded-xl border border-rule bg-paper text-ink focus:outline-none focus:border-accent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-display font-semibold text-ink uppercase mb-1">
                        Number of attendees
                      </label>
                      <select
                        value={formSize}
                        onChange={(e) => setFormSize(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-rule bg-paper text-ink focus:outline-none focus:border-accent text-sm"
                      >
                        <option>Up to 10</option>
                        <option>11 to 20</option>
                        <option>21 to 50</option>
                        <option>50+</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-display font-semibold text-ink uppercase mb-1">
                        Format
                      </label>
                      <select
                        value={formFormat}
                        onChange={(e) => setFormFormat(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-rule bg-paper text-ink focus:outline-none focus:border-accent text-sm"
                      >
                        <option>Not sure yet</option>
                        <option>One-off workshop</option>
                        <option>Recurring programme</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-display font-semibold text-ink uppercase mb-1">
                        Where
                      </label>
                      <select
                        value={formWhere}
                        onChange={(e) => setFormWhere(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-rule bg-paper text-ink focus:outline-none focus:border-accent text-sm"
                      >
                        <option>Online</option>
                        <option>On-site</option>
                        <option>Either</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-display font-semibold text-ink uppercase mb-1">
                      Team and topics
                    </label>
                    <textarea
                      rows={3}
                      value={formMsg}
                      onChange={(e) => setFormMsg(e.target.value)}
                      placeholder="Who's attending and what you'd like to cover..."
                      className="w-full px-4 py-2.5 rounded-xl border border-rule bg-paper text-ink focus:outline-none focus:border-accent text-sm font-body"
                    ></textarea>
                  </div>

                  {formErr && (
                    <p className="text-bad text-xs font-display font-semibold">{formErr}</p>
                  )}

                  <button
                    type="submit"
                    className="btn solid w-full justify-center text-center mt-2"
                  >
                    Send brief and book a call
                  </button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <span className="w-12 h-12 rounded-full bg-good/20 text-good font-extrabold flex items-center justify-center mx-auto mb-4">
                    <TickIcon className="w-6 h-6 text-good" />
                  </span>
                  <h3 className="text-2xl font-display font-extrabold text-ink">
                    Thanks, {formName.split(' ')[0]}. One last step.
                  </h3>
                  <p className="text-muted font-body mt-2 text-sm max-w-sm mx-auto">
                    Pick a time for a 30-minute planning call. Your brief is already attached.
                  </p>
                  <div className="mt-6">
                    <a
                      href={calendlyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn gold inline-flex"
                    >
                      Choose a time on Calendly
                    </a>
                  </div>
                </div>
              )}
            </motion.form>
          </div>
        </div>
      </section>
    </div>
  );
}
