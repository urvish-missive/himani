import { motion } from 'framer-motion';
import { CrownIcon } from '../ui/BrandIcons';
import imgStage from '../../images/hiimanisasspeaker.jpg';
import imgExecutive from '../../images/himanimarketing.jpg';
import imgEvent from '../../images/himani.jpg';
import imgKeynote from '../../images/himanimainsection.jpg';
import imgAuditorium from '../../images/iss-barcelona-stage.jpg';
import imgPortrait from '../../images/Himani-Kankaria4-684x1024.jpg';
import imgSpeaker from '../../images/himanispeaker.jpg';

export default function HomeGallery() {
  const photos = [
    {
      src: imgStage,
      alt: 'Himani Kankaria delivering keynote to live conference audience',
      caption: 'Keynote speaking at international search conferences',
      span: 'sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2',
      objectPosition: 'object-[center_35%]',
    },
    {
      src: imgExecutive,
      alt: 'Himani coaching and advising marketing leaders in executive office',
      caption: 'Executive advisory & marketing direction',
      span: 'sm:col-span-1 sm:row-span-2 lg:col-span-1 lg:row-span-2',
      objectPosition: 'object-[center_18%]',
    },
    {
      src: imgEvent,
      alt: 'Himani at marketing conference and community meetup',
      caption: 'Tech conferences & industry meetups',
      span: 'sm:col-span-1 sm:row-span-1 lg:col-span-1 lg:row-span-1',
      objectPosition: 'object-[center_22%]',
    },
    {
      src: imgKeynote,
      alt: 'Himani speaking on stage hosting event in ivory saree',
      caption: 'Live keynotes & interactive panels',
      span: 'sm:col-span-1 sm:row-span-1 lg:col-span-1 lg:row-span-1',
      objectPosition: 'object-[center_16%]',
    },
    {
      src: imgAuditorium,
      alt: 'International Search Summit Barcelona keynote auditorium',
      caption: 'International Search Summit, Barcelona',
      span: 'sm:col-span-2 sm:row-span-1 lg:col-span-2 lg:row-span-1',
      objectPosition: 'object-center',
    },
    {
      src: imgPortrait,
      alt: 'Himani Kankaria, Founder of Missive Digital',
      caption: 'Founder, Missive Digital',
      span: 'sm:col-span-1 sm:row-span-1 lg:col-span-1 lg:row-span-1',
      objectPosition: 'object-[center_20%]',
    },
    {
      src: imgSpeaker,
      alt: 'Himani presenting on AI and search intent',
      caption: 'AI Search & Content Visibility',
      span: 'sm:col-span-1 sm:row-span-1 lg:col-span-1 lg:row-span-1',
      objectPosition: 'object-[center_42%]',
    },
  ];

  return (
    <section className="py-24 lg:py-28 bg-paper-2 border-b border-rule" id="gallery">
      <div className="max-w-[1160px] mx-auto px-6">
        {/* Kicker */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 font-display font-semibold text-[0.95rem] text-accent mb-3.5">
            <CrownIcon className="w-4 h-4 text-gold shrink-0" />
            <span>Real work, real rooms</span>
          </div>

          {/* Title */}
          <h2 className="font-display font-extrabold text-[clamp(2.8rem,7vw,5.2rem)] leading-[0.95] tracking-[-0.04em] text-ink max-w-[14ch]">
            Proof, not promises.
          </h2>
          <p className="text-muted text-[1.15rem] mt-5 max-w-[50ch]">
            Workshops, advisory sessions, stages, and notes from the people I work with.
          </p>
        </motion.div>

        {/* Grid Mosaic */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[250px] sm:auto-rows-[195px] lg:auto-rows-[210px] gap-4.5 mt-10">
          {photos.map((item, idx) => (
            <motion.figure
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.07 }}
              className={`relative rounded-2xl overflow-hidden bg-card border border-rule shadow-xs group transition-shadow duration-300 hover:shadow-md ${item.span}`}
            >
              <img
                src={item.src}
                alt={item.alt}
                className={`w-full h-full object-cover ${item.objectPosition} group-hover:scale-[1.03] transition-transform duration-700 ease-out`}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity pointer-events-none" />

              <figcaption className="absolute left-3.5 bottom-3.5 max-w-[calc(100%-28px)] bg-paper/95 backdrop-blur-md text-ink font-display text-[0.82rem] font-semibold rounded-full py-1.5 px-3.5 shadow-sm truncate border border-rule/60 group-hover:bg-paper transition-colors select-none z-10">
                {item.caption}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
