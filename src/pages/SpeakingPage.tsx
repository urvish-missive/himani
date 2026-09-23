import { useState } from 'react';
import { motion } from 'framer-motion';
import { CrownIcon, TickIcon, PlayIcon } from '../components/ui/BrandIcons';
import VideoPreviewModal from '../components/ui/VideoPreviewModal';
import stageHeroImg from '../images/himanispeaker.jpg';
import galleryImg1 from '../images/hiimanisasspeaker.jpg';
import galleryImg2 from '../images/Himani-Kankaria4-684x1024.jpg';
import galleryImg3 from '../images/himanimarketing.jpg';
import galleryImg4 from '../images/himanimainimage.jpg';

export default function SpeakingPage() {
  const [activeVideo, setActiveVideo] = useState<{
    id: string;
    title: string;
    show?: string;
    url: string;
    isShort?: boolean;
  } | null>(null);

  const [bioTab, setBioTab] = useState<'short' | 'long'>('short');
  const [copiedBio, setCopiedBio] = useState(false);

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formEvent, setFormEvent] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formAudience, setFormAudience] = useState('200 to 1,000');
  const [formFormat, setFormFormat] = useState('Keynote');
  const [formTalk, setFormTalk] = useState('Suggest one for us');
  const [formMsg, setFormMsg] = useState('');
  const [formErr, setFormErr] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const shortBio =
    'Himani Kankaria, known as the Content Queen of India, is the founder of Missive Digital. With 15+ years in marketing and content, she works as a Virtual CMO, coaches founders and trains marketing teams, and has spoken at the International Search Summit Barcelona and WordCamp Asia.';

  const longBio =
    'Himani Kankaria is the founder of Missive Digital and is widely known as the Content Queen of India. With over 15 years of hands-on experience, she has helped unicorn startups and global enterprises build long-term brand visibility by working closely with leadership teams and coaching in-house marketing teams. Today she works as a Virtual CMO, founder coach and team trainer. Himani shares her insights at international conferences such as the International Search Summit Barcelona, Meet Magento and WordCamp, contributes to Search Engine Journal and Search Engine Land, and has been featured by Wix, Semrush and SE Ranking.';

  const handleCopyBio = () => {
    const textToCopy = bioTab === 'short' ? shortBio : longBio;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopiedBio(true);
        setTimeout(() => setCopiedBio(false), 2500);
      });
    }
  };

  const handleSelectTalk = (talk: string, fmt: string) => {
    setFormTalk(talk);
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
      setFormErr('Add a valid email so I can reply.');
      return;
    }
    if (!formEvent.trim()) {
      setFormErr('Add the event name.');
      return;
    }
    setFormErr('');
    setFormSubmitted(true);
  };

  const brief = `Speaking | ${formEvent} | ${formDate || 'Date TBC'} | ${
    formLocation.trim() || 'Location TBC'
  } | Audience: ${formAudience} | ${formFormat} | Talk: ${formTalk}${
    formMsg.trim() ? ' | ' + formMsg.trim() : ''
  }`;

  const calendlyUrl = `https://calendly.com/missivedigital/30min?name=${encodeURIComponent(
    formName
  )}&email=${encodeURIComponent(formEmail)}&a1=${encodeURIComponent(brief)}`;

  const marqueeBrands = [
    'International Search Summit Barcelona',
    'WordCamp Asia',
    'Whitespark Local Search Summit',
    'Meet Magento',
    'Agile Network India',
    'WordCamp Nagpur',
    'Semrush',
    'Women in Tech SEO',
    'The SEO Entrepreneur',
    'The Search Session',
    'GUSEC',
  ];

  return (
    <div>
      {/* 1 HERO */}
      <section className="pt-8 pb-14 sm:pt-12 sm:pb-18 lg:pt-14 lg:pb-20 bg-gradient-to-b from-lav to-paper border-b border-rule">
        <div className="max-w-[1160px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <div className="inline-flex items-center gap-2 font-display font-semibold text-sm text-accent mb-4">
                <CrownIcon className="w-5 h-5 text-gold" />
                <span>Keynotes, sessions, panels and workshops</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-[4.6rem] font-display font-extrabold tracking-tight leading-[1.05] text-ink max-w-[16ch]">
                Bring the Content Queen of India to your stage.
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted font-body leading-relaxed max-w-[52ch]">
                Talks on content, brand, marketing leadership and what AI changes for all three. Practical, story-led and built around your audience.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <a href="#apply" className="btn solid">
                  Check availability
                </a>
                <a href="#watch" className="btn ghost">
                  Watch me speak
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-8 sm:gap-12 font-display">
                <div className="card-hover p-2 rounded-xl">
                  <b className="block text-3xl sm:text-4xl font-extrabold text-accent leading-none">
                    10+
                  </b>
                  <span className="text-muted text-xs sm:text-sm font-semibold mt-1 block">
                    conference stages
                  </span>
                </div>
                <div className="card-hover p-2 rounded-xl">
                  <b className="block text-3xl sm:text-4xl font-extrabold text-accent leading-none">
                    8+
                  </b>
                  <span className="text-muted text-xs sm:text-sm font-semibold mt-1 block">
                    podcasts and shows
                  </span>
                </div>
                <div className="card-hover p-2 rounded-xl">
                  <b className="block text-3xl sm:text-4xl font-extrabold text-accent leading-none">
                    15+
                  </b>
                  <span className="text-muted text-xs sm:text-sm font-semibold mt-1 block">
                    years in marketing
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Profile Aside Card with Animation & Hover */}
            <motion.aside
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
              className="bg-card border border-rule rounded-3xl p-6 shadow-xl max-w-sm lg:max-w-none mx-auto w-full card-hover group"
            >
              <div className="aspect-square rounded-2xl overflow-hidden border border-rule relative img-zoom-hover">
                <img
                  src={stageHeroImg}
                  alt="Himani on stage"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <h3 className="mt-4 text-xl font-display font-extrabold text-ink">
                Most recently
              </h3>
              <ul className="mt-3 pt-2 border-t border-rule space-y-2.5 text-sm font-display text-ink">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 flex-shrink-0"></span>
                  <span>Panelist, Agile Network India, Ahmedabad, Aug 2026</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 flex-shrink-0"></span>
                  <span>Panelist, WordCamp Asia, Mumbai, Apr 2026</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 flex-shrink-0"></span>
                  <span>Speaker, International Search Summit, Barcelona, 2025</span>
                </li>
              </ul>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* INFINITE MARQUEE TICKER */}
      <div className="overflow-hidden whitespace-nowrap py-5 border-b border-rule bg-card">
        <div className="inline-block animate-marquee font-display font-extrabold text-xl sm:text-2xl text-ink">
          {marqueeBrands.concat(marqueeBrands).map((b, i) => (
            <span key={i} className="mr-12">
              <span className={i % 2 === 0 ? 'text-accent' : 'text-ink'}>{b}</span>
              <span className="text-gold ml-12">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* 2 SIGNATURE TALKS */}
      <section className="py-24 border-b border-rule">
        <div className="max-w-[1160px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-2xl mb-14"
          >
            <span className="font-display font-semibold text-accent text-xs tracking-wider uppercase block mb-3">
              Keynotes & Workshops
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-ink tracking-tight">
              Signature talks
            </h2>
            <p className="mt-4 text-muted font-body text-lg">
              Each keynote is tailored to your audience and can run as a keynote, session or interactive workshop.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Talk 1 */}
            <motion.article
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.55 }}
              className="border border-rule rounded-3xl p-8 bg-card flex flex-col justify-between card-hover transition-all shadow-sm"
            >
              <div>
                <span className="font-display font-semibold text-accent text-xs tracking-wider uppercase">
                  Keynote or session
                </span>
                <h3 className="text-2xl font-display font-extrabold text-ink mt-2 leading-tight">
                  Beyond borders, beyond competitors
                </h3>
                <p className="mt-3 text-muted font-body text-sm leading-relaxed">
                  Most brands copy competitor playbooks and translate content for new markets. This talk shows how to find the opportunities others miss by understanding regional intent and culture.
                </p>
                <h4 className="mt-6 font-display font-semibold text-xs text-ink uppercase tracking-wide">
                  Your audience leaves with
                </h4>
                <ul className="mt-2 space-y-2 text-sm font-body text-ink">
                  <li className="flex items-start gap-2">
                    <TickIcon className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>A method to find untapped content demand</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TickIcon className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>Real examples from global enterprise brands</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TickIcon className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>A framework for new-market organic visibility</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-rule">
                <p className="text-xs font-display text-muted mb-4">
                  Delivered at International Search Summit, Barcelona, 2025
                </p>
                <button
                  type="button"
                  onClick={() =>
                    handleSelectTalk('Beyond borders, beyond competitors', 'Keynote')
                  }
                  className="btn ghost text-sm py-2 px-4 w-full justify-center"
                >
                  Request this talk
                </button>
              </div>
            </motion.article>

            {/* Talk 2 */}
            <motion.article
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="border border-rule rounded-3xl p-8 bg-card flex flex-col justify-between card-hover transition-all shadow-sm"
            >
              <div>
                <span className="font-display font-semibold text-accent text-xs tracking-wider uppercase">
                  Keynote or session
                </span>
                <h3 className="text-2xl font-display font-extrabold text-ink mt-2 leading-tight">
                  AI can write. Can it make people care?
                </h3>
                <p className="mt-3 text-muted font-body text-sm leading-relaxed">
                  Everyone can generate content now. This talk covers what AI still misses, and how brands maintain an authentic point of view that builds enduring trust and pipeline.
                </p>
                <h4 className="mt-6 font-display font-semibold text-xs text-ink uppercase tracking-wide">
                  Your audience leaves with
                </h4>
                <ul className="mt-2 space-y-2 text-sm font-body text-ink">
                  <li className="flex items-start gap-2">
                    <TickIcon className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>Where AI helps and where it destroys trust</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TickIcon className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>A process to humanise AI-assisted content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TickIcon className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>Examples of challenger brands winning today</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-rule">
                <p className="text-xs font-display text-muted mb-4">
                  Delivered at WordCamp Nagpur
                </p>
                <button
                  type="button"
                  onClick={() =>
                    handleSelectTalk('AI can write. Can it make people care?', 'Keynote')
                  }
                  className="btn ghost text-sm py-2 px-4 w-full justify-center"
                >
                  Request this talk
                </button>
              </div>
            </motion.article>

            {/* Talk 3 */}
            <motion.article
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="border border-rule rounded-3xl p-8 bg-card flex flex-col justify-between card-hover transition-all shadow-sm"
            >
              <div>
                <span className="font-display font-semibold text-accent text-xs tracking-wider uppercase">
                  Workshop
                </span>
                <h3 className="text-2xl font-display font-extrabold text-ink mt-2 leading-tight">
                  Content that sells
                </h3>
                <p className="mt-3 text-muted font-body text-sm leading-relaxed">
                  A hands-on session on building a full-funnel content engine, from the first question a buyer asks to the deal closing, with exercises on attendees' own brands.
                </p>
                <h4 className="mt-6 font-display font-semibold text-xs text-ink uppercase tracking-wide">
                  Your audience leaves with
                </h4>
                <ul className="mt-2 space-y-2 text-sm font-body text-ink">
                  <li className="flex items-start gap-2">
                    <TickIcon className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>A custom content map for their own company</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TickIcon className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>The messaging mistakes that stall B2B pipeline</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TickIcon className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>Three high-converting assets to produce next</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-rule">
                <p className="text-xs font-display text-muted mb-4">
                  Built from work with B2B and SaaS teams
                </p>
                <button
                  type="button"
                  onClick={() =>
                    handleSelectTalk('Content that sells (workshop)', 'Workshop')
                  }
                  className="btn ghost text-sm py-2 px-4 w-full justify-center"
                >
                  Request this workshop
                </button>
              </div>
            </motion.article>
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
            className="max-w-2xl mb-12"
          >
            <span className="font-display font-semibold text-accent text-xs tracking-wider uppercase block mb-3">
              Event Formats
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-ink tracking-tight">
              Formats I speak in
            </h2>
            <p className="mt-4 text-muted font-body text-lg">
              Flexible session styles designed to match your event structure, audience size and scheduling requirements.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              {
                title: 'Keynote',
                duration: '30 to 45 minutes',
                desc: 'One big perspective-shifting idea, told with stories and real data.',
              },
              {
                title: 'Session',
                duration: '30 to 60 minutes',
                desc: 'A highly tactical and actionable talk for a focused breakout track.',
              },
              {
                title: 'Panel',
                duration: 'Panelist or moderator',
                desc: 'Engaging discussions on AI, marketing leadership and growth.',
              },
              {
                title: 'Workshop',
                duration: 'Half day',
                desc: "Interactive hands-on work applied directly to attendees' businesses.",
              },
              {
                title: 'Podcast / Webinar',
                duration: 'Guest or co-host',
                desc: 'Deep-dive conversations designed to educate and inspire listeners.',
              },
            ].map((f, idx) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="card-hover bg-card border border-rule rounded-2xl p-6 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <b className="font-display font-extrabold text-lg text-ink block">{f.title}</b>
                  <span className="font-display text-xs text-accent font-semibold block mt-1">
                    {f.duration}
                  </span>
                  <p className="text-muted text-sm font-body mt-3 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 WATCH ME SPEAK */}
      <section id="watch" className="py-24 border-b border-rule">
        <div className="max-w-[1160px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-2xl mb-12"
          >
            <span className="font-display font-semibold text-accent text-xs tracking-wider uppercase block mb-3">
              Watch & Listen
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-ink tracking-tight">
              Watch me speak
            </h2>
            <p className="mt-4 text-muted font-body text-lg">
              Full episodes, keynote recordings, and bite-sized tactical shorts.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: 'qIh2GQpMKC0',
                series: 'The SEO Entrepreneur',
                title: 'From college to CEO',
                meta: 'Full episode on YouTube',
                url: 'https://www.youtube.com/watch?v=qIh2GQpMKC0',
                thumbnail: 'https://img.youtube.com/vi/qIh2GQpMKC0/hqdefault.jpg',
                isShort: false,
              },
              {
                id: 'LbnxW3x5Bs4',
                series: 'The Search Session',
                title: 'Unlearning old content strategies',
                meta: 'With Gianluca Fiorelli',
                url: 'https://www.youtube.com/watch?v=LbnxW3x5Bs4',
                thumbnail: 'https://img.youtube.com/vi/LbnxW3x5Bs4/hqdefault.jpg',
                isShort: false,
              },
              {
                id: 'rMqPMgSctYs',
                series: 'Talks with SEOs, ep. 62',
                title: 'Where organic content is headed',
                meta: 'Full episode on YouTube',
                url: 'https://www.youtube.com/watch?v=rMqPMgSctYs',
                thumbnail: 'https://img.youtube.com/vi/rMqPMgSctYs/hqdefault.jpg',
                isShort: false,
              },
              {
                id: 'beZ_W2D61nY',
                series: 'Short',
                title: 'The biggest SaaS content mistake',
                meta: '60-second tactical watch',
                url: 'https://www.youtube.com/shorts/beZ_W2D61nY',
                thumbnail: 'https://img.youtube.com/vi/beZ_W2D61nY/hqdefault.jpg',
                isShort: true,
              },
              {
                id: 'j4XyLO0QTNU',
                series: 'Short',
                title: 'What quality content means today',
                meta: '60-second tactical watch',
                url: 'https://www.youtube.com/shorts/j4XyLO0QTNU',
                thumbnail: 'https://img.youtube.com/vi/j4XyLO0QTNU/hqdefault.jpg',
                isShort: true,
              },
              {
                id: 'JqEkld_Gu7o',
                series: 'Short',
                title: 'Unlearn the old writing rules',
                meta: '60-second tactical watch',
                url: 'https://www.youtube.com/shorts/JqEkld_Gu7o',
                thumbnail: 'https://img.youtube.com/vi/JqEkld_Gu7o/hqdefault.jpg',
                isShort: true,
              },
            ].map((v, idx) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                onClick={() =>
                  setActiveVideo({
                    id: v.id,
                    title: v.title,
                    show: v.series,
                    url: v.url,
                    isShort: v.isShort,
                  })
                }
                className="group block card-hover rounded-2xl cursor-pointer select-none"
              >
                <div className="aspect-video rounded-2xl border border-rule group-hover:border-accent p-4 sm:p-5 flex flex-col justify-between relative shadow-sm overflow-hidden transition-colors duration-200">
                  {/* Real YouTube Thumbnail */}
                  <img
                    src={v.thumbnail}
                    alt={v.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Gradient Overlay: dark at the bottom so the title reads over busy thumbnails */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2A2440] via-[#2A2440]/60 to-[#2A2440]/10 transition-opacity group-hover:opacity-90" />

                  {/* Badges */}
                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <span className="font-display font-semibold text-[0.7rem] tracking-wide text-accent uppercase bg-white/95 px-2.5 py-1 rounded-full shadow-xs truncate">
                      {v.series}
                    </span>
                    {v.isShort && (
                      <span className="shrink-0 font-display font-bold text-[0.7rem] text-gold-ink bg-gold px-2.5 py-1 rounded-full shadow-xs">
                        SHORT
                      </span>
                    )}
                  </div>

                  {/* Title + Play Button */}
                  <div className="relative z-10 flex items-center justify-between gap-4">
                    <span className="font-display font-extrabold text-base sm:text-[1.05rem] text-white leading-snug line-clamp-2 [text-shadow:0_1px_8px_rgba(0,0,0,0.35)] group-hover:text-gold transition-colors">
                      {v.title}
                    </span>
                    <button
                      type="button"
                      aria-label={`Play preview of ${v.title}`}
                      className="shrink-0 w-11 h-11 rounded-full bg-gold text-gold-ink flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-ink cursor-pointer"
                    >
                      <PlayIcon className="w-4 h-4 ml-0.5" />
                    </button>
                  </div>
                </div>

                {/* Card Meta */}
                <div className="flex items-center justify-between gap-3 mt-1 px-2.5 pt-2.5 pb-3 font-display text-xs text-muted">
                  <span>{v.meta}</span>
                  <span className="text-accent font-semibold group-hover:underline inline-flex items-center gap-1">
                    Preview video ↗
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 WHAT ORGANISERS COUNT ON */}
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
              Event Partnership
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-ink tracking-tight">
              What organisers can count on
            </h2>
            <p className="mt-4 text-muted font-body text-lg">
              Working with me means zero speaker stress, transparent communication, and audience-first delivery.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'A talk built for your audience',
                desc: 'We agree on the exact angle on a preparation call, ensuring it aligns with your event theme.',
              },
              {
                title: 'Slides and materials on time',
                desc: 'Full deck, speaker bio, and high-res headshots sent well before your editorial deadline.',
              },
              {
                title: 'Promotion to my audience',
                desc: 'I actively share the event with my 11K+ followers on LinkedIn and 16K+ on X ahead of time.',
              },
              {
                title: 'Practical, not promotional',
                desc: 'Strictly zero sales pitching on stage. Attendees walk out with frameworks they can use immediately.',
              },
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="card-hover bg-card border border-rule/80 rounded-2xl p-6 flex items-start gap-4 shadow-xs"
              >
                <TickIcon className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <b className="font-display font-semibold text-lg text-ink block">
                    {item.title}
                  </b>
                  <span className="text-muted font-body text-base mt-1 block leading-relaxed">
                    {item.desc}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 RECENT STAGES TIMELINE */}
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
              Track Record
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-ink tracking-tight">
              Recent stages and shows
            </h2>
            <p className="mt-4 text-muted font-body text-lg">
              A chronological timeline of recent keynote appearances, international conference panels, and podcast episodes.
            </p>
          </motion.div>

          <ul className="space-y-3 max-w-4xl">
            {[
              {
                when: 'Aug 2026',
                event: 'Agile Network India, Ahmedabad',
                role: "Panel: Designing the next decade, the decisions that build tomorrow's market leaders",
              },
              {
                when: 'Apr 2026',
                event: 'WordCamp Asia, Mumbai',
                role: 'Panel: How AI is restructuring traditional and modern marketing',
              },
              {
                when: '2025',
                event: 'International Search Summit, Barcelona',
                role: 'Beyond borders, beyond competitors: advanced content research for international SEO',
              },
              {
                when: '2024',
                event: 'WordCamp Nagpur',
                role: 'Humanizing AI content for better SEO and engagement',
              },
              {
                when: '2021',
                event: 'Whitespark Local Search Summit',
                role: 'How to boost organic traffic that converts using featured snippets',
              },
              {
                when: 'Also',
                event: 'Meet Magento, Semrush, SE Ranking, Wix, GUSEC',
                role: 'Keynotes, international webinars and startup faculty sessions',
              },
            ].map((st, idx) => (
              <motion.li
                key={st.event}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-6 p-4 rounded-xl card-hover border border-transparent hover:border-rule hover:bg-card transition-all"
              >
                <span className="font-display font-semibold text-accent text-base">{st.when}</span>
                <div>
                  <b className="font-display font-semibold text-ink text-base block">
                    {st.event}
                  </b>
                  <span className="text-muted text-sm font-body mt-0.5 block">
                    {st.role}
                  </span>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7 PROOF */}
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
              Feedback & Ratings
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-ink tracking-tight">
              What organisers say
            </h2>
            <p className="mt-4 text-muted font-body text-lg">
              Feedback and attendee ratings from event chairs, conference organisers, and podcast hosts.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                stat: '500+',
                label: 'attendees engaged',
                quote: "Himani's keynote was one of our highest-rated sessions. People stayed for 40 minutes of questions afterwards.",
                author: 'Organiser, International Summit',
              },
              {
                stat: '4.9 / 5',
                label: 'session rating',
                quote: 'Remarkably thorough and professional to coordinate with. Delivered her slides weeks ahead of schedule.',
                author: 'Programme Chair, WordCamp',
              },
              {
                stat: '3x',
                label: 'invited back to speak',
                quote: 'Her insights on AI and search intent are always grounded in real experiments, not generic bullet points.',
                author: 'Host, Marketing Podcast',
              },
            ].map((p, idx) => (
              <motion.div
                key={p.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
                className="bg-card border border-rule rounded-2xl p-6 sm:p-8 card-hover shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="font-display font-extrabold text-4xl text-accent">{p.stat}</div>
                  <div className="font-display text-muted text-sm mt-1">{p.label}</div>
                  <p className="mt-4 font-body italic text-ink leading-relaxed">
                    "{p.quote}"
                  </p>
                </div>
                <small className="block mt-6 pt-4 border-t border-rule font-display text-muted text-xs font-semibold">
                  {p.author}
                </small>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8 SPEAKER KIT */}
      <section id="kit" className="py-24 border-b border-rule">
        <div className="max-w-[1160px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-2xl mb-12"
          >
            <span className="font-display font-semibold text-accent text-xs tracking-wider uppercase block mb-3">
              Media & Press Assets
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-ink tracking-tight">
              Speaker kit
            </h2>
            <p className="mt-4 text-muted font-body text-lg">
              Bio options, official headshots, and event promotional assets.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
            {/* Bio box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-card border border-rule rounded-3xl p-6 sm:p-8 shadow-sm card-hover"
            >
              <div className="flex gap-2 mb-4" role="group" aria-label="Bio length">
                <button
                  type="button"
                  aria-pressed={bioTab === 'short'}
                  onClick={() => setBioTab('short')}
                  className={`font-display font-semibold text-xs rounded-full px-4 py-1.5 border transition-all cursor-pointer ${
                    bioTab === 'short'
                      ? 'bg-ink text-paper border-ink'
                      : 'border-rule text-ink hover:border-accent'
                  }`}
                >
                  Short bio
                </button>
                <button
                  type="button"
                  aria-pressed={bioTab === 'long'}
                  onClick={() => setBioTab('long')}
                  className={`font-display font-semibold text-xs rounded-full px-4 py-1.5 border transition-all cursor-pointer ${
                    bioTab === 'long'
                      ? 'bg-ink text-paper border-ink'
                      : 'border-rule text-ink hover:border-accent'
                  }`}
                >
                  Long bio
                </button>
              </div>

              <p className="font-body text-ink text-base leading-relaxed">
                {bioTab === 'short' ? shortBio : longBio}
              </p>

              <button
                type="button"
                onClick={handleCopyBio}
                className="btn solid sm mt-6"
              >
                {copiedBio ? 'Copied to clipboard!' : 'Copy bio'}
              </button>
            </motion.div>

            {/* Assets list */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <ul className="space-y-4 font-body text-ink">
                <li className="flex items-start gap-3 py-3 border-t border-rule px-1">
                  <TickIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>
                    High-resolution headshots:{' '}
                    <a
                      href="https://drive.google.com/file/d/1vt8COIbjyd35j9fv4u7JQyefOd0u0M6Z/view?usp=drive_link"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-link underline hover:text-ink font-semibold"
                    >
                      headshot 1
                    </a>{' '}
                    and{' '}
                    <a
                      href="https://drive.google.com/file/d/1hGOAtu2XHxsq89fxOmx7YYwAbTa1iw64/view?usp=drive_link"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-link underline hover:text-ink font-semibold"
                    >
                      headshot 2
                    </a>
                  </span>
                </li>
                <li className="flex items-start gap-3 py-3 border-t border-rule px-1">
                  <TickIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>Talk titles, descriptions and key audience takeaways</span>
                </li>
                <li className="flex items-start gap-3 py-3 border-t border-rule px-1">
                  <TickIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>
                    Past conference slide decks on{' '}
                    <a
                      href="https://www.slideshare.net/HimaniKankaria"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-link underline hover:text-ink font-semibold"
                    >
                      SlideShare
                    </a>
                  </span>
                </li>
                <li className="flex items-start gap-3 py-3 border-t border-rule px-1">
                  <TickIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>Technical rider: wireless lavalier mic, 16:9 projection</span>
                </li>
              </ul>

              <div className="mt-8">
                <a
                  href="https://drive.google.com/file/d/1vt8COIbjyd35j9fv4u7JQyefOd0u0M6Z/view?usp=drive_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn ghost"
                >
                  Download speaker kit
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* REAL-LIFE PROOF GALLERY */}
      <section className="py-24 bg-paper-2 border-b border-rule" id="gallery">
        <div className="max-w-[1160px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="inline-flex items-center gap-2 font-display font-semibold text-sm text-accent mb-3">
              <CrownIcon className="w-5 h-5 text-gold" />
              <span>From the stage</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-ink tracking-tight">
              Rooms that listen.
            </h2>
            <p className="mt-4 text-muted font-body text-lg">
              Talks, panels, audiences and moments from conferences around the world.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[160px] sm:auto-rows-[195px] gap-4 mt-10">
            <motion.figure
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.5 }}
              className="col-span-2 row-span-2 rounded-2xl overflow-hidden relative border border-rule shadow-sm img-zoom-hover group"
            >
              <img
                src={galleryImg1}
                alt="Himani on conference stage"
                className="w-full h-full object-cover object-[center_35%] transition-transform duration-700 group-hover:scale-105"
              />
              <figcaption className="absolute bottom-3 left-3 bg-paper/90 text-ink text-xs font-display px-3 py-1 rounded-full backdrop-blur-sm shadow">
                WordCamp Asia Mumbai Panel
              </figcaption>
            </motion.figure>
            <motion.figure
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="rounded-2xl overflow-hidden relative border border-rule shadow-sm img-zoom-hover group"
            >
              <img
                src={galleryImg2}
                alt="Speaker keynote presentation"
                className="w-full h-full object-cover object-[center_20%] transition-transform duration-700 group-hover:scale-105"
              />
              <figcaption className="absolute bottom-3 left-3 bg-paper/90 text-ink text-xs font-display px-3 py-1 rounded-full backdrop-blur-sm shadow">
                Keynote Presentation
              </figcaption>
            </motion.figure>
            <motion.figure
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="row-span-2 rounded-2xl overflow-hidden relative border border-rule shadow-sm img-zoom-hover group"
            >
              <img
                src={galleryImg3}
                alt="Agile Network panel discussion"
                className="w-full h-full object-cover object-[center_18%] transition-transform duration-700 group-hover:scale-105"
              />
              <figcaption className="absolute bottom-3 left-3 bg-paper/90 text-ink text-xs font-display px-3 py-1 rounded-full backdrop-blur-sm shadow">
                Agile Network India
              </figcaption>
            </motion.figure>
            <motion.figure
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="rounded-2xl overflow-hidden relative border border-rule shadow-sm img-zoom-hover group"
            >
              <img
                src={galleryImg4}
                alt="Conference attendees Q&A"
                className="w-full h-full object-cover object-[center_15%] transition-transform duration-700 group-hover:scale-105"
              />
              <figcaption className="absolute bottom-3 left-3 bg-paper/90 text-ink text-xs font-display px-3 py-1 rounded-full backdrop-blur-sm shadow">
                Audience Q&A
              </figcaption>
            </motion.figure>
          </div>
        </div>
      </section>

      {/* 9 FAQ */}
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
                Questions organisers ask
              </h2>
              <p className="mt-4 text-muted font-body text-base sm:text-lg leading-relaxed max-w-[36ch]">
                Everything you need to know about booking, fees, talk tailoring, travel arrangements and technical requirements.
              </p>

              <div className="mt-8 p-5.5 rounded-2xl bg-paper border border-rule shadow-2xs">
                <p className="font-display font-bold text-ink text-[0.98rem]">
                  Have a specific event theme?
                </p>
                <p className="text-muted font-body text-sm mt-1.5 leading-relaxed">
                  Every keynote is customized for your audience demographics. Share your goals in the inquiry form below.
                </p>
                <a
                  href="#apply"
                  className="inline-flex items-center gap-1.5 text-accent font-display font-semibold text-sm mt-3.5 hover:underline"
                >
                  Jump to speaker inquiry form ↓
                </a>
              </div>
            </motion.div>

            {/* Right: Accordion Items */}
            <div className="space-y-3.5">
              {[
                {
                  q: 'What are your speaking fees?',
                  a: 'Fees depend on the format, location, travel requirements, and audience. Share your budget in the inquiry form; I also consider selected non-profit and community tech events.',
                },
                {
                  q: 'Do you travel?',
                  a: 'Yes, within India and internationally. Travel arrangements and accommodation are covered by the event, agreed upfront.',
                },
                {
                  q: 'Do you speak at virtual events?',
                  a: 'Yes. Virtual keynotes, conference sessions, webinars, and live panel sessions all work seamlessly with pro audio and lighting.',
                },
                {
                  q: 'How much notice do you need?',
                  a: 'Ideally 6 to 8 weeks for a new or heavily tailored talk, less for a panel appearance or one of my signature keynotes.',
                },
                {
                  q: 'Can you tailor a talk to our event theme?',
                  a: 'Yes. Every talk is customized for your attendee demographics, and I can build a keynote around your specific theme.',
                },
              ].map((faq, idx) => (
                <motion.details
                  key={faq.q}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.55 }}
            >
              <span className="font-display font-semibold text-accent text-xs tracking-wider uppercase block mb-3">
                Booking & Inquiries
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-ink tracking-tight">
                Invite me to speak
              </h2>
              <p className="mt-4 text-muted font-body text-lg leading-relaxed">
                Tell me about your event. I'll reply with availability and the talk that fits your audience best.
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3 text-ink font-body">
                  <TickIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>A reply with availability within 2 working days.</span>
                </li>
                <li className="flex items-start gap-3 text-ink font-body">
                  <TickIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>A talk suggestion matched to your audience.</span>
                </li>
                <li className="flex items-start gap-3 text-ink font-body">
                  <TickIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>Bio, headshots and abstract ready for your agenda.</span>
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
                        Email
                      </label>
                      <input
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="you@event.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-rule bg-paper text-ink focus:outline-none focus:border-accent text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-display font-semibold text-ink uppercase mb-1">
                        Event name
                      </label>
                      <input
                        type="text"
                        value={formEvent}
                        onChange={(e) => setFormEvent(e.target.value)}
                        placeholder="Conference / Event name"
                        className="w-full px-4 py-2.5 rounded-xl border border-rule bg-paper text-ink focus:outline-none focus:border-accent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-display font-semibold text-ink uppercase mb-1">
                        Event date
                      </label>
                      <input
                        type="date"
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-rule bg-paper text-ink focus:outline-none focus:border-accent text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-display font-semibold text-ink uppercase mb-1">
                        City, or virtual
                      </label>
                      <input
                        type="text"
                        value={formLocation}
                        onChange={(e) => setFormLocation(e.target.value)}
                        placeholder="City, or Virtual"
                        className="w-full px-4 py-2.5 rounded-xl border border-rule bg-paper text-ink focus:outline-none focus:border-accent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-display font-semibold text-ink uppercase mb-1">
                        Audience size
                      </label>
                      <select
                        value={formAudience}
                        onChange={(e) => setFormAudience(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-rule bg-paper text-ink focus:outline-none focus:border-accent text-sm"
                      >
                        <option>Under 50</option>
                        <option>50 to 200</option>
                        <option>200 to 1,000</option>
                        <option>1,000+</option>
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
                        <option>Keynote</option>
                        <option>Session</option>
                        <option>Panel</option>
                        <option>Workshop</option>
                        <option>Podcast or webinar</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-display font-semibold text-ink uppercase mb-1">
                        Talk
                      </label>
                      <select
                        value={formTalk}
                        onChange={(e) => setFormTalk(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-rule bg-paper text-ink focus:outline-none focus:border-accent text-sm"
                      >
                        <option>Suggest one for us</option>
                        <option>Beyond borders, beyond competitors</option>
                        <option>AI can write. Can it make people care?</option>
                        <option>Content that sells (workshop)</option>
                        <option>A new talk on our theme</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-display font-semibold text-ink uppercase mb-1">
                      Audience and theme
                    </label>
                    <textarea
                      rows={3}
                      value={formMsg}
                      onChange={(e) => setFormMsg(e.target.value)}
                      placeholder="Who attends, the event theme, and any budget details..."
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
                    Send event brief
                  </button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <span className="w-12 h-12 rounded-full bg-good/20 text-good font-extrabold flex items-center justify-center mx-auto mb-4">
                    <TickIcon className="w-6 h-6 text-good" />
                  </span>
                  <h3 className="text-2xl font-display font-extrabold text-ink">
                    Thanks, {formName.split(' ')[0]}. Want to talk it through?
                  </h3>
                  <p className="text-muted font-body mt-2 text-sm max-w-sm mx-auto">
                    Book a short call to discuss the event, or wait for my reply by email. Your brief is attached to the booking.
                  </p>
                  <div className="mt-6">
                    <a
                      href={calendlyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn gold inline-flex"
                    >
                      Book a call on Calendly
                    </a>
                  </div>
                </div>
              )}
            </motion.form>
          </div>
        </div>
      </section>

      {/* Video Preview Modal */}
      <VideoPreviewModal
        isOpen={!!activeVideo}
        onClose={() => setActiveVideo(null)}
        video={activeVideo}
      />
    </div>
  );
}
