import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlayIcon, CrownIcon } from '../ui/BrandIcons';
import VideoPreviewModal from '../ui/VideoPreviewModal';
import issStageImg from '../../images/iss-barcelona-stage.jpg';

export default function HomeStage() {
  const [activeVideo, setActiveVideo] = useState<{
    id: string;
    title: string;
    show?: string;
    url: string;
    isShort?: boolean;
  } | null>(null);

  const marqueeEvents = [
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

  const videos = [
    {
      id: 'qIh2GQpMKC0',
      title: 'From college to CEO',
      show: 'The SEO Entrepreneur',
      meta: 'Full episode on YouTube',
      url: 'https://www.youtube.com/watch?v=qIh2GQpMKC0',
      thumbnail: 'https://img.youtube.com/vi/qIh2GQpMKC0/hqdefault.jpg',
      isShort: false,
    },
    {
      id: 'LbnxW3x5Bs4',
      title: 'Unlearning old content strategies',
      show: 'The Search Session',
      meta: 'With Gianluca Fiorelli',
      url: 'https://www.youtube.com/watch?v=LbnxW3x5Bs4',
      thumbnail: 'https://img.youtube.com/vi/LbnxW3x5Bs4/hqdefault.jpg',
      isShort: false,
    },
    {
      id: 'rMqPMgSctYs',
      title: 'Where organic content is headed',
      show: 'Talks with SEOs, ep. 62',
      meta: 'Full episode on YouTube',
      url: 'https://www.youtube.com/watch?v=rMqPMgSctYs',
      thumbnail: 'https://img.youtube.com/vi/rMqPMgSctYs/hqdefault.jpg',
      isShort: false,
    },
    {
      id: 'beZ_W2D61nY',
      title: 'The biggest SaaS content mistake',
      show: 'Short',
      meta: '60-second watch',
      url: 'https://www.youtube.com/shorts/beZ_W2D61nY',
      thumbnail: 'https://img.youtube.com/vi/beZ_W2D61nY/hqdefault.jpg',
      isShort: true,
    },
    {
      id: 'j4XyLO0QTNU',
      title: 'What quality content means today',
      show: 'Short',
      meta: '60-second watch',
      url: 'https://www.youtube.com/shorts/j4XyLO0QTNU',
      thumbnail: 'https://img.youtube.com/vi/j4XyLO0QTNU/hqdefault.jpg',
      isShort: true,
    },
    {
      id: 'JqEkld_Gu7o',
      title: 'Unlearn the old writing rules',
      show: 'Short',
      meta: '60-second watch',
      url: 'https://www.youtube.com/shorts/JqEkld_Gu7o',
      thumbnail: 'https://img.youtube.com/vi/JqEkld_Gu7o/hqdefault.jpg',
      isShort: true,
    },
  ];

  const signatureTalks = [
    {
      format: 'Keynote or session',
      title: 'Beyond borders, beyond competitors',
      description:
        'How to stop copying competitor playbooks and find the content opportunities others missed in every new market.',
      bestFor: 'Best for growth and marketing leaders',
      deliveredAt: 'Delivered at International Search Summit, Barcelona, 2025',
    },
    {
      format: 'Keynote or session',
      title: 'AI can write. Can it make people care?',
      description:
        'What AI still misses in content, and how brands keep a real point of view when everyone can generate words.',
      bestFor: 'Best for founders, content and brand teams',
      deliveredAt: 'Delivered at WordCamp Nagpur',
    },
    {
      format: 'Workshop',
      title: 'Content that sells',
      description:
        "Building a full-funnel content engine that feeds pipeline, with exercises on the audience's own brands.",
      bestFor: 'Best for B2B and SaaS marketing teams',
      deliveredAt: 'Built from my work with B2B and SaaS teams',
    },
  ];

  const podcasts = [
    {
      name: 'Women in Tech SEO',
      url: 'https://wtspodcast.captivate.fm/episode/content-marketing-calendars-himani-kankaria',
    },
    {
      name: 'The Agency Accelerator',
      url: 'https://www.imdb.com/title/tt28630315/',
    },
    { name: 'Link Up With Het', url: '#' },
    {
      name: 'FCDC',
      url: 'https://freelancecoalition.org/videos/fcdc-seo-story-with-himani-kankaria-brightonseo-special/',
    },
    {
      name: 'GDC Talks',
      url: 'https://creators.spotify.com/pod/profile/gdc5/episodes/Learn-How-to-make-a-Career-in-Digital-Marketing-With-Indias-No-1-Digital-Educationalist-e13kdgt',
    },
    {
      name: 'Advanced Web Ranking',
      url: 'https://www.advancedwebranking.com/blog/unlearning-old-seo-content-strategies-to-improve-brand-visibility',
    },
  ];

  return (
    <section className="py-24 lg:py-28 bg-stage text-on-stage overflow-hidden" id="stage">
      {/* Intro Header */}
      <div className="max-w-[1160px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, x: -28, skewY: -1.5 }}
          whileInView={{ opacity: 1, x: 0, skewY: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Section Kicker Badge */}
          <div className="inline-flex items-center gap-2 font-display font-semibold text-[0.92rem] text-stage-accent mb-4.5">
            <CrownIcon className="w-4 h-4 text-stage-accent shrink-0" />
            <span>Speaking & appearances</span>
          </div>

          {/* Title: 'On stage. On air.' on line 1, 'On record.' on line 2 */}
          <h2 className="font-display font-extrabold text-[clamp(2.4rem,6.8vw,5.2rem)] leading-[1.05] tracking-[-0.035em] text-on-stage">
            <span className="block">On stage. On air.</span>
            <span className="block">On record.</span>
          </h2>

          <p className="text-on-stage-muted max-w-[56ch] mt-5 text-[1.12rem] sm:text-[1.18rem] leading-relaxed">
            From Barcelona to Mumbai, I talk about content, brand, marketing leadership and what AI changes for all three.
          </p>

          {/* Counts — each stat spring-bounces in */}
          <motion.div
            className="flex flex-wrap gap-x-12 sm:gap-x-16 gap-y-6 mt-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } },
            }}
          >
            {[
              { num: '10+', label: 'conference and event stages' },
              { num: '8+', label: 'podcasts and shows' },
              { num: '15+', label: 'years in marketing' },
            ].map((s) => (
              <motion.div
                key={s.label}
                variants={{
                  hidden: { opacity: 0, y: 24, scale: 0.8 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 18 } },
                }}
              >
                <b className="block font-display font-extrabold text-[3.2rem] leading-none text-stage-accent">
                  {s.num}
                </b>
                <span className="font-display text-on-stage-muted text-[0.98rem]">
                  {s.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Marquee Ticker */}
      <div className="mt-14 border-y border-stage-rule overflow-hidden whitespace-nowrap py-5">
        <div className="inline-block animate-marquee font-display font-extrabold text-[clamp(1.4rem,3vw,2.2rem)]">
          {marqueeEvents.concat(marqueeEvents).map((event, idx) => (
            <span key={idx} className="mr-12">
              <span className={idx % 2 === 0 ? 'text-stage-accent' : 'text-on-stage'}>
                {event}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-[1160px] mx-auto px-6">
        {/* Featured Talk Card with Real Stage Photo */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 12 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformPerspective: 1000 }}
          className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-10 items-center bg-stage-2 rounded-[26px] p-6 sm:p-8 border border-stage-rule shadow-sm mt-14"
        >
          <div
            onClick={() =>
              setActiveVideo({
                id: 'qIh2GQpMKC0',
                title: 'Beyond borders, beyond competitors: advanced content research for international SEO',
                show: 'Keynote Session',
                url: 'https://events.transperfectdigital.com/international-search-summit',
                isShort: false,
              })
            }
            className="group relative border border-stage-rule hover:border-stage-accent aspect-video rounded-2xl p-6 flex flex-col justify-between text-on-stage overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.01]"
          >
            {/* Real Conference Keynote Stage Background */}
            <img
              src={issStageImg}
              alt="International Search Summit Barcelona Keynote Stage"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Cinematic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#2A2440]/95 via-[#2A2440]/55 to-[#2A2440]/25 transition-opacity group-hover:opacity-90" />

            {/* Premium Conference Badge */}
            <div className="relative z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2A2440]/75 border border-white/20 text-white backdrop-blur-md text-[0.82rem] font-display font-semibold tracking-wide self-start shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 animate-pulse" />
              <span>International Search Summit, Barcelona</span>
            </div>
            <span className="relative z-10 font-display font-extrabold text-[clamp(1.25rem,2.4vw,1.85rem)] leading-tight max-w-[20ch] text-white group-hover:text-gold transition-colors">
              Beyond borders, beyond competitors
            </span>
            <span className="absolute right-5 bottom-5 z-10 w-14 h-14 rounded-full bg-gold text-gold-ink flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-white group-hover:text-ink transition-all duration-300">
              <PlayIcon className="w-6 h-6 ml-0.5 text-gold-ink" />
            </span>
          </div>

          <div>
            <span className="font-display font-semibold text-[0.88rem] text-stage-accent uppercase tracking-wider block mb-1">
              Featured talk
            </span>
            <h3 className="font-display font-extrabold text-[1.6rem] text-on-stage">
              International Search Summit
            </h3>
            <p className="text-on-stage-muted mt-3 leading-relaxed text-[1rem]">
              How to stop copying competitor playbooks and find content opportunities in each market by understanding regional intent and cultural nuance.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 items-center">
              <button
                type="button"
                onClick={() =>
                  setActiveVideo({
                    id: 'qIh2GQpMKC0',
                    title: 'Beyond borders, beyond competitors',
                    show: 'Keynote Session',
                    url: 'https://events.transperfectdigital.com/international-search-summit',
                    isShort: false,
                  })
                }
                className="btn gold cursor-pointer"
              >
                Watch talk preview
              </button>
              <a href="#hire" className="btn ghost !text-ink !border-ink hover:!bg-lav">
                Book this talk
              </a>
            </div>
          </div>
        </motion.div>

        {/* Watch Talks & Podcasts Header */}
        <div className="mt-20 sm:mt-24 mb-8">
          <div className="flex flex-wrap justify-between items-end gap-x-8 gap-y-3">
            <div>
              <span className="font-display font-semibold text-[0.88rem] text-stage-accent uppercase tracking-wider block mb-1">
                Watch & Listen
              </span>
              <h3 className="font-display font-extrabold text-[clamp(1.6rem,3vw,2.2rem)] text-on-stage">
                Talks, podcast episodes and shorts
              </h3>
            </div>
            <p className="text-on-stage-muted max-w-[44ch] text-[1rem]">
              Full episodes on YouTube, conference recordings, and 60-second tactical marketing shorts.
            </p>
          </div>
        </div>

        {/* Watch Videos & Shorts Grid with Real YouTube Thumbnails */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
          }}
        >
          {videos.map((vid, vidIdx) => (
            <motion.div
              key={vid.id}
              variants={{
                hidden: { opacity: 0, y: 32, rotate: vidIdx % 2 === 0 ? -2 : 2 },
                visible: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
              }}
              onClick={() => setActiveVideo(vid)}
              className="group block text-on-stage stage-card-hover rounded-2xl cursor-pointer select-none"
            >
              <div className="relative aspect-video rounded-2xl border border-stage-rule group-hover:border-stage-accent p-4 sm:p-5 flex flex-col justify-between overflow-hidden shadow-sm transition-colors duration-200">
                {/* Real YouTube Thumbnail */}
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Dark Gradient Overlay: dark at the bottom so the title reads over busy thumbnails */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A2440] via-[#2A2440]/60 to-[#2A2440]/10 transition-opacity group-hover:opacity-90" />

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <span className="font-display font-semibold text-[0.78rem] text-stage-accent bg-white/95 px-2.5 py-1 rounded-full shadow-xs truncate">
                    {vid.show}
                  </span>
                  {vid.isShort && (
                    <span className="shrink-0 font-display font-bold text-[0.7rem] text-gold-ink bg-gold px-2.5 py-1 rounded-full shadow-xs">
                      SHORT
                    </span>
                  )}
                </div>

                {/* Title + Play Button */}
                <div className="relative z-10 flex items-center justify-between gap-4">
                  <span className="font-display font-extrabold text-base sm:text-[1.05rem] leading-snug text-white line-clamp-2 [text-shadow:0_1px_8px_rgba(0,0,0,0.35)] group-hover:text-gold transition-colors">
                    {vid.title}
                  </span>
                  <button
                    type="button"
                    aria-label={`Play preview of ${vid.title}`}
                    className="shrink-0 w-11 h-11 rounded-full bg-gold text-gold-ink flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-ink shadow-lg cursor-pointer"
                  >
                    <PlayIcon className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
              </div>

              {/* Meta & Watch Link */}
              <div className="flex items-center justify-between gap-3 mt-1 px-2.5 pt-2.5 pb-3 text-on-stage-muted font-display text-[0.86rem]">
                <span>{vid.meta}</span>
                <span className="text-stage-accent text-xs font-semibold group-hover:underline inline-flex items-center gap-1">
                  Preview video ↗
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Signature Talks Cards */}
        <div className="mt-20 sm:mt-24">
          <div className="flex flex-wrap justify-between items-end gap-x-8 gap-y-3 mb-8">
            <div>
              <span className="font-display font-semibold text-[0.88rem] text-stage-accent uppercase tracking-wider block mb-1">
                Keynotes & Workshops
              </span>
              <h3 className="font-display font-extrabold text-[clamp(1.6rem,3vw,2.2rem)] text-on-stage">
                Signature talks for your event
              </h3>
            </div>
            <p className="text-on-stage-muted max-w-[44ch] text-[1rem]">
              Each one can run as a keynote, a breakout session or a hands-on workshop, in person or virtual.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {signatureTalks.map((talk) => (
              <article
                key={talk.title}
                className="bg-stage-2 border border-stage-rule rounded-[22px] p-6 flex flex-col justify-between stage-card-hover"
              >
                <div>
                  <span className="font-display font-semibold text-[0.88rem] text-stage-accent block mb-2">
                    {talk.format}
                  </span>
                  <h4 className="font-display font-extrabold text-[1.4rem] leading-tight text-on-stage">
                    {talk.title}
                  </h4>
                  <p className="text-on-stage-muted mt-3 text-[0.98rem] leading-relaxed">
                    {talk.description}
                  </p>
                </div>
                <div className="mt-6 pt-3.5 border-t border-stage-rule text-on-stage-muted font-display text-[0.86rem]">
                  <p className="text-on-stage font-medium mb-1">{talk.bestFor}</p>
                  <p className="opacity-80">{talk.deliveredAt}</p>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-6 text-on-stage-muted font-display text-[0.95rem]">
            Also a regular panelist on AI and marketing leadership, most recently at WordCamp Asia and Agile Network India.
          </p>

          {/* Also Heard On Pods */}
          <div className="mt-10 flex flex-wrap items-center gap-2.5">
            <span className="font-display text-on-stage-muted text-[0.92rem] mr-1.5">
              Also heard on:
            </span>
            {podcasts.map((pod) => (
              <a
                key={pod.name}
                href={pod.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display font-semibold text-[0.88rem] text-on-stage border border-stage-rule rounded-full py-1.5 px-3.5 bg-stage-2 hover:border-stage-accent hover:bg-lav/60 transition-all hover:scale-105"
              >
                {pod.name}
              </a>
            ))}
          </div>

          {/* Gold Event Book Band */}
          <div className="mt-12 bg-gold text-gold-ink rounded-[24px] p-7 sm:p-8 flex flex-wrap gap-6 justify-between items-center shadow-lg transition-transform hover:scale-[1.01]">
            <div>
              <h3 className="font-display font-extrabold text-[1.6rem] text-gold-ink">
                Planning an event?
              </h3>
              <p className="mt-1.5 max-w-[48ch] text-[1.02rem] text-gold-ink/90">
                Share your date, audience and format. I'll reply with the talk that fits best.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="#hire"
                className="btn solid !bg-gold-ink !text-white !border-gold-ink hover:opacity-90"
              >
                Invite me to speak
              </a>
              <Link
                to="/speaking"
                className="btn ghost !text-gold-ink !border-gold-ink hover:!bg-white/20"
              >
                See speaker page
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Video Preview Modal */}
      <VideoPreviewModal
        isOpen={!!activeVideo}
        onClose={() => setActiveVideo(null)}
        video={activeVideo}
      />
    </section>
  );
}
