import { useState, useRef, useEffect, useCallback } from 'react';
import Container from './ui/Container';
import Reveal from './ui/Reveal';
import { Play, Volume2, VolumeX, ChevronLeft, ChevronRight, Sparkles, ExternalLink } from 'lucide-react';

interface Reel {
  id: string;
  title: string;
  tag: string;
}

const SHORTS_VIDEOS: Reel[] = [
  { id: 'kX44xw2e3eU', title: 'SEO & AI Search Readiness', tag: 'AI Search' },
  { id: '30BpZTl4S5A', title: 'Generative Engine Optimization (GEO)', tag: 'GEO' },
  { id: '0UuhxriP6UM', title: 'Organic Growth Blueprint', tag: 'Strategy' },
  { id: '1WYMkWUzMqA', title: 'B2B Search Engine Masterclass', tag: 'B2B SaaS' },
  { id: 'mLqKDm1XxJY', title: 'Creating High-Impact Content', tag: 'Content' },
  { id: 'Ax2EW9yLd_0', title: 'Technical SEO Deep Dive', tag: 'Tech SEO' },
  { id: 'nIof7F6NM8s', title: 'BrightonSEO Keynote Moments', tag: 'Speaking' },
  { id: 'jLbD1pVEVoQ', title: '1:1 Executive Coaching Takeaways', tag: 'Coaching' },
  { id: 'kf4uUfEgmX4', title: 'Getting Cited in AI Answers', tag: 'GEO Strategy' },
  { id: '-UGtNwiJfyw', title: 'Information Gain & Search Authority', tag: 'Organic' },
  { id: 'ARGQOK7QSZ8', title: 'The Future of AI-Powered Search', tag: 'AI Future' },
  { id: 'ezJtEvbRVpk', title: 'Search Engine Land Column Insights', tag: 'Insights' },
  { id: 'AUAOFjQ3_iY', title: 'Intent-Led Content Framework', tag: 'Framework' },
  { id: 'UTIje5YcB0k', title: 'Algorithm Shifts & AI Answers', tag: 'SEO Updates' },
  { id: 'I89fHJ2tg4Q', title: 'Scaling Enterprise Visibility', tag: 'Growth' },
];

export default function ShortsReels() {
  const [activeVideoId, setActiveVideoId] = useState<string>(SHORTS_VIDEOS[0].id);
  const [isMuted, setIsMuted] = useState(true);
  const [isSectionInView, setIsSectionInView] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<number | null>(null);

  // Check section visibility in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSectionInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Check scroll boundary arrows
  const checkScroll = useCallback(() => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  // Detect which reel is centered as user scrolls
  const handleScroll = useCallback(() => {
    checkScroll();

    if (scrollTimeoutRef.current) {
      window.cancelAnimationFrame(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = window.requestAnimationFrame(() => {
      if (!carouselRef.current) return;
      const container = carouselRef.current;
      const containerCenter = container.scrollLeft + container.clientWidth / 2;

      let closestId = activeVideoId;
      let minDistance = Infinity;

      const cards = container.querySelectorAll<HTMLElement>('[data-reel-id]');
      cards.forEach((card) => {
        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const distance = Math.abs(containerCenter - cardCenter);
        if (distance < minDistance) {
          minDistance = distance;
          const id = card.getAttribute('data-reel-id');
          if (id) closestId = id;
        }
      });

      if (closestId !== activeVideoId) {
        setActiveVideoId(closestId);
      }
    });
  }, [activeVideoId, checkScroll]);

  // Scroll to previous / next reel
  const scrollByAmount = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollOffset = 310;
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollOffset : scrollOffset,
      behavior: 'smooth',
    });
  };

  // Scroll specific reel into center
  const selectReel = (id: string) => {
    setActiveVideoId(id);
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    if (id === SHORTS_VIDEOS[0].id) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      const card = container.querySelector<HTMLElement>(`[data-reel-id="${id}"]`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  return (
    <section
      ref={sectionRef}
      id="reels"
      className="relative py-12 md:py-16 bg-gradient-to-b from-dark via-dark-card to-dark text-white overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-purple/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-orange/15 rounded-full blur-[160px] pointer-events-none" />

      <Container className="relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-6">
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-orange-light text-xs font-semibold uppercase tracking-widest mb-4">
                <Sparkles className="w-3.5 h-3.5 text-orange" />
                <span>Bite-Sized Insights</span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-[1.15] text-white">
                Watch Himani in action:{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-light to-orange-light">
                  Reels & Shorts
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-3 text-sm sm:text-base text-white/70 max-w-2xl leading-relaxed">
                Scroll through 15 tactical breakdowns on Generative Engine Optimization (GEO), Technical SEO,
                and B2B organic growth. Videos autoplay as you scroll past.
              </p>
            </Reveal>
          </div>

          {/* Controls: Audio Toggle & Carousel Arrows */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Global Unmute Button */}
            <button
              type="button"
              onClick={() => setIsMuted((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-medium transition-all cursor-pointer ${
                !isMuted
                  ? 'bg-gradient-to-r from-purple to-orange border-transparent text-white shadow-lg shadow-purple/30'
                  : 'bg-white/10 hover:bg-white/15 border-white/15 text-white/80'
              }`}
            >
              {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{isMuted ? 'Unmute Audio' : 'Sound On'}</span>
            </button>

            {/* Prev arrow */}
            <button
              type="button"
              onClick={() => scrollByAmount('left')}
              disabled={!canScrollLeft}
              aria-label="Previous reel"
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Next arrow */}
            <button
              type="button"
              onClick={() => scrollByAmount('right')}
              disabled={!canScrollRight}
              aria-label="Next reel"
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Container with horizontal padding so the first video card is never clipped */}
        <div
          ref={carouselRef}
          onScroll={handleScroll}
          className="flex gap-4 sm:gap-6 overflow-x-auto py-4 px-2 sm:px-4 md:px-6 snap-x snap-mandatory no-scrollbar cursor-grab active:cursor-grabbing scroll-px-2 sm:scroll-px-4 md:scroll-px-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {SHORTS_VIDEOS.map((reel, index) => {
            const isActive = isSectionInView && activeVideoId === reel.id;

            return (
              <div
                key={reel.id}
                data-reel-id={reel.id}
                onClick={() => selectReel(reel.id)}
                className={`group relative shrink-0 w-[260px] sm:w-[285px] md:w-[300px] h-[460px] sm:h-[500px] md:h-[525px] rounded-2xl overflow-hidden snap-start transition-all duration-300 border cursor-pointer ${
                  isActive
                    ? 'ring-2 ring-orange/90 border-orange/50 shadow-xl shadow-purple/25'
                    : 'border-white/10 opacity-80 hover:opacity-100 hover:border-white/30'
                }`}
              >
                {/* Active Embed or Optimized Poster Thumbnail */}
                {isActive ? (
                  <iframe
                    title={reel.title}
                    src={`https://www.youtube-nocookie.com/embed/${reel.id}?autoplay=1&mute=${
                      isMuted ? 1 : 0
                    }&controls=1&loop=1&playlist=${reel.id}&playsinline=1&rel=0&modestbranding=1&enablejsapi=1`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="relative w-full h-full bg-dark">
                    <img
                      src={`https://i.ytimg.com/vi/${reel.id}/oar2.jpg`}
                      onError={(e) => {
                        e.currentTarget.src = `https://i.ytimg.com/vi/${reel.id}/hqdefault.jpg`;
                      }}
                      alt={reel.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/30 to-black/40" />

                    {/* Play Badge */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:bg-orange transition-all duration-300">
                        <Play className="w-6 h-6 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Card Top Overlay Header */}
                <div
                  className={`absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10 transition-opacity duration-300 ${
                    isActive ? 'opacity-85' : 'opacity-100'
                  }`}
                >
                  <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-semibold tracking-wider uppercase text-white/90">
                    {reel.tag}
                  </span>
                  <span className="text-[11px] font-mono text-white/70 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-md">
                    {String(index + 1).padStart(2, '0')} / {SHORTS_VIDEOS.length}
                  </span>
                </div>

                {/* Card Bottom Overlay Details: Unobtrusive when active so it does not cut video captions */}
                {!isActive ? (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent pointer-events-none z-10">
                    <p className="text-sm font-semibold text-white line-clamp-2 leading-snug drop-shadow-sm mb-2">
                      {reel.title}
                    </p>

                    <div className="flex items-center justify-between pointer-events-auto pt-1 border-t border-white/10">
                      <span className="text-[11px] text-white/70 flex items-center gap-1.5">
                        <Play className="w-3 h-3 fill-white/80" /> Tap to play
                      </span>
                      <a
                        href={`https://www.youtube.com/shorts/${reel.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[11px] font-medium text-orange-light hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <span>YouTube</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="absolute bottom-3 right-3 pointer-events-auto z-10">
                    <a
                      href={`https://www.youtube.com/shorts/${reel.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-medium text-white/90 hover:text-white flex items-center gap-1 transition-colors shadow-md"
                    >
                      <span>YouTube</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Swipe hint for mobile users */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/50 md:hidden">
          <span>← Swipe horizontally to watch next reels →</span>
        </div>
      </Container>
    </section>
  );
}
