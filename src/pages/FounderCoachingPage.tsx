import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CrownIcon, TickIcon, CrossIcon } from '../components/ui/BrandIcons';
import { useLeadSubmit } from '../hooks/useLeadSubmit';
import LeadThankYou from '../components/ui/LeadThankYou';
import { LEAD_LIMITS, validateLead, type LeadInput } from '../lib/leads';
import portraitImg from '../images/himani.jpg';
import aboutImg from '../images/himanimainsection.jpg';
import galleryImg1 from '../images/Himani-Kankaria4-684x1024.jpg';
import galleryImg2 from '../images/himanimarketing.jpg';
import galleryImg3 from '../images/himanispeaker.jpg';
import galleryImg4 from '../images/hiimanisasspeaker.jpg';
import { alternate, enter, reveal } from '../lib/motion';

export default function FounderCoachingPage() {
  const { submit: submitLead, submitting } = useLeadSubmit();
  const [activeTopic, setActiveTopic] = useState(0);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formStage, setFormStage] = useState('Growing, 10 to 50 people');
  const [formTopic, setFormTopic] = useState('Positioning and story');
  const [formFormat, setFormFormat] = useState('Not sure yet');
  const [formMsg, setFormMsg] = useState('');
  const [formErr, setFormErr] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const topicsData = [
    {
      q: '"What should we actually be known for?"',
      t: 'Positioning and story',
      d: 'We find the one thing you want to be known for, test it against how your buyers talk, and turn it into a story you can tell in one line.',
      l: [
        'A one-line positioning statement',
        'A simple story for website, deck and pitch',
        'Words to use, and words to drop',
      ],
    },
    {
      q: '"Should I be the face of the brand on LinkedIn?"',
      t: 'Founder brand on LinkedIn',
      d: "We decide what you stand for publicly, pick three themes you can own, and set a posting rhythm that fits a founder's week.",
      l: [
        'Your three content themes',
        'A realistic posting rhythm',
        'Feedback on your first posts',
      ],
    },
    {
      q: '"Where do we spend our first marketing money?"',
      t: 'Channel and budget bets',
      d: 'We look at where your buyers actually spend attention and decide which one or two channels deserve your first money and time.',
      l: [
        'A ranked shortlist of channels',
        'A 90-day test plan with clear signals',
        'What to stop spending on',
      ],
    },
    {
      q: '"Who should my first marketing hire be?"',
      t: 'First marketing hire',
      d: "We define the role you actually need, write the brief, and prepare how you'll judge candidates or agencies.",
      l: [
        'A clear role definition',
        'Interview questions and a test task',
        'A 30-day onboarding plan',
      ],
    },
    {
      q: '"Why isn\'t our content turning into customers?"',
      t: 'Content that brings customers',
      d: "We map your content to the questions buyers ask before they buy, and cut what isn't pulling its weight.",
      l: [
        'A content map from first question to sale',
        'Three pieces to create first',
        "A way to see what's working",
      ],
    },
  ];

  const handleSelectTopicFromCard = () => {
    setFormTopic(topicsData[activeTopic].t);
    const applySection = document.getElementById('apply');
    if (applySection) applySection.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectFormat = (fmt: string) => {
    setFormFormat(fmt);
    const applySection = document.getElementById('apply');
    if (applySection) applySection.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const lead: LeadInput = {
      source: 'founder-coaching',
      name: formName,
      email: formEmail,
      company: formCompany,
      message: formMsg,
      details: { Stage: formStage, Topic: formTopic, Format: formFormat },
    };
    let invalid = validateLead(lead);
    if (invalid === 'Add a valid email so I can reply.') invalid = 'Add a valid email so I can reply.';
    if (invalid) return setFormErr(invalid);
    setFormErr('');
    const err = await submitLead(lead);
    if (err) return setFormErr(err);
    setFormSubmitted(true);
  };

  return (
    <div>
      {/* 1 HERO */}
      <section className="pt-8 pb-14 sm:pt-12 sm:pb-18 lg:pt-14 lg:pb-20 bg-gradient-to-b from-lav to-paper border-b border-rule">
        <div className="max-w-[1160px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-14 items-center">
            <motion.div
              {...enter('clipUp')}
            >
              <div className="inline-flex items-center gap-2 font-display font-semibold text-sm text-accent mb-4">
                <CrownIcon className="w-5 h-5 text-gold" />
                <span>1-on-1 marketing coaching for founders</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-[4.6rem] font-display font-extrabold tracking-tight leading-[1.05] text-ink max-w-[16ch]">
                Stop making marketing decisions alone.
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted font-body leading-relaxed max-w-[52ch]">
                Private sessions for founders who still own marketing. We work through your positioning, your founder brand, your channel bets and your first hires, so you decide faster and with more confidence.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <a href="#apply" className="btn solid">
                  Apply for coaching
                </a>
                <a href="#topics" className="btn ghost">
                  See what we work on
                </a>
              </div>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted font-display font-medium">
                <span className="inline-flex items-center gap-2">
                  <TickIcon className="w-4 h-4 text-good" /> Private and confidential
                </span>
                <span className="inline-flex items-center gap-2">
                  <TickIcon className="w-4 h-4 text-good" /> Online, across time zones
                </span>
                <span className="inline-flex items-center gap-2">
                  <TickIcon className="w-4 h-4 text-good" /> Single session or a programme
                </span>
              </div>
            </motion.div>

            {/* Profile Aside Card */}
            <motion.aside
              {...enter('tilt3d', { delay: 0.15 })}
              className="bg-card border border-rule rounded-3xl p-6 shadow-xl max-w-sm lg:max-w-none mx-auto w-full card-hover group"
            >
              <div className="aspect-square rounded-2xl overflow-hidden border border-rule relative mb-5">
                <img
                  src={portraitImg}
                  alt="Himani Kankaria smiling at an event"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <h3 className="text-xl font-display font-extrabold text-ink">
                Himani Kankaria
              </h3>
              <p className="text-muted text-sm mt-1 font-body">
                Founder of Missive Digital, and a founder coach.
              </p>
              <ul className="mt-4 pt-2 border-t border-rule space-y-2 text-sm font-display text-ink">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                  Built her own company from Ahmedabad
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                  Guest faculty on branding at GUSEC
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                  15+ years in marketing and content
                </li>
              </ul>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* 2 TOPICS INTERACTIVE SELECTOR */}
      <section id="topics" className="py-24 border-b border-rule">
        <div className="max-w-[1160px] mx-auto px-6">
          <motion.div
            {...reveal('skewLeft')}
            className="max-w-3xl mb-12"
          >
            <span className="font-display font-semibold text-xs tracking-wider uppercase text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full inline-block mb-3.5">
              Interactive Explorer
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-ink tracking-tight">
              Which question is on your mind right now?
            </h2>
            <p className="mt-4 text-lg text-muted font-body">
              Select what's slowing your growth today to see how we solve it together.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-8 items-start">
            {/* Left list of questions */}
            <div className="flex flex-col gap-3" role="tablist">
              {topicsData.map((topic, idx) => {
                const isActive = activeTopic === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTopic(idx)}
                    className={`text-left p-5 rounded-2xl border transition-all font-body italic text-base sm:text-lg leading-snug cursor-pointer interactive-card ${
                      isActive
                        ? 'border-accent bg-lav text-ink shadow-[inset_4px_0_0_#F2C230]'
                        : 'border-rule bg-card text-ink hover:border-accent/40'
                    }`}
                  >
                    {topic.q}
                  </button>
                );
              })}
            </div>

            {/* Right sticky panel */}
            <motion.div
              key={activeTopic}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-card border-2 border-accent rounded-3xl p-8 sticky top-24 shadow-sm card-hover"
            >
              <div className="font-display font-semibold text-xs tracking-wider text-accent uppercase">
                We'd work on
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-ink mt-2">
                {topicsData[activeTopic].t}
              </h3>
              <p className="mt-3 text-muted font-body leading-relaxed text-base">
                {topicsData[activeTopic].d}
              </p>

              <h4 className="mt-6 font-display font-semibold text-sm text-ink uppercase tracking-wide">
                You'd leave with
              </h4>
              <ul className="mt-3 space-y-2 text-ink font-body">
                {topicsData[activeTopic].l.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <TickIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-rule">
                <button
                  type="button"
                  onClick={handleSelectTopicFromCard}
                  className="btn gold w-full sm:w-auto"
                >
                  Apply to work on this
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3 FIT */}
      <section className="py-24 bg-paper-2 border-b border-rule">
        <div className="max-w-[1160px] mx-auto px-6">
          <motion.div
            {...reveal('zoomBlur')}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <span className="font-display font-semibold text-xs tracking-wider uppercase text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full inline-block mb-3.5">
              Fit & Eligibility
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-ink tracking-tight mx-auto">
              Is coaching right for you?
            </h2>
            <p className="mt-4 text-muted font-body text-lg">
              Coaching is high-leverage when you need strategic direction, not outsourced execution.
            </p>
          </motion.div>

          <motion.div {...reveal('tilt3d')}>
          <div className="grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden border border-rule bg-card card-hover">
            {/* Good fit */}
            <div className="p-8 sm:p-10 bg-card">
              <h3 className="text-xl font-display font-extrabold text-accent mb-6">
                A good fit if you
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-ink font-body">
                  <TickIcon className="w-5 h-5 text-good flex-shrink-0 mt-1" />
                  <span>Run a B2B, SaaS or tech company and still own marketing</span>
                </li>
                <li className="flex items-start gap-3 text-ink font-body">
                  <TickIcon className="w-5 h-5 text-good flex-shrink-0 mt-1" />
                  <span>Want to think better about marketing, not hand it off yet</span>
                </li>
                <li className="flex items-start gap-3 text-ink font-body">
                  <TickIcon className="w-5 h-5 text-good flex-shrink-0 mt-1" />
                  <span>Want to build a founder brand without it taking over your week</span>
                </li>
                <li className="flex items-start gap-3 text-ink font-body">
                  <TickIcon className="w-5 h-5 text-good flex-shrink-0 mt-1" />
                  <span>Are about to hire your first marketer or agency</span>
                </li>
              </ul>
            </div>

            {/* Not right fit */}
            <div className="p-8 sm:p-10 bg-paper-2 border-t md:border-t-0 md:border-l border-rule">
              <h3 className="text-xl font-display font-extrabold text-muted mb-6">
                Not the right fit if you
              </h3>
              <ul className="space-y-4 text-muted font-body">
                <li className="flex items-start gap-3">
                  <CrossIcon className="w-5 h-5 text-bad flex-shrink-0 mt-1" />
                  <span>
                    Want someone to run marketing for you (see{' '}
                    <a href="/virtual-cmo" className="text-link underline hover:text-ink">
                      Virtual CMO
                    </a>
                    )
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CrossIcon className="w-5 h-5 text-bad flex-shrink-0 mt-1" />
                  <span>
                    Need your whole team trained (see{' '}
                    <a href="/team-training" className="text-link underline hover:text-ink">
                      team training
                    </a>
                    )
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CrossIcon className="w-5 h-5 text-bad flex-shrink-0 mt-1" />
                  <span>Are looking for quick, unrepeatable growth hacks</span>
                </li>
              </ul>
            </div>
          </div>
          </motion.div>
        </div>
      </section>

      {/* 4 FORMATS */}
      <section className="py-24 border-b border-rule">
        <div className="max-w-[1160px] mx-auto px-6">
          <motion.div
            {...reveal('curtain')}
            className="max-w-2xl mb-14"
          >
            <span className="font-display font-semibold text-xs tracking-wider uppercase text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full inline-block mb-3.5">
              Engagement Models
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-ink tracking-tight">
              Two ways to work together
            </h2>
            <p className="mt-4 text-muted font-body text-lg">
              Pick between an intensive standalone working session or ongoing quarterly partnership.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Format 1: Deep-dive session */}
            <motion.article
              {...reveal('rotateLeft')}
              className="border border-rule rounded-3xl p-8 sm:p-10 bg-card flex flex-col justify-between card-hover"
            >
              <div>
                <span className="font-display font-semibold text-accent text-sm tracking-wide">
                  One session, 90 minutes
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-ink mt-2">
                  Deep-dive session
                </h3>
                <p className="mt-3 text-muted font-body text-base">
                  One focused problem, solved together.
                </p>
                <ul className="mt-6 space-y-3 font-body text-ink">
                  <li className="flex items-start gap-3">
                    <TickIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>Short questionnaire before we meet</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <TickIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>90-minute working session directly on your challenge</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <TickIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>Written summary, framework, and exact next steps</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-rule">
                <button
                  type="button"
                  onClick={() => handleSelectFormat('Deep-dive session')}
                  className="btn ghost"
                >
                  Book a deep-dive
                </button>
              </div>
            </motion.article>

            {/* Format 2: Coaching programme */}
            <motion.article
              {...reveal('rotateRight', { delay: 0.1 })}
              className="border-2 border-accent rounded-3xl p-8 sm:p-10 bg-lav flex flex-col justify-between shadow-md card-hover"
            >
              <div>
                <span className="font-display font-semibold text-accent text-sm tracking-wide">
                  3 or 6 months
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-ink mt-2">
                  Coaching programme
                </h3>
                <p className="mt-3 text-muted font-body text-base">
                  Regular sessions while you make real decisions, with support in between.
                </p>
                <ul className="mt-6 space-y-3 font-body text-ink">
                  <li className="flex items-start gap-3">
                    <TickIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>Fortnightly 1-on-1 working sessions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <TickIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>Feedback on posts, decks, briefs, and hires between sessions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <TickIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>Your own marketing playbook, built collaboratively as we go</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <TickIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>Help interviewing and reviewing marketing candidates/agencies</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-rule">
                <button
                  type="button"
                  onClick={() => handleSelectFormat('Coaching programme')}
                  className="btn gold"
                >
                  Apply for the programme
                </button>
              </div>
            </motion.article>
          </div>
        </div>
      </section>

      {/* 5 HOW COACHING STARTS */}
      <section className="py-24 bg-lav border-b border-rule">
        <div className="max-w-[1160px] mx-auto px-6">
          <motion.div
            {...reveal('blurLeft')}
            className="max-w-2xl mb-12"
          >
            <span className="font-display font-semibold text-accent text-xs tracking-wider uppercase block mb-3">
              Process
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-ink tracking-tight">
              How coaching starts
            </h2>
            <p className="mt-4 text-muted font-body text-lg">
              A frictionless onboarding process designed to get straight to solving your core marketing blockers.
            </p>
          </motion.div>

          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: 1,
                title: 'Apply',
                time: '2 minutes',
                desc: 'Tell me about your company and the question on your mind right now.',
              },
              {
                num: 2,
                title: 'Chemistry call',
                time: '30 minutes, free',
                desc: 'We check if we work well together and agree on your core goals.',
              },
              {
                num: 3,
                title: 'Sessions',
                time: 'Fortnightly',
                desc: 'Working sessions on your real decisions and live marketing, not theory.',
              },
              {
                num: 4,
                title: 'In between',
                time: 'Async',
                desc: 'Send drafts, decks and briefs for rapid feedback as you execute.',
              },
            ].map((step, idx) => (
              <motion.li
                key={step.num}
                {...reveal('popSpring', { delay: idx * 0.08 })}
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

      {/* 6 OUTCOMES */}
      <section className="py-24 border-b border-rule">
        <div className="max-w-[1160px] mx-auto px-6">
          <motion.div
            {...reveal('clipUp')}
            className="max-w-2xl mb-12"
          >
            <span className="font-display font-semibold text-accent text-xs tracking-wider uppercase block mb-3">
              Deliverables & Value
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-ink tracking-tight">
              What founders walk away with
            </h2>
            <p className="mt-4 text-muted font-body text-lg">
              Concrete assets, messaging frameworks, and decision criteria you can hold and measure.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
            {[
              'A one-line answer to "what do you do?" that works everywhere.',
              'A LinkedIn presence that sounds like you and brings in conversations.',
              'A clear view of which channels to bet on, and which to ignore.',
              'The confidence to hire, brief and judge marketers and agencies.',
            ].map((text, idx) => (
              <motion.p
                key={idx}
                {...reveal('blurRight', { delay: idx * 0.08 })}
                className="font-display font-semibold text-xl sm:text-2xl text-ink leading-snug py-6 border-t-2 border-gold transition-transform duration-300 hover:translate-x-1"
              >
                {text}
              </motion.p>
            ))}
          </div>
        </div>
      </section>

      {/* 7 PROOF */}
      <section className="py-24 bg-paper-2 border-b border-rule">
        <div className="max-w-[1160px] mx-auto px-6">
          <motion.div
            {...reveal('riseScale')}
            className="max-w-2xl mb-12"
          >
            <span className="font-display font-semibold text-accent text-xs tracking-wider uppercase block mb-3">
              Client Stories
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-ink tracking-tight">
              From founders I've coached
            </h2>
            <p className="mt-4 text-muted font-body text-lg">
              Direct feedback and measurable growth results from founders across SaaS, fintech, and tech services.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                stat: '5x',
                label: 'LinkedIn reach & inbound leads',
                quote: 'Himani gave me clarity on how to speak publicly without spending half my week writing posts.',
                author: 'SaaS Founder, Ahmedabad',
              },
              {
                stat: '4 weeks',
                label: 'to a clear, defensible positioning',
                quote: 'Our website conversion doubled simply because prospects finally understood what made us distinct.',
                author: 'B2B Tech Founder, Bengaluru',
              },
              {
                stat: '1st',
                label: 'marketing hire made with total confidence',
                quote: 'Himani helped design the test task and interview our head of growth. Saved us 6 months of false starts.',
                author: 'Fintech Founder, Mumbai',
              },
            ].map((item, idx) => (
              <motion.div
                key={item.stat}
                {...alternate('rotateLeft', 'rotateRight', idx, 0.1)}
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

      {/* 8 ABOUT HIMANI */}
      <section className="py-24 border-b border-rule">
        <div className="max-w-[1160px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 items-center">
            <motion.div
              {...reveal('zoomBlur')}
              className="aspect-[4/5] rounded-3xl overflow-hidden border border-rule max-w-sm mx-auto shadow-md card-hover group"
            >
              <img
                src={aboutImg}
                alt="Himani Kankaria"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>
            <motion.div
              {...reveal('skewRight')}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-ink tracking-tight">
                A founder who's made the same calls
              </h2>
              <p className="mt-6 text-lg text-muted font-body leading-relaxed">
                I didn't start with a network or a marketing budget. I started with an IT degree, chose marketing over code, and built Missive Digital through cold outreach and a lot of trial and error.
              </p>
              <p className="mt-4 text-base text-ink font-body leading-relaxed">
                Today I'm known as the Content Queen of India, and I've spent 15+ years helping unicorn startups and global companies build brand visibility. I've also taught branding to early-stage founders as guest faculty at GUSEC. In our sessions you get both views: the marketer's and the founder's.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {['Founder, Missive Digital', 'Guest faculty, GUSEC', 'International speaker'].map((badge) => (
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
            <span>From coaching sessions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-ink tracking-tight">
            Real founders. Real decisions.
          </h2>
          <p className="mt-4 text-muted font-body text-lg">
            Sessions, workshops and notes from founders, shared with their permission.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[160px] sm:auto-rows-[190px] gap-4 mt-10">
            {[
              {
                src: galleryImg1,
                alt: 'Himani in coaching session',
                caption: '1-on-1 Founder Strategy Review',
                span: 'col-span-2 row-span-2',
              },
              {
                src: galleryImg2,
                alt: 'Marketing advisory',
                caption: 'Positioning Workshop',
                span: '',
              },
              {
                src: galleryImg3,
                alt: 'Conference discussion',
                caption: 'Founder Brand Strategy',
                span: 'row-span-2',
              },
              {
                src: galleryImg4,
                alt: 'Speaking and advisory',
                caption: 'GUSEC Faculty Session',
                span: '',
              },
            ].map((img, idx) => (
              <motion.figure
                key={idx}
                {...reveal('riseScale', { delay: idx * 0.08 })}
                className={`rounded-2xl overflow-hidden relative border border-rule shadow-sm group card-hover ${img.span}`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <figcaption className="absolute bottom-3 left-3 bg-paper/90 text-ink text-xs font-display px-3 py-1 rounded-full backdrop-blur-sm group-hover:bg-paper transition-colors">
                  {img.caption}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* 9 FAQ */}
      <section className="py-24 bg-paper-2/60 border-t border-b border-rule" id="faq">
        <div className="max-w-[1160px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.55fr] gap-12 lg:gap-16 items-start">
            {/* Left: Section Header & Context */}
            <motion.div
              {...reveal('slideLeft')}
              className="lg:sticky lg:top-28"
            >
              <div className="inline-flex items-center gap-2 font-display font-semibold text-[0.88rem] text-accent mb-3.5">
                <CrownIcon className="w-4 h-4 text-accent shrink-0" />
                <span>Frequently asked questions</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-display font-extrabold text-ink leading-[1.08] tracking-tight">
                Questions founders ask
              </h2>
              <p className="mt-4 text-muted font-body text-base sm:text-lg leading-relaxed max-w-[36ch]">
                Clarity on coaching cadence, confidentiality, scope, and what to expect during our bi-weekly sessions.
              </p>

              <div className="mt-8 p-5.5 rounded-2xl bg-paper border border-rule shadow-2xs">
                <p className="font-display font-bold text-ink text-[0.98rem]">
                  Need a custom coaching cadence?
                </p>
                <p className="text-muted font-body text-sm mt-1.5 leading-relaxed">
                  Engagements can be adapted to intensive sprints or ongoing bi-weekly sessions.
                </p>
                <a
                  href="#apply"
                  className="inline-flex items-center gap-1.5 text-accent font-display font-semibold text-sm mt-3.5 hover:underline"
                >
                  Apply for coaching ↓
                </a>
              </div>
            </motion.div>

            {/* Right: Accordion Items */}
            <div className="space-y-3.5">
              {[
                {
                  q: 'Is this coaching or consulting?',
                  a: 'Coaching. You stay in charge of marketing and I help you make better decisions. If you want someone to lead marketing for you, the Virtual CMO engagement fits better.',
                },
                {
                  q: 'Is what we discuss confidential?',
                  a: 'Yes. Your numbers, plans and challenges stay strictly between us. An NDA is signed upon request before our working sessions begin.',
                },
                {
                  q: 'How much time does it take?',
                  a: 'A session every two weeks plus a little preparation. Most founders spend two to three hours a month.',
                },
                {
                  q: 'Do you work on my LinkedIn content directly?',
                  a: 'I review your posts and help you find your authentic voice and themes. Writing them stays with you or your team, so the voice remains genuinely yours.',
                },
                {
                  q: "What if I'm not a B2B or SaaS founder?",
                  a: "The work applies to most founder-led companies. Apply and tell me about yours; I'll be completely upfront about whether I'm the right coach for your business.",
                },
              ].map((faq, idx) => (
                <motion.details
                  key={faq.q}
                  {...reveal('blurRight', { delay: idx * 0.05 })}
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

      {/* 10 APPLY */}
      <section id="apply" className="py-24 bg-paper-2">
        <div className="max-w-[1160px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-14 items-start">
            <motion.div
              {...reveal('clipUp')}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-ink tracking-tight">
                Apply for founder coaching
              </h2>
              <p className="mt-4 text-muted font-body text-lg leading-relaxed">
                I take on a small number of founders each quarter. Tell me where you are, and we'll start with a free chemistry call.
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3 text-ink font-body">
                  <TickIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>The chemistry call is free and there's no obligation.</span>
                </li>
                <li className="flex items-start gap-3 text-ink font-body">
                  <TickIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>I read every application before we speak.</span>
                </li>
                <li className="flex items-start gap-3 text-ink font-body">
                  <TickIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>If I'm not the right coach, I'll say so and suggest who is.</span>
                </li>
              </ul>
            </motion.div>

            <motion.form
              {...reveal('tilt3d')}
              noValidate
              onSubmit={handleFormSubmit}
              className="bg-card border-2 border-ink rounded-3xl p-8 sm:p-10 shadow-lg card-hover scroll-mt-24"
            >
              {!formSubmitted ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-display font-semibold text-ink uppercase mb-1">
                        Name <span className="text-bad" aria-hidden="true">*</span>
                      </label>
                      <input
                        type="text"
                        value={formName}
                        aria-required="true"
                        maxLength={LEAD_LIMITS.name}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Your name"
                        className="w-full px-4 py-2.5 rounded-xl border border-rule bg-paper text-ink focus:outline-none focus:border-accent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-display font-semibold text-ink uppercase mb-1">
                        Email <span className="text-bad" aria-hidden="true">*</span>
                      </label>
                      <input
                        type="email"
                        value={formEmail}
                        aria-required="true"
                        maxLength={LEAD_LIMITS.email}
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
                        maxLength={LEAD_LIMITS.company}
                        onChange={(e) => setFormCompany(e.target.value)}
                        placeholder="Company name"
                        className="w-full px-4 py-2.5 rounded-xl border border-rule bg-paper text-ink focus:outline-none focus:border-accent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-display font-semibold text-ink uppercase mb-1">
                        Company stage
                      </label>
                      <select
                        value={formStage}
                        onChange={(e) => setFormStage(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-rule bg-paper text-ink focus:outline-none focus:border-accent text-sm"
                      >
                        <option>Pre-revenue</option>
                        <option>Early revenue</option>
                        <option>Growing, 10 to 50 people</option>
                        <option>Scaling, 50+ people</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-display font-semibold text-ink uppercase mb-1">
                        Main topic
                      </label>
                      <select
                        value={formTopic}
                        onChange={(e) => setFormTopic(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-rule bg-paper text-ink focus:outline-none focus:border-accent text-sm"
                      >
                        <option>Positioning and story</option>
                        <option>Founder brand on LinkedIn</option>
                        <option>Channel and budget bets</option>
                        <option>First marketing hire</option>
                        <option>Content that brings customers</option>
                        <option>Something else</option>
                      </select>
                    </div>
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
                        <option>Deep-dive session</option>
                        <option>Coaching programme</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-display font-semibold text-ink uppercase mb-1">
                      What would you like to be different in 90 days?
                    </label>
                    <textarea
                      rows={3}
                      value={formMsg}
                      maxLength={LEAD_LIMITS.message}
                      onChange={(e) => setFormMsg(e.target.value)}
                      placeholder="Your core challenge or goal..."
                      className="w-full px-4 py-2.5 rounded-xl border border-rule bg-paper text-ink focus:outline-none focus:border-accent text-sm font-body"
                    ></textarea>
                  </div>

                  {formErr && (
                    <p className="text-bad text-xs font-display font-semibold">{formErr}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn solid w-full justify-center text-center mt-2 disabled:opacity-60"
                  >
                    {submitting ? 'Sending…' : 'Send application'}
                  </button>
                </div>
              ) : (
                <LeadThankYou
                  name={formName}
                  email={formEmail}
                  next="I read every application myself before suggesting a first session."
                />
              )}
            </motion.form>
          </div>
        </div>
      </section>
    </div>
  );
}
