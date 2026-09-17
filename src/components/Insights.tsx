import { useState, useRef, useEffect, useCallback } from 'react';
import Container from './ui/Container';
import Reveal from './ui/Reveal';
import { articles, contentCategories, Article } from '../data/articles';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export default function Insights() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const filteredArticles = selectedCategory === 'All'
    ? articles
    : articles.filter((a) => a.category.toLowerCase() === selectedCategory.toLowerCase());

  const checkScroll = useCallback(() => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 20);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener('scroll', checkScroll);
  }, [checkScroll, filteredArticles]);

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const cardWidth = carouselRef.current.firstElementChild
      ? (carouselRef.current.firstElementChild as HTMLElement).offsetWidth + 24
      : 360;
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // Auto-scroll loop
  useEffect(() => {
    if (isPaused || filteredArticles.length <= 1) return;

    const interval = setInterval(() => {
      if (!carouselRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 30;

      if (isAtEnd) {
        carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const cardWidth = carouselRef.current.firstElementChild
          ? (carouselRef.current.firstElementChild as HTMLElement).offsetWidth + 24
          : 360;
        carouselRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, filteredArticles.length]);

  return (
    <section id="insights" className="pt-12 md:pt-16 pb-8 md:pb-12 bg-bg overflow-hidden">
      <Container>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange/10 border border-orange/20 text-orange text-xs font-semibold tracking-[0.2em] uppercase mb-4">
                <Sparkles className="w-3.5 h-3.5 text-orange" />
                Strategic Perspectives
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-[1.15] text-primary">
                <span className="gradient-text">Thinking in public.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-base text-secondary mt-3 max-w-lg">
                Original frameworks, field notes, and perspectives on search, AI transformation, and compounding organic growth.
              </p>
            </Reveal>
          </div>

          {/* Controls: Category badges + Arrow navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5">
              {contentCategories.slice(0, 5).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    if (carouselRef.current) carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                  }}
                  className={`text-xs font-medium px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-purple text-white shadow-sm shadow-purple/30'
                      : 'border border-purple/15 text-secondary hover:border-purple/40 hover:text-purple hover:bg-purple/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Navigation Arrows */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                aria-label="Previous insight"
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                  canScrollLeft
                    ? 'border-purple/30 text-primary hover:bg-purple hover:text-white hover:border-purple shadow-xs cursor-pointer'
                    : 'border-purple/10 text-secondary/30 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                aria-label="Next insight"
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                  canScrollRight
                    ? 'border-purple/30 text-primary hover:bg-purple hover:text-white hover:border-purple shadow-xs cursor-pointer'
                    : 'border-purple/10 text-secondary/30 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Auto-scrolling Carousel Container */}
        <div
          ref={carouselRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth focus:outline-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {filteredArticles.map((article: Article) => (
            <div
              key={article.id}
              className="w-[85vw] sm:w-[360px] md:w-[380px] flex-shrink-0 snap-start flex flex-col"
            >
              <article className="group h-full flex flex-col justify-between p-6 sm:p-8 rounded-2xl border border-purple/20 bg-white/70 backdrop-blur-md hover:bg-white hover:border-purple/40 hover:shadow-xl hover:shadow-purple/10 transition-all duration-300 cursor-pointer">
                {/* Top: Category & Date */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[11px] font-semibold tracking-[0.18em] uppercase px-2.5 py-1 rounded-md bg-orange/10 text-orange border border-orange/20">
                      {article.category}
                    </span>
                    <span className="text-xs text-secondary/50 font-mono">
                      {article.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-semibold text-primary mb-3 group-hover:text-purple transition-colors duration-300 leading-snug line-clamp-2 min-h-[3.25rem]">
                    {article.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-secondary leading-relaxed line-clamp-3 mb-6">
                    {article.description}
                  </p>
                </div>

                {/* Bottom Meta Row - Always aligned at bottom across all cards */}
                <div className="pt-4 border-t border-purple/10 flex items-center justify-between gap-2 mt-auto">
                  <span className="text-xs font-medium text-secondary/60">
                    {article.readTime}
                  </span>
                  <span className="text-xs font-semibold text-primary group-hover:text-purple transition-colors text-right">
                    {article.outlet}
                  </span>
                </div>
              </article>
            </div>
          ))}
        </div>

        {/* Mobile controls & View All */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Previous insight"
              className="w-9 h-9 rounded-full border border-purple/20 flex items-center justify-center text-primary disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-secondary/60">Swipe or tap to explore</span>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Next insight"
              className="w-9 h-9 rounded-full border border-purple/20 flex items-center justify-center text-primary disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center sm:text-left mx-auto sm:mx-0">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-purple transition-colors duration-200"
            >
              <span>Explore More Strategy Frameworks</span>
              <ArrowRight className="w-4 h-4 text-purple" />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
