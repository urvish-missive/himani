import { useState } from 'react';
import Container from '../components/ui/Container';
import Reveal from '../components/ui/Reveal';
import CTAButton from '../components/ui/CTAButton';
import { podcastEpisodes, PodcastEpisode, podcastTags } from '../data/podcast';
import { Mic2, Play } from 'lucide-react';

export default function PodcastPage() {
  const [selectedTag, setSelectedTag] = useState('All');
  const [activeEpisode, setActiveEpisode] = useState<PodcastEpisode>(podcastEpisodes[0]);

  const filteredEpisodes =
    selectedTag === 'All'
      ? podcastEpisodes
      : podcastEpisodes.filter((e) => e.type === selectedTag);

  const thumbUrl = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

  return (
    <main>
      {/* Hero: text left, video right */}
      <section className="pt-20 md:pt-24 pb-12 md:pb-16 bg-gradient-to-br from-bg-alt/40 to-purple/5 overflow-hidden">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="flex flex-col">
              <Reveal>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple/10 border border-purple/20 text-purple text-xs font-semibold tracking-[0.2em] uppercase mb-5">
                  <Mic2 className="w-3.5 h-3.5" />
                  Watch & Listen
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.1] text-primary">
                  Podcasts, webinars & <span className="gradient-text">live talks.</span>
                </h1>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="text-base md:text-lg text-secondary leading-relaxed mt-5 max-w-xl">
                  Long-form conversations and deep dives on organic search, GEO, and building brands
                  that AI actually cites — directly from the archives.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="flex flex-wrap gap-4 mt-8">
                  <CTAButton href="/#contact" size="lg">Book a Speaking Session</CTAButton>
                  <CTAButton href="/#services" variant="secondary" size="lg">Explore Programs</CTAButton>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.15} direction="left">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-purple to-orange rounded-2xl opacity-50" />
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-dark shadow-xl shadow-purple/10">
                  <iframe
                    key={activeEpisode.youtubeId}
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube-nocookie.com/embed/${activeEpisode.youtubeId}`}
                    title={activeEpisode.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <div className="absolute -inset-6 bg-gradient-to-br from-purple/15 to-orange/15 rounded-3xl blur-2xl -z-10" />

                <div className="absolute -bottom-4 left-4 sm:-left-6 bg-white rounded-2xl shadow-lg shadow-purple/10 border border-purple/10 px-4 py-3 max-w-[calc(100%-2rem)]">
                  <p className="text-sm font-semibold text-primary leading-snug truncate">
                    {activeEpisode.title}
                  </p>
                  <span className="block text-[11px] font-semibold tracking-[0.16em] uppercase text-orange mt-0.5">
                    Now Playing · {activeEpisode.type}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Episode Grid */}
      <section className="py-12 md:py-16 bg-bg border-t border-purple/10">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
            <div>
              <Reveal>
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple mb-3">
                  Episodes
                </p>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="font-serif text-3xl md:text-4xl leading-[1.15] text-primary">
                  Browse the archive.
                </h2>
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <div className="flex flex-wrap gap-1.5">
                {podcastTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`text-xs font-medium px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                      selectedTag === tag
                        ? 'bg-purple text-white shadow-sm shadow-purple/30'
                        : 'border border-purple/15 text-secondary hover:border-purple/40 hover:text-purple hover:bg-purple/5'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEpisodes.map((episode, i) => (
              <Reveal key={episode.id} delay={i * 0.08}>
                <button
                  onClick={() => {
                    setActiveEpisode(episode);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group w-full text-left flex flex-col rounded-2xl border border-purple/15 bg-white/70 backdrop-blur-md hover:bg-white hover:border-purple/35 hover:shadow-xl hover:shadow-purple/10 transition-all duration-300 cursor-pointer"
                >
                  <div className="relative aspect-video rounded-t-2xl overflow-hidden bg-dark">
                    <img
                      src={thumbUrl(episode.youtubeId)}
                      alt={episode.title}
                      loading="lazy"
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-70 group-hover:scale-105 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex w-14 h-14 items-center justify-center rounded-full bg-gradient-to-br from-purple to-orange text-white shadow-lg shadow-purple/30 group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                    <span className="absolute top-3 left-3 text-[11px] font-semibold tracking-[0.16em] uppercase px-2.5 py-1 rounded-md bg-white/90 text-primary backdrop-blur-sm">
                      {episode.type}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col gap-2 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-secondary/50 font-mono">{episode.date}</span>
                      <span className="text-[11px] font-medium text-purple">{episode.duration}</span>
                    </div>
                    <h3 className="text-base font-semibold text-primary leading-snug group-hover:text-purple transition-colors duration-300 line-clamp-2">
                      {episode.title}
                    </h3>
                    <p className="text-sm text-secondary leading-relaxed line-clamp-3">
                      {episode.description}
                    </p>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-20 bg-gradient-to-br from-dark via-dark-card to-dark text-center">
        <Container narrow>
          <Reveal>
            <h2 className="font-serif text-3xl md:text-4xl leading-[1.15] text-white mb-6">
              Want this thinking live at your event?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-wrap justify-center gap-4">
              <CTAButton href="/#contact" size="lg">Book a Speaking Session</CTAButton>
              <CTAButton href="/#services" variant="secondary" size="lg">Explore Engagement Models</CTAButton>
            </div>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}